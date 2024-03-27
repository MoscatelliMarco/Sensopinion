import { collection_users, collection_verification_token, collection_delete_token } from "$lib/server/mongodb_collections";
import { generateId } from "lucia";
import nodemailer from 'nodemailer';

async function createEmailVerificationToken(userId, email) {
    // Delete all the previous token for that specific user
    await collection_verification_token.deleteMany({ user_id: userId });

    const verification_token = generateId(40);
    await collection_verification_token.insertOne({
        _id: verification_token,
        user_id: userId,
        email: email,
        created_at: new Date()
    })

    // Delete tokens are needed in case the account was created with the wrong email
    // Delete tokens are going to be removed from the database right after the user verify
    // Create token only if no token for the same user exists
    const alredy_existing_delete_token = await collection_delete_token.findOne({user_id: userId});
    let delete_token = alredy_existing_delete_token?._id;
    if (!alredy_existing_delete_token) {
        delete_token = generateId(60);
        await collection_delete_token.insertOne({
            _id: delete_token,
            user_id: userId,
            email: email
        })
    }

    return {verification_token: verification_token, delete_token: delete_token};
}

const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: import.meta.env.VITE_EMAIL,
        pass: import.meta.env.VITE_EMAIL_PASSWORD
    }
})

export async function sendEmailVerification(baseUrlPage, userId, email) {
    const { verification_token, delete_token } = await createEmailVerificationToken(userId, email);
    const verificationLink = baseUrlPage + "/user-verification/" + verification_token;
    const deleteLink = baseUrlPage + "/user-deletion/" + delete_token;

    try {
        // Send mail with defined transport object
        let info = await transporter.sendMail({
            from: import.meta.env.VITE_EMAIL_FROM,
            to: email,
            subject: 'Verify Your Sensopinion Account',
            html: `
            <!doctype html>
            <html>
            <head>
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <script src="https://cdn.tailwindcss.com"></script>
                <style>
                    body {
                        font-family: 'Roboto', sans-serif; /* Specify Roboto as the font family */
                    }
                    p {
                        line-height: 1.4em !important;
                    }
            
                    h1, h2, h3, h4, h5, h6 {
                        line-height: 1.2em !important;
                        letter-spacing: -0.01em !important;
                    }
            
                    .bg-primary-gradient {
                        background: linear-gradient(to right, rgb(33, 135, 219), rgb(112, 46, 219));
                    }
                    .text-primary-gradient {
                        /* Define the gradient */
                        background-image: linear-gradient(to right, rgb(33, 135, 219), rgb(112, 46, 219));
            
                        /* Set the text color to transparent */
                        color: transparent;
            
                        /* Clip the background to the text */
                        -webkit-background-clip: text;
                        background-clip: text;
                        
                        /* Ensuring text is displayed */
                        -webkit-text-fill-color: transparent; 
                    }
                </style>
                <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Roboto:ital,wght@0,100;0,200;0,300;0,400;0,500;0,600;0,700;0,800;0,900;1,100;1,200;1,300;1,400;1,500;1,600;1,700;1,800;1,900&display=swap">
            </head>
            <body class="flex justify-center bg-gray-100 text-center">
                <div class="my-16 mx-4 md:mx-8 lg:mx-12 max-w-md md:max-w-xl w-full">
                    <div class="w-full h-full bg-white flex flex-col justify-center items-center gap-6 px-4 md:px-7 py-6 lg:py-10">
                        <h1 class="text-primary-gradient font-medium text-3xl">Sensopinion</h1>
                        <svg class="h-20 p-4 border-4 border-gray-300 rounded-full fill-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M22 6c0-1.1-.9-2-2-2H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2zm-2 0l-8 5l-8-5zm0 12H4V8l8 5l8-5z"/></svg>
                        <h3 class="font-medium text-gray-500 text-lg">Verify your email</h3>
                        <p class="text-gray-700 text-sm max-w-sm">Verify your Sensopinion account to access unlimited features on our platform</p>
                        <button class="bg-primary-gradient text-white px-8 py-2 rounded">
                            Verify your account
                        </button>
                    </div>
                </div>
            </body>
            </html>
            `
        });
        return true;
    } catch (error) {
        return false;
    }
}

export async function verifyUser(tokenId) {
    try {
        const token = await collection_verification_token.findOne({ _id: tokenId });
        const userId = token.user_id;
        const user = await collection_users.updateOne({ _id: userId }, { $set: { verified: true } })

        if (user.matchedCount) {
            // Delete verification and delete token from the database
            await collection_verification_token.deleteMany({ user_id: userId });
            await collection_delete_token.deleteMany({ user_id: userId });

            return true;
        }
        return false;
    } catch (e) {
        return false;
    }
}

export async function deleteUser(tokenId) {
    try {
        const token = await collection_delete_token.findOne({ _id: tokenId });
        const userId = token.user_id;
        const user = await collection_users.deleteOne({ _id: userId });

        if (user.deletedCount) {
            // Delete verification and delete token from the database
            await collection_verification_token.deleteMany({ user_id: userId });
            await collection_delete_token.deleteMany({ user_id: userId });

            return true;
        }
        return false;
    } catch (e) {
        return false;
    }
}
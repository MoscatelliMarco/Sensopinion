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
                <p>Click on the button below to verify your account:</p>
                <div>
                    <a href="${verificationLink}">Verify Account</a>
                </div>
                <p>Click on the button below to delete your account:</p>
                <div>
                    <a href="${deleteLink}">Delete Account</a>
                </div>
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
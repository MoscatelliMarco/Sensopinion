import { generateId } from "lucia";
import { MongoClient } from 'mongodb';
import nodemailer from 'nodemailer';

const client = new MongoClient(import.meta.env.VITE_MONGO_CLIENT_URI)

await client.connect();
const db = client.db('users');
const collection_verification_token = db.collection('verification_tokens');
const collection_delete_token = db.collection('verification_tokens');
const collection_users = db.collection('users');
collection_verification_token.createIndex({ "created_at": 1 }, { expireAfterSeconds: 10 * 60 });


async function createEmailVerificationToken(userId, email) {
    // Delete all the previous token for that specific user
    await collection_verification_token.deleteMany({ user_id: userId });
    await collection_delete_token.deleteMany({ user_id: userId });

    const verification_token = generateId(40);
    await collection_verification_token.insertOne({
        id: verification_token,
        user_id: userId,
        email: email,
        created_at: new Date()
    })

    // Delete tokens are needed in case the account was created with the wrong email
    // Delete tokens are going to be removed from the database right after the user verify
    const delete_token = generateId(60);
    await collection_delete_token.insertOne({
        id: delete_token,
        user_id: userId,
        email: email
    })

    return verification_token;
}

console.log({
    user: import.meta.env.VITE_EMAIL,
    pass: import.meta.env.VITE_EMAIL_PASSWORD
})

const transporter = nodemailer.createTransport({
    service: "icloud",
    auth: {
        user: import.meta.env.VITE_EMAIL,
        pass: import.meta.env.VITE_EMAIL_PASSWORD
    }
})

export async function sendEmailVerification(baseUrlPage, userId, email) {
    const verificationToken = await createEmailVerificationToken(userId, email);
    const verificationLink = baseUrlPage + "/user-verification/" + verificationToken;

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
            `
        });
        console.log('Email sent: %s', info.messageId);
    } catch (error) {
        console.error('Error sending email:', error);
    }
}

export async function verifyUser(tokenId) {
    try {
        const token = await collection_token.findOne({ _id: tokenId });
        const userId = token.user_id;
        const user = await collection_users.updateOne({ _id: userId }, { $set: { verified: true } })

        if (!user) {
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
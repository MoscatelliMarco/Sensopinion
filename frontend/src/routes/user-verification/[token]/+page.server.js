import { fail } from '@sveltejs/kit';
import { verifyUser, sendEmailVerification } from "$lib/server/user_verification";
import { collection_verifylink_limiting } from "$lib/server/mongodb_collections";

export async function load({ params }) {
    const tokenId = params.token;
    const is_verified = await verifyUser(tokenId);

    return { 
        props: {
            is_verified: is_verified
        } 
    }
}

export const actions = {
	default: async ({ locals, url }) => {
        if (!locals.user || locals.user?.verified) {
            return fail(400, { error: "Invalid request, you must be sign in or not verified" });
        }

        const rate_limited = await collection_verifylink_limiting.find({email: locals.user.email}).toArray();
        if (rate_limited.length) {
            // Check if the email was sent in the last 2 minutes (because mongodb TTL are not precise)
            let sent_in_the_last_2_minutes = -1 * (rate_limited[0].date_created - (new Date())) / (1000 * 60) < 2
            if (sent_in_the_last_2_minutes) {
                return fail(429, { error: "A verification email has already been sent in the past 2 minutes, wait this time to send another one" })
            }
        }

        await collection_verifylink_limiting.deleteMany({
            email: locals.user.email
        })
        await collection_verifylink_limiting.insertOne({
            email: locals.user.email,
            date_created: new Date()
        })

        const isMailSent = sendEmailVerification(`${url.protocol}//${url.host}`, locals.user.id, locals.user.email);
        if (!isMailSent) {
            return fail(500, { error: "We had an internal server error, try again later" });
        }

        return { success: true }
    }
};
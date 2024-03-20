import { fail } from '@sveltejs/kit';
import { verifyUser, sendEmailVerification } from "$lib/server/user_verification.js";

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

        const isMailSent = sendEmailVerification(`${url.protocol}//${url.host}`, locals.user.id, locals.user.email);
        if (!isMailSent) {
            return fail(500, { error: "We had an internal server error, try again later" });
        }

        return { success: true }
    }
};
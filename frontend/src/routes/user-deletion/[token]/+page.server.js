import { verifyUser } from "$lib/server/user_verification.js";

export async function load({ params }) {
    const tokenId = params.token;
    const is_verified = await verifyUser(tokenId);

    return { 
        props: {
            is_verified: is_verified
        } 
    }
}
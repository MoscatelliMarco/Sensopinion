import { deleteUser } from "$lib/server/user_verification.js";
import { lucia } from "$lib/server/auth";

export async function load({ params, locals, cookies }) {
    const tokenId = params.token;
    const is_deleted = await deleteUser(tokenId);

    if (is_deleted) {
        if (!locals.session) {
			return { 
                props: {
                    is_deleted: is_deleted
                } 
            }
		}

        // Delete and invalidate session in case user still there
		await lucia.invalidateSession(locals.session.id);
		const sessionCookie = lucia.createBlankSessionCookie();
		cookies.set(sessionCookie.name, sessionCookie.value, {
			path: ".",
			...sessionCookie.attributes
		});
        locals.user = null;
        locals.session = null;
    }

    return { 
        props: {
            is_deleted: is_deleted
        } 
    }
}
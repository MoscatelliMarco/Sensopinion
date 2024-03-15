import { lucia } from "$lib/server/auth";
import { fail, redirect } from "@sveltejs/kit";

export const actions = {
    signOut: async (event) => {
        if (!event.locals.session) {
			return fail(401);
		}
		await lucia.invalidateSession(event.locals.session.id);
		const sessionCookie = lucia.createBlankSessionCookie();
		event.cookies.set(sessionCookie.name, sessionCookie.value, {
			path: ".",
			...sessionCookie.attributes
		});

        // TODO show signout message correctly
		redirect(302, "/");
    }
}
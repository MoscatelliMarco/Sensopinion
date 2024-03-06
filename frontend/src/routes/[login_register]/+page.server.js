import { fail, redirect } from '@sveltejs/kit';
import { register } from "$lib/server/users.js"

/** @type {import('./$types').PageServerLoad} */
export async function load({ locals }) {
	if (locals.user) throw redirect(307, '/');
}

/** @type {import('./$types').Actions} */
export const actions = {
	default: async ({ cookies, request, params }) => {
		console.log("register")
        if (params.login_register != 'login' && params.login_register != 'register') {
            throw new error(400, 'Bad Request')
        }
		const data = await request.formData();
		const responseObject = {
			status: 200, // HTTP status code
			headers: {
				'Content-Type': 'application/json' // Content-Type header
			},
			body: JSON.stringify({ message: 'Form submitted successfully' }) // Response body
		};
        let response = await register(data.get('username_register'), data.get('email_register'), data.get('password_register'))
        if (response.error) {
            // return fail(response['code'] || 400, response.msg)
			return responseObject
        }

		// const value = btoa(JSON.stringify(body.user));
		// cookies.set('jwt', value, { path: '/' });

		throw redirect(307, '/');
	}
};
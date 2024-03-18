import { fail, redirect } from '@sveltejs/kit';
import { userSchema, userSchemaLogin } from "$lib/utils/schemas";
import { collection_users } from "$lib/server/mongo_adapter";

// Create user and authentication
import { lucia } from "$lib/server/auth";
import { generateId } from 'lucia';
import { Argon2id } from 'oslo/password';

async function doesUserExists(username, email){
	const emailCheck = await collection_users.findOne({ email: email });
	const usernameCheck = await collection_users.findOne({ username: username });
	if (emailCheck || usernameCheck) {
		return emailCheck || usernameCheck;
	}
	return null;
}
async function doesUserExistsLogin(email_username){
	// Sanitazation needed because not passed through Joi schema
	const emailCheck = await collection_users.findOne({ email: sanitizeStringForMongoDB(email_username) });
	const usernameCheck = await collection_users.findOne({ username: sanitizeStringForMongoDB(email_username) });
	if (emailCheck || usernameCheck) {
		return emailCheck || usernameCheck;
	}
	return null;
}

export async function load({ locals }) {
	if (locals.user) redirect(302, "/");
}

export const actions = {
	register: async ({ cookies, request, params }) => {
		// TODO add request throttling
        if (params.login_register != 'login' && params.login_register != 'register') {
            return fail(400, { error: "Bad request" });
        }

		// Get the credentials
		const form_data = await request.formData();
		const firstName = await form_data.get('first-name');
		const lastName = await form_data.get('last-name');
		const username = await form_data.get('username');
		const email = await form_data.get('email');
		const password = await form_data.get('password');
		const confirmPassword = await form_data.get('confirm-password');

		const result = userSchema.validate({firstName: firstName, lastName: lastName, username: username, email: email, password: password, confirmPassword: confirmPassword});
		if (result.error) {
			return fail(400, { error: result.error.details[0].message })
		}

		const userId = generateId(15);
		const hashedPassword = await new Argon2id().hash(password);

		const userExists = await doesUserExists(username, email);
		if (userExists) {
			return fail(409, { error: "Username or email already existing" });
		}

		// Sanitization not needed because not accepting $ as input inside Joi schema
		await collection_users.insertOne({
			_id: userId,
			firstName: firstName,
			lastName: lastName,
			username: username,
			email: email,
			history: [],
			hashedPassword: hashedPassword,
			dateCreated: new Date(),
			admin: false,
			verified: false
		})
		const session = await lucia.createSession(userId, {});
		const sessionCookie = lucia.createSessionCookie(session.id);
		cookies.set(sessionCookie.name, sessionCookie.value, {
			path: ".",
			...sessionCookie.attributes
		});

		return redirect(307, '/');
	},
	login: async ({ cookies, request, params }) => {
		// TODO add request throttling
		if (params.login_register != 'login' && params.login_register != 'register') {
            return fail(400, { error: "Bad request" });
        }

		// Get the credentials
		const form_data = await request.formData();
		const email_username = await form_data.get('email-username');
		const password = await form_data.get('password');

		const result = userSchemaLogin.validate({emailUsername: email_username, password: password});
		if (result.error) {
			return fail(400, { error: result.error.details[0].message })
		}

		const userExists = await doesUserExistsLogin(email_username);
		if (!userExists) {
			return fail(409, { error: "Incorrect username/email or password" });
		}

		const validPassword = await new Argon2id().verify(userExists.hashedPassword, password);
		if (!validPassword) {
			return fail(400, {
				error: "Incorrect username/email or password"
			});
		}
		const session = await lucia.createSession(userExists._id, {});
		const sessionCookie = lucia.createSessionCookie(session.id);
		cookies.set(sessionCookie.name, sessionCookie.value, {
			path: ".",
			...sessionCookie.attributes
		});

		return redirect(307, '/');
	}
};

function sanitizeStringForMongoDB(inputString) {
	try {
	  // Replace or escape special MongoDB characters
	  let sanitizedString = inputString.replaceAll('$', '\\$');
	  return sanitizedString;
	} catch (e) {
	  return null;
	}
}
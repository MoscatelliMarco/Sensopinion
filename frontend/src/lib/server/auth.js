import { Lucia } from 'lucia';
import { dev } from "$app/environment";
import { adapter } from "$lib/server/mongo_adapter";

export const lucia = new Lucia(adapter, {
    sessionCookie: {
        attributes: {
            // set to `true` when using HTTPS
            secure: !dev,
            // ipCountry: attributes.ip_country
        }
    },
    getUserAttributes: (attributes) => {
        return {
            firstName: attributes.firstName,
            lastName: attributes.lastName,
            username: attributes.username,
            email: attributes.email,
            history: attributes.history,
            admin: attributes.admin,
            verified: attributes.verified,
            dateCreated: attributes.dateCreated
        }
    }
})
import { error } from "@sveltejs/kit";

export async function load ({ locals }) {
    if (!locals.user?.isAdmin) {
        throw new error(404, 'Not found')
    }
}
import { error } from "@sveltejs/kit";

export async function load ({params}) {
    if (params.code !== import.meta.env.VITE_ADMIN_CODE) {
        throw new error(404, 'Not found')
    } 
}
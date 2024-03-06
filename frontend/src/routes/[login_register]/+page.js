import { loadedStore } from "../../stores.js";
import { error } from '@sveltejs/kit';

// This runs on the server during SSR and on the client after navigation
export async function load({ params }) {
    if (params['login_register'] == "login" || params['login_register'] == "register") {
        // loadedStore.set(false)
        // loadedStore.set(true)
    } else {
        throw new error(404, "Not found")
    }
}
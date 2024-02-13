import { error } from "@sveltejs/kit";
import { globalStore, loadedStore } from "../../../../stores.js";

export async function load ({fetch, params}) {
    if (params.code !== import.meta.env.VITE_ADMIN_CODE) {
        throw new error(404, 'Not found')
    }
}
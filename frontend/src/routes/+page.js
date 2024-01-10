import { globalStore, loadedStore } from "../stores";

// This runs on the server during SSR and on the client after navigation
export async function load({ fetch }) {
    loadedStore.set(false)
    let news_articles = globalStore.news;
    if (news_articles === undefined) {
        let res;
        try {
            res = await fetch(`${import.meta.env.VITE_BACKEND_SERVER_IP}/api/news`);
        } catch {}
        if (res.ok) {
            const data = await res.json();
            globalStore.update(($dict) => {
                $dict['news'] = data;
                return $dict;
            })
        }
        loadedStore.set(true)
    }
}
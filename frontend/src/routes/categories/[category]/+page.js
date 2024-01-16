import { globalStore, loadedStore } from "../../../stores";
import { error } from '@sveltejs/kit';

// This runs on the server during SSR and on the client after navigation
export async function load({ fetch, params }) {
    if (['politics', 'economy', 'environment'].includes(params.category)) {
        loadedStore.set(false)
        let news_articles;
        const unsubscribe = globalStore.subscribe((value) => {
            news_articles = value.news;
        })
        unsubscribe()
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
    } else {
        throw new error(404, "We can't the category that you are searching for")
    }
}
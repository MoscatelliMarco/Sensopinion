import { globalStore, loadedStore } from "../../../stores";
import { error } from '@sveltejs/kit';

// This runs on the server during SSR and on the client after navigation
export async function load({ fetch, params, url }) {
    if (['politics', 'economy', 'environment'].includes(params.category)) {
        loadedStore.set(false)

        let res_news;
        try {
            // Send the same params but with n_load
            res_news = await fetch(`/api/news/${params.category}${url.search}${url.search ? "&" : "?"}n_load=12`);
        } catch {}
        if (res_news.ok) {
            const data_news = await res_news.json();

            loadedStore.set(true)
            return {
                props: {
                    news_articles: data_news
                }
            }
        }
        loadedStore.set(true);

    } else {
        throw new error(404, "We can't the category that you are searching for")
    }
}
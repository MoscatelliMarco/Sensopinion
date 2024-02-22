import { loadedStore } from "../../stores";

// This runs on the server during SSR and on the client after navigation
export async function load({ fetch, url }) {
    loadedStore.set(false)

    let res_news;
    try {
        // Send the same params but with n_load
        res_news = await fetch(`/api/news/screener${url.search}${url.search ? "&" : "?"}n_load=12`);
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
    loadedStore.set(true)
}
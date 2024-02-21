import { loadedStore } from "../stores";

// This runs on the server during SSR and on the client after navigation
export async function load({ fetch }) {
    loadedStore.set(false)
    
    let res_metrics;
    let res_news;
    try {
        res_metrics = await fetch(`/api/metrics`);
        res_news = await fetch(`/api/news?n_load=4&sort_by=date_published&order=-1`);
    } catch {}
    if (res_metrics.ok && res_news.ok) {
        const data_metrics = await res_metrics.json();
        const data_news = await res_news.json();

        loadedStore.set(true)
        return {
            props: {
                metrics: data_metrics,
                news_articles: data_news
            }
        }
    }
    loadedStore.set(true)
}
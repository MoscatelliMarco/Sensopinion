import { loadedStore } from "../../../stores";
import { error } from '@sveltejs/kit';

// This runs on the server during SSR and on the client after navigation
export async function load({ fetch, params, url }) {
    if (['politics', 'economy', 'environment'].includes(params.category)) {
        loadedStore.set(false)
    
        let res_metrics;
        let res_news;
        try {
            res_metrics = await fetch(`/api/metrics`);
            res_news = await fetch(`/api/news/${params.category}${url.search}${url.search ? "&" : "?"}n_load=12`);

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
        } catch {}
        loadedStore.set(true)

    } else {
        throw new error(404, "We can't the category that you are searching for")
    }
}
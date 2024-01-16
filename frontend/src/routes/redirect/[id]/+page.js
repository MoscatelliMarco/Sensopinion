import { globalStore } from "../../../stores";
import { error } from '@sveltejs/kit';

// This runs on the server during SSR and on the client after navigation
export async function load({ fetch, params }) {
    let news_articles;
    const unsubscribe = globalStore.subscribe((value) => {
        news_articles = value.news;
    })
    unsubscribe()
    if (news_articles === undefined) {
        let res;
        try {
            res = await fetch(`${import.meta.env.VITE_BACKEND_SERVER_IP}/api/news?param=_id&value=${params.id}`);
        } catch {}
        if (res.ok) {
            const data = await res.json();
            if (!data.length) {
                throw new error(404, "We can't find the news")
            }
            return {
                props: {
                    data: data
                }
            }
        }
    } else {
        for (let news of news_articles) {
            if (news['_id'] == params.id) {
                return {
                    props: {
                        data: news
                    }
                }
            }
        }
        let res;
        try {
            res = await fetch(`${import.meta.env.VITE_BACKEND_SERVER_IP}/api/news?param=_id&value=${params.id}`);
        } catch {}
        if (res.ok) {
            const data = await res.json();
            if (!data.length) {
                throw new error(404, "We can't find the news")
            }
            return {
                props: {
                    data: data
                }
            }
        }
    }
    throw new error(404, "We can't find the news")
}
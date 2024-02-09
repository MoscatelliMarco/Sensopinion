import { globalStore, loadedStore } from "../../stores";

// This runs on the server during SSR and on the client after navigation
export async function load({ fetch }) {
    loadedStore.set(false)
    let news_articles;
    const unsubscribe = globalStore.subscribe((value) => {
        news_articles = value.news;
    })
    unsubscribe()
    if (news_articles === undefined || (news_articles instanceof Array && !news_articles.length)) {
        let res;
        try {
            res = await fetch("/api/news");
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
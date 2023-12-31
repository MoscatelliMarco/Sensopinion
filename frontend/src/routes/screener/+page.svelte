<script>
    import NewsDisplay from '$lib/sections/screener/+page/news_display.svelte';
    export let data;
    let news_articles = data['props']['data']
</script>

<NewsDisplay news_articles={news_articles}/>
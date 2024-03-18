<script>
    import NewsCard from "$lib/items/news_card.svelte";

    let news_history = [];
    let error_fetching = "";
    async function fetchHistory() {
        try {
            const response = await fetch("/api/user-history", {
                method: "GET",
                credentials: "include"
            })
            if (!response.ok) {
                error_fetching = "We had an error fetching your history, try again later :(";
            }
            const result = await response.json()
            news_history = result['history'];
        } catch (error) {
            error_fetching = "We had an error fetching your history, try again later :(";
        }
    }

    fetchHistory()
</script>

<div class="flex flex-col justify-center items-center gap-1">
    <h2 class="text-4xl text-grey-1 font-medium">Your news history</h2>
    <p class="text-sm font-light text-grey-2 mx-4 text-center">*we store only the last 50 views and we delete news after 10 days</p>
</div>

{#if error_fetching}
    <div class="flex justify-center mt-8">
        <p class="text-error font-medium max-w-sm text-center">{error_fetching}</p>
    </div>
{/if}

<div class="flex justify-center mt-12 mx-2">
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-6 max-w-none md:max-w-lg lg:max-w-none">
        {#each news_history as news}
            <div class="py-2 px-3 md:pb-5 pt-4 md:px-6 flex flex-col items-center gap-2 rounded-md border">
                <p class="text-grey-2 font-medium text-sm">Viewed on{(new Date(news.date)).toLocaleDateString(undefined, { day: 'numeric', month: 'numeric', year: 'numeric' })}</p>
                <NewsCard news={news.news} />
            </div>
        {/each}
    </div>
</div>
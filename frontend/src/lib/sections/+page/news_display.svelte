<script>
  import { fade, slide } from "svelte/transition";
  import NewsCard from "../../items/news_card.svelte";

  export let news_articles;
  let sorted_news_articles = [...news_articles]
  sorted_news_articles.sort((a, b) => {
      // Convert the date strings to date objects for comparison.
      let dateA = new Date(a['date_published']);
      let dateB = new Date(b['date_published']);

      // Compare the dates to determine their order.
      return dateB - dateA; // Use dateA - dateB for ascending order.
  });

  let n_load = 4
  let loading = false
  let show_reached_end = false;
  function loadNews() {
    loading = true
    setTimeout(() => {
      n_load += 4
      loading = false

      if (n_load >= news_articles.length) {
          show_reached_end = true;
          setTimeout(() => {
            show_reached_end = false;
          }, 4000)
        }
    }, 250)
  }
</script>

<section class="flex flex-col gap-4 lg:gap-7 xl:gap-12">
    <div class="flex justify-center">
        <h4 class="text-2xl xl:text-3xl font-semibold">Recent <span class="text-primary-gradient">News</span></h4>
    </div>
    {#if news_articles !== undefined && news_articles.length}
      <div class="grid grid-cols-1 md:grid-cols-2 gap-3 lg:gap-5 xl:gap-6">
          {#each sorted_news_articles.slice(0, n_load) as news}
            <NewsCard news={news}/>
          {/each}
      </div>
      {#if loading}
        <div transition:slide={{duration: 100}} class="flex justify-center pb-8">
          <span transition:fade={{duration: 150}} class="loading loading-dots loading-md text-neutral"></span>
        </div>
      {/if}
      {#if show_reached_end}
        <div transition:slide={{duration: 200}}>
          <p transition:fade={{duration: 300}} class="text-center mt-8 py-2.5 rounded-md bg-warning bg-opacity-30 border border-warning text-sm">You have reached the end</p>
        </div>
      {/if}
      <div class="flex justify-center pt-2">
          <button on:click={loadNews} class="btn bg-primary-gradient-opacity bg-primary-gradient-opacity-inter hover:brightness-105 focus:brightness-105 px-6 md:px-5 h-8 md:h-9 min-h-0 border-0 text-white shadow-md hover:shadow-lg">Load more</button>
      </div>
    {:else}
      <p class="font-medium text-center">There are no news available at the moment</p>
    {/if}
</section>
<script>
  import { fade, slide } from "svelte/transition";

  export let news_articles;
  let sorted_news_articles = [...news_articles]
  sorted_news_articles.sort((a, b) => {
      // Convert the date strings to date objects for comparison.
      let dateA = new Date(a['time_of_the_article']);
      let dateB = new Date(b['time_of_the_article']);

      // Compare the dates to determine their order.
      return dateB - dateA; // Use dateA - dateB for ascending order.
  });

  let n_load = 4
  let loading = false
  function loadNews() {
    loading = true
    setTimeout(() => {
      n_load += 4
      loading = false
    }, 250)
  }
</script>

<section class="flex flex-col gap-12">
    <div class="flex justify-center">
        <h4 class="text-2xl xl:text-3xl font-semibold">Recent <span class="text-primary-gradient">News</span></h4>
    </div>
    <div class="grid grid-cols-2 lg:grid-cols-4 gap-5 xl:gap-6">
        {#each sorted_news_articles.slice(0, n_load) as news, index}
          <div transition:slide={{duration: 150}} class="bg-real-white rounded-lg overflow-hidden shadow-md hover:shadow-lg">
            <div transition:fade={{duration: 300}} class="flex flex-col justify-between gap-2.5 overflow-hidden h-88 xl:h-80">
              <a href="{news.url}" target="_blank" class="overflow-hidden w-full h-32">
                <img src="{news['image']}" alt="thumbnail of news article" class="object-cover w-full h-full"/>
              </a>
              <div class="px-4 flex flex-col gap-1.5">
                <h6 class="font-medium text-sm">
                  {news['title'].slice(0, 80).replace(/\s$/, '')}{news['title'].length > 80 ? "..." : ""}
                </h6>
                <p class="text-xs">
                  {news['description'].slice(0, 160).replace(/\s$/, '')}{news['description'].length > 160 ? "..." : ""}
                </p>
              </div>
              <div class="flex justify-between mt-auto items-center">
                <p class="text-xs pl-4">
                  {news['time_of_the_article'].split('T')[0]}
                </p>
                <a href="{news['url']}" target="_blank" class="bg-neutral px-4 py-1.5 text-white text-sm rounded-tl-md">
                  Read
                </a>
              </div>
            </div>
          </div>
          {#if (index + 1) % 8 == 0}
            <div class="col-span-2 lg:col-span-4 h-24 xl:h-28 bg-primary-gradient-opacity bg-opacity-50 grid place-content-center text-semibold text-lg shadow-md hover:shadow-lg rounded-md">
              ADS
            </div>
          {/if}
        {/each}
    </div>
    {#if loading}
      <div transition:slide={{duration: 100}} class="flex justify-center pb-8">
        <span transition:fade={{duration: 150}} class="loading loading-dots loading-md text-neutral"></span>
      </div>
    {/if}
    <div class="flex justify-center">
        <button on:click={loadNews} class="btn bg-primary-gradient-opacity bg-primary-gradient-opacity-inter hover:brightness-105 focus:brightness-105 px-5 h-9 min-h-0 border-0 text-white shadow-md hover:shadow-lg">Load more</button>
    </div>
</section>
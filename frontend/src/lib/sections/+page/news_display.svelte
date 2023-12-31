<script>
  import { fade, slide } from "svelte/transition";
  import RadialProgressSmall from "../../items/radial_progress_small.svelte";
  import { globalStore } from "../../../stores";

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

  let emotion_dict;
  globalStore.subscribe(value => {
      emotion_dict = value.emotion_dict;
  });
</script>

<section class="flex flex-col gap-4 lg:gap-7 xl:gap-12">
    <div class="flex justify-center">
        <h4 class="text-2xl xl:text-3xl font-semibold">Recent <span class="text-primary-gradient">News</span></h4>
    </div>
    <div class="grid grid-cols-1 md:grid-cols-2 gap-3 lg:gap-5 xl:gap-6">
        {#each sorted_news_articles.slice(0, n_load) as news, index}
          <div transition:slide={{duration: 150}} class="rounded-lg overflow-hidden shadow-md hover:shadow-lg">
            <div transition:fade={{duration: 300}} class="flex flex-col justify-between gap-1.5 lg:gap-2.5 overflow-hidden h-104 md:h-100 lg:h-96">
              <a href="{news.url}" target="_blank" class="overflow-hidden w-full h-44 lg:h-52">
                <img src="{news['image']}" alt="thumbnail of news article" class="object-cover w-full h-full"/>
              </a>
              <div class="px-3 lg:px-4 flex flex-col gap-1 lg:gap-1.5">
                <div class="flex justify-between gap-2 lg:gap-4">
                  <h6 class="font-medium text-lg">
                    {news['title'].slice(0, 100).replace(/\s$/, '')}{news['title'].length > 100 ? "..." : ""}
                  </h6>
                  <div class="mt-0.5">
                    <RadialProgressSmall news={news}/>
                  </div>
                </div>
                <p class="text-sm">
                  {news['description'].slice(0, 250).replace(/\s$/, '')}{news['description'].length > 250 ? "..." : ""}
                </p>
              </div>
              <div class="flex justify-between items-center mt-auto">
                <p class="text-sm font-medium px-4 h-7 bg-neutral-light rounded-tr-md bg-opacity-50 grid place-content-center">
                  {news['time_of_the_article'].split('T')[0]}
                </p>
                <a href="{news['url']}" target="_blank" class="bg-neutral px-12 h-7 grid place-content-center text-white rounded-tl-md font-medium">
                  Read
                </a>
              </div>
            </div>
          </div>
          {#if (index + 1) % 8 == 0}
            <div class="col-span-2 h-20 xl:h-24 bg-primary-gradient-opacity bg-opacity-50 grid place-content-center text-semibold text-lg shadow-md hover:shadow-lg rounded-md">
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
    <div class="flex justify-center mt-2">
        <button on:click={loadNews} class="btn bg-primary-gradient-opacity bg-primary-gradient-opacity-inter hover:brightness-105 focus:brightness-105 px-6 md:px-5 h-8 md:h-9 min-h-0 border-0 text-white shadow-md hover:shadow-lg">Load more</button>
    </div>
</section>
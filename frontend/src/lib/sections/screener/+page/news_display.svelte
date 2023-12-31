<script>
    import { fade, slide } from "svelte/transition";
    import RadialProgressSmall from "$lib/items/radial_progress_small.svelte";
    import { globalStore } from "../../../../stores";
  
    export let news_articles;
    let sorted_news_articles = [...news_articles]
    sorted_news_articles.sort((a, b) => {
        // Convert the date strings to date objects for comparison.
        let dateA = new Date(a['time_of_the_article']);
        let dateB = new Date(b['time_of_the_article']);
  
        // Compare the dates to determine their order.
        return dateB - dateA; // Use dateA - dateB for ascending order.
    });
  
    let emotion_dict;
    globalStore.subscribe(value => {
        emotion_dict = value.emotion_dict;
    });
</script>
<div class="grid grid-cols-3 gap-5">
    {#each sorted_news_articles as news, index}
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
    {/each}
</div>
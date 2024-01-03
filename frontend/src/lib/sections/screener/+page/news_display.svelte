<script>
  import { fade, slide } from "svelte/transition";
  import RadialProgressSmall from "$lib/items/radial_progress_small.svelte";
  import { globalStore } from "../../../../stores";
  import { onMount, onDestroy } from "svelte";

  export let news_articles;

  let emotion_dict;
  globalStore.subscribe(value => {
      emotion_dict = value.emotion_dict;
  });

  let loading = false;
  let is_scroll_operation_running = false;
  function loadOnScroll() {
    const nearBottom = window.innerHeight + window.scrollY >= document.body.offsetHeight - 100;

    if (nearBottom && !is_scroll_operation_running) {
      loading = true;
      is_scroll_operation_running = true;
      setTimeout(() => {
        if(window.innerHeight + window.scrollY >= document.body.offsetHeight - 100) {
          n_load += 12;
          setTimeout(() => {
            is_scroll_operation_running = false;
          }, 200)
        }
        loading = false;
        is_scroll_operation_running = false;
      }, 300)
    }
  }

  // Register the scroll event listener
  onMount(() => {
    window.addEventListener('scroll', loadOnScroll);
  })

  // Clean up
  onDestroy(() => {
    window.removeEventListener('scroll', loadOnScroll);
  });

  // When news_articles changes bring back the load to the default 12
  let n_load;
  $: if (news_articles) {
    n_load = 12;
  }
</script>
<div class="grid grid-cols-2 xl:grid-cols-3 gap-5">
    {#each news_articles.slice(0, n_load) as news (news._id)}
      <div class="rounded-md overflow-hidden shadow-sm hover:shadow-md h-auto">
        <div class="flex flex-col justify-between gap-2 lg:gap-3 overflow-hidden h-full">
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
{#if !(news_articles.length)}
  <div class="flex justify-center font-medium text-lg text-center mt-8">
    <p>With your filters there's no available news.</p>
  </div>
{/if}

{#if loading}
  <div transition:slide={{duration: 100}} class="flex justify-center pt-8">
    <span transition:fade={{duration: 150}} class="loading loading-dots loading-md text-neutral"></span>
  </div>
{/if}
<script>
  import { fade, slide } from "svelte/transition";
  import NewsCard from "../../../items/news_card.svelte";
  import { onMount, onDestroy } from "svelte";

  export let news_articles;

  let loading = false;
  let is_scroll_operation_running = false;
  let show_reached_end = false;
  function loadOnScroll() {
    const nearBottom = window.innerHeight + window.scrollY >= document.body.offsetHeight - 100;

    if (nearBottom && !is_scroll_operation_running && !show_reached_end) {
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
        if (n_load >= news_articles.length) {
          show_reached_end = true;
          setTimeout(() => {
            show_reached_end = false;
          }, 4000)
        }
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
<div class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
    {#each news_articles.slice(0, n_load) as news (news._id)}
      <NewsCard news={news} animate={false}/>
    {/each}
</div>
{#if !(news_articles.length)}
  <div class="flex justify-center font-medium text-lg text-center mt-8">
    <p>With your filters there's no available news.</p>
  </div>
{/if}

{#if show_reached_end}
  <div transition:slide={{duration: 200}}>
    <p transition:fade={{duration: 300}} class="text-center mt-8 py-2.5 rounded-md bg-warning bg-opacity-30 border border-warning text-sm">You have reached the end</p>
  </div>
{/if}

{#if loading}
  <div transition:slide={{duration: 100}} class="flex justify-center pt-8">
    <span transition:fade={{duration: 150}} class="loading loading-dots loading-md text-neutral"></span>
  </div>
{/if}
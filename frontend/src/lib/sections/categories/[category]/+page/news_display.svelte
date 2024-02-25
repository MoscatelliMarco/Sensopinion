<script>
    import { fade, slide } from "svelte/transition";
    import NewsCard from "../../../../items/news_card.svelte";
    import { onMount, onDestroy } from "svelte";
    import { page } from "$app/stores";

    export let news_articles;
    export let string_dict_params;
  
    let loading = false;
    let is_scroll_operation_running = false;
    let show_reached_end = false;
    let n_loaded = news_articles.length;
    function loadOnScroll() {
      const nearBottom = window.innerHeight + window.scrollY >= document.body.offsetHeight - 100;
  
      if (nearBottom && !is_scroll_operation_running && !show_reached_end) {
        loading = true;
        is_scroll_operation_running = true;
        setTimeout(async () => {
          let data_news;
          if(window.innerHeight + window.scrollY >= document.body.offsetHeight - 100) {
            // Send request
            let res_news;
            try {
              res_news = await fetch(`/api/news/${$page.params.category}?n_load=12&skip=${n_loaded}${string_dict_params ? "&" + string_dict_params : ""}`);
            } catch (e) {
              console.log(e)
              loading = false
              show_reached_end = true;
              setTimeout(() => {
                show_reached_end = false;
              }, 4000)
              return
            }
  
            data_news = await res_news.json();
            if (Array.isArray(data_news)) {
              news_articles = news_articles.concat(data_news)
              n_loaded = news_articles.length;
            } else {
              show_reached_end = true;
              setTimeout(() => {
                  show_reached_end = false;
              }, 4000)
            }
  
            setTimeout(() => {
              is_scroll_operation_running = false;
            }, 200)
          }
          loading = false;
          is_scroll_operation_running = false;
  
          loading = false
          if (data_news.length == 0) {
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
  </script>
  <div class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
      {#each news_articles as news }
        <NewsCard news={news}/>
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
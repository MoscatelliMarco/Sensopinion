<script>
  import RadialProgressSmall from "./radial_progress_small.svelte";
  import { fade } from "svelte/transition";

  export let news;
  export let animate = true;

  function animation(node) {
    if (animate) {
      return fade(node, {duration: 200});
    } else {
      return null;
    }
  }
</script>

<div class="rounded-md overflow-hidden shadow-sm hover:shadow-md h-auto">
  <div transition:animation class="flex flex-col justify-between gap-2 lg:gap-3 overflow-hidden h-full relative border">
    <div class="absolute top-2 right-2 flex gap-1.5">
      {#if "Politics" in news['categories']}
        <a href="/categories/politics" class="bg-white rounded-md p-1 shadow-sm hover:shadow-md">
          ⚖️
        </a>
      {/if}
      {#if "Economy" in news['categories']}
        <a href="/categories/economy" class="bg-white rounded-md p-1 shadow-sm hover:shadow-md">
          💵
        </a>
      {/if}
      {#if "Environment" in news['categories']}
        <a href="/categories/environment" class="bg-white rounded-md p-1 shadow-sm hover:shadow-md">
          🍃
        </a>
      {/if}
    </div>
    <a href="/redirect/{news['_id']}" target="_blank" class="overflow-hidden w-full h-52 lg:h- border-x border-t">
      <img src="{news['image']}" alt="thumbnail of news article" class="object-cover w-full h-full rounded-t-sm"/>
    </a>
    <div class="px-3 lg:px-4 flex flex-col gap-1 lg:gap-1.5">
      <div class="flex justify-between gap-1 lg:gap-2">
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
      <a href="/redirect/{news['_id']}" target="_blank" class="bg-neutral px-12 h-7 grid place-content-center text-white rounded-tl-md font-medium">
        Read
      </a>
    </div>
  </div>
</div>
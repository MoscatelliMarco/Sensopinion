<script>
  import RadialProgressSmall from "./radial_progress_small.svelte";
  import ImageComponentCard from "./image_component_card.svelte";

  export let news;
</script>

<div class="rounded-md overflow-hidden shadow-sm hover:shadow h-auto">
  <div class="flex flex-col justify-between gap-2 lg:gap-3 overflow-hidden h-full relative border">
    <div class="absolute top-2.5 right-2.5 flex gap-1.5">
      {#if "Politics" in news['categories']}
        <a href="/categories/politics" class="bg-white rounded p-1 shadow-sm hover:shadow-md text-sm">
          ⚖️
        </a>
      {/if}
      {#if "Economy" in news['categories']}
        <a href="/categories/economy" class="bg-white rounded p-1 shadow-sm hover:shadow-md text-sm">
          💵
        </a>
      {/if}
      {#if "Environment" in news['categories']}
        <a href="/categories/environment" class="bg-white rounded p-1 shadow-sm hover:shadow-md text-sm">
          🍃
        </a>
      {/if}
    </div>
    <a href="{(new URL(news['url'])).origin}" target="_blank" class="absolute top-2.5 left-2.5 flex text-white bg-black bg-opacity-40 backdrop-blur px-1.5 py-1 text-xs rounded">
        {(new URL(news['url'])).hostname.replace('www.','')}
    </a>
    <ImageComponentCard url={news["image"]} id={news["_id"]}/>
    <div class="px-3 lg:px-4 flex flex-col gap-1 lg:gap-1.5">
      <div class="flex justify-between gap-1 lg:gap-2">
        <h6 class="font-medium text-lg">
          {news['title'].slice(0, 100).replace(/\s$/, '')}{news['title'].length > 100 ? "..." : ""}
        </h6>
        <div class="mt-0.5">
          <RadialProgressSmall news={news}/>
        </div>
      </div>
      <p class="text-sm text-grey-1 font-light">
        {news['description'].slice(0, 250).replace(/\s$/, '')}{news['description'].length > 250 ? "..." : ""}
      </p>
    </div>
    <div class="mt-auto">
      <div class="flex justify-between items-center mt-1 md:mt-1.5">
        <p class="text-xs font-medium px-4 h-6.5 text-grey-3 rounded-tr-md bg-opacity-50 grid place-content-center">
          {news['date_published'].split('T')[0]}
        </p>
        <a href="/news/{news['_id']}" target="_blank" class="bg-grey-4 px-6 h-6.5 grid place-content-center text-grey-2 rounded-tl font-semibold text-xs">
          Read & Infos
        </a>
      </div>
    </div>
  </div>
</div>
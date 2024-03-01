<script>
    import DynamicRadio from "../../../items/dynamic_radio.svelte";
    import { globalStore } from "../../../../stores";
    import RadialProgressSmall from "../../../items/radial_progress_small.svelte";

    export let data;

    let imageError = false;
</script>

<h6 class="text-3xl md:text-4xl lg:text-5xl font-medium text-center mt-2">
    News <span class="text-primary-gradient">analysis</span>
</h6>
{#if Object.keys(data).length > 4}
    <div class="rounded-md overflow-hidden shadow-sm hover:shadow h-auto w-80 md:w-124 text-left">
        <div class="flex flex-col justify-between gap-2 lg:gap-3 overflow-hidden h-full relative border">
            <div class="overflow-hidden w-full h-52 lg:h-56 border-x border-t">
                {#if !imageError}
                    <img src="{data[5]}" alt="thumbnail of news article" class="object-cover w-full h-full rounded-t-sm card-images" on:error={() => {imageError = true;}}/>
                {:else}
                    <div class="grid place-items-center h-full">
                        <p class="text-sm font-light">Couldn't load the image</p>
                    </div>
                {/if}
            </div>
            <div class="px-3 lg:px-4 flex flex-col gap-1 lg:gap-1.5">
                <div class="flex justify-between gap-1 lg:gap-2">
                    <h6 class="font-medium text-lg">
                        {data[7].slice(0, 100).replace(/\s$/, '')}{data[7].length > 100 ? "..." : ""}
                    </h6>
                </div>
                <p class="text-sm text-grey-1 font-light">
                    {data[6].slice(0, 250).replace(/\s$/, '')}{data[6].length > 250 ? "..." : ""}
                </p>
            </div>
            <div class="mt-auto">
                <div class="flex justify-between items-center mt-1 md:mt-1.5">
                    <p class="text-xs font-medium px-4 h-6.5 text-grey-3 rounded-tr-md bg-opacity-50 grid place-content-center">
                        {data[4].split('T')[0]}
                    </p>
                </div>
            </div>
        </div>
    </div>
{/if}
<div class="w-full max-w-lg flex flex-col gap-4 mt-8 md:mt-10 lg:mt-12">
    <div class="flex justify-center font-light text-sm">
        <p>Positivity and Subjectivity</p>
    </div>
    <div class="flex gap-3 md:gap-4 lg:gap-6 justify-center">
        {#each Object.keys(data[1]) as emotion}
            <div class="w-24 md:w-32">
                <DynamicRadio emoji_size="2xl" value={$globalStore.stretchFunction(data[1][emotion]) * 100} name={emotion} />
            </div>
        {/each}
    </div>
    <div class="flex justify-center font-light text-sm mt-5 md:mt-6">
        <p>Emotions</p>
    </div>
    <div class="flex justify-center gap-2 md:gap-4 lg:gap-5">
        {#each Object.keys(data[0]).slice(0, 4) as emotion}
            <div class="w-18 md:w-24">
                <DynamicRadio emoji_size="lg" value={data[0][emotion] * 100} name={emotion} />
            </div>
        {/each}
    </div>
    <div class="flex justify-center gap-2 md:gap-4 lg:gap-5 mt-neg-2">
        {#each Object.keys(data[0]).slice(4) as emotion}
            <div class="w-18 md:w-24">
                <DynamicRadio emoji_size="lg" value={data[0][emotion] * 100} name={emotion} />
            </div>
        {/each}
    </div>
    <div class="flex justify-center font-light text-sm mt-5 md:mt-6">
        <p>Categories</p>
    </div>
    <div class="flex gap-4 justify-center">
        {#if data[2].includes("Politics")}
            <a href="/categories/politics" class="bg-white text-lg rounded-md p-1.5 shadow-sm hover:shadow">
            ⚖️
            </a>
        {/if}
        {#if data[2].includes("Economy")}
            <a href="/categories/economy" class="bg-white text-lg rounded-md p-1.5 shadow-sm hover:shadow">
            💵
            </a>
        {/if}
        {#if data[2].includes("Environment")}
            <a href="/categories/environment" class="bg-white text-lg rounded-md p-1.5 shadow-sm hover:shadow">
            🍃
            </a>
        {/if}
        {#if data[2].includes("Others") || !data[2].length}
            <p class="bg-white rounded-md px-2.5 py-1.5 shadow-sm text-sm">
                Others
            </p>
        {/if}
    </div>
</div>
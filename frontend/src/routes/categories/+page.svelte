<script>
    import GridRadialProgress from "$lib/items/grid_radial_progress.svelte"
    import { globalStore } from "../../stores";

    let categories = $globalStore.categories;

    // Get the metrics from the prop
    export let data;
    let metrics = data['props']['metrics'];
</script>

<svelte:head>
    <title>Categories</title>
    <meta name='description' content="From politics, to economy, to environment, we got everything analyzed!">
</svelte:head>

<div class="flex flex-col gap-28 md:gap-32 xl:gap-36 mt-4 md:mt-5 lg:mt-8 xl:mt-10">
    {#each Object.keys(categories) as category}
        <div class="flex flex-col gap-5 lg:gap-7">
            <div class="flex flex-col gap-1.5 md:gap-2 border-2 rounded-6xl md:rounded-full xl:px-10 py-4 md:py-5 lg:py-6">
                <a href="/categories/{category}"><h2 class="col-span-3 text-lg md:text-xl lg:text-2xl text-center hover:font-medium">{category.charAt(0).toUpperCase() + category.slice(1)}</h2></a>
                <GridRadialProgress name={category.toLowerCase()} metrics={metrics}/>
            </div>
            <div class="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 text-center gap-x-1 gap-y-1.5 md:gap-2 lg:gap-3 xl:gap-6 px-0 md:px-3 lg:px-4">
                {#each categories[category] as subcategory, index}
                    {#if index == 8}
                        <div class="hidden md:block lg:hidden"></div>
                    {/if}
                    <div class="flex flex-col gap-1 lg:gap-0.25 justify-between border-2 px-3 lg:px-4.5 xl:px-6 pb-2 pt-1.5 rounded-full">
                        <a href="/categories/{category.toLowerCase()}?subcategories={subcategory.replaceAll(" ", "_").toLowerCase()}" class="text-xs lg:text-sm hover:font-medium">{subcategory}</a>
                        <GridRadialProgress name={subcategory.replaceAll(" ", "_").toLowerCase() + "_" + category.toLowerCase()} metrics={metrics} dimension={'small'}/>
                    </div>
                {/each}
            </div>
        </div>
    {/each}
</div>
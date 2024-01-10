<script>
    import { fade, slide } from "svelte/transition";
    import NewsChart from "../../items/news_chart.svelte";
    import { globalStore } from '../../../stores.js';

    let categories = $globalStore.categories;

    export let category_type = null;
    export let emotion_analyze;
    export let cake_chart_colors;
    export let metrics;
    export let factor;
</script>

<div transition:slide={{duration: 700}} class="pt-6 md:pt-14 xl:pt-18">
    <div transition:fade={{duration: 200}} class="grid grid-cols-2 md:grid-cols-4 xl:grid-cols-5 gap-x-3 md:gap-x-0 gap-y-3 md:gap-y-6 xl:gap-y-9 xl:mx-14">
        {#each categories[category_type] as category, index}
            {#if (index == 8)}
                <!-- div to have the other two elements centered when grid-cols-4 -->
                <div class="hidden md:block xl:hidden"></div>
            {/if}
            <a href="#" class="flex flex-col items-center gap-2 xl:gap-3">
                <h4 class="text-xs md:text-base text-center font-medium">{category}</h4>
                <NewsChart name="{category.toLowerCase().replaceAll(" ", "_") + '_' + category_type}" value={
                    (category.toLowerCase().replaceAll(" ", "_") + '_' + category_type) in metrics ? 
                    metrics[(category.toLowerCase().replaceAll(" ", "_") + '_' + category_type)][factor]
                    : "N/A"
                } dimension='small' emotion_analyze={emotion_analyze} cake_chart_colors={cake_chart_colors}/>
            </a>
        {/each}
    </div>
</div>
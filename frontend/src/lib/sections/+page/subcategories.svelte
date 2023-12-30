<script>
    import { fade, slide } from "svelte/transition";
    import NewsChart from "../../items/news_chart.svelte";

    export let category_type = null;
    export let emotion_analyze;
    export let cake_chart_colors;
    export let metrics;
    export let factor;

    let data;
    $: if (category_type == 'politics') {
        data = [
            "Elections",
            "International Relations",
            "Policy Reforms",
            "Legislation",
            "Civil Right",
            "Defense And Security",
            "Local Governance",
            "Politics Scandals",
            "Public Opinion",
            "Others"
        ]
    } else if (category_type == 'economy') {
        data = [
            "Global Economy",
            "Stock Market",
            "Banking",
            "Real Estate",
            "Cryptocurrencies",
            "Insurance",
            "Taxation",
            "Corporate Finance",
            "Economic Policies",
            "Others"
        ]
    } else if (category_type == 'environment') {
        data = [
            "Climate Change",
            "Renewable Energy",
            "Wildlife",
            "Pollution",
            "Natural Disasters",
            "Agriculture",
            "Water Resources",
            "Environment Laws",
            "Biodiversity",
            "Others"
        ]
    } else{
        new Error("Subcategory type not recognized")
    }
</script>

<div transition:slide={{duration: 500}} class="mt-2 md:mt-14 xl:mt-18">
    <div transition:fade={{duration: 400}} class="grid grid-cols-2 md:grid-cols-4 xl:grid-cols-5 gap-x-3 md:gap-x-0 gap-y-3 md:gap-y-6 xl:gap-y-9 xl:mx-14">
        {#each data as category, index}
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

<!-- {
    category.toLowerCase().replaceAll(" ", "_") + '_' + category_type in metrics ? 
    metrics[category.toLowerCase().replaceAll(" ", "_") + '_' + category_type][factor] : 
    "5"
} -->
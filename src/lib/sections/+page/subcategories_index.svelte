<script>
    import RadialProgress from "../../items/radial_progress.svelte";
    export let category_type = null;
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

<div class="grid grid-cols-4 xl:grid-cols-5 gap-y-8 xl:gap-y-9 xl:mx-14">
    {#each data as category, index}
        {#if (index == 8)}
            <!-- div to have the other two elements centered when grid-cols-4 -->
            <div class="block xl:hidden"></div>
        {/if}
        <a href="#" class="flex flex-col items-center gap-2 xl:gap-3">
            <h4 class="text-center font-medium">{category}</h4>
            <RadialProgress name="{category.toLowerCase().replaceAll(" ", "_")}" run_anim=true value=89.4 dimension='small'/>
        </a>
    {/each}
</div>
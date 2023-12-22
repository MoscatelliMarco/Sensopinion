<script>
    import RadialProgress from "../items/radial_progress.svelte";
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
            "Political Parties",
        ]
    } else if (category_type == 'economy') {
        data = [
            "Global Economy",
            "Stock Market",
            "Banking",
            "Real Estate",
            "Cryptocurrencies",
            "Personal Finance",
            "Insurance",
            "Taxation",
            "Corporate Finance",
            "Economic Policies",
        ]
    } else if (category_type == 'environment') {
        data = [
            "Climate Change",
            "Renewable Energy",
            "Wildlife",
            "Pollution",
            "Sustainable Living",
            "Natural Disasters",
            "Agriculture",
            "Water Resources",
            "Evironment Laws",
            "Biodiversity"
        ]
    } else{
        new Error("Subcategory type not recognized")
    }
</script>

<div class="grid grid-cols-5 gap-x-4 gap-y-8">
    {#each data as category}
        <a href="#" class="flex flex-col items-center gap-4">
            <h4 class="text-center font-medium">{category}</h4>
            <RadialProgress name="{category.toLowerCase().replaceAll(" ", "_")}" run_anim=true font_size=20 value=89.4 size=140 thickness=10/>
        </a>
    {/each}
</div>
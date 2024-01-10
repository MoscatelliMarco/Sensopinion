<script>
    import GridRadialProgress from "$lib/items/grid_radial_progress.svelte"
    import { globalStore } from "../../stores";
    
    let news_articles;
    let categories;
    const unsubscribe = globalStore.subscribe((value) => {
        news_articles = value.news;
        categories = value.categories;
    })
    unsubscribe()

    let metrics = {}
    if (news_articles !== undefined) {
        for (let emotion of ['anger', 'disgust', 'fear', 'neutral', 'sadness', 'surprise', 'happiness']) {
            for (let news of news_articles) {
                for (let category in news['categories']) {
                    let raw_category = category;
                    category = category.toLowerCase().replaceAll(" ", "_");
                    if (!(category in metrics)) {
                        metrics[category] = {'emotions': {}, 'positivity': {'numerator': 0,'denominator': 0},'subjectivity': {'numerator': 0,'denominator': 0}}
                    }
                    if (emotion in metrics[category]['emotions']) {
                        metrics[category]['emotions'][emotion]['numerator'] += news['emotions'][emotion]
                        metrics[category]['emotions'][emotion]['denominator'] += 1
                    }
                    else{
                        metrics[category]['emotions'][emotion] = {'numerator': news['emotions'][emotion],'denominator': 1}
                    }
                    for (let subcategory of news['categories'][raw_category]){
                        subcategory = subcategory.toLowerCase().replaceAll(" ", "_") + '_' + category
                        if (!(subcategory in metrics)) {
                            metrics[subcategory] = {'emotions': {}, 'positivity': {'numerator': 0,'denominator': 0},'subjectivity': {'numerator': 0,'denominator': 0}}
                        }
                        if (emotion in metrics[subcategory]['emotions']) {
                            metrics[subcategory]['emotions'][emotion]['numerator'] += news['emotions'][emotion]
                            metrics[subcategory]['emotions'][emotion]['denominator'] += 1
                        }
                        else{
                            metrics[subcategory]['emotions'][emotion] = {'numerator': news['emotions'][emotion],'denominator': 1}
                        }
                    }
                }
            }
            for (let metric in metrics) {
                metrics[metric]['emotions'][emotion] = Math.round(metrics[metric]['emotions'][emotion]['numerator'] / metrics[metric]['emotions'][emotion]['denominator'] * 1000) / 10
            }
        }
        for (let news of news_articles) {
            for (let category in news['categories']) {
                let raw_category = category;
                category = category.toLowerCase().replaceAll(" ", "_");
                metrics[category]['positivity']['numerator'] += news['sentiment']['polarity']
                metrics[category]['positivity']['denominator'] += 1
                metrics[category]['subjectivity']['numerator'] += news['sentiment']['subjectivity']
                metrics[category]['subjectivity']['denominator'] += 1
                for (let subcategory of news['categories'][raw_category]) {
                    subcategory = subcategory.toLowerCase().replaceAll(" ", "_") + "_" + category;
                    metrics[subcategory]['positivity']['numerator'] += news['sentiment']['polarity']
                    metrics[subcategory]['positivity']['denominator'] += 1
                    metrics[subcategory]['subjectivity']['numerator'] += news['sentiment']['subjectivity']
                    metrics[subcategory]['subjectivity']['denominator'] += 1
                }
            }
        }
        for (let metric in metrics) {
            metrics[metric]['positivity'] = Math.round(metrics[metric]['positivity']['numerator'] / metrics[metric]['positivity']['denominator'] * 1000) / 10
            metrics[metric]['subjectivity'] = Math.round(metrics[metric]['subjectivity']['numerator'] / metrics[metric]['subjectivity']['denominator'] * 1000) / 10
        }
    }
</script>
<div class="flex flex-col gap-32 xl:gap-36 mt-4 md:mt-5 lg:mt-8 xl:mt-10">
    {#each Object.keys(categories) as category}
        <div class="flex flex-col gap-5 lg:gap-7">
            <div class="flex flex-col gap-3 lg:gap-5 border-2 rounded-full px-4 xl:px-7 py-5">
                <a href="/categories/{category}"><h2 class="col-span-3 text-xl lg:text-2xl text-center hover:font-medium">{category.charAt(0).toUpperCase() + category.slice(1)}</h2></a>
                <GridRadialProgress name={category.toLowerCase()} metrics={metrics}/>
            </div>
            <div class="grid grid-cols-4 lg:grid-cols-5 text-center gap-2 lg:gap-3 xl:gap-6">
                {#each categories[category] as subcategory, index}
                    {#if index == 8}
                        <div class="hidden md:block lg:hidden"></div>
                    {/if}
                    <div class="flex flex-col gap-0.5 lg:gap-0.25 justify-between border-2 px-3 lg:px-4.5 xl:px-6 pb-2 pt-1.5 rounded-full">
                        <a href="/categories/{category.toLowerCase()}/{subcategory.replaceAll(" ", "_").toLowerCase()}" class="italic text-xs lg:text-sm font-medium hover:font-semibold">{subcategory}</a>
                        <GridRadialProgress name={subcategory.replaceAll(" ", "_").toLowerCase() + "_" + category.toLowerCase()} metrics={metrics} dimension={'small'}/>
                    </div>
                {/each}
            </div>
        </div>
    {/each}
</div>
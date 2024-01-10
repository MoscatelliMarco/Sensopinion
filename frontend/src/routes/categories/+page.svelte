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
<div class="flex flex-col gap-44 mt-12">
    {#each Object.keys(categories) as category}
        <div class="flex flex-col gap-5">
            <a href="/categories/{category}"><h2 class="col-span-3 text-2xl text-center hover:font-medium">{category.charAt(0).toUpperCase() + category.slice(1)}</h2></a>
            <div class="flex flex-col gap-7">
                <GridRadialProgress name={category.toLowerCase()} metrics={metrics}/>
                <div class="grid grid-cols-5 text-center gap-6">
                    {#each categories[category] as subcategory}
                        <div class="flex flex-col border-2 px-6 pb-2 pt-1.5 rounded-full">
                            <a href="/categories/{category.toLowerCase()}/{subcategory.replaceAll(" ", "_").toLowerCase()}" class="italic text-sm font-medium hover:font-semibold">{subcategory}</a>
                            <GridRadialProgress name={subcategory.replaceAll(" ", "_").toLowerCase() + "_" + category.toLowerCase()} metrics={metrics} dimension={'small'}/>
                        </div>
                    {/each}
                </div>
            </div>
        </div>
    {/each}
</div>
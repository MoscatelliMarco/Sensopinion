<script>
    import { globalStore } from "../../../stores";
    import NewsDisplay from "$lib/sections/screener/+page/news_display.svelte"
    import { page } from '$app/stores';

    let news_articles = $globalStore.news;
    let metrics = $globalStore.metrics;
    let categories = $globalStore.categories;

    if (!Object.keys(metrics).length) {
        metrics = {
            'all': {
                'emotions': {},
                'positivity': {
                    'numerator': 0,
                    'denominator': 0
                },
                'subjectivity': {
                    'numerator': 0,
                    'denominator': 0
                }
            }
        }
        if (news_articles !== undefined) {
            for (let emotion of ['anger', 'disgust', 'fear', 'neutral', 'sadness', 'surprise', 'happiness']) {
                for (let news of news_articles) {
                    if (emotion in metrics['all']['emotions']) {
                        metrics['all']['emotions'][emotion]['numerator'] += news['emotions'][emotion]
                        metrics['all']['emotions'][emotion]['denominator'] += 1
                    }
                    else{
                        metrics['all']['emotions'][emotion] = {'numerator': news['emotions'][emotion],'denominator': 1}
                    }

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
                metrics['all']['positivity']['numerator'] += news['sentiment']['polarity']
                metrics['all']['positivity']['denominator'] += 1
                metrics['all']['subjectivity']['numerator'] += news['sentiment']['subjectivity']
                metrics['all']['subjectivity']['denominator'] += 1
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
                metrics[metric]['positivity'] = Math.round($globalStore.stretchFunction(metrics[metric]['positivity']['numerator'] / metrics[metric]['positivity']['denominator']) * 1000) / 10
                metrics[metric]['subjectivity'] = Math.round($globalStore.stretchFunction(metrics[metric]['subjectivity']['numerator'] / metrics[metric]['subjectivity']['denominator']) * 1000) / 10
            }
        }
    }
</script>

<div class="flex flex-col gap-8">
    <div class="flex flex-col gap-4 mt-8">
        <div class="flex">
            <h1 class="text-3xl text-primary-gradient font-semibold">{($page.params.category).charAt(0).toUpperCase() + ($page.params.category).slice(1)}</h1>
        </div>
        <div class="grid grid-cols-5 gap-x-8 gap-y-2">
            {#each categories[$page.params.category] as subcategory}
                <div class="flex gap-1">
                    <input type="checkbox" id="{subcategory}_checkbox" class="w-5"/>
                    <label for="{subcategory}_checkbox" class="text-xs">{subcategory}</label>
                </div>
            {/each}
        </div>
    </div>
    
    <NewsDisplay news_articles={news_articles} />
</div>
import { collection_news } from "$lib/server/mongodb_collections";
import { json } from '@sveltejs/kit';
import { globalStore } from '../../../stores.js';
// Store current length collection so doesn't have to do the math every time
let current_len_collection = undefined;
let metrics_cache = {};

export async function GET() {

    // Get the stretch function from the globalstore
    let stretchFunction;
    const unsubscribe = globalStore.subscribe((store) => {
        stretchFunction = store.stretchFunction;
    })
    unsubscribe()

    // Download the needed part of the news articles
    const projection = { google_news_url: 0, time_analyze: 0 }; // Exclude fields from the results
    let news_articles = await collection_news.find({}, { projection }).toArray();

    // If the length is the same the means that the article are the same and you can use the metrics_cache calculated in the request before (this has a small chance to not calculate the metrics properly if an article is deleted and added at the same time, but the different would be irrelevant)
    if (news_articles.length === current_len_collection) {
        return json(metrics_cache)
    }

    // Calculate the metrics if the length of the previous collection length is different
    let metrics = {
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

    for (let emotion of ['anger', 'disgust', 'fear', 'neutral', 'sadness', 'surprise', 'happiness']) {
        metrics['all']['emotions'][emotion] = {
            'numerator': 0,
            'denominator': 0
        }

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
            // Handle if denominator == 0
            if (metrics[metric]['emotions'][emotion]['denominator'] == 0) {
                metrics[metric]['emotions'][emotion] = 0;
            } else {
                metrics[metric]['emotions'][emotion] = Math.round(metrics[metric]['emotions'][emotion]['numerator'] / metrics[metric]['emotions'][emotion]['denominator'] * 1000) / 10
            }
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
        metrics[metric]['positivity'] = Math.round(stretchFunction(metrics[metric]['positivity']['numerator'] / metrics[metric]['positivity']['denominator']) * 1000) / 10
        metrics[metric]['subjectivity'] = Math.round(stretchFunction(metrics[metric]['subjectivity']['numerator'] / metrics[metric]['subjectivity']['denominator']) * 1000) / 10
    }

    // Save old metrics in the cache
    metrics_cache = {...metrics};
    current_len_collection = news_articles.length;

    return json(metrics);
}
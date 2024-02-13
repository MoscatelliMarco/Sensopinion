<script>
    import { globalStore } from "../../../stores";
    import NewsChartCustom from "./news_chart_custom.svelte";

    const all_categories = $globalStore.categories;
    let categories_parameter = [];
    for (let category in all_categories) {
        categories_parameter.push(category)
        for (let subcategory of all_categories[category]) {
            categories_parameter.push(subcategory.toLowerCase().replaceAll(" ", "_") + "_" + category)
        }
    }

    const factors = $globalStore.emotion_dict;
    const factors_parameter = [...Object.keys(factors)]
    factors_parameter.push('polarity')
    factors_parameter.push('subjectivity')

    export let parameters;
    export let requiredParameters;

    requiredParameters({
        "category": categories_parameter,
        "factor": factors_parameter,
        "order": ["ascending", "descending"],
        "factor_name": "string"
    })

    function capitalizeFirstLetter(str) {
        return str.split(' ').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
    }

    const news = $globalStore.news;
    let news_article_show;
    $: if (parameters) {
        // news_articles_show = news.filter((item) => {
        //     // If there is not category filter show everything
        //     let count_not_present_categories = 0;
        //     for (let category in categories) {
        //         if (!parameters['category']) {
        //             count_not_present_categories += 1;
        //         }
        //     }
        //     if (count_not_present_categories == Object.keys(categories).length) {
        //         return true;
        //     }
        //     for (let category in categories) {
        //         if (parameters['category']) {
        //             if (parameters['category'] == 'true' || parameters['category'] === true) {
        //                 for (let news_category in item['categories']) {
        //                     if (news_category.toLowerCase() == category) {
        //                         return true;
        //                     }
        //                 }
        //             } 
        //             // if the parameters is a list
        //             else {
        //                 if (item['categories'][category.charAt(0).toUpperCase() + category.slice(1)]) {
        //                     for (let news_subcategory of item['categories'][category.charAt(0).toUpperCase() + category.slice(1)]) {
        //                         if (parameters['category'].includes(news_subcategory.replaceAll(" ", "_").toLowerCase())) {
        //                             return true;
        //                         }
        //                     }
        //                 }
        //             }
        //         }
        //     }
        //     return false;
        // })
        news_article_show = news.sort((a, b) => {
            let factor1;
            let factor2;

            if (parameters['factor'] == 'polarity') {
                factor1 = a['sentiment']['polarity'];
                factor2 = b['sentiment']['polarity'];
            } else if (parameters['factor'] == 'subjectivity') {
                factor1 = a['sentiment']['subjectivity'];
                factor2 = b['sentiment']['subjectivity'];
            } 

            else if (parameters['factor'] == 'happiness') {
                factor1 = a['emotions']['happiness'];
                factor2 = b['emotions']['happiness'];
            } else if (parameters['factor'] == 'surprise') {
                factor1 = a['emotions']['surprise'];
                factor2 = b['emotions']['surprise'];
            } else if (parameters['factor'] == 'fear') {
                factor1 = a['emotions']['fear'];
                factor2 = b['emotions']['fear'];
            } else if (parameters['factor'] == 'disgust') {
                factor1 = a['emotions']['disgust'];
                factor2 = b['emotions']['disgust'];
            } else if (parameters['factor'] == 'anger') {
                factor1 = a['emotions']['anger'];
                factor2 = b['emotions']['anger'];
            } else if (parameters['factor'] == 'neutral') {
                factor1 = a['emotions']['neutral'];
                factor2 = b['emotions']['neutral'];
            } else if (parameters['factor'] == 'sadness') {
                factor1 = a['emotions']['sadness'];
                factor2 = b['emotions']['sadness'];
            }

            else {
                factor1 = new Date(a['date_published']);
                factor2 = new Date(b['date_published']);
            }

            // Compare the dates to determine their order.
            if (parameters['order'] == 'ascending') {
                return factor2 - factor1; // Use dateA - dateB for ascending order.
            }
            return factor1 - factor2;
        });
    }
</script>

<main class="w-full h-full py-20 px-28 flex flex-col justify-between gap-16">
    <div class="flex justify-center">
        <h1 class="text-5xl font-medium max-w-lg text-center">
            Most <span class="font-bold text-primary-gradient">{parameters['factor_name']}</span> news in the last 10 days about <span class="font-bold">{parameters['category'] ? capitalizeFirstLetter(parameters['category'].replace("_politics", "").replace("_environment", "").replace("_economy", "").replaceAll("_", " ")) : parameters['category']}</span>
        </h1>
    </div>

    <div class="flex justify-between gap-8">
        <div class="flex flex-col justify-center">
            <NewsChartCustom size={300} thickness={20} font_size={32} font_weight={800} value={parameters['factor'] != 'polarity' && parameters['factor'] != 'subjectivity' ? Math.round(news_article_show[0]['emotions'][parameters['factor']] * 1000) / 10 : Math.round($globalStore.stretchFunction(news_article_show[0]['sentiment'][parameters['factor']]) * 1000) / 10}/>
            <p class="font-light text-sm text-center w-full mt-2">*{parameters['factor']} of the news highlighted</p>
        </div>
        <div class="flex flex-col justify-center gap-2 max-w-md">
            <div class="flex gap-2">
                <div class="flex flex-col justify-center">
                    <svg class="w-8 mt-1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1024 1024" version="1.1"><path d="M454.5 675.5l-32.4 107.9h181.8L574.5 678" fill="#FBBA22"/><path d="M510.1 682.3c215.1 0 215.1-165.2 215.1-165.2V197.4H300.9v319.7s0 165.2 215.1 165.2h-5.9z" fill="#FBBA22"/><path d="M515.4 783.4h91.1s89.5 2.3 89.5 80.8H332.4c0-78.6 89.5-80.8 89.5-80.8H513" fill="#C04931"/><path d="M816.5 383.8V259.3c0-11.2-9-20.2-20.2-20.2h-50.9v-41.7c0-11.2-9-20.2-20.2-20.2H300.9c-11.2 0-20.2 9-20.2 20.2v41.7h-50.9c-11.2 0-20.2 9-20.2 20.2v124.5c0 1.2-0.7 42.2 27.2 70.9 11.7 12 26.5 19.9 43.9 23.8v38.6c0 1.6 2.1 135.7 147.8 174.7l-21.8 72.7c-39 5.7-94.5 31.2-94.5 99.7 0 11.2 9 20.2 20.2 20.2H696c11.2 0 20.2-9 20.2-20.2 0-69.6-57.2-94.7-96.6-99.9l-20.4-72.9c144.1-39.6 146.2-172.7 146.2-174.3v-38.6c17.4-3.9 32.1-11.8 43.9-23.8 27.9-28.7 27.2-69.7 27.2-70.9z m-550.8 42.7c-16-16.4-15.8-41.9-15.8-42.1V279.6h30.7v156.7c-5.7-2.4-10.8-5.6-14.9-9.8z m338.2 377.1c0.1 0 0.1 0 0 0h2c6.2 0.2 54 3 66.8 40.4h-317c12.8-37.4 60.5-40.2 66.2-40.4h182z m-154.6-40.4l19.1-63.6c12.5 1.6 25.9 2.5 40.1 2.8 0.5 0 1.1 0.1 1.6 0.1h5.9c0.5 0 1.1 0 1.6-0.1 14.9-0.3 28.8-1.3 41.9-3l17.9 63.9H449.3zM705 517c-0.1 5.9-3.5 143.6-191.9 145-17.6-0.1-33.6-1.4-48.1-3.7-1.5-0.9-3-1.7-4.7-2.2-3.2-0.9-6.3-1-9.4-0.4-127.1-27.3-129.7-133.5-129.8-138.6V217.6H705V517z m55.3-90.5c-4.1 4.2-9.1 7.4-15 9.8V279.5H776v104.8c0.1 0.3 0.3 25.8-15.7 42.2z" fill="#211F1E"/><path d="M446.7 449.5l-11.2 65.2c-1 5.7 1.4 11.4 6 14.8 4.7 3.4 10.8 3.8 16 1.1l58.5-30.8 58.5 30.8c2.2 1.2 4.6 1.7 7.1 1.7 3.1 0 6.3-1 8.9-2.9 4.7-3.4 7-9.1 6-14.8l-11.2-65.2 47.4-46.2c4.1-4 5.6-10.1 3.8-15.5-1.8-5.5-6.5-9.5-12.2-10.3L559 368l-29.3-59.3c-2.6-5.2-7.8-8.4-13.6-8.4s-11 3.3-13.6 8.4L473.2 368l-65.5 9.5c-5.7 0.8-10.4 4.8-12.2 10.3-1.8 5.5-0.3 11.5 3.8 15.5l47.4 46.2z m38.8-52.6c4.9-0.7 9.2-3.8 11.4-8.3l19.2-38.9 19.2 38.9c2.2 4.5 6.5 7.6 11.4 8.3l43 6.2-31.1 30.3c-3.6 3.5-5.2 8.5-4.4 13.4l7.3 42.8-38.4-20.2c-4.4-2.3-9.7-2.3-14.1 0l-38.4 20.2 7.3-42.8c0.8-4.9-0.8-9.9-4.4-13.4l-31.1-30.3 43.1-6.2z" fill="#211F1E"/></svg>
                </div>
                <div class="flex flex-col justify-center">
                    <h2 class="text-2xl font-medium">{news_article_show[0]['title'].slice(0, 100).replace(/\s$/, '')}{news_article_show[0]['title'].length > 100 ? "..." : ""}</h2>
                </div>
            </div>
            <div class="overflow-hidden w-full h-52">
                <img src="{news_article_show[0]['image']}" class="object-cover w-full h-full rounded-t-sm card-images"/>
            </div>
            <div class="mt-0.5 font-light">
                <p>{news_article_show[0]['description'].slice(0, 150).replace(/\s$/, '')}{news_article_show[0]['description'].length > 150 ? "..." : ""}</p>
            </div>
        </div>
    </div>

    <div class="flex flex-col gap-4 mb-4">

        <div class="flex w-full gap-4">
            <div class="flex gap-6">
                <div class="flex flex-col justify-center">
                    <p class="font-bold text-xl">#2</p>
                </div>
                <div class="flex flex-col justify-center">
                    <NewsChartCustom size={120} thickness={10} font_size={16} font_weight={600} value={parameters['factor'] != 'polarity' && parameters['factor'] != 'subjectivity' ? Math.round(news_article_show[1]['emotions'][parameters['factor']] * 1000) / 10 : Math.round($globalStore.stretchFunction(news_article_show[1]['sentiment'][parameters['factor']]) * 1000) / 10}/>
                </div>
            </div>
            <div class="overflow-hidden h-32 w-48 shrink-0 flex flex-col justify-center">
                <img src="{news_article_show[1]['image']}" class="object-cover w-full h-full rounded-t-sm card-images"/>
            </div>
            <div class="flex flex-col justify-center gap-1">
                <h3 class="font-bold text-lg">{news_article_show[1]['title'].slice(0, 100).replace(/\s$/, '')}{news_article_show[1]['title'].length > 100 ? "..." : ""}</h3>
                <p class="text-sm font-light">{news_article_show[1]['description'].slice(0, 200).replace(/\s$/, '')}{news_article_show[1]['description'].length > 200 ? "..." : ""}</p>
            </div>
        </div>

        <div class="flex w-full gap-4">
            <div class="flex gap-6">
                <div class="flex flex-col justify-center">
                    <p class="font-bold text-xl">#3</p>
                </div>
                <div class="flex flex-col justify-center">
                    <NewsChartCustom size={120} thickness={10} font_size={16} font_weight={600} value={parameters['factor'] != 'polarity' && parameters['factor'] != 'subjectivity' ? Math.round(news_article_show[2]['emotions'][parameters['factor']] * 1000) / 10 : Math.round($globalStore.stretchFunction(news_article_show[2]['sentiment'][parameters['factor']]) * 1000) / 10}/>
                </div>
            </div>
            <div class="overflow-hidden h-32 w-48 shrink-0 flex flex-col justify-center">
                <img src="{news_article_show[2]['image']}" class="object-cover w-full h-full rounded-t-sm card-images"/>
            </div>
            <div class="flex flex-col justify-center gap-1">
                <h3 class="font-bold text-lg">{news_article_show[2]['title'].slice(0, 100).replace(/\s$/, '')}{news_article_show[2]['title'].length > 100 ? "..." : ""}</h3>
                <p class="text-sm font-light">{news_article_show[2]['description'].slice(0, 200).replace(/\s$/, '')}{news_article_show[2]['description'].length > 200 ? "..." : ""}</p>
            </div>
        </div>

    </div>
</main>
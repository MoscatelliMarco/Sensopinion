<script>
    import { globalStore } from "../../../stores";
    import { isEquivalent } from "../../../public/dictEquivalent"
    import { onMount, onDestroy } from "svelte";
    import NewsDisplay from "$lib/sections/screener/+page/news_display.svelte"
    import GridRadialProgress from "$lib/items/grid_radial_progress.svelte"
    import { page } from '$app/stores';
    import { pushState } from "$app/navigation";
    import { writable } from 'svelte/store';
    import { browser } from "$app/environment";

    let news_articles = $globalStore.news;
    let metrics = $globalStore.metrics;
    let categories = $globalStore.categories;

    // Store for the dictionary parameters.
    const dict_params = writable({});

    // FILTERS
    let subtopic_checkboxes;
    function checkSubTopic() {
        let active_sub_filter = []
        for (let checkbox of subtopic_checkboxes) {
            if (checkbox.checked) {
                active_sub_filter.push(checkbox.dataset['filter'])
            }
        }
        dict_params.update(($dict) => {
            if (active_sub_filter.length) {
                $dict['subcategories'] = active_sub_filter;
            } else {
                delete $dict['subcategories']
            }
            return $dict;
        })
    }
    onMount(() => {
        subtopic_checkboxes = document.querySelectorAll(".subtopic_checkbox");
        for (let checkbox of subtopic_checkboxes){
            checkbox.addEventListener('change', checkSubTopic)
        }
    })
    onDestroy(() => {
        for (let checkbox of subtopic_checkboxes){
            checkbox.removeEventListener('change', checkSubTopic)
        }
    })


    // SORT
    $: if (ascending || !ascending) {
        dict_params.update($dict => {
            if (ascending) {
                $dict['ascending'] = 'true';   
            } else {
                delete $dict['ascending']
            }
            return $dict
        })
    }

    let sort_select;
    onMount(() => {
        // Add an event listener for the 'change' event
        sort_select.addEventListener('change', (event) => {
            // Get the value of the selected option
            const selectedValue = event.target.value;
            
            dict_params.update($dict => {
                if (selectedValue == 'date') {
                    delete $dict['sortby']
                } else {
                    $dict['sortby'] = selectedValue;
                }
                return $dict
            })
        });
    })

    // Logic component select option input
    let options;
    onMount(() => {
        options = document.querySelectorAll(".sortby-options")
    })
    $: if ($dict_params) {
        if (options) {
            for (let option of options) {
                if ($dict_params['sortby'] == option.value) {
                    option.selected = true;
                } else {
                    option.selected = false;
                }
            }
        }
    }

    // This function updates the URL parameters to reflect the current store state.
    function updateURLParams(params) {
        const search_params = new URLSearchParams(params)
        // Get the current URL
        const currentUrl = window.location.href;
        // Create a URL object using the current URL
        const urlObject = new URL(currentUrl);
        // Extract the base URL
        const baseURL = urlObject.origin + urlObject.pathname;

        if (currentUrl != baseURL + (search_params.toString() ? ("?" + search_params.toString()) : "")) {
            if (search_params.toString()) {
                pushState(baseURL + "?" + search_params.toString(), {});
            } else {
                pushState(baseURL, {});
            }
        }
    }

    // Reactively update URL when dict_params changes.
    let ascending = false;
    $: if ($dict_params) {
        ascending = 'ascending' in $dict_params ? true : false;
        // Check if the component is mounted so the URL params are not resetted at the start
        if (is_mounted) {
            updateURLParams($dict_params);
        }
    }

    // This function initializes the store from URL parameters.
    function initParamsFromURL() {
        const params = new URLSearchParams(window.location.search);
        const initialParams = {};
        params.forEach((value, key) => {
            initialParams[key] = value;
        });
        dict_params.set(initialParams);
    }

    // On component mount, initialize the store from URL parameters.
    let is_mounted = false;
    onMount(() => {
        is_mounted = true;
        if (browser) {
            initParamsFromURL();
        }
    });

    // Logic changes news_articles_based on filters
    let news_articles_show = [];
    let before_dict_params = { ...$dict_params };
    $: if ($dict_params) {
        // Run only if the html is mounted, if news_articles exist and the previous dict_params is different from the new one
        if (news_articles && (!isEquivalent(before_dict_params, $dict_params) || !is_mounted)) {
            news_articles_show = news_articles.filter((item) => {
                if (!$dict_params['subcategories']) {
                    if (Object.keys(item['categories']).includes($page.params.category.charAt(0).toUpperCase() + $page.params.category.slice(1))) {
                        return true;
                    }
                }
                if ($dict_params['subcategories']) {
                    if (item['categories'][$page.params.category.charAt(0).toUpperCase() + $page.params.category.slice(1)]) {
                        for (let news_subcategory of item['categories'][$page.params.category.charAt(0).toUpperCase() + $page.params.category.slice(1)]) {
                            if ($dict_params['subcategories'].includes(news_subcategory.replaceAll(" ", "_").toLowerCase())) {
                                return true;
                            }
                        }
                    }
                }
                return false;
            })

            news_articles_show.sort((a, b) => {

                let factor1;
                let factor2;

                if ($dict_params['sortby'] == 'positivity') {
                    factor1 = a['sentiment']['polarity'];
                    factor2 = b['sentiment']['polarity'];
                } else if ($dict_params['sortby'] == 'subjectivity') {
                    factor1 = a['sentiment']['subjectivity'];
                    factor2 = b['sentiment']['subjectivity'];
                } 
                
                else if ($dict_params['sortby'] == 'happiness') {
                    factor1 = a['emotions']['happiness'];
                    factor2 = b['emotions']['happiness'];
                } else if ($dict_params['sortby'] == 'surprise') {
                    factor1 = a['emotions']['surprise'];
                    factor2 = b['emotions']['surprise'];
                } else if ($dict_params['sortby'] == 'fear') {
                    factor1 = a['emotions']['fear'];
                    factor2 = b['emotions']['fear'];
                } else if ($dict_params['sortby'] == 'disgust') {
                    factor1 = a['emotions']['disgust'];
                    factor2 = b['emotions']['disgust'];
                } else if ($dict_params['sortby'] == 'anger') {
                    factor1 = a['emotions']['anger'];
                    factor2 = b['emotions']['anger'];
                } else if ($dict_params['sortby'] == 'neutral') {
                    factor1 = a['emotions']['neutral'];
                    factor2 = b['emotions']['neutral'];
                } else if ($dict_params['sortby'] == 'sadness') {
                    factor1 = a['emotions']['sadness'];
                    factor2 = b['emotions']['sadness'];
                }

                else {
                    factor1 = new Date(a['date_published']);
                    factor2 = new Date(b['date_published']);
                }

                // Compare the dates to determine their order
                if (!$dict_params['ascending']) {
                    return factor2 - factor1; // Use dateA - dateB for ascending order.
                }
                return factor1 - factor2;
            });
            window.scrollTo({top: 0, behavior: 'smooth'});
            before_dict_params = { ...$dict_params }
        }
    }

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
        if (news_articles !== undefined && news_articles.length) {
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
        globalStore.update((value) => {
            value['metrics'] = metrics;
            return value;
        })
    }
    
    $: if ($page.params.category) {
        news_articles_show = news_articles.filter((item) => {
            if (!$dict_params['subcategories']) {
                if (Object.keys(item['categories']).includes($page.params.category.charAt(0).toUpperCase() + $page.params.category.slice(1))) {
                    return true;
                }
            }
            if ($dict_params['subcategories']) {
                if (item['categories'][$page.params.category.charAt(0).toUpperCase() + $page.params.category.slice(1)]) {
                    for (let news_subcategory of item['categories'][$page.params.category.charAt(0).toUpperCase() + $page.params.category.slice(1)]) {
                        if ($dict_params['subcategories'].includes(news_subcategory.replaceAll(" ", "_").toLowerCase())) {
                            return true;
                        }
                    }
                }
            }
            return false;
        })
    }
</script>

<svelte:head>
    <title>Analyzing {$page.params.category}</title>
    <meta name='description' content="Analyzing the news about {$page.params.category}">
</svelte:head>

<div class="flex flex-col gap-8">
    <div class="flex flex-col gap-4 mt-8">
        <div class="flex justify-between">
            <div class="flex flex-col md:flex-row gap-1 md:gap-4 mb-1 md:mb-0">
                <h1 class="text-3xl text-primary-gradient font-semibold">{($page.params.category).charAt(0).toUpperCase() + ($page.params.category).slice(1)}</h1>
                <div class="w-36 lg:w-40 flex flex-col justify-center">
                    <GridRadialProgress metrics={metrics} name={$page.params.category} dimension='side'/>
                </div>
            </div>
            <div class="flex gap-6 items-center">
                <select bind:this={sort_select} class="w-32 text-sm rounded-none p-0 bg-white">
                    <option class="sortby-options" value="date">Date</option>
    
                    <option class="sortby-options" value="positivity">Positivity</option>
                    <option class="sortby-options" value="subjectivity">Subjectivity</option>
    
                    <option class="sortby-options" value="happiness">Happiness</option>
                    <option class="sortby-options" value="sadness">Sadness</option>
                    <option class="sortby-options" value="surprise">Surprise</option>
                    <option class="sortby-options" value="fear">Fear</option>
                    <option class="sortby-options" value="neutral">Neutral</option>
                    <option class="sortby-options" value="anger">Anger</option>
                    <option class="sortby-options" value="disgust">Disgust</option>
                </select>
                <button on:click={() => {ascending = !ascending;}}>
                    {#if !ascending}
                        <svg xmlns="http://www.w3.org/2000/svg" class="w-6 stroke-black" viewBox="0 0 24 24" fill="none">
                            <path d="M13 12H21M13 8H21M13 16H21M6 7V17M6 17L3 14M6 17L9 14" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                        </svg>
                    {:else}
                        <svg xmlns="http://www.w3.org/2000/svg" class="w-6 stroke-black" viewBox="0 0 24 24" fill="none">
                            <path d="M13 12H21M13 8H21M13 16H21M6 7V17M6 7L3 10M6 7L9 10" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                        </svg>
                    {/if}
                </button>
            </div>
        </div>
        <div class="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-x-8 gap-y-2">
            {#each categories[$page.params.category] as subcategory, index}
                {#if index == 8}
                    <div class="hidden md:block lg:hidden"></div>
                {/if}
                <div class="flex gap-1">
                    <input type="checkbox" id="{subcategory}_checkbox" class="subtopic_checkbox w-5" checked={
                        $dict_params['subcategories'] && ($dict_params['subcategories'] === true || $dict_params['subcategories'].includes(subcategory.toLowerCase().replaceAll(" ", "_"))) ? "checked" : ""
                    } data-filter={subcategory.toLowerCase().replaceAll(" ", "_")}/>
                    <label for="{subcategory}_checkbox" class="text-xs">{subcategory}</label>
                </div>
            {/each}
        </div>
    </div>
    
    <NewsDisplay news_articles={news_articles_show} />
</div>

<div style="transform: translateX(-50%);" class="fixed bottom-2 md:bottom-4 lg:bottom-6 left-1/2 flex justify-end max-w-lg md:max-w-3xl lg:max-w-5xl xl:max-w-6xl px-2 md:px-4 lg:px-6 w-full pointer-events-none">
    <button class="bg-white rounded-full pointer-events-auto" on:click={() => {window.scrollTo({top: 0, behavior: 'smooth'});}}>
        <div class="bg-primary-gradient-opacity bg-primary-gradient-opacity-inter rounded-full p-3">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" class="fill-white h-6">
                <path fill-rule="evenodd" d="M8,5.58578 L11.7071,9.29289 C12.0976,9.68342 12.0976,10.3166 11.7071,10.7071 C11.3466385,11.0675615 10.7793793,11.0952893 10.3871027,10.7902834 L10.2929,10.7071 L9,9.41421 L9,15 C9,15.5523 8.55229,16 8,16 C7.48716857,16 7.06449347,15.613973 7.0067278,15.1166239 L7,15 L7,9.41421 L5.70711,10.7071 C5.31658,11.0976 4.68342,11.0976 4.29289,10.7071 C3.93241,10.3466385 3.90468077,9.77939633 4.20970231,9.3870988 L4.29289,9.29289 L8,5.58578 Z M8,0 C9.10457,0 10,0.895431 10,2 C10,3.10457 9.10457,4 8,4 C6.89543,4 6,3.10457 6,2 C6,0.895431 6.89543,0 8,0 Z"/>
            </svg>
        </div>
    </button>
</div>
<script>
    import NewsChart from "$lib/items/news_chart.svelte"
    import SubCategories from "$lib/sections/+page/subcategories.svelte"
    import TryScreener from "$lib/sections/+page/try_screener.svelte"
    import NewsDisplay from "$lib/sections/+page/news_display.svelte"
    import FactorDropdownButton  from "$lib/items/factor_dropdown_button.svelte";
    import { onMount, onDestroy } from 'svelte';
    import { fade } from "svelte/transition";

    let category_type = null;
    function show_more (event) {
        if (category_type != event.target.dataset['category_type']) {
            category_type = event.target.dataset['category_type']
        } else {
            category_type = null
        }
    }

    // Handle dropdown
    let dropdown; // This will hold the reference to your dropdown
    let dropdown_main_active = false;

    // Function to handle click outside the dropdown
    function handleClickDropdown(event) {
        if (dropdown && dropdown_main_active) {
            dropdown_main_active = false;
        }
    }

    // Function to toggle the dropdown and stop click propagation
    function toggleDropdown(event) {
        dropdown_main_active = !dropdown_main_active;
        if (dropdown_small_active) {
            dropdown_small_active = false;
        }
        event.stopPropagation(); // Prevent click from immediately propagating to window
    }

    let dropdown_small; // This will hold the reference to your dropdown
    let dropdown_small_active = false;

    // Function to handle click outside the dropdown
    function handleClickSmallDropdown(event) {
        if (dropdown_small && dropdown_small_active) {
            dropdown_small_active = false;
        }
    }

    // Function to toggle the dropdown and stop click propagation
    function toggleSmallDropdown(event) {
        dropdown_small_active = !dropdown_small_active;
        if (dropdown_main_active) {
            dropdown_main_active = false;
        }
        event.stopPropagation(); // Prevent click from immediately propagating to window
    }

    // Listen for clicks on the entire window
    onMount(() => {
        window.addEventListener('click', handleClickDropdown);
        window.addEventListener('click', handleClickSmallDropdown);
    });

    // Cleanup the event listener when the component is destroyed
    onDestroy(() => {
        window.removeEventListener('click', handleClickDropdown);
        window.removeEventListener('click', handleClickSmallDropdown);
    });

    // News and Factor logic
    let factor = 'positivity';
    function handleClickFactor(event) {
        const factor_value = event.target.dataset['factorValue'];
        factor = factor_value
    }

    export let data;
    const news_articles = data['props']['data']
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
    if (news_articles.length) {
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
            metrics[metric]['positivity'] = Math.round(metrics[metric]['positivity']['numerator'] / metrics[metric]['positivity']['denominator'] * 1000) / 10
            metrics[metric]['subjectivity'] = Math.round(metrics[metric]['subjectivity']['numerator'] / metrics[metric]['subjectivity']['denominator'] * 1000) / 10
        }
    }

    let cake_chart_colors = [
        "rgb(108, 62, 219)",
        "rgb(93, 65, 219)",
        "rgb(83, 77, 219)",
        "rgb(72, 90, 219)", 
        "rgb(59, 105, 219)", 
        "rgb(46, 120, 219)", 
        "rgb(33, 135, 219)", 
        "rgb(33, 135, 219)"
    ]

    let emotion_analyze;
    function handleClickEmotionAnalyze(event) {
        const emotion_analyze_value = event.target.dataset['emotion'];
        if (emotion_analyze == emotion_analyze_value) {
            emotion_analyze = undefined;
        } else {
            emotion_analyze = emotion_analyze_value
        }
    }
</script>

{#if !news_articles.length}
    <div role="alert" class="alert alert-error shadow-md">
        <svg xmlns="http://www.w3.org/2000/svg" class="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
        <span class="mt-0.5">We couldn't fetch the news for an internal server error😔, try again later.</span>
    </div>
{:else}
    <div class="flex flex-col gap-32 md:gap-36 lg:gap-48 xl:gap-56">

        <section class="flex flex-col items-center md:flex-row md:justify-between gap-8 lg:gap-16 xl:gap-24 mt-8 md:mt-12 lg:mt-14 xl:mt-16">
            <div class="flex flex-col justify-center gap-4 md:gap-6 lg:gap-8 xl:gap-10 items-center text-center md:text-left">
                <div class="flex flex-col gap-2 md:gap-4 lg:gap-5 xl:gap-6">
                    <h1 style="line-height: 1.1;" class="font-bold text-3xl md:text-4xl lg:text-5xl xl:text-6xl max-w-sm lg:max-w-lg xl:max-w-2xl">
                        Analyze <span class="text-primary-gradient">Sentiment</span> and <span class="text-primary-gradient">Emotions</span> At The Speed Of Light
                    </h1>
                    <h3 class="max-w-sm xl:max-w-lg text-xxs md:text-xs lg:text-sm xl:text-base">
                        We hate reading boring articles just to understand what's happening around us, that's why we created WPTAT
                    </h3>
                </div>
                <div class="hidden md:flex md:justify-start w-full gap-2 lg:gap-5 xl:gap-6">
                    <button 
                    class="w-1/2 md:w-40 lg:w-48 xl:w-52 h-10 lg:h-11 xl:h-12 min-h-0 text-xs uppercase lg:text-sm rounded-md bg-primary-gradient font-semibold text-white hover:brightness-105 focus:hover:brightness-105 btn shadow-md hover:shadow-lg">
                        Try our screener
                    </button>
                    <div class="relative w-1/2 md:w-full">
                        <button on:click={toggleDropdown} class="w-full md:w-40 lg:w-48 xl:w-52 h-10 lg:h-11 xl:h-12 min-h-0 shadow-md hover:shadow-lg text-xs lg:text-sm rounded-md bordeTr border-neutral text-neutral hover:border-neutral-dark hover:text-neutral-dark btn font-light">
                            Explore <span class="hidden md:inline-block">New </span>Analysis
                        </button>
                        <ul bind:this={dropdown} class:hidden={!dropdown_main_active} class:absolute={dropdown_main_active} 
                        class="w-38 md:w-40 lg:w-48 xl:w-52 bg-white rounded-md mt-1 md:mt-1.5 lg:mt-2 shadow-md px-1.5 py-1 md:px-3 md:py-2.5 flex flex-col gap-0.5 z-20">
                            <FactorDropdownButton clickFunction={handleClickFactor} content="👎👍 Positivity 👍👎" factorValue="positivity" currentFactor={factor} />
                            <FactorDropdownButton clickFunction={handleClickFactor} content="🤜✊ Subjectivity ✊🤛" factorValue="subjectivity" currentFactor={factor} />
                            <FactorDropdownButton clickFunction={handleClickFactor} content="🤬😃 Emotions 😃🤬" factorValue="emotions" currentFactor={factor} />
                        </ul>
                    </div>
                </div>
            </div>
            <div class="flex flex-col justify-center gap-2 md:gap-4 mt-0 md:mt-6">
                <div class="flex justify-center">
                    <NewsChart name="all" value={metrics['all'][factor]} dimension='big' emotion_analyze={emotion_analyze} cake_chart_colors={cake_chart_colors}/>
                </div>
                <div class="relative">
                    {#if (factor !== 'emotions')}
                        <h5 transition:fade={{duration: 300}} class="text-center font-light text-sm xl:text-base h-12 lg:h-13 absolute top-0 left-0 right-0">{factor.charAt(0).toUpperCase() + factor.slice(1)} on news</h5>
                    {:else}
                        <div class="absolute top-0 left-0 right-0">
                            <div transition:fade={{duration: 300}} class="flex flex-col h-12 lg:h-13 justify-between">
                                <div class="flex justify-center gap-1 lg:gap-2.5 xl:gap-3">
                                    {#each ['🤬', '🤢', '😨', '😐', '😭', '😲', '😀'] as emotion_item, index}
                                        <button on:click={handleClickEmotionAnalyze} data-emotion={emotion_item} style="background-color: {cake_chart_colors[index]};" 
                                        class="py-1 px-2.5 md:py-1 md:px-1.5 lg:px-2 lg:py-1.5 xl:py-1 text-sm md:text-xs lg:text-sm rounded-md flex flex-col justify-center border border-white"
                                        class:shadow-md={emotion_item != emotion_analyze}
                                        class:hover:shadow-lg={emotion_item != emotion_analyze}
                                        class:emotion_selected={emotion_item == emotion_analyze}
                                        >
                                            {emotion_item}
                                        </button>
                                    {/each}
                                </div>
                                <p class="text-center font-light text-xs lg:text-sm">(try to click on an emoji)</p>
                            </div>
                        </div>
                    {/if}
                </div>
                <div class="flex md:hidden md:justify-start w-full gap-2 lg:gap-5 xl:gap-6 mt-14">
                    <button 
                    class="w-1/2 md:w-40 lg:w-48 xl:w-52 h-10 lg:h-11 xl:h-12 min-h-0 text-xs uppercase lg:text-sm rounded-md bg-primary-gradient font-semibold text-white hover:brightness-105 focus:hover:brightness-105 btn shadow-md hover:shadow-lg">
                        Try our screener
                    </button>
                    <div class="relative w-1/2 md:w-full">
                        <button on:click={toggleDropdown} class="w-full md:w-40 lg:w-48 xl:w-52 h-10 lg:h-11 xl:h-12 min-h-0 shadow-md hover:shadow-lg text-xs lg:text-sm rounded-md bordeTr border-neutral text-neutral hover:border-neutral-dark hover:text-neutral-dark btn font-light">
                            Explore <span class="hidden md:inline-block">New </span>Analysis
                        </button>
                        <ul bind:this={dropdown} class:hidden={!dropdown_main_active} class:absolute={dropdown_main_active} 
                        class="w-38 md:w-40 lg:w-48 xl:w-52 bg-white rounded-md mt-1 md:mt-1.5 lg:mt-2 shadow-md px-1.5 py-1 md:px-3 md:py-2.5 flex flex-col gap-0.5 z-20">
                            <FactorDropdownButton clickFunction={handleClickFactor} content="👎👍 Positivity 👍👎" factorValue="positivity" currentFactor={factor} />
                            <FactorDropdownButton clickFunction={handleClickFactor} content="🤜✊ Subjectivity ✊🤛" factorValue="subjectivity" currentFactor={factor} />
                            <FactorDropdownButton clickFunction={handleClickFactor} content="🤬😃 Emotions 😃🤬" factorValue="emotions" currentFactor={factor} />
                        </ul>
                    </div>
                </div>
            </div>
        </section>
        
        <section class="flex flex-col">
            <div class="text-center flex flex-col gap-6 md:gap-4 lg:gap-7 xl:gap-8">
                <h2 class="font-medium text-2xl md:text-3xl lg:text-4xl">What People Think About</h2>
                <div class="flex flex-col gap-16 md:gap-0 items-center md:flex-row md:justify-between xl:mx-16">
                    <div class="flex flex-col justify-center gap-4 md:gap-5 lg:gap-6 w-full items-center">
                        <a href="#" class="flex flex-col gap-1.5 md:gap-2">
                            <h4 class="font-medium text-center text-base md:text-lg xl:text-xl">Politics</h4>
                            <NewsChart name="politics" dimension='medium' value={metrics['politics'][factor]} emotion_analyze={emotion_analyze} cake_chart_colors={cake_chart_colors}/>
                        </a>
                        <div class="flex justify-center">
                            <button on:click={show_more} data-category_type="politics" 
                            class="btn w-28 md:w-32 text-xs min-h-0 h-7 md:h-8 xl:h-9 items-center rounded-md shadow-md hover:shadow-lg"
                            class:bg-primary-gradient = {category_type == 'politics'}
                            class:shadow-lg = {category_type == 'politics'}
                            class:text-white = {category_type == 'politics'}>{#if category_type == 'politics'}Show less{:else}Show more{/if}</button>
                        </div>
                        {#if category_type == 'politics'}
                            <div class="block md:hidden">
                                <SubCategories category_type={category_type} emotion_analyze={emotion_analyze} cake_chart_colors={cake_chart_colors} metrics={metrics} factor={factor} />
                            </div>
                        {/if}
                    </div>
                    <div class="flex flex-col justify-center gap-4 md:gap-5 lg:gap-6 w-full items-center">
                        <a href="#" class="flex flex-col gap-1.5 md:gap-2">
                            <h4 class="font-medium text-center text-base md:text-lg xl:text-xl">Economy</h4>
                            <NewsChart name="economy" dimension='medium' value={metrics['economy'][factor]} emotion_analyze={emotion_analyze} cake_chart_colors={cake_chart_colors}/>
                        </a>
                        <div class="flex justify-center">
                            <button on:click={show_more} data-category_type="economy" 
                            class="btn w-28 md:w-32 text-xs min-h-0 h-7 md:h-8 xl:h-9 items-center rounded-md shadow-md hover:shadow-lg"
                            class:bg-primary-gradient = {category_type == 'economy'}
                            class:shadow-lg = {category_type == 'economy'}
                            class:text-white = {category_type == 'economy'}>{#if category_type == 'economy'}Show less{:else}Show more{/if}</button>
                        </div>
                        {#if category_type == 'economy'}
                            <div class="block md:hidden">
                                <SubCategories category_type={category_type} emotion_analyze={emotion_analyze} cake_chart_colors={cake_chart_colors} metrics={metrics} factor={factor} />
                            </div>
                        {/if}
                    </div>
                    <div class="flex flex-col justify-center gap-4 md:gap-5 lg:gap-6 w-full items-center">
                        <a href="#" class="flex flex-col gap-1.5 md:gap-2">
                            <h4 class="font-medium text-center text-base md:text-lg xl:text-xl">Environment</h4>
                            <NewsChart name="environment" dimension='medium' value={metrics['environment'][factor]} emotion_analyze={emotion_analyze} cake_chart_colors={cake_chart_colors}/>
                        </a>
                        <div class="flex justify-center">
                            <div class="flex justify-center">
                                <button on:click={show_more} data-category_type="environment" 
                                class="btn w-28 md:w-32 text-xs min-h-0 h-7 md:h-8 xl:h-9 items-center rounded-md shadow-md hover:shadow-lg"
                                class:bg-primary-gradient = {category_type == 'environment'}
                                class:shadow-lg = {category_type == 'environment'}
                                class:text-white = {category_type == 'environment'}>{#if category_type == 'environment'}Show less{:else}Show more{/if}</button>
                            </div>
                        </div>
                        {#if category_type == 'environment'}
                            <div class="block md:hidden">
                                <SubCategories category_type={category_type} emotion_analyze={emotion_analyze} cake_chart_colors={cake_chart_colors} metrics={metrics} factor={factor} />
                            </div>
                        {/if}
                    </div>
                </div>
            </div>
            {#if category_type}
                <div class="hidden md:block">
                    <SubCategories category_type={category_type} emotion_analyze={emotion_analyze} cake_chart_colors={cake_chart_colors} metrics={metrics} factor={factor} />
                </div>
            {/if}
            <div class="flex flex-col gap-2 lg:gap-4 mt-9 lg:mt-12 xl:mt-14">
                <div class="flex justify-center">
                    <div class="relative">
                        <button on:click={toggleSmallDropdown} class="w-40 lg:w-48 xl:w-52 text-xs lg:text-sm h-8 xl:h-9 min-h-0 shadow-md hover:shadow-lg rounded-md border border-neutral text-neutral hover:border-neutral-dark hover:text-neutral-dark btn font-light">
                            Change Analysis
                        </button>
                        <ul bind:this={dropdown_small} class:hidden={!dropdown_small_active} class:absolute={dropdown_small_active} 
                        class="w-40 lg:w-48 xl:w-52 bg-white rounded-md mt-2 shadow-md px-3 py-2.5 flex flex-col gap-0.5 z-20">
                            <FactorDropdownButton clickFunction={handleClickFactor} content="👎👍 Positivity 👍👎" factorValue="positivity" currentFactor={factor} />
                            <FactorDropdownButton clickFunction={handleClickFactor} content="🤜✊ Subjectivity ✊🤛" factorValue="subjectivity" currentFactor={factor} />
                            <FactorDropdownButton clickFunction={handleClickFactor} content="🤬😃 Emotions 😃🤬" factorValue="emotions" currentFactor={factor} />
                        </ul>
                    </div>
                </div>
                <div class="relative h-12 lg:h-14">
                    {#if (factor !== 'emotions')}
                        <div class="text-center font-light absolute top-0 left-0 right-0">
                            <div class="flex justify-center">
                                <h5 transition:fade={{duration: 300}} class="w-40 lg:w-48 xl:w-52 py-1.5 lg:py-2 rounded-md bg-neutral-light flex flex-col justify-between h-12 lg:h-14 items-center shadow-md">
                                    <span class="text-xs lg:text-sm">
                                        Analyzing: 
                                    </span>
                                    <span class="text-sm lg:text-base font-bold">
                                        { factor == 'positivity' ? "👎👍 Positivity 👍👎" : factor == 'subjectivity' ? "🤜✊ Subjectivity ✊🤛" : "🤬😃 Emotions 😃🤬"}
                                    </span>
                                </h5>
                            </div>
                        </div>
                    {:else}
                        <div class="absolute top-0 left-0 right-0">
                            <div transition:fade={{duration: 300}} class="flex flex-col h-12 lg:h-14 justify-between">
                                <div class="flex justify-center gap-1.5 lg:gap-3">
                                    {#each ['🤬', '🤢', '😨', '😐', '😭', '😲', '😀'] as emotion_item, index}
                                        <button on:click={handleClickEmotionAnalyze} data-emotion={emotion_item} style="background-color: {cake_chart_colors[index]};" 
                                        class="px-2 py-1 lg:px-2.5 lg:py-1.5 text-xs lg:text-sm rounded-md flex flex-col justify-center border border-white"
                                        class:shadow-md={emotion_item != emotion_analyze}
                                        class:hover:shadow-lg={emotion_item != emotion_analyze}
                                        class:emotion_selected={emotion_item == emotion_analyze}
                                        >
                                            {emotion_item}
                                        </button>
                                    {/each}
                                </div>
                            </div>
                        </div>
                    {/if}
                </div>
            </div>
        </section>

        <TryScreener/>

        <NewsDisplay news_articles={news_articles} />

    </div>

    <style>
        .emotion_selected {
            filter: brightness(1.3);
            box-shadow: 0 25px 50px -12px rgb(0 0 0 / 0.25);
        }
    </style>
{/if}
<script>
    import NewsChart from "$lib/test/news_chart.svelte"
    import SubCategories from "$lib/sections/+page/subcategories_index.svelte"
    import TryScreener from "$lib/sections/+page/try_screener.svelte"
    import NewsDisplay from "$lib/sections/+page/news_display.svelte"
    import FactorDropdownButton  from "$lib/items/factor_dropdown_button.svelte";

    let category_type = null;
    function show_more (event) {
        if (category_type != event.target.dataset['category_type']) {
            category_type = event.target.dataset['category_type']
        } else {
            category_type = null
        }
    }

    // Handle dropdown
    import { onMount, onDestroy } from 'svelte';
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
        event.stopPropagation(); // Prevent click from immediately propagating to window
    }

    // Listen for clicks on the entire window
    onMount(() => {
        window.addEventListener('click', handleClickDropdown);
    });

    // Cleanup the event listener when the component is destroyed
    onDestroy(() => {
        window.removeEventListener('click', handleClickDropdown);
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
    for (let emotion of ['anger', 'disgust', 'fear', 'neutral', 'sadness', 'surprise', 'happiness']) {
        for (let news of news_articles) {
            if (emotion in metrics['all']['emotions']) {
                metrics['all']['emotions'][emotion]['numerator'] += news['emotions'][emotion]
                metrics['all']['emotions'][emotion]['denominator'] += 1
            }
            else{
                metrics['all']['emotions'][emotion] = {
                    'numerator': news['emotions'][emotion],
                    'denominator': 1
                }
            }
        }
        metrics['all']['emotions'][emotion] = Math.round(metrics['all']['emotions'][emotion]['numerator'] / metrics['all']['emotions'][emotion]['denominator'] * 1000) / 10
    }
    for (let news of news_articles) {
        metrics['all']['positivity']['numerator'] += news['sentiment']['polarity']
        metrics['all']['positivity']['denominator'] += 1
        metrics['all']['subjectivity']['numerator'] += news['sentiment']['subjectivity']
        metrics['all']['subjectivity']['denominator'] += 1
    }
    metrics['all']['positivity'] = Math.round(metrics['all']['positivity']['numerator'] / metrics['all']['positivity']['denominator'] * 1000) / 10
    metrics['all']['subjectivity'] = Math.round(metrics['all']['subjectivity']['numerator'] / metrics['all']['subjectivity']['denominator'] * 1000) / 10

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

<div class="flex flex-col gap-48 xl:gap-56">

    <section class="flex justify-between gap-16 xl:gap-24 mt-16">
        <div class="flex flex-col justify-center gap-8 xl:gap-10">
            <div class="flex flex-col gap-5 xl:gap-6">
                <h1 style="line-height: 1.1;" class="font-bold text-5xl xl:text-6xl max-w-2xl">
                    Analyze <span class="text-primary-gradient">Sentiment</span> and <span class="text-primary-gradient">Emotions</span> At The Speed Of Light
                </h1>
                <h3 class="max-w-sm xl:max-w-lg text-sm xl:text-base">
                    We hate reading boring articles just to understand what's happening around us, that's why we created WPTAT
                </h3>
            </div>
            <div class="flex gap-8">
                <button class="w-44 xl:w-48 py-2.5 h-11 xl:h-12 min-h-0 text-sm rounded-md bg-primary-gradient font-semibold text-white hover:brightness-105 focus:hover:brightness-105 btn shadow-md hover:shadow-lg">TRY OUR SCREENER</button>
                <div class="relative">
                    <button on:click={toggleDropdown} class="w-44 xl:w-48 h-11 xl:h-12 min-h-0 shadow-md hover:shadow-lg text-sm rounded-md border-2 border-neutral text-neutral hover:border-neutral-dark hover:text-neutral-dark btn font-light text-md">Try a different emotion</button>
                    <ul bind:this={dropdown} class:hidden={!dropdown_main_active} class:absolute={dropdown_main_active} 
                    class="w-44 xl:w-48 bg-white rounded-md mt-2 shadow-md px-4 py-2 flex flex-col gap-0.5 z-50">
                        <FactorDropdownButton clickFunction={handleClickFactor} content="👎👍 Positivity 👍👎" factorValue="positivity" currentFactor={factor} />
                        <FactorDropdownButton clickFunction={handleClickFactor} content="🤜✊ Subjectivity ✊🤛" factorValue="subjectivity" currentFactor={factor} />
                        <FactorDropdownButton clickFunction={handleClickFactor} content="🤬😃 Emotions 😃🤬" factorValue="emotions" currentFactor={factor} />
                    </ul>
                </div>
            </div>
        </div>
        <div class="flex flex-col justify-center gap-4 mt-6">
            <NewsChart name="all" value={metrics['all'][factor]} dimension='big' emotion_analyze={emotion_analyze} cake_chart_colors={cake_chart_colors}/>
            {#if (factor !== 'emotions')}
                <h5 class="text-center font-light text-sm xl:text-base h-16">*{factor.charAt(0).toUpperCase() + factor.slice(1)} on news</h5>
            {:else}
                <div class="flex flex-col h-16 justify-between">
                    <div class="flex justify-center gap-4">
                        {#each ['🤬', '🤢', '😨', '😐', '😭', '😲', '😀'] as emotion_item, index}
                            <button on:click={handleClickEmotionAnalyze} data-emotion={emotion_item} style="background-color: {cake_chart_colors[index]};" 
                            class="p-1.5 text-sm rounded-md flex flex-col justify-center border"
                            class:shadow-md={emotion_item != emotion_analyze}
                            class:hover:shadow-lg={emotion_item != emotion_analyze}
                            class:emotion_selected={emotion_item == emotion_analyze}
                            >
                                {emotion_item}
                            </button>
                        {/each}
                    </div>
                    <p class="text-center font-light text-sm">(try to click on an emoji)</p>
                </div>
            {/if}
        </div>
    </section>
    
    <!-- <section class="flex flex-col gap-14 xl:gap-18">
        <div class="text-center flex flex-col gap-7 xl:gap-8">
            <h2 class="font-medium text-4xl">What People Think About</h2>
            <div class="flex justify-between xl:mx-16">
                <div class="flex flex-col justify-center gap-6">
                    <a href="#" class="flex flex-col gap-2">
                        <h4 class="font-medium text-center text-lg xl:text-xl">Politics</h4>
                        <NewsChart name="politics" dimension='medium' value="4"/>
                    </a>
                    <div class="flex justify-center">
                        <button on:click={show_more} data-category_type="politics" 
                        class="btn w-32 text-xs min-h-0 h-9 xl:h-10 items-center rounded-md shadow-md hover:shadow-lg"
                        class:bg-primary-gradient = {category_type == 'politics'}
                        class:shadow-lg = {category_type == 'politics'}
                        class:text-white = {category_type == 'politics'}>{#if category_type == 'politics'}Show less{:else}Show more{/if}</button>
                    </div>
                </div>
                <div class="flex flex-col justify-center gap-6">
                    <a href="#" class="flex flex-col gap-2">
                        <h4 class="font-medium text-center text-lg xl:text-xl">Economy</h4>
                        <NewsChart name="economy" dimension='medium' value="5"/>
                    </a>
                    <div class="flex justify-center">
                        <button on:click={show_more} data-category_type="economy" 
                        class="btn w-32 text-xs min-h-0 h-9 xl:h-10 items-center rounded-md shadow-md hover:shadow-lg"
                        class:bg-primary-gradient = {category_type == 'economy'}
                        class:shadow-lg = {category_type == 'economy'}
                        class:text-white = {category_type == 'economy'}>{#if category_type == 'economy'}Show less{:else}Show more{/if}</button>
                    </div>
                </div>
                <div class="flex flex-col justify-center gap-6">
                    <a href="#" class="flex flex-col gap-2">
                        <h4 class="font-medium text-center text-lg xl:text-xl">Environment</h4>
                        <NewsChart name="environment" dimension='medium' value="9"/>
                    </a>
                    <div class="flex justify-center">
                        <div class="flex justify-center">
                            <button on:click={show_more} data-category_type="environment" 
                            class="btn w-32 text-xs min-h-0 h-9 xl:h-10 items-center rounded-md shadow-md hover:shadow-lg"
                            class:bg-primary-gradient = {category_type == 'environment'}
                            class:shadow-lg = {category_type == 'environment'}
                            class:text-white = {category_type == 'environment'}>{#if category_type == 'environment'}Show less{:else}Show more{/if}</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        {#if category_type}
            <SubCategories category_type={category_type} />
        {/if}
    </section>

    <TryScreener />

    <NewsDisplay /> -->

</div>

<style>
    .emotion_selected {
        filter: brightness(1.3);
        box-shadow: 0 25px 50px -12px rgb(0 0 0 / 0.25);
    }
</style>
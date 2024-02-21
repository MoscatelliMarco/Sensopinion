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

    // Get the prop with the news metrics and articles
    export let data;
    let metrics = data['props']['metrics'];
    let news_articles = data['props']['news_articles']
</script>

<svelte:head>
    <title>Sensopinion: analyze sentiment and emotions of news and articles at the speed of light</title>
    <meta name='description' content="We hate reading boring articles just to understand what's happening around us, that's why we created Sensopinion. Whether you are a Neutrality searcher or an Emotions analyzer, we got your back!">
</svelte:head>

{#if !metrics}
    <div role="alert" class="alert alert-error shadow-md">
        <svg xmlns="http://www.w3.org/2000/svg" class="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
        <span class="mt-0.5">We couldn't fetch the news for an internal server error😔, try again later.</span>
    </div>
{:else}
    <div class="flex flex-col gap-32 lg:gap-48 xl:gap-52">

        <section class="flex flex-col items-center md:flex-row md:justify-between gap-8 lg:gap-16 xl:gap-24 mt-6 xl:mt-12">
            <div class="flex flex-col justify-center gap-4 md:gap-7 lg:gap-9 xl:gap-11 items-center text-center md:text-left">
                <div class="flex flex-col gap-2 md:gap-3 lg:gap-4 xl:gap-5 items-center md:items-start">
                    <h1 class="font-bold text-3xl md:text-4xl lg:text-5xl xl:text-6xl max-w-xs md:max-w-sm lg:max-w-lg xl:max-w-2xl">
                        Analyze <span class="text-primary-gradient">Sentiment</span> and <span class="text-primary-gradient">Emotions</span> Of News And Articles At The Speed Of Light
                    </h1>
                    <p class="max-w-xs xl:max-w-lg text-xs lg:text-sm xl:text-base text-grey-1">
                        We hate reading boring articles just to understand what's happening around us, that's why we created Sensopinion.
                    </p>
                </div>
                <div class="hidden md:flex md:justify-start w-full gap-2 lg:gap-4">
                    <a href="/screener"
                    class="w-1/2 md:w-40 lg:w-48 xl:w-52 h-10 lg:h-11 xl:h-12 min-h-0 text-xs uppercase lg:text-sm rounded-md bg-primary-gradient font-semibold text-white hover:brightness-105 focus:hover:brightness-105 btn shadow-md hover:shadow-lg">
                        Try our screener
                    </a>
                    <div class="relative w-1/2 md:w-auto">
                        <button on:click={toggleDropdown} class="w-full md:w-40 lg:w-48 xl:w-52 h-10 lg:h-11 xl:h-12 min-h-0 shadow-md hover:shadow-lg text-xs lg:text-sm rounded-md bordeTr border-grey-2 text-grey-2 hover:border-grey-1 hover:text-grey-1 btn font-light">
                            <p>
                                Explore New Analysis
                            </p>
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
            <div class="flex flex-col justify-center px-2 md:px-0 gap-2 md:gap-4 mt-0 md:mt-6">
                <div class="flex justify-center">
                    <NewsChart name="all" value={metrics['all'][factor]} dimension='big' emotion_analyze={emotion_analyze} cake_chart_colors={cake_chart_colors}/>
                </div>
                <div class="relative h-12 lg:h-13">
                    {#if (factor !== 'emotions')}
                        <h5 transition:fade={{duration: 300}} class="text-center text-grey-2 font-light text-sm xl:text-base absolute top-0 left-0 right-0">{factor.charAt(0).toUpperCase() + factor.slice(1)} on news</h5>
                    {:else}
                        <div class="absolute top-0 left-0 right-0">
                            <div transition:fade={{duration: 300}} class="flex flex-col justify-between">
                                <div class="flex justify-center gap-1 lg:gap-2.5 xl:gap-3">
                                    {#each ['🤬', '🤢', '😨', '😐', '😭', '😲', '😀'] as emotion_item, index}
                                        <button on:click={handleClickEmotionAnalyze} data-emotion={emotion_item} style="background-color: {cake_chart_colors[index]};" 
                                        class="py-1 px-2 md:py-1 md:px-1.5 lg:px-2 lg:py-1.5 xl:py-1 text-xs lg:text-sm rounded-md flex flex-col justify-center border border-white"
                                        class:shadow-md={emotion_item != emotion_analyze}
                                        class:hover:shadow-lg={emotion_item != emotion_analyze}
                                        class:emotion_selected={emotion_item == emotion_analyze}
                                        >
                                            {emotion_item}
                                        </button>
                                    {/each}
                                </div>
                                <p class="text-center font-light text-xs lg:text-sm text-grey-2">(try to click on an emoji)</p>
                            </div>
                        </div>
                    {/if}
                </div>
                <div class="flex md:hidden md:justify-start w-full gap-2 lg:gap-5 xl:gap-6">
                    <a href="/screener"
                    class="w-1/2 md:w-40 lg:w-48 xl:w-52 h-10 lg:h-11 xl:h-12 min-h-0 text-xs uppercase lg:text-sm rounded-md bg-primary-gradient font-semibold text-white hover:brightness-105 focus:hover:brightness-105 btn shadow-md hover:shadow-lg">
                        Try <span class="hidden md:block">our </span>screener
                    </a>
                    <div class="relative w-1/2 md:w-full">
                        <button on:click={toggleDropdown} class="bg-transparent w-full md:w-40 lg:w-48 xl:w-52 h-10 lg:h-11 xl:h-12 min-h-0 shadow-md hover:shadow-lg text-xs lg:text-sm rounded-md bordeTr border-neutral text-neutral hover:border-neutral-dark hover:text-neutral-dark btn font-light">
                            Explore Analysis
                        </button>
                        <ul bind:this={dropdown} class:hidden={!dropdown_main_active} class:absolute={dropdown_main_active} 
                        class="w-full md:w-40 lg:w-48 xl:w-52 bg-white rounded-md mt-1 md:mt-1.5 lg:mt-2 shadow-md px-1.5 py-1 md:px-3 md:py-2.5 flex flex-col gap-0.5 z-20">
                            <FactorDropdownButton clickFunction={handleClickFactor} content="👍 Positivity 👎" factorValue="positivity" currentFactor={factor} />
                            <FactorDropdownButton clickFunction={handleClickFactor} content="🤜 Subjectivity 🤛" factorValue="subjectivity" currentFactor={factor} />
                            <FactorDropdownButton clickFunction={handleClickFactor} content="😃 Emotions 🤬" factorValue="emotions" currentFactor={factor} />
                        </ul>
                    </div>
                </div>
            </div>
        </section>
        
        <section class="flex flex-col">
            <div class="text-center flex flex-col gap-8 lg:gap-11 xl:gap-12">
                <h2 class="font-medium text-2xl md:text-3xl lg:text-4xl">What People Think About</h2>
                <div class="flex flex-col gap-13 md:gap-0 items-center md:flex-row md:justify-between xl:mx-16">
                    <div class="flex flex-col justify-center gap-3 md:gap-4 w-full items-center">
                        <a href="/categories/politics" class="flex flex-col gap-3 md:gap-5 lg:gap-6">
                            <h4 class="text-center text-lg xl:text-xl text-grey-1">politics</h4>
                            <NewsChart name="politics" dimension='medium' value={metrics['politics'][factor]} emotion_analyze={emotion_analyze} cake_chart_colors={cake_chart_colors}/>
                        </a>
                        <div class="flex justify-center">
                            <button on:click={show_more} data-category_type="politics" 
                            class="btn w-28 text-xs min-h-0 h-7 xl:h-8 font-light rounded-md shadow hover:shadow-md {category_type == 'politics' ? "bg-primary-gradient-opacity shadow-md text-white font-normal" : "bg-transparent border-grey-3 text-grey-3"}">
                            {#if category_type == 'politics'}Show less{:else}Show more{/if}</button>
                        </div>
                        {#if category_type == 'politics'}
                            <div class="block md:hidden">
                                <SubCategories category_type={category_type} emotion_analyze={emotion_analyze} cake_chart_colors={cake_chart_colors} metrics={metrics} factor={factor} />
                            </div>
                        {/if}
                    </div>
                    <div class="flex flex-col justify-center gap-3 md:gap-4 w-full items-center">
                        <a href="/categories/economy" class="flex flex-col gap-3 md:gap-5 lg:gap-6">
                            <h4 class="text-center text-lg xl:text-xl text-grey-1">economy</h4>
                            <NewsChart name="economy" dimension='medium' value={metrics['economy'][factor]} emotion_analyze={emotion_analyze} cake_chart_colors={cake_chart_colors}/>
                        </a>
                        <div class="flex justify-center">
                            <button on:click={show_more} data-category_type="economy" 
                            class="btn w-28 text-xs min-h-0 h-7 xl:h-8 font-light rounded-md shadow hover:shadow-md {category_type == 'economy' ? "bg-primary-gradient-opacity shadow-md text-white font-normal" : "bg-transparent border-grey-3 text-grey-3"}">
                            {#if category_type == 'economy'}Show less{:else}Show more{/if}</button>
                        </div>
                        {#if category_type == 'economy'}
                            <div class="block md:hidden">
                                <SubCategories category_type={category_type} emotion_analyze={emotion_analyze} cake_chart_colors={cake_chart_colors} metrics={metrics} factor={factor} />
                            </div>
                        {/if}
                    </div>
                    <div class="flex flex-col justify-center gap-3 md:gap-4 w-full items-center">
                        <a href="/categories/environment" class="flex flex-col gap-3 md:gap-5 lg:gap-6">
                            <h4 class="text-center text-lg xl:text-xl text-grey-1">environment</h4>
                            <NewsChart name="environment" dimension='medium' value={metrics['environment'][factor]} emotion_analyze={emotion_analyze} cake_chart_colors={cake_chart_colors}/>
                        </a>
                        <div class="flex justify-center">
                            <div class="flex justify-center">
                                <button on:click={show_more} data-category_type="environment" 
                                class="btn w-28 text-xs min-h-0 h-7 xl:h-8 font-light rounded-md shadow hover:shadow-md {category_type == 'environment' ? "bg-primary-gradient-opacity shadow-md text-white font-normal" : "bg-transparent border-grey-3 text-grey-3"}">
                                {#if category_type == 'environment'}Show less{:else}Show more{/if}</button>
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
            <div class="flex flex-col gap-1.5 lg:gap-2.5 mt-14 lg:mt-18 xl:mt-20">
                <div class="flex justify-center">
                    <div class="relative">
                        <button on:click={toggleSmallDropdown} class="bg-transparent w-44 lg:w-48 xl:w-52 text-xs lg:text-sm h-8 xl:h-9 min-h-0 shadow hover:shadow-md rounded-md border border-grey-2 text-grey-2 hover:border-grey-1 hover:text-grey-1 btn font-light">
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
                                <b transition:fade={{duration: 300}} class="w-44 lg:w-48 xl:w-52 py-1.5 lg:py-2 rounded-md bg-grey-4 flex flex-col justify-between h-12 lg:h-14 items-center shadow">
                                    <span class="text-xs lg:text-sm text-grey-2">
                                        Analyzing: 
                                    </span>
                                    <span class="text-sm lg:text-base font-bold text-grey-1 mt-neg-2">
                                        { factor == 'positivity' ? "👎👍 Positivity 👍👎" : factor == 'subjectivity' ? "🤜✊ Subjectivity ✊🤛" : "🤬😃 Emotions 😃🤬"}
                                    </span>
                                </b>
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
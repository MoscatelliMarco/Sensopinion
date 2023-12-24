<script>
    import RadialProgress from "$lib/items/radial_progress.svelte"
    import SubCategories from "$lib/sections/+page/subcategories_index.svelte"
    import TryScreener from "$lib/sections/+page/try_screener.svelte"
    import NewsDisplay from "$lib/sections/+page/news_display.svelte"

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
</script>

<div class="flex flex-col gap-48 xl:gap-56">

    <section class="flex justify-between gap-16 xl:gap-24 mt-16">
        <div class="flex flex-col justify-center gap-8 xl:gap-10">
            <div class="flex flex-col gap-5 xl:gap-6">
                <h1 style="line-height: 1.1;" class="font-bold text-5xl xl:text-6xl max-w-2xl">
                    Analyze <span class="text-primary-gradient">Sentiment</span> and <span class="text-primary-gradient">Emotions</span> At The Speed Of Light
                </h1>
                <h3 class="max-w-sm xl:max-w-lg text-sm xl:text-base">
                    We hate reading boring articles just to understand what is happening around us, that's why we created WPTAT
                </h3>
            </div>
            <div class="flex gap-8">
                <button class="w-44 xl:w-48 py-2.5 h-11 xl:h-12 min-h-0 text-sm rounded-md bg-primary-gradient font-semibold text-white hover:brightness-105 focus:hover:brightness-105 btn shadow-md hover:shadow-lg">TRY OUR SCREENER</button>
                <div class="relative">
                    <button on:click={toggleDropdown} class="w-44 xl:w-48 h-11 xl:h-12 min-h-0 shadow-md hover:shadow-lg text-sm rounded-md border-2 border-neutral text-neutral hover:border-neutral-dark hover:text-neutral-dark btn font-light text-md">Try a different emotion</button>
                    <ul bind:this={dropdown} class:hidden={!dropdown_main_active} class:absolute={dropdown_main_active} 
                    class="w-44 xl:w-48 bg-white rounded-md mt-2 shadow-md px-4 py-2 flex flex-col gap-0.5">
                        <li><button class="bg-primary-gradient-opacity bg-primary-gradient-opacity-inter text-white text-sm py-0.5 w-full rounded-sm">👍 Positivity 👍</button></li>
                        <li><button class="hover:bg-neutral-light focus:bg-neutral-light text-sm w-full rounded-sm py-0.5">👎 Negativity 👎</button></li>
                        <li style="margin: -2px 0px -2px 0px;" class="w-full text-center font-thin text-neutral text-sm">--------</li>
                        <li><button class="hover:bg-neutral-light focus:bg-neutral-light text-sm w-full rounded-sm py-0.5">✊ Subjectivity ✊</button></li>
                        <li style="margin: -2px 0px -2px 0px;" class="w-full text-center font-thin text-neutral text-sm">--------</li>
                        <li><button class="hover:bg-neutral-light focus:bg-neutral-light text-sm w-full rounded-sm py-0.5">😃 Happiness 😃</button></li>
                        <li><button class="hover:bg-neutral-light focus:bg-neutral-light text-sm w-full rounded-sm py-0.5">😢 Sadness 😢</button></li>  
                        <li><button class="hover:bg-neutral-light focus:bg-neutral-light text-sm w-full rounded-sm py-0.5">😱 Fear 😱</button></li>  
                        <li><button class="hover:bg-neutral-light focus:bg-neutral-light text-sm w-full rounded-sm py-0.5">🤮 Disgust 🤮</button></li>    
                    </ul>
                </div>
            </div>
        </div>
        <div class="flex flex-col justify-center gap-3 mt-6">
            <RadialProgress run_anim=true name="all" value=78.4 dimension='big'/>
            <h5 class="text-center font-light text-sm xl:text-base">*Positivity on news</h5>
        </div>
    </section>
    
    <section class="flex flex-col gap-14 xl:gap-18">
        <div class="text-center flex flex-col gap-7 xl:gap-8">
            <h2 class="font-medium text-4xl">What People Think About</h2>
            <div class="flex justify-between xl:mx-16">
                <div class="flex flex-col justify-center gap-6">
                    <a href="#" class="flex flex-col gap-2">
                        <h4 class="font-medium text-center text-lg xl:text-xl">Politics</h4>
                        <RadialProgress run_anim=true name="politics" dimension='medium' value='87.8'/>
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
                        <RadialProgress run_anim=true name="economics" dimension='medium' value='56.2'/>
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
                        <RadialProgress run_anim=true name="environment" dimension='medium' value='6.5'/>
                    </a>
                    <div class="flex justify-center">
                        <div class="flex justify-center">
                            <!-- bg-primary-gradient font-medium text-white hover:brightness-105 -->
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

    <NewsDisplay />

</div>
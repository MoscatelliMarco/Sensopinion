<script>
    import NewsDisplay from '$lib/sections/screener/+page/news_display.svelte';
    import FilterSide from '../../lib/items/filter_side.svelte';
    import SortSide from '../../lib/items/sort_side.svelte';
    import { fade } from 'svelte/transition';
    import { writable } from 'svelte/store';
    import { onMount } from 'svelte';
    import { browser } from "$app/environment"

    import { globalStore } from "../../stores.js";
    let news_articles;
    let categories;
    globalStore.subscribe(value => {
        news_articles = value.news;
        categories = value.categories;
    });

    let filterActive = false;
    let sortActive = false;
    let filterShow = false;
    let sortShow = false;

    let firstOpen = true;
    function animParams(){
        if (firstOpen) {
            return {duration: 0}
        } else{
            return {duration: 150}
        }
    }

    // Store for the dictionary parameters.
    const dict_params = writable({});

    // This function updates the URL parameters to reflect the current store state.
    function updateURLParams(params) {
        const search_params = new URLSearchParams(params)
        // Get the current URL
        const currentUrl = window.location.href;
        // Create a URL object using the current URL
        const urlObject = new URL(currentUrl);
        // Extract the base URL
        const baseURL = urlObject.origin + urlObject.pathname;

        if (search_params.toString()) {
            window.history.pushState({}, '', baseURL + "?" + search_params.toString());
        } else {
            window.history.pushState({}, '', baseURL);
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
    let isChanged = false;
    let news_articles_show = []
    $: if ($dict_params) {
        
        if (news_articles) {
            news_articles_show = news_articles.filter((item) => {
                if (!Object.keys($dict_params).length) {
                    return true;
                }
                let are_all_categories_blank = 0;
                for (let category in categories) {
                    if ($dict_params[category] === undefined) {
                        are_all_categories_blank += 1
                    }
                    if ($dict_params[category] && (category.charAt(0).toUpperCase() + category.slice(1)) in item['categories']){
                        return true;
                    }
                }
                if (are_all_categories_blank == Object.keys(categories).length) {
                    return true;
                }
                return false;
            })

            news_articles_show.sort((a, b) => {
                // Convert the date strings to date objects for comparison.
                let dateA = new Date(a['time_of_the_article']);
                let dateB = new Date(b['time_of_the_article']);

                // Compare the dates to determine their order.
                if (!$dict_params['ascending']) {
                    return dateB - dateA; // Use dateA - dateB for ascending order.
                }
                return dateA - dateB;
            });
        }

        // Because you can't listen to changes in dict I use a variable that changes every cycle
        isChanged = !isChanged;
    }
</script>

{#if news_articles === undefined}
    <div role="alert" class="alert alert-error shadow-md">
        <svg xmlns="http://www.w3.org/2000/svg" class="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
        <span class="mt-0.5">We couldn't fetch the news for an internal server error😔, try again later.</span>
    </div>
{:else}
    <div class="flex justify-start">
        <div class="flex items-start">
            <div class="flex flex-col gap-4 p-3">
                <button on:click={() => {filterActive ? setTimeout(() => {if (!filterActive) {filterShow = false}}, 150) : filterShow = true; filterActive = !filterActive; sortActive = false; sortShow = false; if(!filterActive && !sortActive) {firstOpen = true} else {setTimeout(() => {firstOpen = false}, 25)}}}>
                    <svg xmlns="http://www.w3.org/2000/svg" class="w-6 stroke-black" viewBox="0 0 24 24" fill="none">
                        <path d="M3 4.6C3 4.03995 3 3.75992 3.10899 3.54601C3.20487 3.35785 3.35785 3.20487 3.54601 3.10899C3.75992 3 4.03995 3 4.6 3H19.4C19.9601 3 20.2401 3 20.454 3.10899C20.6422 3.20487 20.7951 3.35785 20.891 3.54601C21 3.75992 21 4.03995 21 4.6V6.33726C21 6.58185 21 6.70414 20.9724 6.81923C20.9479 6.92127 20.9075 7.01881 20.8526 7.10828C20.7908 7.2092 20.7043 7.29568 20.5314 7.46863L14.4686 13.5314C14.2957 13.7043 14.2092 13.7908 14.1474 13.8917C14.0925 13.9812 14.0521 14.0787 14.0276 14.1808C14 14.2959 14 14.4182 14 14.6627V17L10 21V14.6627C10 14.4182 10 14.2959 9.97237 14.1808C9.94787 14.0787 9.90747 13.9812 9.85264 13.8917C9.7908 13.7908 9.70432 13.7043 9.53137 13.5314L3.46863 7.46863C3.29568 7.29568 3.2092 7.2092 3.14736 7.10828C3.09253 7.01881 3.05213 6.92127 3.02763 6.81923C3 6.70414 3 6.58185 3 6.33726V4.6Z" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                    </svg>
                </button>
                <button on:click={() => {sortActive ? setTimeout(() => {if (!sortActive) {sortShow = false}}, 150) : sortShow = true; sortActive = !sortActive; filterActive = false; filterShow = false; if(!filterActive && !sortActive) {firstOpen = true;} else {setTimeout(() => {firstOpen = false}, 25)}}}>
                    <svg xmlns="http://www.w3.org/2000/svg" class="w-6 stroke-black" viewBox="0 0 24 24" fill="none">
                        {#if ascending}
                            <path d="M13 12H21M13 8H21M13 16H21M6 7V17M6 7L3 10M6 7L9 10" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                        {:else}
                            <path d="M13 12H21M13 8H21M13 16H21M6 7V17M6 17L3 14M6 17L9 14" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                        {/if}
                    </svg>
                </button>
            </div>
            <div class="h-full min-h-100 bg-white filter-menu overflow-hidden relative" class:w-0={!filterActive && !sortActive} class:w-64={filterActive || sortActive}>
                {#if filterShow}
                    <div transition:fade={animParams()}>
                        <FilterSide dict_params={dict_params}/>
                    </div>
                {:else if sortShow}
                    <div transition:fade={animParams()}>
                        <SortSide ascending={ascending} changeOrder={() => {ascending = !ascending}} dict_params={dict_params} />
                    </div>
                {/if}
            </div>
        </div>
    <div class="w-full">
        <NewsDisplay news_articles={news_articles_show} is_changed={isChanged}/>
    </div>
    </div>
{/if}

<style>
    .filter-menu {
        transition: width 0.3s;
    }
</style>
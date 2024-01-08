<script>
    import NewsDisplay from '$lib/sections/screener/+page/news_display.svelte';
    import FilterSide from '../../lib/items/filter_side.svelte';
    import SortSide from '../../lib/items/sort_side.svelte';
    import { isEquivalent } from "../../public/dictEquivalent"
    import { fade, slide } from 'svelte/transition';
    import { writable } from 'svelte/store';
    import { onMount, onDestroy } from 'svelte';
    import { browser } from "$app/environment";
    import { pushState } from "$app/navigation";

    import { globalStore } from "../../stores.js";
    let news_articles;
    let categories;
    globalStore.subscribe(value => {
        news_articles = value.news;
        categories = value.categories;
    });

    // Filter and sort page conditions
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

        if (currentUrl != baseURL + (search_params.toString() ? ("?" + search_params.toString()) : "")) {
            if (search_params.toString()) {
                pushState(baseURL + "?" + search_params.toString(), {});
            } else {
                pushState(baseURL, {});
            }
        }
        // if (currentUrl != baseURL + (search_params.toString() ? ("?" + search_params.toString()) : "")) {
        //     if (search_params.toString()) {
        //         window.history.pushState({}, '', baseURL + "?" + search_params.toString());
        //     } else {
        //         window.history.pushState({}, '', baseURL);
        //     }
        // }
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
    let news_articles_show = []
    let before_dict_params = { ...$dict_params };
    $: if ($dict_params) {
        if (news_articles && (!isEquivalent(before_dict_params, $dict_params) || !is_mounted)) {
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
                    factor1 = new Date(a['time_of_the_article']);
                    factor2 = new Date(b['time_of_the_article']);
                }

                // Compare the dates to determine their order.
                if (!$dict_params['ascending']) {
                    return factor2 - factor1; // Use dateA - dateB for ascending order.
                }
                return factor1 - factor2;
            });
            window.scrollTo({top: 0, behavior: 'smooth'});
            before_dict_params = { ...$dict_params }
        }
    }

    // Javascript logic filter and sort button sticky
    let side_buttons;
    let parent_side_buttons;
    let side_menu;
    let stickyPointSide;

    let up_buttons;
    let up_buttons_parent;
    let up_buttons_sibling;
    let stickyPointUp;
    onMount(() => {
        // Get the initial position of the element
        stickyPointSide = side_buttons.offsetTop;
        stickyPointUp = up_buttons.offsetTop;

        // Add the scroll and resize event listener
        window.addEventListener('scroll', checkSticky);
        window.addEventListener('resize', widthChangeResize);

        // Run it once on load in case the page starts with a scroll
        checkSticky();
        widthChangeResize()
    })
    onDestroy(() => {
        window.removeEventListener('scroll', checkSticky);
        window.removeEventListener('resize', widthChangeResize);
    })
    // Function to check the scroll position and adjust the element accordingly
    function checkSticky() {
        if (window.pageYOffset >= stickyPointSide - 16 && window.innerWidth >= 1024) {
            // When the user has scrolled past the stickyPoint, make it sticky
            side_buttons.style.position = 'fixed';
            side_buttons.style.top = '16px';
            side_menu.style.position = 'fixed';
            side_menu.style.top = '16px';
        } else {
            // When the user is above the stickyPoint, position it normally
            side_buttons.style.position = 'relative';
            side_buttons.style.top = '';
            side_menu.style.position = 'relative';
            side_menu.style.top = '';
        }
        if (window.pageYOffset >= stickyPointUp && window.innerWidth < 1024) {
            up_buttons.style.position = 'fixed';
            up_buttons.style.top = '0';
            up_buttons_sibling.style.paddingTop = up_buttons.offsetHeight + 'px';
        } else {
            up_buttons.style.position = 'relative';
            up_buttons.style.top = '';
            up_buttons_sibling.style.paddingTop = '0';
        }
    }

    function widthChangeResize() {
        side_buttons.style.width = parent_side_buttons.offsetWidth + "px";
        up_buttons.style.width = up_buttons_parent.offsetWidth + "px";
        if (window.innerWidth >= 1024) {
            up_buttons_sibling.style.paddingTop = '0';
        }
    }
</script>

{#if news_articles === undefined}
    <div role="alert" class="alert alert-error shadow-md">
        <svg xmlns="http://www.w3.org/2000/svg" class="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
        <span class="mt-0.5">We couldn't fetch the news for an internal server error😔, try again later.</span>
    </div>
{:else}
    <div bind:this={up_buttons_parent} class="flex justify-start flex-col lg:flex-row">
        <div class="hidden lg:flex">
            <div bind:this={parent_side_buttons} class="w-14">
                <div bind:this={side_buttons} class="flex flex-col gap-4 items-center">
                    <button on:click={() => {filterActive ? setTimeout(() => {if (!filterActive) {filterShow = false}}, 150) : filterShow = true; filterActive = !filterActive; sortActive = false; sortShow = false; if(!filterActive && !sortActive) {firstOpen = true} else {setTimeout(() => {firstOpen = false}, 25)}}}>
                        <svg xmlns="http://www.w3.org/2000/svg" class="w-6 stroke-black" viewBox="0 0 24 24" fill="none">
                            <path d="M3 4.6C3 4.03995 3 3.75992 3.10899 3.54601C3.20487 3.35785 3.35785 3.20487 3.54601 3.10899C3.75992 3 4.03995 3 4.6 3H19.4C19.9601 3 20.2401 3 20.454 3.10899C20.6422 3.20487 20.7951 3.35785 20.891 3.54601C21 3.75992 21 4.03995 21 4.6V6.33726C21 6.58185 21 6.70414 20.9724 6.81923C20.9479 6.92127 20.9075 7.01881 20.8526 7.10828C20.7908 7.2092 20.7043 7.29568 20.5314 7.46863L14.4686 13.5314C14.2957 13.7043 14.2092 13.7908 14.1474 13.8917C14.0925 13.9812 14.0521 14.0787 14.0276 14.1808C14 14.2959 14 14.4182 14 14.6627V17L10 21V14.6627C10 14.4182 10 14.2959 9.97237 14.1808C9.94787 14.0787 9.90747 13.9812 9.85264 13.8917C9.7908 13.7908 9.70432 13.7043 9.53137 13.5314L3.46863 7.46863C3.29568 7.29568 3.2092 7.2092 3.14736 7.10828C3.09253 7.01881 3.05213 6.92127 3.02763 6.81923C3 6.70414 3 6.58185 3 6.33726V4.6Z" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                        </svg>
                    </button>
                    <button on:click={() => {sortActive ? setTimeout(() => {if (!sortActive) {sortShow = false}}, 150) : sortShow = true; sortActive = !sortActive; filterActive = false; filterShow = false; if(!filterActive && !sortActive) {firstOpen = true;} else {setTimeout(() => {firstOpen = false}, 25)}}}>
                        <svg xmlns="http://www.w3.org/2000/svg" class="w-7 stroke-black" viewBox="0 0 24 24" fill="none">
                            {#if ascending}
                                <path d="M13 12H21M13 8H21M13 16H21M6 7V17M6 7L3 10M6 7L9 10" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                            {:else}
                                <path d="M13 12H21M13 8H21M13 16H21M6 7V17M6 17L3 14M6 17L9 14" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                            {/if}
                        </svg>
                    </button>
                </div>
            </div>
            <div class="bg-white relative filter-menu" class:w-0={!filterActive && !sortActive} class:w-56={filterActive || sortActive}>
                <div bind:this={side_menu} class="h-full min-h-100 bg-white filter-menu overflow-hidden relative" class:w-0={!filterActive && !sortActive} class:w-56={filterActive || sortActive}>
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
        </div>
        <div bind:this={up_buttons} class="block lg:hidden z-50">
            <div class="flex justify-between p-2 bg-white">
                <button on:click={() => {filterShow = !filterShow; filterActive = !filterActive; sortActive = false; sortShow = false; if(!filterActive && !sortActive) {firstOpen = true} else {setTimeout(() => {firstOpen = false}, 25)}}}>
                    <svg xmlns="http://www.w3.org/2000/svg" class="w-6 stroke-black" viewBox="0 0 24 24" fill="none">
                        <path d="M3 4.6C3 4.03995 3 3.75992 3.10899 3.54601C3.20487 3.35785 3.35785 3.20487 3.54601 3.10899C3.75992 3 4.03995 3 4.6 3H19.4C19.9601 3 20.2401 3 20.454 3.10899C20.6422 3.20487 20.7951 3.35785 20.891 3.54601C21 3.75992 21 4.03995 21 4.6V6.33726C21 6.58185 21 6.70414 20.9724 6.81923C20.9479 6.92127 20.9075 7.01881 20.8526 7.10828C20.7908 7.2092 20.7043 7.29568 20.5314 7.46863L14.4686 13.5314C14.2957 13.7043 14.2092 13.7908 14.1474 13.8917C14.0925 13.9812 14.0521 14.0787 14.0276 14.1808C14 14.2959 14 14.4182 14 14.6627V17L10 21V14.6627C10 14.4182 10 14.2959 9.97237 14.1808C9.94787 14.0787 9.90747 13.9812 9.85264 13.8917C9.7908 13.7908 9.70432 13.7043 9.53137 13.5314L3.46863 7.46863C3.29568 7.29568 3.2092 7.2092 3.14736 7.10828C3.09253 7.01881 3.05213 6.92127 3.02763 6.81923C3 6.70414 3 6.58185 3 6.33726V4.6Z" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                    </svg>
                </button>
                <button on:click={() => {sortShow = !sortShow; sortActive = !sortActive; filterActive = false; filterShow = false; if(!filterActive && !sortActive) {firstOpen = true;} else {setTimeout(() => {firstOpen = false}, 25)}}}>
                    <svg xmlns="http://www.w3.org/2000/svg" class="w-7 stroke-black" viewBox="0 0 24 24" fill="none">
                        {#if ascending}
                            <path d="M13 12H21M13 8H21M13 16H21M6 7V17M6 7L3 10M6 7L9 10" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                        {:else}
                            <path d="M13 12H21M13 8H21M13 16H21M6 7V17M6 17L3 14M6 17L9 14" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                        {/if}
                    </svg>
                </button>
            </div>
            {#if (filterShow || sortShow)}
                <div transition:slide={{duration: 150}} class="bg-white pb-2 relative">
                    {#if filterShow}
                        <div>
                            <FilterSide dict_params={dict_params}/>
                        </div>
                    {:else if sortShow}
                        <div>
                            <SortSide ascending={ascending} changeOrder={() => {ascending = !ascending}} dict_params={dict_params} />
                        </div>
                    {/if}
                </div>
            {/if}
        </div>
        <div bind:this={up_buttons_sibling} class="w-full">
            <NewsDisplay news_articles={news_articles_show}/>
        </div>
    </div>
{/if}

<style>
    .filter-menu {
        transition: width 0.3s;
    }
</style>
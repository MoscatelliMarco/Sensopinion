<script>
    import FilterTopics from "$lib/items/filter_topics.svelte";
    import { writable } from 'svelte/store';
    import { browser } from "$app/environment";
    import { onMount } from "svelte";
    import { pushState } from "$app/navigation";

    // Store for the dictionary parameters.
    const dict_params = writable({});

    // This function updates the URL parameters to reflect the current store state.
    function updateURLParams(params) {
        const url = new URL(window.location);
        Object.keys(params).forEach(key => {
            if (params[key]) {
                url.searchParams.set(key, params[key]);
            } else {
                url.searchParams.delete(key);
            }
        });
        if (!Object.keys(params).length) {
            const baseUrl = `${url.protocol}//${url.host}${url.pathname}`;
            window.history.pushState({}, '', baseUrl);
        } else {
            window.history.pushState({}, '', url);     
        }
    }

    // Reactively update URL when dict_params changes.
    $: if ($dict_params) {
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
</script>

<h6 class="font-semibold text-lg">Topics</h6>
<div class="flex flex-col gap-5 mt-6">
    <FilterTopics dict_params={dict_params} topic="Politics"/>
    <FilterTopics dict_params={dict_params} topic="Economy"/>
    <FilterTopics dict_params={dict_params} topic="Environment"/>
</div>
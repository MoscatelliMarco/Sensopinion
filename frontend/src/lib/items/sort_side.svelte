<script>
    import { onMount } from "svelte";
    export let ascending;
    export let changeOrder;
    export let dict_params;

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
</script>
<div class="lg:absolute lg:top-0 lg:left-0 flex flex-col gap-8 pt-1 pb-3 pr-4 pl-1 w-full lg:w-56 h-full bg-white">
    <div class="flex flex-col gap-4">
        <p class="font-semibold text-xl">Sort by</p>
        <div class="flex justify-between items-center">
            <select bind:this={sort_select} class="w-36 text-sm rounded-none p-0 bg-white">
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
            <button on:click={() => {changeOrder()}}>
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
        <div class="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-2 justify-center gap-x-3 md:gap-x-4 lg:gap-x-2 gap-y-1.5 mb-1 md:mb-0 mt-2">
            <button on:click={() => {$dict_params['sortby'] = 'positivity'; delete $dict_params['ascending'];}} class="{$dict_params['sortby'] == 'positivity' && $dict_params['ascending'] != 'true' ? "bg-primary-gradient-opacity border-white text-white" : ""} btn shadow-sm hover:shadow-md focus:shadow-md min-h-0 rounded-md px-4 lg:px-6 h-7 lg:h-10 text-xs font-light">Most positive</button>
            <button on:click={() => {$dict_params['sortby'] = 'positivity'; $dict_params['ascending'] = 'true';}} class="{$dict_params['sortby'] == 'positivity' && $dict_params['ascending'] =='true' ? "bg-primary-gradient-opacity border-white text-white" : ""} btn shadow-sm hover:shadow-md focus:shadow-md min-h-0 rounded-md px-4 lg:px-6 h-7 lg:h-10 text-xs font-light">Most negative</button>
            <button on:click={() => {$dict_params['sortby'] = 'neutral'; delete $dict_params['ascending'];}} class="{$dict_params['sortby'] == 'neutral' && $dict_params['ascending'] != 'true' ? "bg-primary-gradient-opacity border-white text-white" : ""} btn shadow-sm hover:shadow-md focus:shadow-md min-h-0 rounded-md px-4 lg:px-6 h-7 lg:h-10 text-xs font-light">Most neutral</button>
            <button on:click={() => {$dict_params['sortby'] = 'anger'; delete $dict_params['ascending'];}} class="{$dict_params['sortby'] == 'anger' && $dict_params['ascending'] != 'true' ? "bg-primary-gradient-opacity border-white text-white" : ""} btn shadow-sm hover:shadow-md focus:shadow-md min-h-0 rounded-md px-4 lg:px-6 h-7 lg:h-10 text-xs font-light">Most angry</button>
        </div>
    </div>
</div>
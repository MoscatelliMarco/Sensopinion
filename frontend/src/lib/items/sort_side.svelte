<script>
    import { onMount } from "svelte";
    export let ascending;
    export let changeOrder;
    export let dict_params;

    $: if (ascending || !ascending) {
        dict_params.update($dict => {
            if (ascending) {
                $dict['ascending'] = true;   
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
</script>
<div class="absolute top-0 left-0 flex flex-col gap-8 py-5 pr-5 pl-2.5 w-64 h-full bg-white">
    <div class="flex flex-col gap-4">
        <p class="font-semibold text-xl">Sort by</p>
        <div class="flex justify-between items-center">
            <select bind:this={sort_select} class="w-36 text-sm rounded-none p-0 bg-white">
                <option value="date">Date</option>

                <option value="positivity">Positivity</option>
                <option value="subjectivity">Subjectivity</option>

                <option value="happiness">Happiness</option>
                <option value="sadness">Sadness</option>
                <option value="surprise">Surprise</option>
                <option value="fear">Fear</option>
                <option value="neutral">Neutral</option>
                <option value="anger">Anger</option>
                <option value="disgust">Disgust</option>
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
    </div>
</div>
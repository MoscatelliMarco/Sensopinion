<script>
    import { globalStore } from '../../stores.js';
    import { slide } from 'svelte/transition';
    import { onMount, onDestroy } from 'svelte';
    import SubTopic from "./subtopic_filter_dropdown.svelte"

    let sub_topics = $globalStore.categories;

    export let show_more = false;
    export let switch_show;

    export let topic;
    sub_topics = sub_topics[(topic).toLowerCase()]

    export let dict_params;

    let main_checkbox;
    function checkEverything() {
        if (main_checkbox.checked) {
            dict_params.update(($dict) => {
                $dict[topic.toLowerCase()] = true;
                return $dict;
            })
        } else {
            dict_params.update(($dict) => {
                delete $dict[topic.toLowerCase()]
                return $dict
            })
        }
    }

    onMount(() => {
        main_checkbox.addEventListener('change', checkEverything)
    })
    onDestroy(() => {
        main_checkbox.removeEventListener('change', checkEverything)
    })

    $: if($dict_params) {
        // If the component is not mount yet is going to throw an error so simply do nothing
        try {
            if (topic.toLowerCase() in $dict_params) {
                main_checkbox.checked = true;
            } else {
                main_checkbox.checked = false;
            }
        } catch (e) {}
    }
</script>

<div class="flex flex-col">
    <div class="flex justify-between">
        <label for="{topic}_checkbox" class="font-medium text-base">{topic}</label>
        <input bind:this={main_checkbox} type="checkbox" id="{topic}_checkbox" class="w-5"/>
    </div>
    <button class="text-xs p-1 italic" on:click={() => {switch_show()}}>
        Show {show_more ? "less" : "more"}
    </button>
    {#if show_more}
        <div transition:slide={{duration: 300}} class="flex flex-col gap-1 pt-1.5">
            <SubTopic dict_params={dict_params} topic={topic}/>
        </div>
    {/if}
</div>
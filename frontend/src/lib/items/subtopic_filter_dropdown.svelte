<script>
    import { onMount, onDestroy } from "svelte";
    import { globalStore } from '../../stores.js';

    let sub_topics = $globalStore.categories;  

    export let topic;
    sub_topics = sub_topics[(topic).toLowerCase()]

    export let dict_params;
    let topic_key = topic.toLowerCase()
    let subtopic_checkboxes;
    function checkSubTopic() {
        let active_sub_filter = []
        for (let checkbox of subtopic_checkboxes) {
            if (checkbox.checked) {
                active_sub_filter.push(checkbox.dataset['filter'])
            }
        }
        dict_params.update(($dict) => {
            if (active_sub_filter.length) {
                $dict[topic_key] = active_sub_filter;
            } else {
                delete $dict[topic_key]
            }
            return $dict;
        })
    }
    onMount(() => {
        subtopic_checkboxes = document.querySelectorAll(".subtopic_checkbox");
        for (let checkbox of subtopic_checkboxes){
            checkbox.addEventListener('change', checkSubTopic)
        }
    })
    onDestroy(() => {
        for (let checkbox of subtopic_checkboxes){
            checkbox.removeEventListener('change', checkSubTopic)
        }
    })

    $: if ($dict_params) {
        // If the component is not mount yet is going to throw an error so simply do nothing
        try {
            if ($dict_params[topic_key] === true) {
                for (let checkbox of subtopic_checkboxes) {
                    checkbox.checked = true;
                }
            }
        } catch (e) {}
    }   
</script>

{#each sub_topics as sub_topic}
    <div class="flex justify-between">
        <label for="{sub_topic}_checkbox" class="text-sm">{sub_topic}</label>
        <input type="checkbox" checked={
            $dict_params[topic_key] && ($dict_params[topic_key] === true || $dict_params[topic_key].includes(sub_topic.toLowerCase().replaceAll(" ", "_"))) || $dict_params[topic_key] == 'ascending' ? "checked" : ""
        } data-filter={sub_topic.toLowerCase().replaceAll(" ", "_")} id="{sub_topic}_checkbox" class="w-4 subtopic_checkbox"/>
    </div>
{/each}
<script>
    import { onMount } from "svelte";
    export let inputText = '';

    let char_count;
    onMount(() => {
        char_count = inputText.length;
    })
</script>
<div class="relative h-full">
    <textarea on:input={() => {setTimeout(() => {char_count = inputText.length;}, 50)}} maxlength="2500" name="text" 
        bind:value={inputText} placeholder="Text to analyze" 
        class="text-sm md:text-base px-2.5 py-1.5 w-full h-full resize-none overflow-y-auto focus:border-none focus:outline-none"></textarea>
    <p class="absolute bottom-0 right-1">{2500 - char_count}</p>
</div>
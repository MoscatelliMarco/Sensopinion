<script>
    import FilterTopics from "$lib/items/filter_topics.svelte";

    export let dict_params;
</script>

<div class="absolute top-0 left-0 flex flex-col gap-8 py-5 pr-5 pl-2.5 w-64 h-full bg-white">
    <div class="flex flex-col gap-4">
        <h6 class="font-semibold text-xl">Topics</h6>
        <div class="flex flex-col gap-4">
            <FilterTopics dict_params={dict_params} topic="Politics"/>
            <FilterTopics dict_params={dict_params} topic="Economy"/>
            <FilterTopics dict_params={dict_params} topic="Environment"/>
        </div>
    </div>
</div>
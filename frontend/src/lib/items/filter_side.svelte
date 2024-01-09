<script>
    import FilterTopics from "$lib/items/filter_topics.svelte";

    export let dict_params;
</script>

<div class="lg:absolute lg:top-0 lg:left-0 flex flex-col gap-8 pt-1 pb-3 pr-4 pl-1 w-full h-full bg-white">
    <div class="flex flex-col gap-4 lg:gap-6">
        <h6 class="font-semibold text-xl">Topics</h6>
        <div class="grid grid-cols-2 md:grid-cols-8 lg:grid-cols-1 gap-y-5 gap-x-8 md:gap-x-0">
            <div class="col-span-1 md:col-span-2 lg:col-span-1">
                <FilterTopics dict_params={dict_params} topic="Politics"/>
            </div>
            <p class="hidden md:block lg:hidden text-center">·</p>
            <div class="col-span-1 md:col-span-2 lg:col-span-1">
                <FilterTopics dict_params={dict_params} topic="Economy"/>
            </div>
            <p class="hidden md:block lg:hidden text-center">·</p>
            <div class="col-span-1 md:col-span-2 lg:col-span-1">
                <FilterTopics dict_params={dict_params} topic="Environment"/>
            </div>
        </div>
    </div>
</div>
<script>
    import FilterTopics from "$lib/items/filter_topics.svelte";

    export let dict_params;

    let show_more_politics = false;
    let show_more_economy = false;
    let show_more_environment = false;

    const switchPolitics = () => {show_more_politics = !show_more_politics; if (window.innerWidth < 768) {show_more_economy = false; show_more_environment = false;}}
    const switchEconomy = () => {show_more_economy = !show_more_economy; if (window.innerWidth < 768) {show_more_politics = false; show_more_environment = false;}}
    const switchEnvironment = () => {show_more_environment = !show_more_environment; if (window.innerWidth < 768) {show_more_economy = false; show_more_politics = false;}}
</script>

<div class="lg:absolute lg:top-0 lg:left-0 flex flex-col gap-8 pt-1 pb-3 pr-4 pl-1 w-full h-full bg-white">
    <div class="flex flex-col gap-4 lg:gap-6">
        <h6 class="font-semibold text-xl">Topics</h6>
        <div class="grid grid-cols-2 md:grid-cols-8 lg:grid-cols-1 gap-y-5 gap-x-8 md:gap-x-0">
            <div class="col-span-1 md:col-span-2 lg:col-span-1">
                <FilterTopics show_more={show_more_politics} switch_show={switchPolitics} dict_params={dict_params} topic="Politics"/>
            </div>
            <p class="hidden md:block lg:hidden text-center">·</p>
            <div class="col-span-1 md:col-span-2 lg:col-span-1">
                <FilterTopics show_more={show_more_economy} switch_show={switchEconomy} dict_params={dict_params} topic="Economy"/>
            </div>
            <p class="hidden md:block lg:hidden text-center">·</p>
            <div class="col-span-1 md:col-span-2 lg:col-span-1">
                <FilterTopics show_more={show_more_environment} switch_show={switchEnvironment} dict_params={dict_params} topic="Environment"/>
            </div>
        </div>
    </div>
</div>
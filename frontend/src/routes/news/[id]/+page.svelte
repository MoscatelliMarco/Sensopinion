<script>
    import { onMount } from "svelte";
    import NewsRadioAll from "../../../lib/sections/news/+page/news_radio_all.svelte";
    
    export let data;
    let news = data['props']['data'][0]
    let radio_data = [news['emotions'], news['sentiment'], Object.keys(news['categories']), Object.values(news['categories']), news['date_published'], news['image'], news['description'], news['title']]

    let timer = 3;
    onMount(() => {
        setInterval(() => {
            if (timer != 0) {
                timer -= 1;
            }
        }, 1000)
    })
</script>

<div class="flex flex-col items-center gap-3 mt-5 md:mt-6 lg:mt-8 text-center">
    <div class="flex flex-col items-center">
        <p>Click this button after {timer} seconds to be redirected</p>
        <p class="text-8xl text-primary-gradient font-bold">{timer}</p>
    </div>
    <button on:click={() => {
        if (timer == 0) { window.open(news['url'], '_blank'); }
    }} class="{timer == 0 ? "btn bg-primary-gradient shadow-md hover:shadow-lg" : " bg-primary-gradient-opacity"} h-9 min-h-0 rounded-sm text-white border-0 px-8 font-medium disabled:opacity-50 disabled:cursor-not-allowed">
        Redirect me
    </button>
    <div class="mt-14 md:mt-16 lg:mt-18 flex flex-col gap-1 md:gap-2 lg:gap-4">
        <NewsRadioAll data={radio_data} show_text={false}/>
    </div>
</div>
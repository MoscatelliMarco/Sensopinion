<script>
    import { onMount } from "svelte";
    
    export let data;
    let news = data['props']['data'][0]

    let timer = 3;
    onMount(() => {
        setInterval(() => {
            if (timer != 0) {
                timer -= 1;
            }
        }, 1000)
    })

    $: if (timer == 0) {
        window.open(news['url'], '_blank');
    }
</script>

<div class="flex flex-col items-center gap-3 mt-16 md:mt-20 lg:mt-24 xl:mt-28 text-center">
    <div class="flex flex-col items-center">
        <p>Wait few seconds before being redirected</p>
        <p class="text-8xl text-primary-gradient font-bold">{timer}</p>
    </div>
    <button on:click={() => {
        if (timer == 0) { window.open(news['url'], '_blank'); }
    }} class="{timer == 0 ? "btn bg-primary-gradient shadow-md hover:shadow-lg" : " bg-primary-gradient-opacity"} h-8 min-h-0 rounded-sm text-white border-0 px-3 font-medium text-xs disabled:opacity-50 disabled:cursor-not-allowed">
        Click here if you aren't redirected
    </button>
</div>
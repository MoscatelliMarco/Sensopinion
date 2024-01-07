<script>
    import { onMount } from 'svelte';
    import { loadedStore } from '../stores';
    import Navbar from "$lib/components/navbar.svelte";
    import Footer from "$lib/components/footer.svelte";
    import "../public/app.css"
    import "../public/global.css"
    
    // Vercel speed insights to check the metrics of the website
    import { injectSpeedInsights } from "@vercel/speed-insights/sveltekit"
    injectSpeedInsights()

    let store_loaded;
    loadedStore.subscribe(value => {
        store_loaded = value
    })
    
    let page_loaded = false;
    onMount(() => {
        // Simulating a loading process
        page_loaded = true;
    });

    let loaded;
    $: if(page_loaded && store_loaded) {
        loaded = page_loaded && store_loaded
    }
</script>

{#if loaded}
    <body class="flex flex-col min-h-screen bg-white text-black overflow-x-hidden">
        <Navbar />
        <main class="flex justify-center mb-48">
            <div class="max-w-lg md:max-w-3xl lg:max-w-5xl xl:max-w-6xl mx-2 md:mx-4 lg:mx-6 w-full">
                <slot></slot>
            </div>
        </main>
        <Footer />
    </body>
{:else}
    <div class="bg-white flex justify-center items-center h-screen">
        <span class="loading loading-infinity w-10 md:w-12 lg:w-13"></span>
    </div>
{/if}
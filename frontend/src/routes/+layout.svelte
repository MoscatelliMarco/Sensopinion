<script>
    import { onMount } from 'svelte';
    import { loadedStore, userStore } from '../stores';
    import Navbar from "$lib/components/navbar.svelte";
    import Footer from "$lib/components/footer.svelte";
    import FlashMessage from '$lib/items/flash_message.svelte';
    import "$lib/css/app.css"
    import "$lib/css/global.css"

    export let data;

    let store_loaded;
    const unsubscribe = loadedStore.subscribe(value => {
        store_loaded = value
    })
    unsubscribe()
    
    let page_loaded = false;
    onMount(() => {
        // Simulating a loading process
        page_loaded = true;
    });

    let loaded;
    $: if(page_loaded && store_loaded) {
        loaded = page_loaded && store_loaded
    }

    $: if((data['props']['user'] || !data['props']['user']) && page_loaded) {
        userStore.update(store => {
            store.user = data['props']['user'] ? data['props']['user'] : null;
            store.session = data['props']['session'] ? data['props']['session'] : null;

            return store;
        })
    }
</script>

{#if loaded}
    <div class="font-main flex flex-col min-h-screen bg-white text-black overflow-x-hidden">
        <Navbar />
        <main class="flex justify-center mb-40 md:mb-36 lg:mb-40">
            <div class="max-w-lg md:max-w-3xl lg:max-w-5xl xl:max-w-6xl px-2 md:px-4 lg:px-6 w-full">
                <FlashMessage />
                <slot></slot>
            </div>
        </main>
        <Footer />
    </div>
{:else}
    <div class="font-main bg-white flex justify-center items-center h-screen">
        <span class="loading loading-infinity w-10 md:w-12 lg:w-13"></span>
    </div>
{/if}
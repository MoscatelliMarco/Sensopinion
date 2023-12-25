<script>
    import Navbar from "$lib/components/navbar.svelte";
    import Footer from "$lib/components/footer.svelte";
    import "../public/app.css"
    import "../public/global.css"

    import { onMount } from 'svelte';

    let isLoaded = false;

    onMount(() => {
        // Simulating a loading process
        isLoaded = true;
    });
</script>

{#if isLoaded}
    <body class="flex flex-col min-h-screen bg-white text-black">
        <Navbar />
        <main class="flex justify-center mb-48">
            <div class="max-w-6xl mx-16">
                <slot></slot>
            </div>
        </main>
        <Footer />
    </body>
{:else}
    <div class="bg-white flex justify-center items-center h-screen">
        <span class="loading loading-infinity w-12 md:w-14 lg:w-16 xl:w-18"></span>
    </div>
{/if}
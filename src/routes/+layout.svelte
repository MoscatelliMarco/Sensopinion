<script>
    import Navbar from "../lib/navbar.svelte";
    import "../public/app.css"
    import "../public/global.css"
</script>

<Navbar />

<main class="flex justify-center">
    <div class="max-w-7xl mx-16">
        <slot></slot>
    </div>
</main>
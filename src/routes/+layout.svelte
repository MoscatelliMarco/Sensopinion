<script>
    import Navbar from "../lib/navbar.svelte";
    import Footer from "../lib/footer.svelte";
    import "../public/app.css"
    import "../public/global.css"
</script>

<body class="flex flex-col min-h-screen bg-white text-black">
    <Navbar />
    <main class="flex justify-center mb-32">
        <div class="max-w-6xl mx-16 flex flex-col gap-32">
            <slot></slot>
        </div>
    </main>
    <Footer />
</body>
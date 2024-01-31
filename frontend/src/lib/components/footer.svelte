<script>
    import { page } from '$app/stores';
</script>

<footer class="mt-auto flex justify-center lg:pt-0 xl:pt-8 mx-2 md:mx-4 lg:mx-6">
    <div class="max-w-6xl flex flex-col gap-9 md:gap-5 lg:gap-9 shadow-lg rounded-2xl mb-3 lg:mb-4 xl:mb-5 py-7 lg:py-8 xl:py-10 px-6 lg:px-14 w-full mt-neg-8 lg:mt-neg-4">
        <div class="flex justify-center mb-neg-1 md:mb-0">
            <h2 class="text-primary-gradient font-medium text-xl lg:text-2xl">Sensopinion</h2>
        </div>
        <ul class="flex flex-col md:flex-row items-center justify-center gap-0 md:gap-5 lg:gap-8 xl:gap-10 text-sm">
            <li class="hover:font-medium {$page.url.pathname === '/' ? 'font-medium' : ''}">
                <a svelte href="/">
                    Home
                </a>
            </li>
            <li class="font-medium">·</li>
            <li class="hover:font-medium {$page.url.pathname === '/screener' ? 'font-medium' : ''}">
                <a svelte href="/screener">
                    Screener
                </a>
            </li>
            <li class="font-medium">·</li>
            <li class="hover:font-medium {$page.url.pathname === '/analyze_your_news' ? 'font-medium' : ''}">
                <a href="/analyze_your_news">
                    Analyze Your News
                </a>
            </li>
            <li class="font-medium">·</li>
            <li class="hover:font-medium {$page.url.pathname === '/categories' ? 'font-medium' : ''}">
                <a href="/categories">
                    Categories
                </a>
            </li>
            <li class="font-medium">·</li>
            <li class="hover:font-medium {$page.url.pathname === '/info/about-us' ? 'font-medium' : ''}">
                <a href="/info/about-us">
                    About us
                </a>
            </li>
        </ul>
        <div class="flex justify-center">
            <h5 class="font-semibold text-sm">Made with ❤️ by <a href="https://github.com/MoscatelliMarco">Marco Moscatelli</a></h5>
        </div>
    </div>
</footer>
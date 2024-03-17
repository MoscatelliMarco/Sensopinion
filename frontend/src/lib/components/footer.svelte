<script>
    import { page } from '$app/stores';
</script>

<footer class="mt-auto flex justify-center lg:pt-0 xl:pt-8 px-1 md:px-4 lg:px-6">
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
            <li class="hover:font-medium {$page.url.pathname.includes('/categories') ? 'font-medium' : ''}">
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
        <ul class="flex gap-2 justify-center items-center my-1">
            <li>
                <a href="https://www.instagram.com/sensopinion/">
                    <svg class="h-8 stroke-grey-1 hover:stroke-black p-0.25" xmlns="http://www.w3.org/2000/svg" viewBox="0 -0.5 25 25" fill="none">
                        <path fill-rule="evenodd" clip-rule="evenodd" d="M15.5 5H9.5C7.29086 5 5.5 6.79086 5.5 9V15C5.5 17.2091 7.29086 19 9.5 19H15.5C17.7091 19 19.5 17.2091 19.5 15V9C19.5 6.79086 17.7091 5 15.5 5Z" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                        <path fill-rule="evenodd" clip-rule="evenodd" d="M12.5 15C10.8431 15 9.5 13.6569 9.5 12C9.5 10.3431 10.8431 9 12.5 9C14.1569 9 15.5 10.3431 15.5 12C15.5 12.7956 15.1839 13.5587 14.6213 14.1213C14.0587 14.6839 13.2956 15 12.5 15Z" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                        <rect x="15.5" y="9" width="2" height="2" rx="1" transform="rotate(-90 15.5 9)"/>
                        <rect x="16" y="8.5" width="1" height="1" rx="0.5" transform="rotate(-90 16 8.5)" stroke-linecap="round"/>
                    </svg>
                </a>
            </li>
            <li>
                <a href="https://www.threads.net/">
                    <svg class="h-8 fill-grey-1 hover:fill-black p-1.5" xmlns="http://www.w3.org/2000/svg" aria-label="Threads" viewBox="0 0 192 192"><path d="M141.537 88.9883C140.71 88.5919 139.87 88.2104 139.019 87.8451C137.537 60.5382 122.616 44.905 97.5619 44.745C97.4484 44.7443 97.3355 44.7443 97.222 44.7443C82.2364 44.7443 69.7731 51.1409 62.102 62.7807L75.881 72.2328C81.6116 63.5383 90.6052 61.6848 97.2286 61.6848C97.3051 61.6848 97.3819 61.6848 97.4576 61.6855C105.707 61.7381 111.932 64.1366 115.961 68.814C118.893 72.2193 120.854 76.925 121.825 82.8638C114.511 81.6207 106.601 81.2385 98.145 81.7233C74.3247 83.0954 59.0111 96.9879 60.0396 116.292C60.5615 126.084 65.4397 134.508 73.775 140.011C80.8224 144.663 89.899 146.938 99.3323 146.423C111.79 145.74 121.563 140.987 128.381 132.296C133.559 125.696 136.834 117.143 138.28 106.366C144.217 109.949 148.617 114.664 151.047 120.332C155.179 129.967 155.42 145.8 142.501 158.708C131.182 170.016 117.576 174.908 97.0135 175.059C74.2042 174.89 56.9538 167.575 45.7381 153.317C35.2355 139.966 29.8077 120.682 29.6052 96C29.8077 71.3178 35.2355 52.0336 45.7381 38.6827C56.9538 24.4249 74.2039 17.11 97.0132 16.9405C119.988 17.1113 137.539 24.4614 149.184 38.788C154.894 45.8136 159.199 54.6488 162.037 64.9503L178.184 60.6422C174.744 47.9622 169.331 37.0357 161.965 27.974C147.036 9.60668 125.202 0.195148 97.0695 0H96.9569C68.8816 0.19447 47.2921 9.6418 32.7883 28.0793C19.8819 44.4864 13.2244 67.3157 13.0007 95.9325L13 96L13.0007 96.0675C13.2244 124.684 19.8819 147.514 32.7883 163.921C47.2921 182.358 68.8816 191.806 96.9569 192H97.0695C122.03 191.827 139.624 185.292 154.118 170.811C173.081 151.866 172.51 128.119 166.26 113.541C161.776 103.087 153.227 94.5962 141.537 88.9883ZM98.4405 129.507C88.0005 130.095 77.1544 125.409 76.6196 115.372C76.2232 107.93 81.9158 99.626 99.0812 98.6368C101.047 98.5234 102.976 98.468 104.871 98.468C111.106 98.468 116.939 99.0737 122.242 100.233C120.264 124.935 108.662 128.946 98.4405 129.507Z"/></svg>
                </a>
            </li>
            <li>
                <a href="mailto:contact.sensopinion@gmail.com">
                    <svg class="h-8 stroke-grey-1 hover:stroke-black p-1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none">
                        <path d="M21 8L17.4392 9.97822C15.454 11.0811 14.4614 11.6326 13.4102 11.8488C12.4798 12.0401 11.5202 12.0401 10.5898 11.8488C9.53864 11.6326 8.54603 11.0811 6.5608 9.97822L3 8M6.2 19H17.8C18.9201 19 19.4802 19 19.908 18.782C20.2843 18.5903 20.5903 18.2843 20.782 17.908C21 17.4802 21 16.9201 21 15.8V8.2C21 7.0799 21 6.51984 20.782 6.09202C20.5903 5.71569 20.2843 5.40973 19.908 5.21799C19.4802 5 18.9201 5 17.8 5H6.2C5.0799 5 4.51984 5 4.09202 5.21799C3.71569 5.40973 3.40973 5.71569 3.21799 6.09202C3 6.51984 3 7.07989 3 8.2V15.8C3 16.9201 3 17.4802 3.21799 17.908C3.40973 18.2843 3.71569 18.5903 4.09202 18.782C4.51984 19 5.07989 19 6.2 19Z" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                    </svg>
                </a>
            </li>
        </ul>
        <div class="flex justify-center">
            <h5 class="font-semibold text-sm">Made with ❤️ by <a href="https://github.com/MoscatelliMarco">Marco Moscatelli</a></h5>
        </div>
    </div>
</footer>
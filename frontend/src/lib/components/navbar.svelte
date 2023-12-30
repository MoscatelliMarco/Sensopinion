<script>
    import { onMount, onDestroy } from "svelte";
    let openMenu = false;
    let originalScrollY;

    function disableScroll() {
        originalScrollY = window.scrollY;  // Record the scroll position
        document.body.style.position = 'fixed';
        document.body.style.top = `-${originalScrollY}px`;
        document.body.style.width = '100%';
        document.body.style.overflowY = 'scroll';  // Keep the scrollbar visible
    }

    function enableScroll() {
        document.body.style.position = '';
        document.body.style.top = '';
        document.body.style.width = '';
        document.body.style.overflowY = '';
        window.scrollTo(0, originalScrollY);  // Reset the scroll position
    }

    let navbarTotalTopSpace = 0;
    let navbar;
    let drawer;
    function updateNavbarHeight() {
        const navbarStyle = window.getComputedStyle(navbar);

        const navbarHeight = navbar.offsetHeight; // Get the height of the navbar
        const navbarMarginTop = parseInt(navbarStyle.marginTop, 10); // Get the top margin of the navbar

        navbarTotalTopSpace = navbarHeight + navbarMarginTop; // Calculate total space occupied by the navbar including its margin
    }

    function setDrawerPadding() {
        drawer.style.paddingTop = `${navbarTotalTopSpace}px`; // Set the top padding to the navbar height
    }

    // Watch for changes in openMenu and call disable/enableScroll accordingly
    $: if (openMenu) {
        disableScroll();
        setDrawerPadding()
    } else {
        enableScroll();
    }

    function closeDrawerLaptop() {
        if (window.innerWidth >= 1024) {
            openMenu = false;
        }
    }

    onMount(() => {
        // Update the navbar height on resize and initial load
        window.addEventListener('resize', updateNavbarHeight);
        window.addEventListener('resize', closeDrawerLaptop);
        updateNavbarHeight(); // Initial call to set the navbar height
    })
    onDestroy(() => {
        // Destroy event listener if component destroyed
        window.removeEventListener('resize', updateNavbarHeight);
        window.removeEventListener('resize', closeDrawerLaptop);
    })
</script>

<nav class="flex justify-center mx-4 lg:mx-6">
    <div bind:this={navbar} class="max-w-6xl w-full flex justify-between rounded-2xl shadow-lg bg-white py-5 px-14 mb-8 xl:mb-12 mt-4 z-50">
        <h2 class="text-primary-gradient font-black text-xl">WPTAT</h2>
        <ul class="gap-16 hidden lg:flex">
            <li class="hover:font-medium text-sm flex flex-col justify-center">
                <a href="#">Sentiment Screener</a>
            </li>
            <li class="hover:font-medium text-sm flex flex-col justify-center">
                <a href="#">Analyze Your News</a>
            </li>
            <li class="hover:font-medium text-sm flex flex-col justify-center">
                <a href="#">About us</a>
            </li>
        </ul>
        <button on:click={() => {openMenu = !openMenu}} class="block lg:hidden">
            <svg xmlns="http://www.w3.org/2000/svg" class="fill-black h-6" viewBox="0 0 24 24">
                <path fill-rule="evenodd" clip-rule="evenodd" d="M4 5C3.44772 5 3 5.44772 3 6C3 6.55228 3.44772 7 4 7H20C20.5523 7 21 6.55228 21 6C21 5.44772 20.5523 5 20 5H4ZM7 12C7 11.4477 7.44772 11 8 11H20C20.5523 11 21 11.4477 21 12C21 12.5523 20.5523 13 20 13H8C7.44772 13 7 12.5523 7 12ZM13 18C13 17.4477 13.4477 17 14 17H20C20.5523 17 21 17.4477 21 18C21 18.5523 20.5523 19 20 19H14C13.4477 19 13 18.5523 13 18Z"/>
            </svg>
        </button>
    </div>
</nav>
<div bind:this={drawer} class={`fixed top-0 left-0 w-full h-screen z-30 ${openMenu ? 'backdrop-blur-md' : ''}`} style="transition: backdrop-filter 0.3s;">
    <div class={`w-full h-full bg-white fixed z-40 ${openMenu ? 'drawer-enter' : 'drawer-exit drawer-hidden'}`}>
        <ul class="flex flex-col gap-4 px-4 pt-6">
            <li class="hover:font-medium flex flex-col justify-center shadow-sm hover:shadow-md px-4 py-3 rounded-md">
                <a href="#">Sentiment Screener</a>
            </li>
            <li class="hover:font-medium flex flex-col justify-center shadow-sm hover:shadow-md px-4 py-3 rounded-md">
                <a href="#">Analyze Your News</a>
            </li>
            <li class="hover:font-medium flex flex-col justify-center shadow-sm hover:shadow-md px-4 py-3 rounded-md">
                <a href="#">About us</a>
            </li>
            <li class="hover:font-medium flex flex-col justify-center shadow-sm hover:shadow-md px-4 py-3 rounded-md">
                <a href="#">Where do we find news</a>
            </li>
        </ul>
    </div>
</div>
<style>
    @keyframes slideIn {
      from {
        transform: translateX(-100%);
      }
      to {
        transform: translateX(0);
      }
    }
  
    @keyframes slideOut {
      from {
        transform: translateX(0);
      }
      to {
        transform: translateX(-100%);
      }
    }
  
    .drawer-enter {
      animation: slideIn 0.3s forwards;
    }
  
    .drawer-exit {
      animation: slideOut 0.3s forwards;
    }

    .drawer-hidden {
        transform: translateX(-100%);
    }
</style>
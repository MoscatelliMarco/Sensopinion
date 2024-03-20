<script>
    import { onMount, onDestroy } from "svelte";
    let openMenu = false;
    let originalScrollY;
    import { page } from '$app/stores';
    import Icon from '@iconify/svelte';
    import { userStore } from "../../stores";

    // Create variable for navbar height
    let navbar_node;
    let navbar_height;
    onMount(() => {
        navbar_height = navbar_node.offsetHeight;
    })

    function disableScroll() {
        if (document.body.scrollHeight > window.innerHeight) {
            originalScrollY = window.scrollY;  // Record the scroll position
            document.body.style.position = 'fixed';
            document.body.style.top = `-${originalScrollY}px`;
            document.body.style.width = '100%';
            document.body.style.overflowY = 'scroll';  // Keep the scrollbar visible
            try {navbar_node.style.top = window.scrollY + "px";} catch(e) {} // Without try catch it stops working at the start
        }
    }

    function enableScroll() {
        document.body.style.position = '';
        document.body.style.top = '';
        document.body.style.width = '';
        document.body.style.overflowY = '';
        window.scrollTo(0, originalScrollY);  // Reset the scroll position
        try {navbar_node.style.top = "0px";} catch (e) {} // Without try catch it stops working at the start
    }

    let navbarTotalTopSpace = 0;
    let navbar;
    let drawer;
    function updateNavbarHeight() {
        const navbarHeight = navbar.offsetHeight; // Get the height of the navbar
        navbarTotalTopSpace = navbarHeight
    }

    function setDrawerPadding() {
        drawer.style.paddingTop = `${navbarTotalTopSpace}px`; // Set the top padding to the navbar height
    }

    // Watch for changes in openMenu and call disable/enableScroll accordingly
    let drawerVisible = false;
    $: if (openMenu) {
        drawerVisible = true;
        disableScroll();
        setDrawerPadding()
    } else {
        enableScroll();
        setTimeout(() => {
            if (!openMenu) {
                drawerVisible = false;
            }
        }, 300)
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

    // Close navbar menu when url changes
    function closeNavbar() {
        drawerVisible = false;
        openMenu = false;
        enableScroll()
    }
    $: $page, closeNavbar();
</script>

<nav bind:this={navbar_node} class="flex justify-center pb-2 lg:pb-4 z-40 fixed w-full">
    <div bind:this={navbar} 
    class="max-w-6xl w-full flex justify-between shadow-sm bg-white pt-4 pb-3.5 md:pt-4.5 md:pb-4 px-4 md:px-8 lg:px-12 xl:px-14 rounded-none lg:rounded-b-lg mx-0 lg:mx-6">
        <div class="flex flex-col justify-center">
            <h2 class="text-primary-gradient font-medium text-lg md:text-xl">Sensopinion</h2>
        </div>
        <ul class="gap-10 xl:gap-12 hidden lg:flex">
            <li class="hover:font-medium text-sm flex flex-col justify-center {$page.url.pathname === '/' ? 'text-primary-gradient font-medium' : ''}">
                <a href="/">Home</a>
            </li>
            <li class="hover:font-medium text-sm flex flex-col justify-center {$page.url.pathname === '/screener' ? 'text-primary-gradient font-medium' : ''}">
                <a href="/screener">Screener</a>
            </li>
            <li class="hover:font-medium text-sm flex flex-col justify-center {$page.url.pathname.includes('/categories') ? 'text-primary-gradient font-medium' : ''}">
                <a href="/categories">Categories</a>
            </li>
            <li class="hover:font-medium text-sm flex flex-col justify-center {$page.url.pathname === '/analyze_your_news' ? 'text-primary-gradient font-medium' : ''}">
                <a href="/analyze_your_news">Analyze Your News</a>
            </li>
            {#if $userStore.user}
                <a href="/user" class="p-0.5">
                    <div class="text-grey-1 ml-1 mb-0.25">
                        {#if $page.url.pathname.includes("/user")}
                            <Icon icon="mdi:account" class="h-5.5 w-5.5"/>
                        {:else}
                            <Icon icon="mdi:account-outline" class="h-5.5 w-5.5"/>
                        {/if}
                    </div>
                </a>
            {:else}
                <li>
                    <a class="btn bg-primary-gradient-opacity-high bg-primary-gradient-opacity-high-inter rounded text-white border shadow-sm hover:shadow px-8 min-h-0 h-8.5 font-normal text-sm"
                    href="/login">Login</a>
                </li>
            {/if}
        </ul>
        <button class="block lg:hidden ham-menu stroke-black{openMenu ? " open" : ""}" on:click={() => {openMenu = !openMenu;}}>
            <svg class="w-7 h-7" viewBox="0 0 100 100">
              <path class="line top" d="M 20,30 H 80"/>
              <path class="line middle" d="M 20,50 H 80" />
              <path class="line bottom" d="M 20,70 H 80"/>
            </svg>
        </button>
    </div>
</nav>
<div style="height: {navbar_height}px;"></div>
<div bind:this={drawer} class="top-0 left-0 w-full h-screen z-30"
    class:fixed={drawerVisible}
    class:hidden={!drawerVisible}>
    <div class={`w-full h-full bg-white fixed z-50 ${openMenu ? 'drawer-enter' : 'drawer-exit drawer-hidden'}`}>
        <ul class="flex flex-col gap-4 px-4 pt-6">
            <li class="text-sm hover:font-medium flex flex-col justify-center hover:shadow px-4 py-3 rounded-md {$page.url.pathname === '/' ? 'text-primary-gradient font-semibold shadow' : 'text-grey-1 shadow-sm'}">
                <a href="/">Home</a>
            </li>
            <li class="text-sm hover:font-medium flex flex-col justify-center hover:shadow px-4 py-3 rounded-md {$page.url.pathname === '/screener' ? 'text-primary-gradient font-semibold shadow' : 'text-grey-1 shadow-sm'}">
                <a href="/screener">Screener</a>
            </li>
            <li class="text-sm hover:font-medium flex flex-col justify-center hover:shadow px-4 py-3 rounded-md {$page.url.pathname.includes('/categories') ? 'text-primary-gradient font-semibold shadow' : 'text-grey-1 shadow-sm'}">
                <a href="/categories">Categories</a>
            </li>
            <li class="text-sm hover:font-medium flex flex-col justify-center hover:shadow px-4 py-3 rounded-md {$page.url.pathname === '/analyze_your_news' ? 'text-primary-gradient font-semibold shadow' : 'text-grey-1 shadow-sm'}">
                <a href="/analyze_your_news">Analyze Your News</a>
            </li>
            <li class="text-sm hover:font-medium flex flex-col justify-center hover:shadow px-4 py-3 rounded-md {$page.url.pathname === '/info/about-us' ? 'text-primary-gradient font-semibold shadow' : 'text-grey-1 shadow-sm'}">
                <a href="/info/about-us">About us</a>
            </li>
            {#if $userStore.user}
            <li class="text-sm hover:font-medium flex flex-col justify-center hover:shadow px-4 py-3 rounded-md {$page.url.pathname === '/user' ? 'text-primary-gradient font-semibold shadow' : 'text-grey-1 shadow-sm'}">
                <a href="/user">Account info</a>
            </li>
            {:else}
                <li class="flex justify-center gap-3 md:gap-5 mt-4">
                    <a class="btn bg-primary-gradient-opacity-high bg-primary-gradient-opacity-high-inter rounded text-white border shadow-sm hover:shadow w-28 md:w-44 min-h-0 h-8.5 font-normal text-sm"
                    href="/login">Login</a>
                    <a class="btn border-grey-2 rounded text-grey-2 border shadow-sm hover:shadow w-28 md:w-44 min-h-0 h-8.5 font-normal text-sm"
                    href="/register">Sign up</a>
                </li>
            {/if}
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


    .line {
        stroke-width: 6;
        stroke-linecap: round;
        transition: all 500ms;
    }
    .top {
        transform-origin: 26px 40px;
    }
    .middle {
        stroke-dasharray: 60 60;
    }
    .bottom {
        transform-origin: 26px 60px;
    }
    .ham-menu.open .top {
        transform: rotate(45deg);
    }
    .ham-menu.open .middle {
        stroke-dasharray: 1 60;
        stroke-dashoffset: -30;
    }
    .ham-menu.open .bottom {
        transform: rotate(-45deg);
    }
</style>
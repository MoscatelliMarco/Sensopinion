<script>
    import { onMount, onDestroy } from "svelte";
    let openMenu = false;
    let originalScrollY;

    // Create variable for navbar height
    let navbar_node;
    let navbar_height;
    onMount(() => {
        navbar_height = navbar_node.offsetHeight;
    })

    function disableScroll() {
        originalScrollY = window.scrollY;  // Record the scroll position
        document.body.style.position = 'fixed';
        document.body.style.top = `-${originalScrollY}px`;
        document.body.style.width = '100%';
        document.body.style.overflowY = 'scroll';  // Keep the scrollbar visible
        try {navbar_node.style.top = window.scrollY + "px";} catch(e) {} // Without try catch it stops working at the start
    }

    function enableScroll() {
        document.body.style.position = '';
        document.body.style.top = '';
        document.body.style.width = '';
        document.body.style.overflowY = '';
        window.scrollTo(0, originalScrollY);  // Reset the scroll position
        try {navbar_node.style.top = "0px";} catch (error) {} // Without try catch it stops working at the start
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

    import { page } from '$app/stores';

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
    class="max-w-6xl w-full flex justify-between shadow-sm bg-white py-5 lg:py-6 px-4 md:px-8 lg:px-12 xl:px-14 rounded-none md:rounded-b-lg mx-0 md:mx-4 lg:mx-6">
        <h2 class="text-primary-gradient font-medium text-xl">Sensopinion</h2>
        <ul class="gap-10 xl:gap-12 hidden lg:flex">
            <li class="hover:font-medium text-sm flex flex-col justify-center {$page.url.pathname === '/' ? 'text-primary-gradient font-medium' : ''}">
                <a href="/">Home</a>
            </li>
            <li class="hover:font-medium text-sm flex flex-col justify-center {$page.url.pathname === '/screener' ? 'text-primary-gradient font-medium' : ''}">
                <a href="/screener">Screener</a>
            </li>
            <li class="hover:font-medium text-sm flex flex-col justify-center {$page.url.pathname === '#' ? 'text-primary-gradient font-medium' : ''}">
                <a href="#">Analyze Your News</a>
            </li>
            <li class="hover:font-medium text-sm flex flex-col justify-center {$page.url.pathname === '#' ? 'text-primary-gradient font-medium' : ''}">
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
<div style="height: {navbar_height}px;"></div>
<div bind:this={drawer} class="top-0 left-0 w-full h-screen z-30"
    class:fixed={drawerVisible}
    class:hidden={!drawerVisible}>
    <div class={`w-full h-full bg-white fixed z-50 ${openMenu ? 'drawer-enter' : 'drawer-exit drawer-hidden'}`}>
        <ul class="flex flex-col gap-4 px-4 pt-6">
            <li class="hover:font-medium flex flex-col justify-center shadow-sm hover:shadow-md px-4 py-3 rounded-md {$page.url.pathname === '/' ? 'text-primary-gradient font-medium' : ''}">
                <a href="/">Home</a>
            </li>
            <li class="hover:font-medium flex flex-col justify-center shadow-sm hover:shadow-md px-4 py-3 rounded-md {$page.url.pathname === '/screener' ? 'text-primary-gradient font-medium' : ''}">
                <a href="/screener">Screener</a>
            </li>
            <li class="hover:font-medium flex flex-col justify-center shadow-sm hover:shadow-md px-4 py-3 rounded-md {$page.url.pathname === '#' ? 'text-primary-gradient font-medium' : ''}">
                <a href="#">Analyze Your News</a>
            </li>
            <li class="hover:font-medium flex flex-col justify-center shadow-sm hover:shadow-md px-4 py-3 rounded-md {$page.url.pathname === '#' ? 'text-primary-gradient font-medium' : ''}">
                <a href="#">About us</a>
            </li>
            <li class="hover:font-medium flex flex-col justify-center shadow-sm hover:shadow-md px-4 py-3 rounded-md {$page.url.pathname === '#' ? 'text-primary-gradient font-medium' : ''}">
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
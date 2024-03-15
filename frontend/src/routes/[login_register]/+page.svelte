<script>
    import { enhance } from "$app/forms";
    import { pushState } from "$app/navigation";
    import { onMount } from "svelte";

    import { slide } from "svelte/transition";
    let login;
    if (window.location.href.includes("login")) {
        login = true;
    } else {
        login = false;
    }


    let is_mounted = false;
    onMount(() => {
        is_mounted = true;
    })

    let first_run = true;
    $: if ((login || !login) && is_mounted) {
        if (!first_run) {
            if (login) {
                pushState(window.location.href.replace("register", "login"), {});
            } else {
                pushState(window.location.href.replace("login", "register"), {});
            }
        } else {
            first_run = false;
        }
    }
</script>

<div class="flex min-h-full flex-col justify-center px-6 py-16 md:py-20 xl:py-24">
    <div class="flex justify-center">
        <button on:click={() => {login = true;}} class="{login ? "bg-primary-gradient-opacity text-white" : "border border-grey-2 text-grey-2"} 
        w-24 py-1.5 rounded-l text-sm">
            Sign in
        </button>
        <button on:click={() => {login = false;}} class="{!login ? "bg-primary-gradient-opacity text-white" : "border border-grey-2 text-grey-2"} 
        w-24 py-1.5 rounded-r text-sm">
            Sign up
        </button>
    </div>
  
    <h3 class="text-center font-medium text-2xl mt-8">
        {login ? "Login into your account" : "Create an account"}
    </h3>

    {#if login}
        <div transition:slide={{duration: 300}} class="sm:mx-auto sm:w-full sm:max-w-sm mt-6">
            <form class="space-y-3" action="?/login" method="POST" use:enhance>
                <div>
                    <label for="email_username" class="block text-sm font-medium leading-6 text-grey-1">Email address or username</label>
                    <div class="mt-1">
                        <input id="email_username" name="email_username" type="text" autocomplete="email" required class="px-2 block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset sm:text-sm sm:leading-6">
                    </div>
                </div>
            
                <div>
                    <div class="flex items-center justify-between">
                    <label for="password" class="block text-sm font-medium leading-6 text-grey-1">Password</label>
                    <div>
                        <a href="#" class="font-semibold text-xs text-primary-gradient">Forgot password?</a>
                    </div>
                    </div>
                    <div class="mt-1">
                        <input id="password" name="password" type="password" autocomplete="current-password" required class="px-2 block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset sm:text-sm sm:leading-6">
                    </div>
                </div>
            
                <div class="pt-3">
                    <button type="submit" class="flex w-full justify-center rounded-md bg-primary-gradient px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2">
                        Sign in
                    </button>
                </div>
            </form>
        </div>
    {:else}
        <div transition:slide={{duration: 300}} class="sm:mx-auto sm:w-full sm:max-w-sm mt-8">
            <form class="space-y-3" action="?/register" method="POST">
                <div class="flex gap-3">
                    <div class="w-full">
                        <label for="first-name" class="block text-sm font-medium leading-6 text-grey-1">First name</label>
                        <div class="mt-1">
                        <input id="first-name" name="first-name" type="text" required class="px-2 block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset sm:text-sm sm:leading-6">
                        </div>
                    </div>
    
                    <div class="w-full">
                        <label for="last-name" class="block text-sm font-medium leading-6 text-grey-1">Last name</label>
                        <div class="mt-1">
                        <input id="last-name" name="last-name" type="text" required class="px-2 block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset sm:text-sm sm:leading-6">
                        </div>
                    </div>
                </div>

                <div>
                    <label for="username" class="block text-sm font-medium leading-6 text-grey-1">Username</label>
                    <div class="mt-1">
                    <input id="username" name="username" type="text" required class="px-2 block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset sm:text-sm sm:leading-6">
                    </div>
                </div>

                <div>
                    <label for="email" class="block text-sm font-medium leading-6 text-grey-1">Email address</label>
                    <div class="mt-1">
                    <input id="email" name="email" type="email" required class="px-2 block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset sm:text-sm sm:leading-6">
                    </div>
                </div>
            
                <div>
                    <div class="flex items-center justify-between">
                        <label for="password" class="block text-sm font-medium leading-6 text-grey-1">Password</label>
                        </div>
                        <div class="mt-1">
                        <input id="password" name="password" type="password" required class="px-2 block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset sm:text-sm sm:leading-6">
                    </div>
                </div>

                <div>
                    <div class="flex items-center justify-between">
                        <label for="confirm_password" class="block text-sm font-medium leading-6 text-grey-1">Confirm password</label>
                        </div>
                        <div class="mt-1">
                        <input id="confirm_password" name="confirm_password" type="password" required class="px-2 block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset sm:text-sm sm:leading-6">
                    </div>
                </div>
            
                <div class="pt-3">
                    <button type="submit" class="flex w-full justify-center rounded-md bg-primary-gradient px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2">
                        Sign up
                    </button>
                </div>
            </form>
        </div>
    {/if}

  </div>
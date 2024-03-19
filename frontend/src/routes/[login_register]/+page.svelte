<script>
    import { pushState } from "$app/navigation";
    import { onMount } from "svelte";
    import LoginForm from "$lib/sections/[login_register]/+page/login_form.svelte";
    import RegisterForm from "$lib/sections/[login_register]/+page/register_form.svelte";
    import { enhance } from "$app/forms";
    export let form;

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
        <LoginForm form={form} />
    {:else}
        <RegisterForm form={form} />
    {/if}

  </div>
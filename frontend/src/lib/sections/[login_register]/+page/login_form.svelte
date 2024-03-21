<script>
    import { enhance } from "$app/forms";
    import { slide, fade } from "svelte/transition";
    import { userSchemaLogin } from "$lib/utils/schemas";

    export let form;

    let emailUsername;
    let password;

    let error = "";
    let submit_button;
    function verifyInput() {
        const resultSchema = userSchemaLogin.validate({emailUsername: emailUsername, password: password});
        if (resultSchema.error) {
            error = resultSchema.error.details[0].message;
        } else {
            submit_button.click();
        }
    }
</script>

<div transition:slide={{duration: 300}} class="sm:mx-auto sm:w-full sm:max-w-sm mt-6">
    <form class="space-y-3" action="?/login" method="POST" use:enhance>
        <div>
            <label for="email-username" class="block text-sm font-medium leading-6 text-grey-1">Email address or username</label>
            <div class="mt-1">
                <input bind:value={emailUsername} id="email-username" name="email-username" type="text" autocomplete="email" class="px-2 block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset sm:text-sm sm:leading-6">
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
                <input bind:value={password} id="password" name="password" type="password" autocomplete="current-password" class="px-2 block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset sm:text-sm sm:leading-6">
            </div>
        </div>
    
        <div class="pt-3">
            <button on:click={verifyInput} type="submit" class="flex w-full justify-center rounded-md bg-primary-gradient px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2">
                Sign in
            </button>
        </div>

        <button bind:this={submit_button} aria-hidden="true" class="hidden" type="submit"></button>

        {#if error || form?.error}
            <div transition:slide={{duration: 150}} class="flex justify-center mx-4">
                <p transition:fade={{duration: 200}} class="text-center text-error font-medium text-sm">{error ? error : (form ? form.error : "")}</p>
            </div>
        {/if}
    </form>
</div>
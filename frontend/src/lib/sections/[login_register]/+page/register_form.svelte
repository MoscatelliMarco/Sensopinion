<script>
    import { enhance } from "$app/forms";
    import { slide, fade } from "svelte/transition";
    import { userSchema } from "$lib/utils/schemas";

    export let form;

    let firstName;
    let lastName;
    let username;
    let email;
    let password;
    let confirmPassword;

    let error = "";
    let submit_button;
    function verifyInput() {
        const resultSchema = userSchema.validate({firstName: firstName, lastName: lastName, username: username, email: email, password: password, confirmPassword: confirmPassword});
        if (resultSchema.error) {
            error = resultSchema.error.details[0].message;
        } else {
            submit_button.click();
        }
    }
</script>

<div transition:slide={{duration: 300}} class="sm:mx-auto sm:w-full sm:max-w-sm mt-8">
    <form id="register-form" class="space-y-3" action="?/register" method="POST" use:enhance>
        <div class="flex gap-3">
            <div class="w-full">
                <label for="first-name" class="block text-sm font-medium leading-6 text-grey-1">First name</label>
                <div class="mt-1">
                    <input bind:value={firstName} id="first-name" name="first-name" type="text" class="px-2 block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset sm:text-sm sm:leading-6">
                </div>
            </div>

            <div class="w-full">
                <label for="last-name" class="block text-sm font-medium leading-6 text-grey-1">Last name</label>
                <div class="mt-1">
                    <input bind:value={lastName} id="last-name" name="last-name" type="text" class="px-2 block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset sm:text-sm sm:leading-6">
                </div>
            </div>
        </div>

        <div>
            <label for="username" class="block text-sm font-medium leading-6 text-grey-1">Username</label>
            <div class="mt-1">
                <input bind:value={username} id="username" name="username" type="text" class="px-2 block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset sm:text-sm sm:leading-6">
            </div>
        </div>

        <div>
            <label for="email" class="block text-sm font-medium leading-6 text-grey-1">Email address</label>
            <div class="mt-1">
                <input bind:value={email} id="email" name="email" type="text" class="px-2 block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset sm:text-sm sm:leading-6">
            </div>
        </div>
    
        <div>
            <div class="flex items-center justify-between">
                <label for="password" class="block text-sm font-medium leading-6 text-grey-1">Password</label>
            </div>
            <div class="mt-1">
                <input bind:value={password} id="password" name="password" type="password" class="px-2 block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset sm:text-sm sm:leading-6">
            </div>
        </div>

        <div>
            <div class="flex items-center justify-between">
                <label for="confirm-password" class="block text-sm font-medium leading-6 text-grey-1">Confirm password</label>
            </div>
            <div class="mt-1">
                <input bind:value={confirmPassword} id="confirm-password" name="confirm-password" type="password" class="px-2 block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset sm:text-sm sm:leading-6">
            </div>
        </div>
    
        <div class="pt-3">
            <button on:click={verifyInput} type="button" class="flex w-full justify-center rounded-md bg-primary-gradient px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2">
                Sign up
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
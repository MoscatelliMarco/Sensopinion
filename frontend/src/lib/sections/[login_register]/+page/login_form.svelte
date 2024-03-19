<script>
    import { enhance } from "$app/forms";
    import { slide } from "svelte/transition";
    import { userSchemaLogin } from "$lib/utils/schemas";
    import { deserialize } from '$app/forms';
    import { flashMessageStore } from "../../../../stores";

    export let form;

    let emailUsername;
    let password;

    // let error = "";
    // async function handleSubmit(event) {
    //     event.preventDefault();

    //     const resultSchema = userSchemaLogin.validate({emailUsername: emailUsername, password: password})
    //     if (resultSchema.error) {
    //         error = resultSchema.error.details[0].message;
    //         let cache_error = error;
    //         setTimeout(() => {
    //             if (cache_error == error) {
    //                 error = ""
    //             }
    //         }, 4000)
    //     } else {
    //         const data = new FormData(event.currentTarget);
    //         const response = await fetch(event.currentTarget.action, {
    //             method: 'POST',
    //             body: data
    //         });
    //         const result = deserialize(await response.text());
    //         if (result.type == 'failure') {
    //             error = result.data.error;

    //             let cache_error = error;
    //             setTimeout(() => {
    //                 if (cache_error == error) {
    //                     error = ""
    //                 }
    //             }, 4000)
    //         } else {
    //             let intervalId;
    //             function flashInterval(intervalId) {
    //                 if (window.location.pathname === '/') {
    //                     flashMessageStore.set("Welcome back, we are happy to have you here again");
    //                     clearInterval(intervalId);
    //                 }
    //             }
    //             intervalId = setInterval(() => {flashInterval(intervalId)}, 100)
    //         }
    //     }
    // }
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
            <button type="submit" class="flex w-full justify-center rounded-md bg-primary-gradient px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2">
                Sign in
            </button>
        </div>

        <div class="flex justify-center mx-4">
            <p class="text-center text-error font-medium text-sm">{form ? form.error : ""}</p>
        </div>
    </form>
</div>
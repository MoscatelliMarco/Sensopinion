<script>
    import { userStore, flashMessageStore } from "../../../stores";
    import { enhance } from "$app/forms";
    import { goto } from "$app/navigation";
    export let data;
    const is_verified = data['props']['is_verified'];

    export let form;

    $: if (form?.success) {
        // goto("/");
        // let intervalId;
        // function flashInterval(intervalId) {
        //     if (window.location.pathname === '/') {
        //         flashMessageStore.set("We sent another authentication email, check your inbox");
        //         clearInterval(intervalId);
        //     }
        // }
        // intervalId = setInterval(() => {flashInterval(intervalId)}, 100)
    }
</script>

<div class="mt-16 text-center">
    {#if is_verified}
        <div class="flex flex-col gap-2 justify-center items-center">
            <p class="text-primary-gradient text-2xl font-semibold">Congratulations!</p>
            <p class="text-grey-2 text-sm">You are now a verified user</p>
        </div>
    {:else}
        <div class="flex justify-center">
            <p class="text-error text-lg font-medium bg-error bg-opacity-20 px-28 py-3 rounded">
                Token invalid or expired
            </p>
        </div>
        {#if $userStore.user && !$userStore.user.verified}
            <form class="flex flex-col items-center gap-1 mt-10" action="#" method="POST" use:enhance>
                <p class="text-center text-grey-1 font-medium">Want another code?</p>
                <button class="px-8 py-2 bg-primary-gradient-opacity text-white rounded font-semibold">Send another code</button>
            </form>
            <div class="flex justify-center mx-4">
                <p class="text-center text-error font-medium text-sm">{form?.error ? form.error : ""}</p>
            </div>
        {/if}
    {/if}
</div>
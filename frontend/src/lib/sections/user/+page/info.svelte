<script>
    import { enhance } from "$app/forms";
    import { flashMessageStore } from "../../../../stores";
    
    export let user;

    async function handleSubmitSignOut() {
        let intervalId;
        function flashInterval(intervalId) {
            if (window.location.pathname === '/') {
                flashMessageStore.set("Goodbye, we hope to see you soon again!");
                clearInterval(intervalId);
            }
        }
        intervalId = setInterval(() => {flashInterval(intervalId)}, 100)
    }
</script>


<div class="flex flex-col gap-4">
    <div class="grid grid-cols-2 w-64 items-end">
        <p class="text-grey-2 text-sm font-medium mb-0.25">First name</p>
        <p class="text-lg text-grey-1">{user['firstName']}</p>

        <p class="text-grey-2 text-sm font-medium mb-0.25">Last name</p>
        <p class="text-lg text-grey-1">{user['lastName']}</p>

        <p class="text-grey-2 text-sm font-medium mb-0.25">Email</p>
        <p class="text-lg text-grey-1">{user['email']}</p>

        <p class="text-grey-2 text-sm font-medium mb-0.25">Date creation</p>
        <p class="text-lg text-grey-1">{user['dateCreated'].toLocaleDateString(undefined, { day: 'numeric', month: 'numeric', year: 'numeric' })}</p>
    </div>
    <div class="flex gap-4">
        {#if user.admin}
            <a href="/user/admin" class="border-info border rounded-md text-sm px-3 py-1.5 text-info">
                Admin panel
            </a>
        {/if}
        <button class="border-error border rounded-md text-sm px-3 py-1.5 text-error" onclick="signOutModal.showModal()">
            Sign out
        </button>
    </div>
    <dialog id="signOutModal" class="modal">
        <div class="modal-box">
            <form use:enhance on:submit={handleSubmitSignOut} class="flex flex-col gap-5" method="POST" action="?/signOut">
                <p class="text-center">Are you sure you want to sign out?</p>
                <div class="flex gap-4 w-full">
                    <button on:click={() => {
                        document.querySelector("#close-signout-modal").click();
                    }} type="button" class="py-1 w-full text-white bg-error rounded-md">Cancel</button>
                    <button type="submit" class="border-error border rounded-md w-full text-sm py-1 text-error">Confirm</button>
                </div>
            </form>
        </div>
        <form method="dialog" class="modal-backdrop">
            <button id="close-signout-modal">close</button>
        </form>
    </dialog>
</div>
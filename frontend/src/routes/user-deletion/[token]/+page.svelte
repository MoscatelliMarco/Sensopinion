<script>
    import { userStore } from '../../../stores.js';

    export let data;
    const is_deleted = data['props']['is_deleted'];

    $: if (is_deleted) {
        userStore.update(store => {
            store.user = null;
            store.session = null;
            return store;
        })
    }
</script>

<div class="mt-16 text-center">
    {#if is_deleted}
        <div class="flex flex-col gap-2 justify-center items-center">
            <p class="text-primary-gradient text-2xl font-semibold">We are sorry that you had to delete this account</p>
            <p class="text-grey-2 text-sm">We hope to see you again in case you change your mind :)</p>
        </div>
    {:else}
        <div class="flex justify-center">
            <p class="text-error text-lg font-medium bg-error bg-opacity-20 px-28 py-3 rounded">
                Token invalid or expired
            </p>
        </div>
    {/if}
</div>
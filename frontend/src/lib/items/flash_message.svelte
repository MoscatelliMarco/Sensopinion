<script>
    import { flashMessageStore } from "../../stores";
    import { slide } from "svelte/transition";

    export let message = "";
    $: if ($flashMessageStore) {
        message = $flashMessageStore;
        flashMessageStore.set("");
    }
</script>

{#if message}
    <div transition:slide={{duration: 300}} class="pt-2">
        <div class="flex items-center justify-between gap-2 bg-info bg-opacity-20 border border-info px-4 py-2.5 rounded text-info-dark">
            <p>{message}</p>
            <button on:click={() => {message = "";}} class="flex-col justify-center">
                <svg class="w-4 h-4 text-info-dark" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" {...$$props}>
                    <path fill="none" stroke="currentColor" stroke-linecap="round" stroke-width="2.75" d="M20 20L4 4m16 0L4 20" />
                </svg>
            </button>
        </div>
    </div>
{/if}
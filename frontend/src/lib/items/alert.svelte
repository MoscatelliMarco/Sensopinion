<script>
    export let message;
    export let type = "warning";
    export let show_x = true;

    let closed = false;
</script>

{#if !closed}
    <div class="absolute top-4 w-full flex justify-center z-50">
        <div class="max-w-lg md:max-w-3xl lg:max-w-5xl xl:max-w-6xl px-2 md:px-4 lg:px-6 bg-white break-words w-full rounded-md border-2 border-{type} bg-opacity-90">
            <div class="flex justify-between bg-{type} gap-2 py-3 px-4 bg-opacity-30">
                <div class="flex flex-col justify-center">
                    <p>{message}</p>
                </div>
                <button on:click={() => {closed = true;}} class="{show_x ? "flex" : "hidden"} flex-col justify-center">
                    <svg class="w-4 h-4 text-black" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" {...$$props}>
                        <path fill="none" stroke="currentColor" stroke-linecap="round" stroke-width="2.75" d="M20 20L4 4m16 0L4 20" />
                    </svg>
                </button>
            </div>
        </div>
    </div>
{/if}
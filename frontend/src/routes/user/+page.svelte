<script>
    import { onMount } from "svelte";
    import { pushState } from "$app/navigation";

    import Info from "$lib/sections/user/+page/info.svelte";
    import History from "$lib/sections/user/+page/history.svelte";

    export let data;
    const user = data['props']['user'];

    let current_page;

    let first_iter = true;
    $: if (current_page) {
        if (!first_iter) {
            const new_url = new URL(window.location.href);
            const new_url_params = new URLSearchParams(new_url);
            new_url_params.set("current_page", current_page)
            new_url.search = new_url_params;
            pushState(new_url.toString(), {});
        }

        first_iter = false;
    }

    onMount(() => {

        const starting_url = new URL(window.location.href);
        const startin_url_params = new URLSearchParams(starting_url.search);
        const starting_page = startin_url_params.get("current_page")

        if (starting_page !== "info" && starting_page) {
            current_page = starting_page;
        }

        window.addEventListener('popstate', () => {
            const url = new URL(window.location.href);
            const params = new URLSearchParams(url.search);
            const page = params.get("current_page")
            current_page = page;
        });
    })
</script>

<div class="rounded inline-block border border-grey-1 text-grey-1 px-5 py-1.5 mt-2">
    <div class="flex gap-2 px-3 items-end">
        <p class="text-grey-2 text-sm">Visiting</p>
        <select bind:value={current_page} class="focus:outline-none font-medium pr-1">
            <option selected value="info">info</option>
            <option value="history">history</option>
        </select>
    </div>
</div>

<div class="mt-6">
    {#if current_page == "info"}
        <Info user={user} />
    {:else if current_page == 'history'}
        <History />
    {/if}
</div>
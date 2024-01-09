<script>
    import { page } from '$app/stores';
</script>

<div class="flex flex-col items-center mt-16 md:mt-20 lg:mt-24 xl:mt-28 text-center gap-2 lg:gap-4">
    <p class="w-72 text-light italic">Oooh, looks like you have encountered an error, we are sorry about that</p>
    <div class="flex flex-col gap-0 lg:gap-0.5">
        <h1 class="text-primary-gradient text-8xl font-bold">{$page.status}</h1>
        {#if $page.error.message}
            <p class="text-sm">{$page.error.message}</p>
        {/if}
    </div>
</div>
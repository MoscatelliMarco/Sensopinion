<script>
    export let id;
    export let url;

    let imageError = false;
</script>

<a href="/redirect/{id}" target="_blank" class="overflow-hidden w-full h-52 lg:h-56 border-x border-t">
    {#if !imageError}
        <img src="{url}" alt="thumbnail of news article" class="object-cover w-full h-full rounded-t-sm card-images" on:error={() => {imageError = true;}}/>
    {:else}
        <div class="grid place-items-center h-full">
            <p class="text-sm font-light">Couldn't load the image</p>
        </div>
    {/if}
</a>
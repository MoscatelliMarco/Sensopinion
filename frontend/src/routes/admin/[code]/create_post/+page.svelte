<script>
    import { onMount } from "svelte";
    import * as htmlToImage from 'html-to-image';
    import MostXNews from "../../../../lib/items/admin/most_x_news.svelte";

    let html_post;
    let post_type_value;
    let post_type = null;

    function downloadPost () {

        htmlToImage.toJpeg(html_post, {quality: 1})
        .then(function (dataUrl) {
            var link = document.createElement('a');
            link.download = 'media_post.jpeg';
            link.href = dataUrl;
            link.click();
            link.remove()
        })
        .catch(function (error) {
            console.error('oops, something went wrong!', error);
        });
    }

    let required_parameters = {}
    let parameters = {}
    const requiredParameters = (template_required_parameters) => {
        required_parameters = template_required_parameters;
    }
</script>

<div class="flex flex-col gap-2">
    <h5 class="text-lg">Options</h5>
    <div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
        <select on:change={() => {post_type_value = post_type['value'];}} bind:this={post_type} >
            <option disabled selected>-- select a post type --</option>
            <option value="most_x_news">Most x news</option>
            <option value="most_x_categories">Most x categories</option>
        </select>
    </div>
</div>

<div class="flex justify-center mt-4">
    <button on:click={downloadPost} class="btn min-h-0 h-10 px-3 bg-primary-gradient text-white">
        Download
    </button>
</div>

<div class="overflow-x-auto mt-4">
    <div style="width: calc(1080px + 20px);" class="bg-warning p-2.5">
        <div bind:this={html_post} style="width: 1080px; height: 1080px;" class="bg-white">
            {#if post_type_value == 'most_x_news'}
                <MostXNews parameters={parameters} requiredParameters={requiredParameters}/>
            {:else}
                <div class="w-full h-full"></div>
            {/if}
        </div>
    </div>
</div>
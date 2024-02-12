<script>
    import { onMount } from "svelte";
    import * as htmlToImage from 'html-to-image';

    let html_post;

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
</script>

<div class="overflow-x-auto">
    <div style="width: calc(1080px + 20px);" class="bg-warning p-2.5">
        <div bind:this={html_post} style="width: 1080px; height: 1080px;" class="bg-white">
            <p>Lorem Ipsum</p>
        </div>
    </div>
</div>

<div class="flex justify-center">
    <button on:click={downloadPost} class="btn min-h-0 h-10 px-3 bg-primary-gradient text-white">
        Download
    </button>
</div>
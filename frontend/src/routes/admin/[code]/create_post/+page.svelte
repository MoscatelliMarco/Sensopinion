<script>
    import * as htmlToImage from 'html-to-image';
    import MostXNews from "../../../../lib/items/admin/most_x_news.svelte";

    let html_post;
    let post_type_value;
    let post_type = null;
    let output_filename;

    function downloadPost () {
        htmlToImage.toJpeg(html_post, {quality: 1, useCORS: true})
        .then(function (dataUrl) {
            var link = document.createElement('a');
            link.download = (output_filename.value ? output_filename.value : "sensopinion_media") + '.jpeg';
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

    $: if (post_type_value) {
        setTimeout(() => {
            const parameterInputs = document.querySelectorAll('.parameter-input')
            for (let parameterInput of parameterInputs) {
                if (parameterInput.type == 'select-one') {
                    parameterInput.addEventListener("change", () => {
                        parameters[parameterInput.name] = parameterInput.value; 
                    })
                } else if (parameterInput.type == 'text') {
                    parameterInput.addEventListener("keyup", () => {
                        parameters[parameterInput.name] = parameterInput.value;
                    })
                } else if (parameterInput.type == 'range') {
                    parameterInput.addEventListener("change", () => {
                        parameters[parameterInput.name] = parameterInput.value;
                    })
                }      
            }
        }, 100)
    }

    export let data;
    const news_articles = data['props']['news_articles'];
</script>

<div class="flex flex-col gap-4">
    <h5 class="text-lg">Options</h5>
    <div class="flex flex-col gap-3">
        <div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-4">
            <select on:change={() => {post_type_value = post_type['value'];}} bind:this={post_type} class="border rounded-md p-1" >
                <option disabled selected>-- select a post type --</option>
                <option value="most_x_news">Most x news</option>
                <option value="most_x_categories">Most x categories</option>
            </select>
            <input class="px-2 border rounded-md" bind:this={output_filename} placeholder="filename">
        </div>
        <div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-4 gap-y-2">
            {#each Object.keys(required_parameters) as parameter}
                {#if Array.isArray(required_parameters[parameter])}
                    <select name="{parameter}" class="parameter-input border rounded-md p-1">
                        <option disabled selected>-- select {parameter} --</option>
                        {#each required_parameters[parameter] as option}
                            <option value="{option}">{option}</option>
                        {/each}
                    </select>
                {:else if required_parameters[parameter] == 'string'}
                    <input name="{parameter}" type="text" placeholder="{parameter}" class="parameter-input px-2 border rounded-md">
                {:else if required_parameters[parameter]['range']}
                    <div class="flex flex-col justify-center">
                        <input name="{parameter}" type="range" min="{required_parameters[parameter]['range'][0]}" max="{required_parameters[parameter]['range'][1]}" value="{(required_parameters[parameter]['range'][0] + required_parameters[parameter]['range'][1]) / 2}" 
                        class="parameter-input range range-info border"/>
                    </div>
                {/if}
            {/each}
        </div>
    </div>
</div>

<div class="flex justify-center mt-4">
    <button on:click={downloadPost} class="btn min-h-0 h-10 px-3 bg-primary-gradient text-white">
        Download
    </button>
</div>

<div class="flex justify-center">
    <div class="overflow-x-auto mt-4">
        <div style="width: calc(1080px + 20px);" class="bg-warning p-2.5">
            <div bind:this={html_post} style="width: 1080px; height: 1080px;" class="bg-white">
                {#if post_type_value == 'most_x_news'}
                    <MostXNews parameters={parameters} requiredParameters={requiredParameters} news_articles={news_articles}/>
                {:else}
                    <div class="w-full h-full"></div>
                {/if}
            </div>
        </div>
    </div>
</div>
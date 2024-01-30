<script>
    import DynamicRadio from "../../items/dynamic_radio.svelte";
    import { globalStore } from "../../../stores";

    export let data;
</script>

<h6 class="text-5xl font-medium text-center">
    Your text is <span class="text-primary-gradient">analyzed</span>!
</h6>
<div class="w-full max-w-lg flex flex-col gap-2 mt-6">
    <div class="flex justify-center font-medium">
        <p>Positivity and Subjectivity</p>
    </div>
    <div class="flex gap-8 px-32">
        {#each Object.keys(data[1]) as emotion}
            <DynamicRadio value={(emotion == 'polarity' || emotion == 'subjectivity' ? $globalStore.stretchFunction(data[1][emotion]) : data[0][emotion]) * 100} name={emotion} />
        {/each}
    </div>
    <div class="flex justify-center font-medium mt-4">
        <p>Emotions</p>
    </div>
    <div class="flex gap-8">
        {#each Object.keys(data[0]).slice(0, 4) as emotion}
            <DynamicRadio value={(emotion == 'polarity' || emotion == 'subjectivity' ? $globalStore.stretchFunction(data[1][emotion]) : data[0][emotion]) * 100} name={emotion} />
        {/each}
    </div>
    <div class="flex gap-8 px-18 mt-neg-2">
        {#each Object.keys(data[0]).slice(4) as emotion}
            <DynamicRadio value={(emotion == 'polarity' || emotion == 'subjectivity' ? $globalStore.stretchFunction(data[1][emotion]) : data[0][emotion]) * 100} name={emotion} />
        {/each}
    </div>
    <div class="flex justify-center font-medium mt-6">
        <p>Categories</p>
    </div>
    <div class="flex gap-4 justify-center">
        {#if data[2].includes("Politics")}
            <a href="/categories/politics" class="bg-white text-lg rounded-md p-1.5 shadow-sm hover:shadow-md">
            ⚖️
            </a>
        {/if}
        {#if data[2].includes("Economy")}
            <a href="/categories/economy" class="bg-white text-lg rounded-md p-1.5 shadow-sm hover:shadow-md">
            💵
            </a>
        {/if}
        {#if data[2].includes("Environment")}
            <a href="/categories/environment" class="bg-white text-lg rounded-md p-1.5 shadow-sm hover:shadow-md">
            🍃
            </a>
        {/if}
        {#if data[2].includes("Others")}
            <p class="bg-white rounded-md px-2.5 py-1.5 shadow-sm text-sm">
            Others
            </p>
        {/if}
    </div>
</div>
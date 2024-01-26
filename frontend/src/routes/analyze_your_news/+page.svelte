<script>
    let mode_text = true;
</script>
<div class="w-full flex justify-center mt-10 md:mt-12 lg:mt-16 xl:mt-20">
    <div class="max-w-3xl flex flex-col w-full">
        <div class="flex justify-center">
            <button on:click={() => {mode_text = !mode_text}} class="{mode_text ? "bg-primary-gradient-opacity text-white" : "text-black"} w-24 py-1 text-xs
              border-neutral rounded-tl-md border-x border-t">
                Text
            </button>
            <button on:click={() => {mode_text = !mode_text}} class="{!mode_text ? "bg-primary-gradient-opacity text-white" : "text-black"} w-24 py-1 text-xs
              border-neutral rounded-tr-md border-r border-t">
                Url
            </button>
        </div>
        <div class="{mode_text ? "h-72 md:h-124 lg:h-160" : ""} w-full border border-neutral rounded-sm">
            {#if mode_text}
                <textarea placeholder="Text to analyse" class="text-sm md:text-base px-2.5 py-1.5 w-full h-full resize-none overflow-y-auto focus:border-none focus:outline-none"></textarea>
            {:else}
                <input type="text" placeholder="Url to analyse" class="text-sm md:text-base px-2.5 py-1.5 w-full focus:border-none focus:outline-none">
            {/if}
        </div>
        <div class="flex justify-center">
            <button class="bg-primary-gradient text-white
                border-neutral rounded-b-md border-b border-x px-14 py-1.5 font-medium text-sm">
                  Analyze
            </button>
        </div>
    </div>
</div>
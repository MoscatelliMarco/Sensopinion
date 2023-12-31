<script>
    let ascending = false;
</script>
<div class="absolute top-0 left-0 flex flex-col gap-8 p-5 w-64 h-full bg-white">
    <div class="flex flex-col gap-4">
        <p class="font-semibold text-xl">Sort by</p>
        <div class="flex justify-between items-center">
            <select class="w-36 text-sm rounded-none p-0 bg-white">
                <option>Date</option>
                <option>Anger</option>
                <option>Neutral</option>
                <option>Subjectivity</option>
                <option>Sentiment</option>
            </select>
            <button on:click={() => {ascending = !ascending}}>
                {#if !ascending}
                    <svg xmlns="http://www.w3.org/2000/svg" class="w-6 stroke-black" viewBox="0 0 24 24" fill="none">
                        <path d="M13 12H21M13 8H21M13 16H21M6 7V17M6 17L3 14M6 17L9 14" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                    </svg>
                {:else}
                    <svg xmlns="http://www.w3.org/2000/svg" class="w-6 stroke-black" viewBox="0 0 24 24" fill="none">
                        <path d="M13 12H21M13 8H21M13 16H21M6 7V17M6 7L3 10M6 7L9 10" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                    </svg>
                {/if}
            </button>
        </div>
    </div>
</div>
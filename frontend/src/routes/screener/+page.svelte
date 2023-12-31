<script>
    import NewsDisplay from '$lib/sections/screener/+page/news_display.svelte';
    export let data;
    let news_articles = data['props']['data']

    let filterActive = false;
</script>

<div class="flex">
    <div class="flex items-start">
        <button on:click={() => {filterActive = !filterActive}}>
            <svg xmlns="http://www.w3.org/2000/svg" class="w-8 stroke-black" viewBox="0 0 24 24" fill="none">
                <path d="M3 4.6C3 4.03995 3 3.75992 3.10899 3.54601C3.20487 3.35785 3.35785 3.20487 3.54601 3.10899C3.75992 3 4.03995 3 4.6 3H19.4C19.9601 3 20.2401 3 20.454 3.10899C20.6422 3.20487 20.7951 3.35785 20.891 3.54601C21 3.75992 21 4.03995 21 4.6V6.33726C21 6.58185 21 6.70414 20.9724 6.81923C20.9479 6.92127 20.9075 7.01881 20.8526 7.10828C20.7908 7.2092 20.7043 7.29568 20.5314 7.46863L14.4686 13.5314C14.2957 13.7043 14.2092 13.7908 14.1474 13.8917C14.0925 13.9812 14.0521 14.0787 14.0276 14.1808C14 14.2959 14 14.4182 14 14.6627V17L10 21V14.6627C10 14.4182 10 14.2959 9.97237 14.1808C9.94787 14.0787 9.90747 13.9812 9.85264 13.8917C9.7908 13.7908 9.70432 13.7043 9.53137 13.5314L3.46863 7.46863C3.29568 7.29568 3.2092 7.2092 3.14736 7.10828C3.09253 7.01881 3.05213 6.92127 3.02763 6.81923C3 6.70414 3 6.58185 3 6.33726V4.6Z" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
        </button>
        <div class="h-64 bg-white filter-menu overflow-hidden relative" class:w-0={!filterActive} class:w-64={filterActive}>
            <div class="absolute top-0 left-0 flex flex-col p-5 w-64">
                <h6 class="font-medium text-lg">Topics</h6>
                <div class="flex flex-col">
                    <div class="flex justify-between">
                        <label for="finance_checkbox">Finance</label>
                        <input type="checkbox" id="finance_checkbox" class="checkbox checkbox-info checkbox-sm"/>
                    </div>
                    <button class="text-sm">
                        Show more
                    </button>
                </div>
            </div>
        </div>
    </div>
   <div>
        <NewsDisplay news_articles={news_articles}/>
   </div>
</div>

<style>
    .filter-menu {
        transition: width 1s;
    }
</style>
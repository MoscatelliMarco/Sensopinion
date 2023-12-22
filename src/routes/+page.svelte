<script>
    import RadialProgress from "../lib/items/radial_progress.svelte"
    import SubCategories from "../lib/sections/subcategories_index.svelte"
    import TryScreener from "../lib/sections/try_screener.svelte"

    let category_type = null;
    function show_more (event) {
        if (category_type != event.target.dataset['category_type']) {
            category_type = event.target.dataset['category_type']
        } else {
            category_type = null
        }
    }
</script>

<div class="flex flex-col gap-52">

    <section class="flex justify-between gap-24 mt-16">
        <div class="flex flex-col justify-center gap-10">
            <div class="flex flex-col gap-6">
                <h1 class="font-bold text-6xl max-w-2xl">
                    Analyze <span class="text-primary-gradient">Emotions</span> At The Speed Of Light
                </h1>
                <h3 class="font-thin max-w-lg">
                    Understand what people think on the news and social media without reading tons of boring articles
                </h3>
            </div>
            <div class="flex gap-8">
                <button class="w-48 py-3 text-sm rounded-md bg-primary-gradient font-semibold text-white hover:brightness-105 btn">TRY OUR SCREENER</button>
                <div class="dropdown">
                    <div tabindex="0" class="w-48 py-3 text-sm rounded-md border-2 border-neutral text-neutral hover:border-neutral-dark hover:text-neutral-dark btn font-light text-md">Try a different emotion</div>
                    <ul tabindex="0" class="p-2 shadow menu dropdown-content z-[1] rounded-lg font-light hover:font-regular text-sm flex flex-col gap-1 px-4 py-3 w-48">
                      <li><button class="bg-primary-gradient-opacity bg-primary-gradient-opacity-inter text-white">Positivity</button></li>
                      <li><button class="hover:bg-neutral-light">Fear</button></li>
                      <li><button class="hover:bg-neutral-light">Anger</button></li>
                      <li><button class="hover:bg-neutral-light">Disgust</button></li>
                    </ul>
                </div>
            </div>
        </div>
        <div class="flex flex-col justify-center gap-3 mt-6">
            <RadialProgress name="all" value=78.4 font_size=48 font_weight=700 size=420 thickness=28/>
            <h5 class="text-center text-sm font-light">*Positivity on news</h5>
        </div>
    </section>
    
    <section class="flex flex-col gap-16">
        <div class="text-center flex flex-col gap-8">
            <h2 class="font-semibold text-4xl">What People Think About</h2>
            <div class="flex justify-between xl:mx-16">
                <div class="flex flex-col justify-center gap-6">
                    <a href="#" class="flex flex-col gap-4">
                        <h4 class="font-medium text-center text-2xl">Politics</h4>
                        <RadialProgress name="politics" font_size=32 font_weight=700 value=25 size=250 thickness=18/>
                    </a>
                    <div class="flex justify-center">
                        <button on:click={show_more} data-category_type="politics" class="btn w-32 text-xs min-h-0 h-10 items-center rounded-md"
                        class:bg-primary-gradient = {category_type == 'politics'}
                        class:text-white = {category_type == 'politics'}>{#if category_type == 'politics'}Show less{:else}Show more{/if}</button>
                    </div>
                </div>
                <div class="flex flex-col justify-center gap-6">
                    <a href="#" class="flex flex-col gap-4">
                        <h4 class="font-medium text-center text-2xl">Economy</h4>
                        <RadialProgress name="economics" font_size=32 font_weight=700 value=97 size=250 thickness=18/>
                    </a>
                    <div class="flex justify-center">
                        <button on:click={show_more} data-category_type="economy" class="btn w-32 text-xs min-h-0 h-10 items-center rounded-md"
                        class:bg-primary-gradient = {category_type == 'economy'}
                        class:text-white = {category_type == 'economy'}>{#if category_type == 'economy'}Show less{:else}Show more{/if}</button>
                    </div>
                </div>
                <div class="flex flex-col justify-center gap-6">
                    <a href="#" class="flex flex-col gap-4">
                        <h4 class="font-medium text-center text-2xl">Environment</h4>
                        <RadialProgress name="environment" font_size=32 font_weight=700 value=6 size=250 thickness=18/>
                    </a>
                    <div class="flex justify-center">
                        <div class="flex justify-center">
                            <!-- bg-primary-gradient font-medium text-white hover:brightness-105 -->
                            <button on:click={show_more} data-category_type="environment" 
                            class="btn w-32 text-xs min-h-0 h-10 items-center rounded-md"
                            class:bg-primary-gradient = {category_type == 'environment'}
                            class:text-white = {category_type == 'environment'}>{#if category_type == 'environment'}Show less{:else}Show more{/if}</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        {#if category_type}
            <SubCategories category_type={category_type} />
        {/if}
    </section>

    <TryScreener />

    <section class="flex flex-col gap-16">
        <div class="flex justify-center">
            <h4 class="text-5xl font-semibold">Recent News</h4>
        </div>
        <div class="grid grid-cols-2 gap-8">
            <div class="card">
                <figure><img src="https://daisyui.com/images/stock/photo-1606107557195-0e29a4b5b4aa.jpg" alt="car!"/></figure>
                <div class="card-body">
                  <h2 class="card-title">Life hack</h2>
                  <p>How to park your car at your garage?</p>
                  <div class="card-actions justify-end">
                    <button class="btn">Learn now!</button>
                  </div>
                </div>
            </div>
            <div class="card">
                <figure><img src="https://daisyui.com/images/stock/photo-1606107557195-0e29a4b5b4aa.jpg" alt="car!"/></figure>
                <div class="card-body">
                  <h2 class="card-title">Life hack</h2>
                  <p>How to park your car at your garage?</p>
                  <div class="card-actions justify-end">
                    <button class="btn">Learn now!</button>
                  </div>
                </div>
            </div>
        </div>
        <div class="flex justify-center">
            <button class="btn bg-primary-gradient-opacity bg-primary-gradient-opacity-inter px-8 h-6 border-0 text-white">Load more</button>
        </div>
    </section>

</div>
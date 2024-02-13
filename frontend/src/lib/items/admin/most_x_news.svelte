<script>
    import { globalStore } from "../../../stores";

    const all_categories = $globalStore.categories;
    let categories_parameter = [];
    for (let category in all_categories) {
        categories_parameter.push(category)
        for (let subcategory of all_categories[category]) {
            categories_parameter.push(subcategory.toLowerCase().replaceAll(" ", "_") + "_" + category)
        }
    }

    const factors = $globalStore.emotion_dict;
    const factors_parameter = [...Object.keys(factors)]
    factors_parameter.push('positivity')
    factors_parameter.push('subjectivity')

    export let parameters;
    export let requiredParameters;

    const news = $globalStore.news;

    requiredParameters({
        "category": categories_parameter,
        "factor": factors_parameter,
        "ascending": ["ascending", "descending"],
        "factor_name": "string"
    })

    function capitalizeFirstLetter(str) {
        return str.split(' ').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
    }

    let boilerplate = {
        "news_title": "Biden is killing civiliants and his enjoying it",
        "news_description": "People are desperate and don't know what to do, they are begging for mercy.",
        "image_url": "https://asianews.network/wp-content/uploads/2024/02/2532551.jpg",

        "news_title_2": "Biden is killing civiliants and his enjoying it",
        "news_description_2": "People are desperate and don't know what to do, they are begging for mercy.",
        "image_url_2": "https://asianews.network/wp-content/uploads/2024/02/2532551.jpg",

        "news_title_3": "Biden is killing civiliants and his enjoying it",
        "news_description_3": "People are desperate and don't know what to do, they are begging for mercy.",
        "image_url_3": "https://asianews.network/wp-content/uploads/2024/02/2532551.jpg"
    }
</script>

<main class="w-full h-full py-20 px-36 flex flex-col justify-between gap-16">
    <div class="flex justify-center">
        <h1 class="text-5xl font-medium max-w-lg text-center">
            Most <span class="font-bold text-primary-gradient">{parameters['factor_name']}</span> news in the last 10 days about <span class="font-bold">{parameters['category'] ? capitalizeFirstLetter(parameters['category'].replace("_politics", "").replace("_environment", "").replace("_economy", "").replaceAll("_", " ")) : parameters['category']}</span>
        </h1>
    </div>

    <div class="flex justify-between gap-8">
        <div class="flex flex-col justify-center">
            <div class="relative">
                <div class="radial-progress font-bold text-4xl z-20"
            style="--value:70; --size:20rem; --thickness:1.4rem; color: #4B57DB;" role="progressbar">
                <span class="text-primary-gradient">70%</span>
            </div>
            <div style="width: 20rem; height: 20rem; border-radius: 9999px; 
            border-width: 1.4rem; border-color: #E2E2E2;
            transform: translate(0, -50%);"
            class="absolute top-1/2 right-0 z-10"></div>
            </div>
            <p class="font-light text-sm text-center w-full mt-2">*{parameters['factor']} of the news highlighted</p>
        </div>
        <div class="flex flex-col justify-center gap-2 w-88">
            <div class="flex">
                <div class="flex flex-col justify-center">
                    <svg class="w-10 mt-1.5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1024 1024" version="1.1"><path d="M454.5 675.5l-32.4 107.9h181.8L574.5 678" fill="#FBBA22"/><path d="M510.1 682.3c215.1 0 215.1-165.2 215.1-165.2V197.4H300.9v319.7s0 165.2 215.1 165.2h-5.9z" fill="#FBBA22"/><path d="M515.4 783.4h91.1s89.5 2.3 89.5 80.8H332.4c0-78.6 89.5-80.8 89.5-80.8H513" fill="#C04931"/><path d="M816.5 383.8V259.3c0-11.2-9-20.2-20.2-20.2h-50.9v-41.7c0-11.2-9-20.2-20.2-20.2H300.9c-11.2 0-20.2 9-20.2 20.2v41.7h-50.9c-11.2 0-20.2 9-20.2 20.2v124.5c0 1.2-0.7 42.2 27.2 70.9 11.7 12 26.5 19.9 43.9 23.8v38.6c0 1.6 2.1 135.7 147.8 174.7l-21.8 72.7c-39 5.7-94.5 31.2-94.5 99.7 0 11.2 9 20.2 20.2 20.2H696c11.2 0 20.2-9 20.2-20.2 0-69.6-57.2-94.7-96.6-99.9l-20.4-72.9c144.1-39.6 146.2-172.7 146.2-174.3v-38.6c17.4-3.9 32.1-11.8 43.9-23.8 27.9-28.7 27.2-69.7 27.2-70.9z m-550.8 42.7c-16-16.4-15.8-41.9-15.8-42.1V279.6h30.7v156.7c-5.7-2.4-10.8-5.6-14.9-9.8z m338.2 377.1c0.1 0 0.1 0 0 0h2c6.2 0.2 54 3 66.8 40.4h-317c12.8-37.4 60.5-40.2 66.2-40.4h182z m-154.6-40.4l19.1-63.6c12.5 1.6 25.9 2.5 40.1 2.8 0.5 0 1.1 0.1 1.6 0.1h5.9c0.5 0 1.1 0 1.6-0.1 14.9-0.3 28.8-1.3 41.9-3l17.9 63.9H449.3zM705 517c-0.1 5.9-3.5 143.6-191.9 145-17.6-0.1-33.6-1.4-48.1-3.7-1.5-0.9-3-1.7-4.7-2.2-3.2-0.9-6.3-1-9.4-0.4-127.1-27.3-129.7-133.5-129.8-138.6V217.6H705V517z m55.3-90.5c-4.1 4.2-9.1 7.4-15 9.8V279.5H776v104.8c0.1 0.3 0.3 25.8-15.7 42.2z" fill="#211F1E"/><path d="M446.7 449.5l-11.2 65.2c-1 5.7 1.4 11.4 6 14.8 4.7 3.4 10.8 3.8 16 1.1l58.5-30.8 58.5 30.8c2.2 1.2 4.6 1.7 7.1 1.7 3.1 0 6.3-1 8.9-2.9 4.7-3.4 7-9.1 6-14.8l-11.2-65.2 47.4-46.2c4.1-4 5.6-10.1 3.8-15.5-1.8-5.5-6.5-9.5-12.2-10.3L559 368l-29.3-59.3c-2.6-5.2-7.8-8.4-13.6-8.4s-11 3.3-13.6 8.4L473.2 368l-65.5 9.5c-5.7 0.8-10.4 4.8-12.2 10.3-1.8 5.5-0.3 11.5 3.8 15.5l47.4 46.2z m38.8-52.6c4.9-0.7 9.2-3.8 11.4-8.3l19.2-38.9 19.2 38.9c2.2 4.5 6.5 7.6 11.4 8.3l43 6.2-31.1 30.3c-3.6 3.5-5.2 8.5-4.4 13.4l7.3 42.8-38.4-20.2c-4.4-2.3-9.7-2.3-14.1 0l-38.4 20.2 7.3-42.8c0.8-4.9-0.8-9.9-4.4-13.4l-31.1-30.3 43.1-6.2z" fill="#211F1E"/></svg>
                </div>
                <div class="flex flex-col justify-center">
                    <h2 class="text-2xl font-bold">{parameters['news_title']}</h2>
                </div>
            </div>
            <div class="overflow-hidden w-full h-52">
                <img src="{parameters['image_url']}" class="object-cover w-full h-full rounded-t-sm card-images"/>
            </div>
            <div class="mt-0.5 font-light">
                <p>{parameters['news_description']}</p>
            </div>
        </div>
    </div>

    <div class="flex flex-col gap-4 mb-4">

        <div class="flex w-full gap-4">
            <div class="flex flex-col justify-center">
                <p class="font-bold text-xl">#2</p>
            </div>
            <div class="overflow-hidden h-32 w-48 flex flex-col justify-center">
                <img src="{parameters['image_url_2']}" class="object-cover w-full h-full rounded-t-sm card-images"/>
            </div>
            <div class="flex flex-col justify-center gap-1">
                <h3 class="font-bold text-lg">{parameters['news_title_2']}</h3>
                <p class="text-sm font-light">{parameters['news_description_2']}</p>
            </div>
        </div>

        <div class="flex w-full gap-4">
            <div class="flex flex-col justify-center">
                <p class="font-bold text-xl">#3</p>
            </div>
            <div class="overflow-hidden h-32 w-48 flex flex-col justify-center">
                <img src="{parameters['image_url_3']}" class="object-cover w-full h-full rounded-t-sm card-images"/>
            </div>
            <div class="flex flex-col justify-center gap-1">
                <h3 class="font-bold text-lg">{parameters['news_title_3']}</h3>
                <p class="text-sm font-light">{parameters['news_description_3']}</p>
            </div>
        </div>

    </div>
</main>
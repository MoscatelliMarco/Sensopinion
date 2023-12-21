<script>
    import RadialProgress from "../lib/radial_progress.svelte"
    // Define start and end colors of the gradient (Red to Blue)
    const startColor = { r: 255, g: 0, b: 0 }; // Red
    const endColor = { r: 0, g: 0, b: 255 }; // Blue

    function getColor(value) {
        let gradientColors = [];

        for (let i = 0; i < 1000; i++) {
            let r = startColor.r + ((endColor.r - startColor.r) * i / 1000);
            let g = startColor.g + ((endColor.g - startColor.g) * i / 1000);
            let b = startColor.b + ((endColor.b - startColor.b) * i / 1000);
            gradientColors.push({ r: Math.round(r), g: Math.round(g), b: Math.round(b) });
        }
        let index = Math.floor((value / 1000) * gradientColors.length);
        index = Math.min(index, gradientColors.length - 1); // Ensure index is within array bounds
        return `rgb(${gradientColors[index].r}, ${gradientColors[index].g}, ${gradientColors[index].b})`;
    }
</script>

<div class="flex flex-col gap-48">

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
                      <li><button class="bg-primary-gradient-opacity bg-primary-gradient-opacity-hover text-white">Positivity</button></li>
                      <li><button class="hover:bg-neutral-light">Fear</button></li>
                      <li><button class="hover:bg-neutral-light">Anger</button></li>
                      <li><button class="hover:bg-neutral-light">Disgust</button></li>
                    </ul>
                </div>
            </div>
        </div>
        <div class="flex flex-col justify-center gap-2 mt-6">
            <RadialProgress name="all" value=78.4 font_size=48 font_weight=700 size=420 thickness=28/>
            <h5 class="text-center text-sm font-thin">*Positivity index on news</h5>
        </div>
    </section>
    
    <section class="flex flex-col gap-24">
        <div class="flex justify-between xl:mx-16">
            <div class="flex flex-col justify-center gap-8">
                <a href="#" class="flex flex-col gap-8">
                    <h4 class="font-medium text-center text-2xl">Politics</h4>
                    <RadialProgress name="politics" font_size=32 font_weight=700 value=25 size=250 thickness=18/>
                </a>
                <div class="flex justify-center">
                    <button class="btn w-32 text-xs min-h-0 h-10 items-center rounded-md">Show more</button>
                </div>
            </div>
            <div class="flex flex-col justify-center gap-8">
                <a href="#" class="flex flex-col gap-8">
                    <h4 class="font-medium text-center text-2xl">Economics</h4>
                    <RadialProgress name="economics" font_size=32 font_weight=700 value=97 size=250 thickness=18/>
                </a>
                <div class="flex justify-center">
                    <button class="btn w-32 text-xs min-h-0 h-10 items-center rounded-md">Show more</button>
                </div>
            </div>
            <div class="flex flex-col justify-center gap-8">
                <a href="#" class="flex flex-col gap-8">
                    <h4 class="font-medium text-center text-2xl">Environment</h4>
                    <RadialProgress name="environment" font_size=32 font_weight=700 value=6 size=250 thickness=18/>
                </a>
                <div class="flex justify-center">
                    <div class="flex justify-center">
                        <button class="w-32 text-xs min-h-0 h-10 items-center rounded-md bg-primary-gradient font-medium text-white hover:brightness-105 btn">Show less</button>
                    </div>
                </div>
            </div>
        </div>
        <div class="grid grid-cols-5">
            <a href="#" class="flex flex-col items-center gap-4">
                <h4 class="text-center font-medium">Climate Change</h4>
                <RadialProgress name="climate_change" font_size=20 value=100 size=140 thickness=10/>
            </a>
            <a href="#" class="flex flex-col items-center gap-4">
                <h4 class="text-center font-medium">Renewable Energy</h4>
                <RadialProgress name="renewable_energy" font_size=20 value=100 size=140 thickness=10/>
            </a>
            <a href="#" class="flex flex-col items-center gap-4">
                <h4 class="text-center font-medium">Wildlife</h4>
                <RadialProgress name="wildlife" va font_size=20 value=100 size=140 thickness=10/>
            </a>
            <a href="#" class="flex flex-col items-center gap-4">
                <h4 class="text-center font-medium">Pollution</h4>
                <RadialProgress name="pollution" va font_size=20 value=100 size=140 thickness=10/>
            </a>
            <a href="#" class="flex flex-col items-center gap-4">
                <h4 class="text-center font-medium">Sustainable Living</h4>
                <RadialProgress name="sustainable_living" va font_size=20 value=100 size=140 thickness=10/>
            </a>
        </div>
    </section>

</div>
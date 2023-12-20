<script>
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

<section class="flex justify-between gap-24 mt-8">
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
            <button class="w-48 py-3 text-sm rounded-md bg-primary-gradient text-md font-semibold text-white hover:brightness-105 btn">TRY OUR SCREENER</button>
            <details class="dropdown">
                <summary class="w-48 py-3 text-sm rounded-md border-2 border-neutral text-neutral hover:border-neutral-dark hover:text-neutral-dark btn font-light text-md">Try a different emotion</summary>
                <ul class="p-2 shadow menu dropdown-content z-[1] rounded-lg font-light hover:font-regular text-sm flex flex-col gap-1 px-4 py-3 w-48">
                  <li><button class="bg-primary-gradient-opacity bg-primary-gradient-opacity-hover text-white">Positivity</button></li>
                  <li><button class="hover:bg-neutral-light">Fear</button></li>
                  <li><button class="hover:bg-neutral-light">Anger</button></li>
                  <li><button class="hover:bg-neutral-light">Disgust</button></li>
                </ul>
            </details>
        </div>
    </div>
    <div class="flex flex-col justify-center gap-2 mt-6">
        <div class="radial-progress" 
        style="
        --value:{10.9}; 
        --size: 20rem;
        --thickness: 1.5rem;
        color: {getColor(109)};" 
        role="progressbar">
            <span style="color: {getColor(109)};" class="font-bold text-4xl">
                {10.9}
            </span>
        </div>
        <h5 class="text-center text-sm font-thin">*Positivity index on news</h5>
    </div>
</section>

<section class="flex justify-between">
    <div class="flex flex-col justify-center gap-4 mt-6">
        <h4 class="font-semibold text-center text-2xl">Politics</h4>
        <div class="radial-progress" 
        style="
        --value:{432 / 10}; 
        --size: 12rem;
        --thickness: 1rem;
        color: {getColor(432) / 10};" 
        role="progressbar">
            <span style="color: {getColor(432) / 10};" class="font-bold text-2xl">
                {432 / 10}
            </span>
        </div>
    </div>
    <div class="flex flex-col justify-center gap-4 mt-6">
        <h4 class="font-semibold text-center text-2xl">Politics</h4>
        <div class="radial-progress" 
        style="
        --value:{432 / 10}; 
        --size: 12rem;
        --thickness: 1rem;
        color: {getColor(432) / 10};" 
        role="progressbar">
            <span style="color: {getColor(432) / 10};" class="font-bold text-2xl">
                {432 / 10}
            </span>
        </div>
    </div>
    <div class="flex flex-col justify-center gap-4 mt-6">
        <h4 class="font-semibold text-center text-2xl">Politics</h4>
        <div class="radial-progress" 
        style="
        --value:{432 / 10}; 
        --size: 12rem;
        --thickness: 1rem;
        color: {getColor(432) / 10};" 
        role="progressbar">
            <span style="color: {getColor(432) / 10};" class="font-bold text-2xl">
                {432 / 10}
            </span>
        </div>
    </div>
</section>
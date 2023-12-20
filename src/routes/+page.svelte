<script>
    function generateGradientColors(startColor, endColor, steps) {
    let colors = [];

    for (let i = 0; i < steps; i++) {
        let r = startColor.r + ((endColor.r - startColor.r) * i / steps);
        let g = startColor.g + ((endColor.g - startColor.g) * i / steps);
        let b = startColor.b + ((endColor.b - startColor.b) * i / steps);
        colors.push({ r: Math.round(r), g: Math.round(g), b: Math.round(b) });
    }

        return colors;
    }

    function getColor(gradientColors, value, maxValue) {
        let index = Math.floor((value / maxValue) * gradientColors.length);
        index = Math.min(index, gradientColors.length - 1); // Ensure index is within array bounds
        return `rgb(${gradientColors[index].r}, ${gradientColors[index].g}, ${gradientColors[index].b})`;
    }

    // Define start and end colors of the gradient (Red to Blue)
    const startColor = { r: 255, g: 0, b: 0 }; // Red
    const endColor = { r: 0, g: 0, b: 255 }; // Blue

    // Generate 1000 gradient colors
    const gradientColors = generateGradientColors(startColor, endColor, 1000);

    // Example: Get a color for a specific value
    const value = 876;
    const maxValue = 1000; // Maximum value
    const selectedColor = getColor(gradientColors, value, maxValue);
</script>

<section class="flex justify-between gap-24">
    <div class="flex flex-col justify-center gap-12">
        <div class="flex flex-col gap-4 max-w-lg">
            <h1 class="font-bold text-4xl">
                Analyze <span class="text-primary-gradient">Emotions</span> At The Speed Of Light
            </h1>
            <h3 class="font-thin">
                Understand what people think on the news and social media without reading tons of boring articles
            </h3>
        </div>
        <div>
            <button class="px-5 py-2 text-sm rounded-md bg-primary-gradient text-md font-semibold text-white">TRY OUR SCREENER</button>
        </div>
    </div>
    <div class="flex flex-col justify-center gap-2 mt-6">
        <div class="radial-progress" 
        style="
        --value:{value / 10}; 
        --size: 14rem;
        --thickness: 1rem;
        color: {selectedColor};" 
        role="progressbar">
            <span style="color: {selectedColor};" class="font-bold text-4xl">
                {value / 10}
            </span>
        </div>
        <h5 class="text-center text-sm font-thin">*Positivity index on news</h5>
    </div>
</section>
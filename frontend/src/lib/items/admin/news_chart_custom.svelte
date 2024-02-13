<script>
    export let size;
    export let thickness;
    export let value;
    export let font_weight = 600;
    export let font_size = 24;
</script>

<div class="relative" style="width: {size}px; height: {size}px">
    <div class="absolute top-0 left-0">
        <div style="
        width: {size}px;
        height: {size}px;
        " class="relative">
            <div style="
                width: {size}px;
                height: {size}px;
                " class="flex items-center justify-center bg-neutral-light rounded-full">
                <div style="
                width: {size - thickness * 2}px;
                height: {size - thickness * 2}px;
                " class="flex items-center justify-center bg-white rounded-full">
                    <div style="
                        font-weight: {font_weight};
                        font-size: {font_size}px;
                    " class="text-primary-gradient">
                        {value + '%'}
                    </div>
                </div>
            </div>
            <svg xlmns="http://www.w3.org/2000/svg" version="1.1" width="{size}" height="{size}" class="shadow-md lg:hover:shadow-lg rounded-full news-chart-svg">
                <defs>
                    <linearGradient id="GradientColor"  x1="0%" y1="0%" x2="0%" y2="100%">
                        <stop offset="0%" stop-color="rgb(33, 135, 219)"/>
                        <stop offset="100%" stop-color="rgb(112, 46, 219)"/>
                    </linearGradient>
                </defs>
                <circle style="
                    stroke-width: {thickness};
                    stroke-dasharray: {2 * Math.PI * (size / 2 - thickness / 2) + "px"};
                    stroke-dashoffset: {2 * Math.PI * (size / 2 - thickness / 2) - 2 * Math.PI * (size / 2 - thickness / 2) * (value / 100) + 'px'};
                    " transform="rotate(270 {size / 2} {size / 2})" cx="{size / 2}" cy="{size / 2}" r="{size / 2 - thickness / 2}" 
                stroke-linecap="round"/>
            </svg>
        </div>
    </div>
</div>
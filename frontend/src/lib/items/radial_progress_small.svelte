<script>
    import { globalStore } from '../../stores.js';

    export let news;

    let size = "32"
    let thickness = "4"

    let emotion_dict;
    const unsubscribe = globalStore.subscribe(value => {
        emotion_dict = value.emotion_dict;
    });
    unsubscribe()
    
    const entries = Object.entries(news['emotions']);
    entries.sort((a, b) => b[1] - a[1]);
    const sortedObj = Object.fromEntries(entries);
    let value_1 = sortedObj[Object.keys(sortedObj)[0]] * 100
    let emoji_1 = emotion_dict[Object.keys(sortedObj)[0]]
    let value_2 = sortedObj[Object.keys(sortedObj)[1]] * 100
    let emoji_2 = emotion_dict[Object.keys(sortedObj)[1]]
</script>

<div class="flex gap-2">
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
                    " class="flex items-center justify-center bg-white rounded-full text-xs pt-0.5">
                        {emoji_1}
                    </div>
                </div>
                <svg xlmns="http://www.w3.org/2000/svg" version="1.1" width="{size}" height="{size}" class="rounded-full">
                    <defs>
                        <linearGradient id="GradientColor"  x1="0%" y1="0%" x2="0%" y2="100%">
                            <stop offset="0%" stop-color="rgb(33, 135, 219)"/>
                            <stop offset="100%" stop-color="rgb(112, 46, 219)"/>
                        </linearGradient>
                    </defs>
                    <circle style="
                        stroke-width: {thickness};
                        stroke-dasharray: {2 * Math.PI * (size / 2 - thickness / 2) + "px"};
                        stroke-dashoffset: {2 * Math.PI * (size / 2 - thickness / 2) - 2 * Math.PI * (size / 2 - thickness / 2) * (value_1 / 100) + "px"};
                        " transform="rotate(270 {size / 2} {size / 2})" cx="{size / 2}" cy="{size / 2}" r="{size / 2 - thickness / 2}" 
                    stroke-linecap="round"/>
                </svg>
            </div>
        </div>
    </div>
    
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
                    " class="flex items-center justify-center bg-white rounded-full text-xs pt-0.5">
                        {emoji_2}
                    </div>
                </div>
                <svg xlmns="http://www.w3.org/2000/svg" version="1.1" width="{size}" height="{size}" class="rounded-full">
                    <defs>
                        <linearGradient id="GradientColor"  x1="0%" y1="0%" x2="0%" y2="100%">
                            <stop offset="0%" stop-color="rgb(33, 135, 219)"/>
                            <stop offset="100%" stop-color="rgb(112, 46, 219)"/>
                        </linearGradient>
                    </defs>
                    <circle style="
                        stroke-width: {thickness};
                        stroke-dasharray: {2 * Math.PI * (size / 2 - thickness / 2) + "px"};
                        stroke-dashoffset: {2 * Math.PI * (size / 2 - thickness / 2) - 2 * Math.PI * (size / 2 - thickness / 2) * (value_2 / 100) + "px"};
                        " transform="rotate(270 {size / 2} {size / 2})" cx="{size / 2}" cy="{size / 2}" r="{size / 2 - thickness / 2}" 
                    stroke-linecap="round"/>
                </svg>
            </div>
        </div>
    </div>
</div>

<style>
    circle {
        fill: none;
        stroke: url(#GradientColor);
    }

    svg {
        position: absolute;
        top: 0;
        left: 0;
    }
</style>
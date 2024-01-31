<script>
    import { globalStore } from "../../stores";
    import { onMount, onDestroy } from "svelte";

    export let value;
    export let name;
    export let emoji_size = 'xl';

    let emotion_dict = $globalStore.emotion_dict;
    emotion_dict['polarity'] = "👍";
    emotion_dict['subjectivity'] = "✊";
    let emoji = $globalStore.emotion_dict[name]

    let parent;
    let size = 200;
    let thickness = Math.round(size / 12.5);
    let resized = false;
    function changeSize () {
        size = parent.offsetWidth;
        thickness = Math.round(size / 12.5)

        if (style) {
            resized = true;
            try {
                document.head.removeChild(style);
            } catch {}
        }
    }

    let style;
    onMount(() => {
        window.addEventListener('resize', changeSize)
        changeSize()

        try {
            style = document.createElement('style');
            style.type = 'text/css';
            let stroke_offset_value = 2 * Math.PI * (size / 2 - thickness / 2) - 2 * Math.PI * (size / 2 - thickness / 2) * (value / 100) + 'px'
            const keyFrames = `
                @keyframes ${name} {
                    100% {
                        stroke-dashoffset: ${stroke_offset_value};
                    }
                }
            `;
            // If your browser supports style.sheet.insertRule
            if (style.sheet) {
                style.sheet.insertRule(keyFrames, 0);
            } else {
                style.appendChild(document.createTextNode(keyFrames));
            }
            document.head.appendChild(style);
        } catch (error){
            console.log(`Couldn't animated ${name}, ${error}`)
        }
    })
    onDestroy(() => {
        window.removeEventListener('resize', changeSize)
    })
</script>

<div bind:this={parent} class="relative" style="width: 100%; height: {size}px">
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
                " class="flex flex-col items-center justify-center bg-white rounded-full">
                <p class="text-{emoji_size}">{value == undefined ? "❌" : emoji}</p>
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
                    animation: {name} 0.3s ease-in forwards;
                    stroke-dasharray: {2 * Math.PI * (size / 2 - thickness / 2) + "px"};
                    stroke-dashoffset: {value == undefined ? 2 * Math.PI * (size / 2 - thickness / 2) + "px" : !resized ? 2 * Math.PI * (size / 2 - thickness / 2) + "px" : 2 * Math.PI * (size / 2 - thickness / 2) - 2 * Math.PI * (size / 2 - thickness / 2) * (value / 100) + 'px'};
                    " transform="rotate(270 {size / 2} {size / 2})" cx="{size / 2}" cy="{size / 2}" r="{size / 2 - thickness / 2}" 
                stroke-linecap="round"/>
            </svg>
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
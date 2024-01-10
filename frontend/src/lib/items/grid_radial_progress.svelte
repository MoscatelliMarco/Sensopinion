<script>
  import { onDestroy, onMount } from "svelte";
    import { globalStore } from "../../stores";

    export let metrics;
    export let name;
    export let dimension = 'big';

    let code;
    let el = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j'];

    let emotion_dict;
    const unsubscribe = globalStore.subscribe(value => {
        emotion_dict = value.emotion_dict;
    });
    unsubscribe()

    let value_positivity;
    let value_subjectivity;
    let value_1;
    let value_2;
    let emotion_1;
    let emotion_2;
    let emoji_1;
    let emoji_2;
    try {
        value_positivity = metrics[name]['positivity']
        value_subjectivity = metrics[name]['subjectivity']
        const entries = Object.entries(metrics[name]['emotions']);
        entries.sort((a, b) => b[1] - a[1]);
        const sortedObj = Object.fromEntries(entries);
        value_1 = sortedObj[Object.keys(sortedObj)[0]]
        value_2 = sortedObj[Object.keys(sortedObj)[1]]
        emotion_1 = Object.keys(sortedObj)[0]
        emotion_2 = Object.keys(sortedObj)[1]
        emoji_1 = emotion_dict[Object.keys(sortedObj)[0]]
        emoji_2 = emotion_dict[Object.keys(sortedObj)[1]]
    } catch(e) {}

    let parent;
    let size = 200;
    let thickness = dimension == 'big' ? Math.round(size / 14) : Math.round(size / 12)
    function changeSize () {
        size = parent.offsetWidth;
        thickness = dimension == 'big' ? Math.round(size / 14) : Math.round(size / 12)
    }
    onMount(() => {
        window.addEventListener('resize', changeSize)
        changeSize()

        if (dimension == 'big') {
            try {
                const style = document.createElement('style');
                style.type = 'text/css';
                let stroke_offset_value_positivity = 2 * Math.PI * (size / 2 - thickness / 2) - 2 * Math.PI * (size / 2 - thickness / 2) * (value_positivity / 100) + 'px'
                let stroke_offset_value_subjectivity = 2 * Math.PI * (size / 2 - thickness / 2) - 2 * Math.PI * (size / 2 - thickness / 2) * (value_subjectivity / 100) + 'px'
                let stroke_offset_value_1 = 2 * Math.PI * (size / 2 - thickness / 2) - 2 * Math.PI * (size / 2 - thickness / 2) * (value_1 / 100) + 'px'
                let stroke_offset_value_2 = 2 * Math.PI * (size / 2 - thickness / 2) - 2 * Math.PI * (size / 2 - thickness / 2) * (value_2 / 100) + 'px'
                code = ''
                for (let i = 0; i < String(stroke_offset_value_positivity).length; i++) {
                    if (String(stroke_offset_value_positivity)[i] != '.'){
                        code = code + el[String(stroke_offset_value_positivity)[i]]
                    }
                }
                const keyFrames = `
                    @keyframes ${name}_${code}_1 {
                        100% {
                            stroke-dashoffset: ${stroke_offset_value_positivity};
                        }
                    }
                    @keyframes ${name}_${code}_2 {
                        100% {
                            stroke-dashoffset: ${stroke_offset_value_subjectivity};
                        }
                    }
                    @keyframes ${name}_${code}_3 {
                        100% {
                            stroke-dashoffset: ${stroke_offset_value_1};
                        }
                    }
                    @keyframes ${name}_${code}_4 {
                        100% {
                            stroke-dashoffset: ${stroke_offset_value_2};
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
        }
    })
    onDestroy(() => {
        window.removeEventListener('resize', changeSize)
    })
</script>

<div class="grid {dimension == 'big' ? "gap-3 md:gap-6 lg:gap-8 xl:gap-10 px-5 md:px-10 lg:px-14 xl:px-16 grid-cols-2 md:grid-cols-4" : "px-0.5 lg:px-0 gap-2 lg:gap-4 grid-cols-4"}">
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
                    " class="flex flex-col items-center justify-center bg-white rounded-full {dimension == 'big' ? 'pt-0.5' : ''}">
                    {#if dimension == 'big'}
                        <p class="text-xs lg:text-sm text-light flex"><span class="text-xxs lg:text-xs">👍</span>Positivity<span class="text-xxs lg:text-xs">👍</span></p>
                        <p class="font-bold text-lg lg:text-xl mt-neg-2 text-primary-gradient">{value_positivity}%</p>
                    {:else}
                        <p class="text-xs">{value_positivity == undefined ? "❌" : "👍"}</p>
                    {/if}
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
                        animation: {name}_{code}_1 0.3s ease-in forwards;
                        stroke-dasharray: {2 * Math.PI * (size / 2 - thickness / 2) + "px"};
                        stroke-dashoffset: {value_positivity == undefined ? 2 * Math.PI * (size / 2 - thickness / 2) + "px" : dimension == 'big' ? 2 * Math.PI * (size / 2 - thickness / 2) + "px" : 2 * Math.PI * (size / 2 - thickness / 2) - 2 * Math.PI * (size / 2 - thickness / 2) * (value_positivity / 100) + 'px'};
                        " transform="rotate(270 {size / 2} {size / 2})" cx="{size / 2}" cy="{size / 2}" r="{size / 2 - thickness / 2}" 
                    stroke-linecap="round"/>
                </svg>
            </div>
        </div>
    </div>
    <div class="relative" style="width: 100%; height: {size}px">
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
                    " class="flex flex-col items-center justify-center bg-white rounded-full {dimension == 'big' ? 'pt-0.5' : ''}">
                        {#if dimension == 'big'}
                            <p class="text-xs lg:text-sm text-light"><span class="text-xxs lg:text-xs">✊</span>Subjectivity<span class="text-xxs lg:text-xs">✊</span></p>
                            <p class="font-bold text-lg lg:text-xl mt-neg-2 text-primary-gradient">{value_subjectivity}%</p>
                        {:else}
                            <p class="text-xs">{value_positivity == undefined ? "❌" : "✊"}</p>
                        {/if}
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
                        animation: {name}_{code}_2 0.3s ease-in forwards;
                        stroke-dasharray: {2 * Math.PI * (size / 2 - thickness / 2) + "px"};
                        stroke-dashoffset: {value_subjectivity == undefined ? 2 * Math.PI * (size / 2 - thickness / 2) + "px" : dimension == 'big' ? 2 * Math.PI * (size / 2 - thickness / 2) + "px" : 2 * Math.PI * (size / 2 - thickness / 2) - 2 * Math.PI * (size / 2 - thickness / 2) * (value_subjectivity / 100) + 'px'};
                        " transform="rotate(270 {size / 2} {size / 2})" cx="{size / 2}" cy="{size / 2}" r="{size / 2 - thickness / 2}" 
                    stroke-linecap="round"/>
                </svg>
            </div>
        </div>
    </div>
    <div class="relative" style="width: 100%; height: {size}px">
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
                    " class="flex flex-col items-center justify-center bg-white rounded-full {dimension == 'big' ? 'pt-0.5' : ''}">
                        {#if dimension == 'big'}
                            <p class="text-xs lg:text-sm text-light"><span class="text-xxs lg:text-xs">{emoji_1}</span>{emotion_1.charAt(0).toUpperCase() + emotion_1.slice(1)}<span class="text-xxs lg:text-xs">{emoji_1}</span></p>
                            <p class="font-bold text-lg lg:text-xl mt-neg-2 text-primary-gradient">{value_1}%</p>
                        {:else}
                            <p class="text-xs">{value_positivity == undefined ? "❌" : emoji_1}</p>
                        {/if}
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
                        animation: {name}_{code}_3 0.3s ease-in forwards;
                        stroke-dasharray: {2 * Math.PI * (size / 2 - thickness / 2) + "px"};
                        stroke-dashoffset: {value_1 == undefined ? 2 * Math.PI * (size / 2 - thickness / 2) + "px" : dimension == 'big' ? 2 * Math.PI * (size / 2 - thickness / 2) + "px" : 2 * Math.PI * (size / 2 - thickness / 2) - 2 * Math.PI * (size / 2 - thickness / 2) * (value_1 / 100) + 'px'};
                        " transform="rotate(270 {size / 2} {size / 2})" cx="{size / 2}" cy="{size / 2}" r="{size / 2 - thickness / 2}" 
                    stroke-linecap="round"/>
                </svg>
            </div>
        </div>
    </div>
    <div class="relative" style="width: 100%; height: {size}px">
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
                    " class="flex flex-col items-center justify-center bg-white rounded-full {dimension == 'big' ? 'pt-0.5' : ''}">
                    {#if dimension == 'big'}
                        <p class="text-xs lg:text-sm text-light"><span class="text-xxs lg:text-xs">{emoji_2}</span>{emotion_2.charAt(0).toUpperCase() + emotion_2.slice(1)}<span class="text-xxs lg:text-xs">{emoji_2}</span></p>
                        <p class="font-bold text-lg lg:text-xl mt-neg-2 text-primary-gradient">{value_2}%</p>
                    {:else}
                        <p class="text-xs">{value_positivity == undefined ? "❌" : emoji_2}</p>
                    {/if}
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
                        animation: {name}_{code}_4 0.3s ease-in forwards;
                        stroke-dasharray: {2 * Math.PI * (size / 2 - thickness / 2) + "px"};
                        stroke-dashoffset: {value_2 == undefined ? 2 * Math.PI * (size / 2 - thickness / 2) + "px" : dimension == 'big' ? 2 * Math.PI * (size / 2 - thickness / 2) + "px" : 2 * Math.PI * (size / 2 - thickness / 2) - 2 * Math.PI * (size / 2 - thickness / 2) * (value_2 / 100) + 'px'};
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
<script>
    import { onMount } from "svelte";
    import { fade } from "svelte/transition";
    import { globalStore } from '../../stores.js';

    export let dimension = 'medium'
    export let name = "test";
    export let value;
    export let cake_chart_colors;
    export let emotion_analyze;

    // Handle if value == null
    if (value === null) {
        value = 0;
    }

    let size;
    let thickness;
    let font_weight;
    let font_size;
    
    /* Responsive sizes of the radiant */
    let dimensions = {
        'big': {
            1280: {
                font_size: 48,
                font_weight: 700,
                size: 420,
                thickness: 28
            },
            1024: {
                font_size: 40,
                font_weight: 700,
                size: 360,
                thickness: 22
            },
            768: {
                font_size: 36,
                font_weight: 700,
                size: 280,
                thickness: 20
            },
            mobile: {
                font_size: 38,
                font_weight: 700,
                size: 280,
                thickness: 18
            }
        },
        'medium': {
            1280: {
                font_size: 32,
                font_weight: 700,
                size: 250,
                thickness: 18
            },
            1024: {
                font_size: 26,
                font_weight: 700,
                size: 240,
                thickness: 16
            },
            768: {
                font_size: 22,
                font_weight: 700,
                size: 200,
                thickness: 14
            },
            mobile: {
                font_size: 28,
                font_weight: 700,
                size: 230,
                thickness: 16
            }
        },
        'small': {
            1280: {
                font_size: 20,
                font_weight: 700,
                size: 140,
                thickness: 10
            },
            1024: {
                font_size: 18,
                font_weight: 700,
                size: 140,
                thickness: 9
            },
            768: {
                font_size: 16,
                font_weight: 700,
                size: 130,
                thickness: 9
            },
            mobile: {
                font_size: 12,
                font_weight: 700,
                size: 120,
                thickness: 8
            }
        }
    }

    /* Because doing this in only CSS would be too complex I am using JS*/
    function updateWidth () {
        if (window.innerWidth >= 1280){
            font_size = dimensions[dimension][1280]['font_size']
            font_weight = dimensions[dimension][1280]['font_weight']
            size = dimensions[dimension][1280]['size']
            thickness = dimensions[dimension][1280]['thickness']  
        } else if (window.innerWidth >= 1024){
            font_size = dimensions[dimension][1024]['font_size']
            font_weight = dimensions[dimension][1024]['font_weight']
            size = dimensions[dimension][1024]['size']
            thickness = dimensions[dimension][1024]['thickness']   
        }else if (window.innerWidth >= 768){
            font_size = dimensions[dimension][768]['font_size']
            font_weight = dimensions[dimension][768]['font_weight']
            size = dimensions[dimension][768]['size']
            thickness = dimensions[dimension][768]['thickness']   
        } else {
            font_size = dimensions[dimension]['mobile']['font_size']
            font_weight = dimensions[dimension]['mobile']['font_weight']
            size = dimensions[dimension]['mobile']['size']
            thickness = dimensions[dimension]['mobile']['thickness'] 
        }
    }
    updateWidth()
    onMount(() => {
        window.addEventListener('resize', updateWidth)

        return () => {
            window.removeEventListener('resize', updateWidth);
        };
    })

    let code;
    let el = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j'];
    $: if (value) {
        try {
            const style = document.createElement('style');
            style.type = 'text/css';
            let stroke_offset_value = 2 * Math.PI * (size / 2 - thickness / 2) - 2 * Math.PI * (size / 2 - thickness / 2) * (value / 100) + 'px'
            code = ''
            for (let i = 0; i < String(value).length; i++) {
                if (String(value)[i] != '.'){
                    code = code + el[String(value)[i]]
                }
            }
            const keyFrames = `
                @keyframes ${name}_${code} {
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
            console.log(`Couldn't animated ${name}`)
        }
    }

    let highest_emotion_score = 0;
    let highest_emotion_type = null;
    $: if (name) {
        highest_emotion_score = 0;
        highest_emotion_type = null;
    }
    $: if (value) {
        if (typeof value === 'object') {
            for (let emotion in value) {
                if (value[emotion] > highest_emotion_score) {
                    highest_emotion_type = emotion
                    highest_emotion_score = value[emotion]
                }
            }
        }
    }
    let emotion_dict = $globalStore.emotion_dict;

    function getKeysByValue(object, value) {
        return String(Object.keys(object).filter(key => object[key] === value));
    }
</script>

<div class="relative" style="width: {size}px; height: {size}px">
    {#if (typeof value !== 'object')}
        <div class="absolute top-0 left-0" transition:fade={{duration: 300}}>
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
                        animation: {name}_{code} 0.3s ease-in forwards;
                        stroke-dasharray: {2 * Math.PI * (size / 2 - thickness / 2) + "px"};
                        stroke-dashoffset: {2 * Math.PI * (size / 2 - thickness / 2) + "px"};
                        " transform="rotate(270 {size / 2} {size / 2})" cx="{size / 2}" cy="{size / 2}" r="{size / 2 - thickness / 2}" 
                    stroke-linecap="round"/>
                </svg>
            </div>
        </div>
    {:else}
        <div transition:fade={{duration: 300}} style="
        background-image: conic-gradient(
            {cake_chart_colors[0]} {value[Object.keys(value)[0]]}%,
            {cake_chart_colors[1]} {value[Object.keys(value)[0]]}% {value[Object.keys(value)[0]] + value[Object.keys(value)[1]]}%,
            {cake_chart_colors[2]} {value[Object.keys(value)[0]] + value[Object.keys(value)[1]]}% {value[Object.keys(value)[0]] + value[Object.keys(value)[1]] + value[Object.keys(value)[2]]}%,
            {cake_chart_colors[3]} {value[Object.keys(value)[0]] + value[Object.keys(value)[1]] + value[Object.keys(value)[2]]}% {value[Object.keys(value)[0]] + value[Object.keys(value)[1]] + value[Object.keys(value)[2]] + value[Object.keys(value)[3]]}%,
            {cake_chart_colors[4]} {value[Object.keys(value)[0]] + value[Object.keys(value)[1]] + value[Object.keys(value)[2]] + value[Object.keys(value)[3]]}%, {value[Object.keys(value)[0]] + value[Object.keys(value)[1]] + value[Object.keys(value)[2]] + value[Object.keys(value)[3]] + value[Object.keys(value)[4]]}%,
            {cake_chart_colors[5]} {value[Object.keys(value)[0]] + value[Object.keys(value)[1]] + value[Object.keys(value)[2]] + value[Object.keys(value)[3]] + value[Object.keys(value)[4]]}% {value[Object.keys(value)[0]] + value[Object.keys(value)[1]] + value[Object.keys(value)[2]] + value[Object.keys(value)[3]] + value[Object.keys(value)[4]] + value[Object.keys(value)[5]]}%,
            {cake_chart_colors[6]} {value[Object.keys(value)[0]] + value[Object.keys(value)[1]] + value[Object.keys(value)[2]] + value[Object.keys(value)[3]] + value[Object.keys(value)[4]] + value[Object.keys(value)[5]]}% {value[Object.keys(value)[0]] + value[Object.keys(value)[1]] + value[Object.keys(value)[2]] + value[Object.keys(value)[3]] + value[Object.keys(value)[4]] + value[Object.keys(value)[5]] + value[Object.keys(value)[6]]}%,
            {cake_chart_colors[7]} {value[Object.keys(value)[0]] + value[Object.keys(value)[1]] + value[Object.keys(value)[2]] + value[Object.keys(value)[3]] + value[Object.keys(value)[4]] + value[Object.keys(value)[5]] + value[Object.keys(value)[6]]}% 100%
        );
        width: {size}px; 
        height: {size}px;
        " class="shadow-md hover:shadow-lg relative rounded-full border-white"
        class:border-4={dimension != 'small'}
        class:border-3={dimension == 'small'}>
            <div class="rounded-full bg-white absolute center-absolute" style="
            width: {size - thickness * 4.5}px;
            height: {size - thickness * 4.5}px;">

            </div>
            <div class="absolute center-absolute">
                <div class="flex flex-col w-64 text-center">
                    {#if (!emotion_analyze)}
                        <p class="text-sm"
                        class:hidden={dimension == 'medium' || dimension == 'small'}>Top emotion:</p>
                        <p class="font-medium flex justify-center"
                            class:text-lg={dimension == 'medium' || dimension == 'big'}
                            class:xl:text-xl={dimension == 'medium' || dimension == 'big'}
                            class:md:text-base={dimension == 'small'}
                            class:text-sm={dimension == 'small'}>
                            <span class="flex flex-col justify-center">
                                {emotion_dict[highest_emotion_type]} 
                                {dimension == 'big' ? highest_emotion_type.charAt(0).toUpperCase() + highest_emotion_type.slice(1) : ''} 
                                -&nbsp;
                            </span>
                            <span class="font-extrabold text-primary-gradient">{highest_emotion_score}%</span>
                        </p>
                    {:else}
                        <p class="text-sm"
                        class:hidden={dimension == 'medium' || dimension == 'small'}>Emotion:</p>
                        <p class="font-medium flex justify-center"
                            class:text-lg={dimension == 'medium' || dimension == 'big'}
                            class:xl:text-xl={dimension == 'medium' || dimension == 'big'}
                            class:md:text-base={dimension == 'small'}
                            class:text-sm={dimension == 'small'}>
                            <span class="flex flex-col justify-center">
                                {emotion_analyze}
                                {dimension == 'big' ? getKeysByValue(emotion_dict, emotion_analyze).charAt(0).toUpperCase() + getKeysByValue(emotion_dict, emotion_analyze).slice(1) : ''}
                                -&nbsp;
                            </span>
                            <span class="font-extrabold text-primary-gradient">{value[getKeysByValue(emotion_dict, emotion_analyze)]}%</span>
                        </p>
                    {/if}
                </div>
            </div>
        </div>
    {/if}
</div>
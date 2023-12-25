<script>
  import { onMount } from "svelte";

    export let dimension = 'medium'
    export let name = "test";
    export let run_anim = false;
    export let value;

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
                size: 340,
                thickness: 20
            },
            768: {
                font_size: 48,
                font_weight: 700,
                size: 420,
                thickness: 28
            },
            mobile: {
                font_size: 48,
                font_weight: 700,
                size: 420,
                thickness: 28
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
                size: 220,
                thickness: 14
            },
            768: {
                font_size: 32,
                font_weight: 700,
                size: 250,
                thickness: 18
            },
            mobile: {
                font_size: 32,
                font_weight: 700,
                size: 250,
                thickness: 18
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
                font_size: 20,
                font_weight: 700,
                size: 140,
                thickness: 10
            },
            mobile: {
                font_size: 20,
                font_weight: 700,
                size: 140,
                thickness: 10
            }
        }
    }

    /* Because doing this in only CSS would be too complex I am using JS*/
    function updateWidth () {
        if (window.innerWidth > 1280){
            font_size = dimensions[dimension][1280]['font_size']
            font_weight = dimensions[dimension][1280]['font_weight']
            size = dimensions[dimension][1280]['size']
            thickness = dimensions[dimension][1280]['thickness']  
        } else if (window.innerWidth > 1024){
            font_size = dimensions[dimension][1024]['font_size']
            font_weight = dimensions[dimension][1024]['font_weight']
            size = dimensions[dimension][1024]['size']
            thickness = dimensions[dimension][1024]['thickness']   
        }else if (window.innerWidth > 768){
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

    $: if (run_anim) {        
        try {
            const style = document.createElement('style');
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
            console.log(name)
        }
    }

</script>

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
                {value}%
            </div>
        </div>
    </div>
    <svg xlmns="http://www.w3.org/2000/svg" version="1.1" width="{size}" height="{size}">
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
            stroke-dashoffset: {2 * Math.PI * (size / 2 - thickness / 2) + "px"};
        " transform="rotate(270 {size / 2} {size / 2})" cx="{size / 2}" cy="{size / 2}" r="{size / 2 - thickness / 2}" stroke-linecap="round" id="{name}"/>
    </svg>
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
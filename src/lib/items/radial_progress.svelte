<script>
    export let size = 160;
    export let thickness = 20;
    export let value = 65;
    export let font_weight = 600;
    export let font_size = 28;
    export let name = "test";
    export let run_anim = false;

    // Because I couldn't add a dynamic value for the animation I had to insert the property using script and not style
    import { onMount } from 'svelte';
    onMount(() => {
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
    });

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
                <stop offset="0%" stop-color="#0000ff"/>
                <stop offset="100%" stop-color="#ff0000"/>
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
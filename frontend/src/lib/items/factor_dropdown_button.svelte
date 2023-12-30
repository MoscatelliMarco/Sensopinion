<script>
    export let content;
    export let factorValue;
    export let clickFunction;
    export let currentFactor;
</script>

<li><button on:click={clickFunction} data-factor-value="{factorValue}" 
    class="text-xs lg:text-sm py-0.5 w-full rounded-sm"
    class:bg-primary-gradient-opacity = {currentFactor==factorValue}
    class:bg-primary-gradient-opacity-inter = {currentFactor==factorValue}
    class:text-white = {currentFactor==factorValue}
    class:hover:bg-neutral-light = {currentFactor != factorValue}
    class:focus:bg-neutral-light = {currentFactor != factorValue}
    >{content}</button></li>
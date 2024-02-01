<script>
    export let dict_params;

    let search_value;
    export let delay = 500;

    // Debounce function
    function debounce(func, wait) {
        let timeout;

        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };

            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    }

    // Wrapped update function with debounce
    const updateParams = debounce((value) => {
        if (!value) {
            dict_params.update(params => {
                delete params['search'];
                return params;
            })
        } else {
            $dict_params['search'] = value;
        }
    }, delay);

    // React to search_value changes with debounce
    $: if (search_value !== undefined) {
        updateParams(search_value);
    }
</script>

<div class="lg:absolute lg:top-0 lg:left-0 flex flex-col gap-8 pt-1 pb-3 pr-4 pl-1 w-full lg:w-56 h-full bg-white">
    <div class="border border-black rounded-md p-0.5">
        <input bind:value={search_value} maxlength="50" name="url" type="text" placeholder="Search content" class="text-xs md:text-sm px-1.5 py-1 w-full focus:border-none focus:outline-none" />
    </div>
</div>
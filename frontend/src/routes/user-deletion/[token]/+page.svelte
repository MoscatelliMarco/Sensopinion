<script>
    export let data;
    const is_verified = data['props']['is_verified'];
</script>

<div class="mt-6">
    {#if is_verified}
        <div class="flex flex-col gap-2 justify-center items-center">
            <p class="text-primary-gradient text-2xl font-semibold">Congratulations!</p>
            <p class="text-grey-2 text-sm">You are now a verified user</p>
        </div>
    {:else}
        <div class="flex justify-center">
            <p class="text-error font-medium">
                Token invalid or expired
            </p>
        </div>
    {/if}
</div>
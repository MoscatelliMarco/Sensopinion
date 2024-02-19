<script>
    import TextareaAnalyzeText from "../../lib/items/textarea_analyze_text.svelte";
    import NewsRadioAll from "../../lib/sections/analyze_text/+page/news_radio_all.svelte";
    import Alert from "../../lib/items/alert.svelte";

    let mode_text = true; // State to toggle between text and URL input
    let inputText = ''; // To store the input value
    let inputUrl = ''; // To store the input url value
  
    // Logic to show loading
    let show_loading = false;
    let data;
    let message;
    let message_error;

    let show_server_not_responding = false;
    let show_link_invalid = false;
    let is_taking_time = false;

    // Function to handle form submission
    async function handleSubmit(event) {
        event.preventDefault(); // Prevent default form submission behavior

        const body = mode_text ? { text: inputText } : { url: inputUrl }; // Conditionally prepare the body

        // Set a timeout to change is_taking_time to true if the request takes more than 8 seconds
        const timeout = setTimeout(() => {
            is_taking_time = true;
        }, 12000); // 8000 milliseconds = 8 seconds

        try {
            show_loading = true;
            const response = await fetch(import.meta.env.VITE_BACKEND_SERVER_IP + '/api/analyze_text', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(body),
            });

            clearTimeout(timeout); // Clear the timeout as the request has finished

            if (!response.ok) {
                show_loading = false;
                show_server_not_responding = true;
                setTimeout(() => {
                    show_server_not_responding = false;
                }, 4000)
                return;
            }

            const is_message_showed = getCookie("message_showed");
            if (!is_message_showed) {
                message = "We can't guarantee with absolute certainty our results to be accurate.";
                setCookie("message_showed", "true");
            }

            data = await response.json();
            if (data['error']) {
                message_error = data['error'];
            } else if (!data || !data.length) {
                show_link_invalid = true;
                setTimeout(() => {
                    show_link_invalid = false;
                }, 4000);
            }
        } catch (error) {
            clearTimeout(timeout); // Clear the timeout in case of an error as well
            show_server_not_responding = true;
            setTimeout(() => {
                show_server_not_responding = false;
            }, 4000);
        } finally {
            // Ensure is_taking_time is set to false and loading state is updated when the request is complete or fails
            is_taking_time = false;
            show_loading = false;
        }
    }

    // Function to set a cookie with an expiration of 5 days
    function setCookie(name, value, days = 5) {
        const date = new Date();
        date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
        document.cookie = `${name}=${value};expires=${date.toUTCString()};path=/`;
    }

    // Function to read a cookie by name
    function getCookie(name) {
        const value = `; ${document.cookie}`;
        const parts = value.split(`; ${name}=`);
        if (parts.length === 2) return parts.pop().split(';').shift();
    }
</script>

<svelte:head>
    <title>Analyze your text</title>
    <meta name='description' content="Analyze your own text, wheter is a news url or your article, we got your back!">
</svelte:head>

<div class="w-full flex flex-col items-center mt-2 md:mt-4 lg:mt-6 relative">
    {#if message}
        <Alert message={message}/>
    {/if}
    {#if message_error}
        <Alert message={message_error} type={'error'}/>
    {/if}
    {#if show_server_not_responding}
        <Alert message="The server is not responding, we are sorry for the inconvenient" type={'error'} show_x={false}/>
    {/if}
    {#if show_link_invalid}
        <Alert message="The link that you've provided is invalid, it might not be a news article url" type={'error'} show_x={false}/>
    {/if}
    {#if data && !data['error']}
        {#key data}
            <div class="w-full flex flex-col items-center justify-center gap-4 pb-4">
                <NewsRadioAll data={data}/>
            </div>
        {/key}
    {/if}
    <div class="max-w-3xl flex flex-col w-full mt-10 lg:mt-12">
        <div class="flex justify-center">
              <button on:click={() => mode_text = true} class="{mode_text ? 'bg-primary-gradient-opacity text-white' : 'text-black'} w-24 py-1 text-xs border-neutral rounded-tl-md border-x border-t">
                  Text
              </button>
              <button on:click={() => mode_text = false} class="{!mode_text ? 'bg-primary-gradient-opacity text-white' : 'text-black'} w-24 py-1 text-xs border-neutral rounded-tr-md border-r border-t">
                  Url
              </button>
        </div>
        <form on:submit={handleSubmit}>
            {#if mode_text}
                <div class="w-full border border-neutral rounded-sm h-72 md:h-124 lg:h-140">
                    <TextareaAnalyzeText bind:inputText={inputText}/>
                </div>
                <div class="flex justify-center">
                    <button disabled="{inputText.length ? "" : "disabled"}" type="submit" class="{inputText.length ? "bg-primary-gradient " : "bg-primary-gradient-opacity "}text-white border-neutral rounded-b-md border-b border-x w-36 py-1.5 font-medium text-sm">
                        {#if !show_loading}
                            Analyze
                        {:else}
                            <span class="loading loading-infinity h-2.5"></span>
                        {/if}
                    </button>
                </div>
            {:else}
                <div class="w-full border border-neutral rounded-sm">
                    <input maxlength="250" name="url" type="text" bind:value={inputUrl} placeholder="Url to analyze" class="text-sm md:text-base px-2.5 py-1.5 w-full focus:border-none focus:outline-none">
                </div>
                <div class="flex justify-center">
                    <button disabled="{inputUrl.length ? "" : "disabled"}" type="submit" class="{inputUrl.length ? "bg-primary-gradient " : "bg-primary-gradient-opacity "}text-white border-neutral rounded-b-md border-b border-x w-36 py-1.5 font-medium text-sm">
                        {#if !show_loading}
                            Analyze
                        {:else}
                            <span class="loading loading-infinity h-2.5"></span>
                        {/if}
                    </button>
                </div>
            {/if}
        </form>
        {#if is_taking_time}
            <div class="flex justify-center text-center font-medium mt-6 lg:mt-8 text-sm">
                <p class="max-w-80">We are experiencing a lot of demand, give us just a little bit more time 🥺</p>
            </div>
        {/if}
    </div>
  </div>
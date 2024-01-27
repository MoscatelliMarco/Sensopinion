<script>
    import TextareaAnalyzeText from "../../lib/items/textarea_analyze_text.svelte";

    let mode_text = true; // State to toggle between text and URL input
    let inputText = ''; // To store the input value
    let inputUrl = ''; // To store the input url value
  
    // Logic to show loading
    let show_loading = false;

    // Function to handle form submission
    async function handleSubmit(event) {
        event.preventDefault(); // Prevent default form submission behavior
        
        const endpoint = import.meta.env.VITE_BACKEND_SERVER_IP + '/api/analyze_text';
        const body = mode_text ? { text: inputText } : { url: inputUrl }; // Conditionally prepare the body

        try {
            show_loading = true;
            const response = await fetch(endpoint, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(body),
            });
    
            if (!response.ok) {
                // TODO show error
                print('Error in the response')
                show_loading = false;
                return
            }
    
            const data = await response.json();
            console.log(data); // Handle success response
        } catch (error) {
            console.error('There was a problem with your fetch operation:', error);
        }
        show_loading = false;
    }
  </script>
  
  <div class="w-full flex justify-center mt-10 md:mt-12 lg:mt-16 xl:mt-20">
      <div class="max-w-3xl flex flex-col w-full">
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
      </div>
  </div>
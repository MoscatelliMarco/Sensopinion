<script>
    let text = 'I like talking about mobile phones';
    let result = '';

    async function classify() {
        const res = await fetch('/api/exploration', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ text }) 
        });
        if (res.ok) {
            const data = await res.json();
            console.log(data)
            result = data.label;
        } else {
            result = 'An error occurred.';
        }
    }
</script>

<input bind:value={text} placeholder="Enter text to classify" />
<button on:click={classify}>Classify</button>
<p>{result}</p>
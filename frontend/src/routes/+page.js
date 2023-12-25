// This runs on the server during SSR and on the client after navigation
export async function load({ fetch }) {
    const res = await fetch("http://127.0.0.1:8000/api/news");
    if (res.ok) {
        const data = await res.json();
        return { 
            props: { data } 
        }; // Pass the data as props to the component
    }
    // Handle errors or situations where data couldn't be fetched
    return { 
        status: res.status,
        props: { data: [] }
    };
}
// This runs on the server during SSR and on the client after navigation
export async function load({ fetch }) {
    let res;
    try {
        res = await fetch(`${import.meta.env.VITE_BACKEND_SERVER_IP}/api/news`);
    } catch {
        return {
            status: 500,
            props: { data: [] }
        }
    }
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
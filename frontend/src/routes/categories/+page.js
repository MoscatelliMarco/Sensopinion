import { loadedStore } from "../../stores";
import { error } from "@sveltejs/kit";

// This runs on the server during SSR and on the client after navigation
export async function load({ fetch }) {
    loadedStore.set(false)
    
    let res_metrics;
    try {
        res_metrics = await fetch(`/api/metrics`);
    } catch {}
    if (res_metrics.ok) {
        const data_metrics = await res_metrics.json();

        loadedStore.set(true)
        return {
            props: {
                metrics: data_metrics
            }
        }
    }
    loadedStore.set(true)
}
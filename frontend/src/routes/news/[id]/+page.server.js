import { error } from '@sveltejs/kit';
import { MongoClient, ObjectId } from 'mongodb';

const client = new MongoClient(import.meta.env.VITE_MONGO_CLIENT_URI)

await client.connect();
const db = client.db('users');
const collection = db.collection('users')


// This runs on the server during SSR and on the client after navigation
export async function load({ fetch, params, locals }) {
    let res;
    try {
        res = await fetch(`/api/news/one?factor=_id&value=${params.id}`);
    } catch {}
    if (res.ok) {
        const data = await res.json();
        if (!data.length) {
            throw new error(404, "We can't find the news")
        }

        // Save the data in the history
        if (locals.user) {
            // Search for the document with the provided elementId
            if (!locals.user.history) {
                // If 'history' field doesn't exist, create it with an array containing historyId
                await collection.updateOne({ _id: locals.user.id }, { $set: { history: [{date: new Date(), news_id: params.id}] } });
            } else {
                // If 'history' field exists
                const { history } = locals.user;
                if (history[0].news_id !== params.id) {
                    // If the first element is different from historyId, prepend it
                    let updatedHistory = [{date: new Date(), news_id: params.id}, ...history];
                    if (updatedHistory.length > 50) {
                        updatedHistory = updatedHistory.slice(0, 50);
                    }
                    await collection.updateOne({ _id: locals.user.id }, { $set: { history: updatedHistory } });
                }
            }
        }

        return {
            props: {
                data: data
            }
        }
    }
    throw new error(404, "We can't find the news")
}
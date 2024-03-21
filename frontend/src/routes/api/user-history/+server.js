import { json } from '@sveltejs/kit';
import { ObjectId } from 'mongodb';
import { collection_news } from "$lib/server/mongodb_collections";

const projection = { google_news_url: 0, time_analyze: 0 }; // Exclude fields from the results

export async function GET({ locals }) {
    if (!locals.user) {
        return json({ error: "You need to be logged in to access this route" });
    }
    if (!locals.user.history) {
        return json({ history: [] })
    }

    const history = Array.from(locals.user.history ? locals.user.history : []).map(str => new ObjectId(str.news_id));
    const search_results = await collection_news.find({ _id: { $in:  history} }, { projection }).toArray();

    // Because there are no duplicates in search results we create construct the history properly
    const constructed_history = locals.user.history.map(history_element => {
        return{
            date: history_element.date, 
            news: search_results.find(item => item._id.toString() === history_element.news_id)
        }
    });

    return json({ history: constructed_history });
}
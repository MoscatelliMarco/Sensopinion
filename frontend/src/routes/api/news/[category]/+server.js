import { json } from '@sveltejs/kit';
import { categories_news } from '../mongodb.js';

export async function GET(event) {
    const category = event.params.category || null;
    const subcategories = event.url.searchParams.get("subcategories") || null;

    const n_load = event.url.searchParams.get("n_load") || 9;
    const skip = event.url.searchParams.get("skip") || 0;

    const sort_by = event.url.searchParams.get("sort_by") || "date_published";
    const order = event.url.searchParams.get("order") || "descending";

    const search = event.url.searchParams.get("search") || null;

    const news = await categories_news(category, subcategories, n_load, skip, sort_by, order, search)
    return json(news)
}
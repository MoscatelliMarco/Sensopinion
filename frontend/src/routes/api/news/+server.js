import { json } from '@sveltejs/kit';
import { all_news } from './mongodb.js';

export async function GET(event) {
  const n_load = event.url.searchParams.get("n_load") || null;
  const skip = event.url.searchParams.get("skip") || 0;
  const sort_by = event.url.searchParams.get("sort_by") || 'date_published';
  const order = event.url.searchParams.get("order") || 'descending';

  const news = await all_news(n_load, skip, sort_by, order)
  return json(news)
}
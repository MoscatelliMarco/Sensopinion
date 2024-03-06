import { json } from '@sveltejs/kit';
import { screener_news } from '$lib/server/news.js';

export async function GET(event) {
  const politics = event.url.searchParams.get("politics");
  const economy = event.url.searchParams.get("economy");
  const environment = event.url.searchParams.get("environment");

  const n_load = event.url.searchParams.get("n_load") || 9;
  const skip = event.url.searchParams.get("skip") || 0;

  const sort_by = event.url.searchParams.get("sort_by") || "date_published";
  const order = event.url.searchParams.get("order") || "descending";

  const search = event.url.searchParams.get("search") || null;

  const news = await screener_news(politics, economy, environment, n_load, skip, sort_by, order, search)
  return json(news)
}
import { json } from '@sveltejs/kit';
import { one_news } from '$lib/server/news.js';

export async function GET(event) {
  const factor = event.url.searchParams.get("factor");
  const value = event.url.searchParams.get("value");

  const news = await one_news(factor, value)
  return json(news)
}
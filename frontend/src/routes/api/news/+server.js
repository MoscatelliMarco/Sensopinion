// src/routes/api/news.js
import { MongoClient, ObjectId } from 'mongodb';
import { json } from '@sveltejs/kit';

const client = new MongoClient(import.meta.env.VITE_MONGO_CLIENT_URL)
let db;

await client.connect();
db = client.db('news_database');
const collection = db.collection('news_collection')
db.collection('news_collection').createIndex({ "time_analyze": 1 }, { expireAfterSeconds: 604800 });

function sanitizeStringForMongoDB(inputString) {
  // Replace or escape special MongoDB characters
  let sanitizedString = inputString.replace('$', '\\$').replace('.', '\\.');
  return sanitizedString;
}

export async function GET(event) {
  const param = event.url.searchParams.get('param');
  const value = event.url.searchParams.get('value');

  const start_specific_id = event.url.searchParams.get("start_id");
  const n_load = event.url.searchParams.get("n_load");
  const sort_by = event.url.searchParams.get("sort_by");
  const order = event.url.searchParams.get("order");
  
  let projection = { google_news_url: 0, time_analyze: 0, url: 0 }; // Exclude fields from the results

  try {
    // Create sort criteria
    let sort_criteria;
    if (sort_by) {
      sort_criteria = { date_published: order ? parseInt(order) : 1 }  // Sort by date_published field in ascending order (1) or -1 for descending order
    } else {
      sort_criteria = {}
    }

    let news;
    if (param && value) {
      const sanitizedParam = sanitizeStringForMongoDB(param);
      const sanitizedValue = sanitizeStringForMongoDB(value);
      
      // Construct query
      let query = {};
      if (sanitizedParam === '_id') {
        query = { [sanitizedParam]: new ObjectId(sanitizedValue) };
      } else {
        query = { [sanitizedParam]: sanitizedValue };
      }

      projection = { google_news_url: 0, time_analyze: 0 } // Keep the url in this case to provide the most amount of data as possible
      news = await collection.find(query, { projection }).sort(sort_criteria).toArray();
    } else if (n_load) {
      if (start_specific_id) {
        news = await collection.find({ _id: { $gt: new ObjectId(sanitizeStringForMongoDB(start_specific_id)) } }, { projection }).sort(sort_criteria).skip(1).limit(parseInt(sanitizeStringForMongoDB(n_load))).toArray();
      } else {
        news = await collection.find({}, { projection }).sort(sort_criteria).limit(parseInt(sanitizeStringForMongoDB(n_load))).toArray();
      }

    } else {
      projection = { google_news_url: 0, time_analyze: 0, url: 0 }; // Exclude fields from the results
      news = await collection.find({}, { projection }).sort(sort_criteria).toArray();
    }
    
    return json(news);
  } catch (e) {
    console.log(e)
    return json([])
  }
}
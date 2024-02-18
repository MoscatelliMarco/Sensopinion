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
    
    news = await collection.find(query).toArray();
  } else {
    let projection = { google_news_url: 0, time_analyze: 0, url: 0 }; // Exclude fields from the results
    news = await collection.find({}, { projection }).toArray();
  }
  
  return json(news);
}
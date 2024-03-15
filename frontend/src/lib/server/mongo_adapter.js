// src/routes/api/news.js
import { MongoClient } from 'mongodb';
import { MongodbAdapter } from "@lucia-auth/adapter-mongodb";

const client = new MongoClient(import.meta.env.VITE_MONGO_CLIENT_URI)

await client.connect();
const db = client.db('users');
export const collection_users = db.collection('users')
const collection_sessions = db.collection('sessions')

export const adapter = new MongodbAdapter(collection_sessions, collection_users);
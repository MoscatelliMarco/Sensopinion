import { MongoClient } from 'mongodb';

const client = new MongoClient(import.meta.env.VITE_MONGO_CLIENT_URI)

await client.connect();

// NEWS

const db_news = client.db('news_database');

export const collection_news = db_news.collection('news_collection')

await collection_news.createIndex({ "date_published": 1 }, { expireAfterSeconds: 10 * 24 * 60 * 60 });

// USERS

const db_users = client.db('users');

export const collection_verification_token = db_users.collection('verification_tokens');
export const collection_delete_token = db_users.collection('delete_tokens');
export const collection_users = db_users.collection('users');
export const collection_sessions = db_users.collection('sessions')

await collection_verification_token.createIndex({ "created_at": 1 }, { expireAfterSeconds: 10 * 60 });
await collection_users.createIndex({ email: 1 }, { unique: true });
await collection_users.createIndex({ username: 1 }, { unique: true });
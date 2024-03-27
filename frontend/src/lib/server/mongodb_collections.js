import { MongoClient } from 'mongodb';

const client = new MongoClient(import.meta.env.VITE_MONGO_CLIENT_URI)

await client.connect();

// NEWS

const db_news = client.db('news_database');

export const collection_news = db_news.collection('news_collection')

// ACTIVATE ONLY IN PRODUCTION
// await collection_news.createIndex({ "date_published": 1 }, { expireAfterSeconds: 10 * 24 * 60 * 60 });

// USERS

const db_users = client.db('users');

export const collection_verification_token = db_users.collection('verification_tokens');
export const collection_delete_token = db_users.collection('delete_tokens');
export const collection_users = db_users.collection('users');
export const collection_sessions = db_users.collection('sessions')

await collection_verification_token.createIndex({ "created_at": 1 }, { expireAfterSeconds: 10 * 60 });
await collection_users.createIndex({ email: 1 }, { unique: true });
await collection_users.createIndex({ username: 1 }, { unique: true });

// RATE LIMITING

const db_rate_limiting = client.db('rate_limiting');
export const collection_login_limiting = db_rate_limiting.collection("login_limiting");
export const collection_register_limiting = db_rate_limiting.collection("register_limiting");
export const collection_verifylink_limiting = db_rate_limiting.collection("verifylink_limiting");
await collection_login_limiting.createIndex({ "created_at": 1 }, { expireAfterSeconds: 5 * 60 });
await collection_register_limiting.createIndex({ "created_at": 1 }, { expireAfterSeconds: 10 * 60 });
await collection_verifylink_limiting.createIndex({ "created_at": 1 }, { expireAfterSeconds: 5 * 60 });
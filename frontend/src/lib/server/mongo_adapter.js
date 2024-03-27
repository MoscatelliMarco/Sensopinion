import { collection_users, collection_sessions } from "$lib/server/mongodb_collections";
import { MongodbAdapter } from "@lucia-auth/adapter-mongodb";

export const adapter = new MongodbAdapter(collection_sessions, collection_users);
// src/routes/api/news.js
import { MongoClient, ObjectId } from 'mongodb';
import { globalStore } from '../../../stores';

const client = new MongoClient(import.meta.env.VITE_MONGO_CLIENT_URL)
let db;

await client.connect();
db = client.db('news_database');
const collection = db.collection('news_collection')
db.collection('news_collection').createIndex({ "time_analyze": 1 }, { expireAfterSeconds: 604800 });

function sanitizeStringForMongoDB(inputString) {
  try {
    // Replace or escape special MongoDB characters
    let sanitizedString = inputString.replace('$', '\\$').replace('.', '\\.');
    return sanitizedString;
  } catch (e) {
    return null;
  }
}

export async function all_news(n_load = null, skip = 0, sort_by = 'date_published', order = 'descending') {
    // Translate sort_by to the correct format
    let emotions;
    const unsubscribe = globalStore.subscribe(store => {
        emotions = Object.keys(store.emotion_dict);
    })
    unsubscribe()

    // Change positivity to polarity
    sort_by = sort_by === 'positivity' ? "polarity" : sort_by;
    const prefix = emotions.includes(sort_by) ? "emotions." : (["polarity", "subjectivity"].includes(sort_by) ? "sentiment." : "")
    sort_by =  prefix + sort_by

    const projection = { google_news_url: 0, time_analyze: 0, url: 0 }; // Exclude fields from the results

    try {
        const sort_order = order === 'ascending' ? 1 : -1; // If different from ascending -> descending
        let sort_criteria;
        if (sort_by) {
            sort_criteria = { [sort_by]: parseInt(sort_order) }
        } else {
            sort_criteria = {}
        }

        let news;
        if (n_load !== null) {
            news = await collection.find({}, { projection }).sort(sort_criteria).skip(parseInt(skip)).limit(parseInt(n_load)).toArray();
        } else {
            news = await collection.find({}, { projection }).sort(sort_criteria).skip(parseInt(skip)).toArray();
        }

        return news;
    } catch (e) {
        console.log(e);
        return [];
    }
}

export async function one_news(factor, value) {
    const projection = { google_news_url: 0, time_analyze: 0 }; // Exclude fields from the results

    // Sanitize strings for mongodb
    factor = sanitizeStringForMongoDB(factor);
    value = sanitizeStringForMongoDB(value);

    try {
        value = factor == "_id" ? new ObjectId(value) : value; // Convert value to object _id if factor == _id
        const news = await collection.find({[factor]: value}, { projection }).toArray();

        return news;
    } catch (e) {
        console.log(e);
        return [];
    }
}

export async function screener_news(politics, economy, environment, n_load = 9, skip = 0, sort_by = 'date_published', order = 'descending', search = null) {
    // Translate sort_by to the correct format
    let emotions;
    const unsubscribe = globalStore.subscribe(store => {
        emotions = Object.keys(store.emotion_dict);
    })
    unsubscribe()

    // Change positivity to polarity
    sort_by = sort_by === 'positivity' ? "polarity" : sort_by;
    const prefix = emotions.includes(sort_by) ? "emotions." : (["polarity", "subjectivity"].includes(sort_by) ? "sentiment." : "");
    sort_by =  prefix + sort_by;

    const projection = { google_news_url: 0, time_analyze: 0, url: 0 }; // Exclude fields from the results

    // Format properly for the request the parameters
    if (politics == 'true') {
        politics = true;
    } else if (politics) {
        // Get the list of the subcategories from politics
        politics = sanitizeStringForMongoDB(capitalizeEveryWord(politics.replaceAll("_", " "))).split(",");
    }
    if (economy == 'true') {
        economy = true;
    } else if (economy) {
        // Get the list of the subcategories from economy
        economy = sanitizeStringForMongoDB(capitalizeEveryWord(economy.replaceAll("_", " "))).split(",");
    }
    if (environment == 'true') {
        environment = true;
    } else if (environment) {
        // Get the list of the subcategories from environment
        environment = sanitizeStringForMongoDB(capitalizeEveryWord(environment.replaceAll("_", " "))).split(",");
    }
    
    // Create the condition for the request
    let conditions = [];

    // Construct conditions based on the input parameters
    if (politics === true) {
        conditions.push({ "categories.Politics": { $exists: true } });
    } else if (Array.isArray(politics)) {
        conditions.push({ "categories.Politics": { $in: politics } });
    }
    
    if (economy === true) {
        conditions.push({ "categories.Economy": { $exists: true } });
    } else if (Array.isArray(economy)) {
        conditions.push({ "categories.Economy": { $in: economy } });
    }
    
    if (environment === true) {
        conditions.push({ "categories.Environment": { $exists: true } });
    } else if (Array.isArray(environment)) {
        conditions.push({ "categories.Environment": { $in: environment } });
    }

    // Conditions must be {} if it's blank to prevent any errors $and/$or/$nor must be a nonempty array
    conditions = conditions.length ? { $or: conditions } : {};

   // Construct the search condition $and/$or/$nor must be a nonempty array
    const searchCondition = search ? {
        $or: [
            { url: { $regex: search, $options: 'i' } }, // Case-insensitive regex search for url
            { title: { $regex: search, $options: 'i' } }, // Case-insensitive regex search for title
            { description: { $regex: search, $options: 'i' } } // Case-insensitive regex search for description
        ]
    } : {};

    // Combine conditions and searchCondition with an $and operator
    let query = {
        $and: [
            conditions, // Check categories
            searchCondition // Check search keyword
        ]
    };

    try {
        // Execute the query with limit, skip, sorting, and ordering
        const news = await collection.find(query, { projection })
        .limit(parseInt(n_load))
        .skip(parseInt(skip))
        .sort({ [sort_by]: order === 'descending' ? -1 : 1 })
        .toArray();

        return news;
    } catch (e) {
        console.log(e);
        return [];
    }
}

// TODO this function needs to be adapted to categories and need to adapt news display in categories
export async function categories_news(category, subcategories, n_load = 9, skip = 0, sort_by = 'date_published', order = 'descending') {
    // Translate sort_by to the correct format
    let emotions;
    const unsubscribe = globalStore.subscribe(store => {
        emotions = Object.keys(store.emotion_dict);
    })
    unsubscribe()

    // Change positivity to polarity
    sort_by = sort_by === 'positivity' ? "polarity" : sort_by;
    const prefix = emotions.includes(sort_by) ? "emotions." : (["polarity", "subjectivity"].includes(sort_by) ? "sentiment." : "");
    sort_by =  prefix + sort_by;

    const projection = { google_news_url: 0, time_analyze: 0, url: 0 }; // Exclude fields from the results

    // Format properly for the request the parameters
    if (politics == 'true') {
        politics = true;
    } else if (politics) {
        // Get the list of the subcategories from politics
        politics = sanitizeStringForMongoDB(capitalizeEveryWord(politics.replaceAll("_", " "))).split(",");
    }
    if (economy == 'true') {
        economy = true;
    } else if (economy) {
        // Get the list of the subcategories from economy
        economy = sanitizeStringForMongoDB(capitalizeEveryWord(economy.replaceAll("_", " "))).split(",");
    }
    if (environment == 'true') {
        environment = true;
    } else if (environment) {
        // Get the list of the subcategories from environment
        environment = sanitizeStringForMongoDB(capitalizeEveryWord(environment.replaceAll("_", " "))).split(",");
    }
    
    // Create the condition for the request
    let conditions = [];

    // Construct conditions based on the input parameters
    if (politics === true) {
        conditions.push({ "categories.Politics": { $exists: true } });
    } else if (Array.isArray(politics)) {
        conditions.push({ "categories.Politics": { $in: politics } });
    }
    
    if (economy === true) {
        conditions.push({ "categories.Economy": { $exists: true } });
    } else if (Array.isArray(economy)) {
        conditions.push({ "categories.Economy": { $in: economy } });
    }
    
    if (environment === true) {
        conditions.push({ "categories.Environment": { $exists: true } });
    } else if (Array.isArray(environment)) {
        conditions.push({ "categories.Environment": { $in: environment } });
    }

    // Conditions must be {} if it's blank to prevent any errors $and/$or/$nor must be a nonempty array
    conditions = conditions.length ? { $or: conditions } : {};

   // Construct the search condition $and/$or/$nor must be a nonempty array
    const searchCondition = search ? {
        $or: [
            { url: { $regex: search, $options: 'i' } }, // Case-insensitive regex search for url
            { title: { $regex: search, $options: 'i' } }, // Case-insensitive regex search for title
            { description: { $regex: search, $options: 'i' } } // Case-insensitive regex search for description
        ]
    } : {};

    // Combine conditions and searchCondition with an $and operator
    let query = {
        $and: [
            conditions, // Check categories
            searchCondition // Check search keyword
        ]
    };

    try {
        // Execute the query with limit, skip, sorting, and ordering
        const news = await collection.find(query, { projection })
        .limit(parseInt(n_load))
        .skip(parseInt(skip))
        .sort({ [sort_by]: order === 'descending' ? -1 : 1 })
        .toArray();

        return news;
    } catch (e) {
        console.log(e);
        return [];
    }
}

// This function is needed because the subcategories in mongodb are stored with the first letter capitalized
function capitalizeEveryWord(str) {
    return str.replace(/(^|\s|,)([a-z])/g, function(char) {
        return char.toUpperCase();
    });
}
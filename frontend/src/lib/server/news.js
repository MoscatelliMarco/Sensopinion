import { collection_news } from "$lib/server/mongodb_collections";
import { ObjectId } from 'mongodb';
import { globalStore } from '../../stores';

const projection = { google_news_url: 0, time_analyze: 0 }; // Exclude fields from the results

function sanitizeStringForMongoDB(inputString) {
  try {
    // Replace or escape special MongoDB characters
    let sanitizedString = inputString.replaceAll('$', '\\$').replace('.', '\\.');
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
            news = await collection_news.find({}, { projection }).sort(sort_criteria).skip(parseInt(skip)).limit(parseInt(n_load)).toArray();
        } else {
            news = await collection_news.find({}, { projection }).sort(sort_criteria).skip(parseInt(skip)).toArray();
        }

        return news;
    } catch (e) {
        console.log(e);
        return [];
    }
}

export async function one_news(factor, value) {

    // Sanitize strings for mongodb
    factor = sanitizeStringForMongoDB(factor);
    value = sanitizeStringForMongoDB(value);

    try {
        value = factor == "_id" ? new ObjectId(value) : value; // Convert value to object _id if factor == _id
        const news = await collection_news.find({[factor]: value}, { projection }).toArray();

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
        const news = await collection_news.find(query, { projection })
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

// NOTE: even though there is the search parameters here it only works in api request and not in the client
export async function categories_news(category, subcategories, n_load = 9, skip = 0, sort_by = 'date_published', order = 'descending', search = null) {
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
    
    // Create the condition for the request
    let conditions = [];

    // Correct formatting subcategories
    subcategories = subcategories ? sanitizeStringForMongoDB(capitalizeEveryWord(subcategories.replaceAll("_", " "))).split(",") : [];

    // Construct conditions based on the input parameters
    if (category === "politics") {
        if (subcategories.length) {
            conditions.push({ "categories.Politics": { $in: subcategories } });
        } else {
            conditions.push({ "categories.Politics": { $exists: true } });
        }
    } else if (category === "economy") {
        if (subcategories.length) {
            conditions.push({ "categories.Economy": { $in: subcategories } });
        } else {
            conditions.push({ "categories.Economy": { $exists: true } });
        }
    } else if (category === "environment") {
        if (subcategories.length) {
            conditions.push({ "categories.Environment": { $in: subcategories } });
        } else {
            conditions.push({ "categories.Environment": { $exists: true } });
        }
    } else {
        return [] // If the categories are not accepted just send an empty array
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
        const news = await collection_news.find(query, { projection })
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
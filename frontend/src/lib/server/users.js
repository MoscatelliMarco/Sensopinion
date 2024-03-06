// src/routes/api/news.js
import { MongoClient, ObjectId } from 'mongodb';
import { userSchema } from './validation_schema';
import crypto from 'crypto';

const client = new MongoClient(import.meta.env.VITE_MONGO_CLIENT_URI)
let db;

await client.connect();
db = client.db('users');
const collection = db.collection('users')

function sanitizeStringForMongoDB(inputString) {
  try {
    // Replace or escape special MongoDB characters
    let sanitizedString = inputString.replaceAll('$', '\\$');
    return sanitizedString;
  } catch (e) {
    return null;
  }
}

function hashPassword(password) {
    const salt = crypto.randomBytes(128).toString("base64");
    const iterations = 10000;

    const hash = crypto.pbkdf2Sync(password, salt, iterations, 512, "sha512").toString("hex");

    return { salt, hash, iterations };
}

async function doesUserExist(username, email) {
    const existingEmail = await collection.findOne({ email });
    if (existingEmail) {
        return true;
    }
    const existingUsername = await collection.findOne({ username });
    if (existingUsername) {
        return true;
    }
    return false;
}

function isPasswordCorrect(savedHash, savedSalt, savedIterations, passwordAttempt) {
    const hashAttempt = crypto.pbkdf2Sync(passwordAttempt, savedSalt, savedIterations, 512, "sha512").toString("hex");
    return hashAttempt === savedHash;
}

export async function register(username, email, password) {
    username = sanitizeStringForMongoDB(username);
    email = sanitizeStringForMongoDB(email);
    password = sanitizeStringForMongoDB(password);

    const { error } = userSchema.validate({
        username: username,
        email: email,
        password: password
    })

    if (error) {
        let msg = '';
        if (error.details.length && error.details[0].message) {
            msg = error.details[0].message;
        } else {
            msg = "Bad request";
        }
        return {
            error: true,
            msg: msg
        }
    }

    const user_exists = await doesUserExist(username, email);
    if (user_exists) {
        return {
            error: true,
            code: 409,
            msg: "Username or password already been used"
        }
    }

    const user = {};

    user['username'] = username;
    user['email'] = email;
    const { salt, hash, iterations } = hashPassword(password);
    user['hash_password'] = hash;
    user['salt_password'] = salt;
    user['iterations_password'] = iterations; 

    const result = await collection.insertOne(user);
    console.log(`A document was inserted with the _id: ${result.insertedId}`);

    return {
        msg: "User registered"
    }
}
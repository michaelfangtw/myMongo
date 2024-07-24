require('dotenv').config();
const { MongoClient } = require('mongodb');
const moment = require('moment-timezone');

async function run() {
    const uri = process.env.MONGO_URI;
    console.log(uri);
    const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

    try {
        console.log("Connecting to MongoDB...");
        await client.connect();
        console.log("Connected to MongoDB");

        const database = client.db('ctiportal');
        const collection = database.collection('Users');

        const document = {
            name: "Example Document",
            date: moment.tz('Asia/Taipei').format()
        };

        console.log("Inserting document...");
        const result = await collection.insertOne(document);
        console.log(`New document inserted with _id: ${result.insertedId}`);
    } catch (err) {
        console.error("An error occurred:", err);
    } finally {
        console.log("Closing connection");
        await client.close();
    }
}

run().catch(console.dir);

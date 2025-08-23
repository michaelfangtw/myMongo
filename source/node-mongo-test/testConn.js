require('dotenv').config();
const { MongoClient } = require('mongodb');

async function testConnection() {
    const uri = process.env.MONGO_URI;
    const client = new MongoClient(uri);

    try {
        await client.connect();
        console.log("Connected successfully to server");
    } catch (err) {
        console.error(err);
    } finally {
        await client.close();
    }
}

testConnection().catch(console.dir);

const { MongoClient } = require('mongodb');

async function testConnection() {
    const uri = "mongodb://admin:your_password@localhost:27017/mydatabase?authSource=admin";
    const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

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

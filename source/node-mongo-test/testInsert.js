require('dotenv').config();
const { MongoClient } = require('mongodb');
const moment = require('moment-timezone');
const fs = require('fs');
const path = require('path');

const LOG_DIR = path.resolve(__dirname, 'logs');
const LOG_FILE = path.join(LOG_DIR, 'testInsert.log');

function ensureLogDir() {
    if (!fs.existsSync(LOG_DIR)) {
        fs.mkdirSync(LOG_DIR, { recursive: true });
    }
}

function appendLog(level, message, meta) {
    ensureLogDir();
    const timestamp = new Date().toISOString();
    const entry = { timestamp, level, message, meta };
    fs.appendFileSync(LOG_FILE, JSON.stringify(entry) + '\n');
}

async function run() {
    const uri = process.env.MONGO_URI;
    appendLog('info', 'Using MONGO_URI', { uri: uri ? 'present' : 'missing' });
    console.log(uri);

    const client = new MongoClient(uri);

    try {
        appendLog('info', 'Connecting to MongoDB');
        console.log('Connecting to MongoDB...');
        await client.connect();
        appendLog('info', 'Connected to MongoDB');
        console.log('Connected to MongoDB');

        const database = client.db('ctiportal');
        const collection = database.collection('Users');

        const document = {
            name: 'Example Document',
            date: moment.tz('Asia/Taipei').format()
        };

        appendLog('info', 'Inserting document', { document });
        console.log('Inserting document...');
        const result = await collection.insertOne(document);
        const msg = `New document inserted with _id: ${result.insertedId}`;
        appendLog('info', 'Insert result', { insertedId: result.insertedId });
        console.log(msg);
    } catch (err) {
        appendLog('error', 'An error occurred', { error: err && err.message });
        console.error('An error occurred:', err);
    } finally {
        appendLog('info', 'Closing connection');
        console.log('Closing connection');
        await client.close();
    }
}

run().catch(err => {
    appendLog('error', 'Unhandled error in run', { error: err && err.message });
    console.dir(err);
});

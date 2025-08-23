const { MongoClient } = require('mongodb');
const cron = require('node-cron');
const fs = require('fs').promises;
const path = require('path');
const moment = require('moment-timezone'); // add this near top

const MONGO_URI = process.env.MONGO_URI || 'mongodb://admin:your_password@mongo:27017/?authSource=admin';
const DB_NAME = process.env.DB_NAME || 'testdb';
let client;

const LOG_DIR = path.join(process.cwd(), 'logs');
const LOG_FILE = path.join(LOG_DIR, 'cron.log');
const TZ = process.env.TZ || 'UTC';

// create/connect client once
async function createClient() {
  if (client) return client;
  client = new MongoClient(MONGO_URI);
  await client.connect();
  console.log('Connected to MongoDB');
  await saveLog('Connected to MongoDB');
  return client;
}

async function ensureLogDir() {
  try {
    await fs.mkdir(LOG_DIR, { recursive: true });
  } catch (e) {
    // fail silently; console for debugging
    console.error('ensureLogDir error:', e);
  }
}

async function saveLog(message) {
  // use moment-timezone to format local time with offset/name
  const ts = moment.tz(new Date(), TZ).format('YYYY-MM-DDTHH:mm:ss.SSSZ'); 
  const line = `${ts} ${message}\n`;
  try {
    await ensureLogDir();
    await fs.appendFile(LOG_FILE, line, 'utf8');
  } catch (e) {
    console.error('Failed to write log:', e);
  }
}

// testInsert function (merged)
// adjust collection name / document as needed or replace with your testInsert body
async function testInsert() {
  const c = await createClient();
  const db = c.db(DB_NAME);
  const coll = db.collection('test');
  const doc = { createdAt: new Date(), note: 'cron test insert' };
  const res = await coll.insertOne(doc);
  console.log('Inserted document id:', res.insertedId);
  await saveLog(`Inserted document id: ${res.insertedId}`);
  return res.insertedId;
}

// wrapper job that calls testInsert (keeps your previous runJob naming)
async function runJob() {
  try {
    const id = await testInsert();
    console.log('job run at', new Date());
  }
  catch(ex) {
    console.error('Job error:', ex);
    await saveLog(`Job error: ${ex && ex.message ? ex.message : String(ex)}`);
  }
}

// schedule every 1 minute
cron.schedule('*/1 * * * *', () => {
  runJob();
});

// run once at startup
(async () => {
  try {
    await runJob();
  } catch (e) {
    console.error('Initial run error:', e);
    if (typeof saveLog === 'function') {
      await saveLog(`Initial run error: ${e && e.message ? e.message : String(e)}`);
    }
  }
})();

// graceful shutdown
process.on('SIGINT', async () => {
  console.log('Shutting down...');
  process.exit(0);
});

process.on('unhandledRejection', async (reason) => {
  console.error('Unhandled Rejection:', reason);
  await saveLog(`Unhandled Rejection: ${reason}`);
});

process.on('uncaughtException', async (err) => {
  console.error('Uncaught Exception:', err);
  await saveLog(`Uncaught Exception: ${err.stack || err}`);
});
const path = require('path');
const fs = require('fs');
const express = require('express');
const OS = require('os');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();

app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, '/')));
app.use(cors());

/* =========================
   MONGODB CONNECTION
========================= */

mongoose.set('bufferCommands', false); // fail fast if not connected

const mongoUrl = process.env.MONGO_URL || 'mongodb://127.0.0.1:27017/SuperData';
console.log('Connecting to Mongo:', mongoUrl);

// Promise that resolves when Mongo is connected
const mongoReady = mongoose
  .connect(mongoUrl, { serverSelectionTimeoutMS: 5000 })
  .then(() => {
    console.log('MongoDB Connection Successful');
  })
  .catch((err) => {
    console.error('MongoDB Connection Failed:', err);
    process.exit(1);
  });

/* =========================
   SCHEMA + MODEL
========================= */

const Schema = mongoose.Schema;

const dataSchema = new Schema({
  name: String,
  id: Number,
  description: String,
  image: String,
  velocity: String,
  distance: String,
});

const planetModel = mongoose.model('planets', dataSchema);

/* =========================
   ROUTES
========================= */

app.post('/planet', async function (req, res) {
  try {
    // Make extra sure DB is connected before querying
    await mongoReady;

    const planetData = await planetModel.findOne({ id: req.body.id });

    if (!planetData) {
      return res.status(404).send('Planet not found');
    }

    return res.send(planetData);
  } catch (err) {
    console.error(err);
    return res.status(500).send('Error in Planet Data');
  }
});

app.get('/', async (req, res) => {
  res.sendFile(path.join(__dirname, '/', 'index.html'));
});

app.get('/api-docs', (req, res) => {
  fs.readFile('oas.json', 'utf8', (err, data) => {
    if (err) {
      console.error('Error reading file:', err);
      return res.status(500).send('Error reading file');
    }
    res.json(JSON.parse(data));
  });
});

app.get('/os', function (req, res) {
  res.json({
    os: OS.hostname(),
    env: process.env.NODE_ENV,
  });
});

app.get('/live', function (req, res) {
  res.json({ status: 'live' });
});

app.get('/ready', function (req, res) {
  res.json({ status: 'ready' });
});

/* =========================
   START SERVER (only when ready)
========================= */

mongoReady.then(() => {
  app.listen(3000, () => {
    console.log('Server successfully running on port - 3000');
  });
});

/* =========================
   EXPORT FOR TESTING
========================= */

module.exports = { app, mongoReady };

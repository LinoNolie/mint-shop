const express = require('express');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

const app = express();

app.use(cors());
app.use(express.json({ limit: '50mb' }));

// Serve static files from the parent directory
app.use(express.static(path.join(__dirname, '..')));

// Serve try-on.html for /try-on route
app.get('/try-on', (req, res) => {
    res.sendFile(path.join(__dirname, '..', 'try-on.html'));
});

// ...rest of your server code...

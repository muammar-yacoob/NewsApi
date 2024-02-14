require('dotenv').config();
const express = require('express');
const serverless = require('serverless-http');
const newsRoutes = require('./newsRoutes');
const app = express();
// const PORT = 8001;

app.use('/', newsRoutes);
app.use(express.static('public'));

// app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

module.exports.handler = serverless(app);
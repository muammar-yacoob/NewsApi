require('dotenv').config();
const express = require('express');
const serverless = require('serverless-http');
const newsRoutes = require('../src/newsRoutes');
const app = express();

app.use('/', newsRoutes);
app.use(express.static('public'));

//@ serverless
// const PORT = 8888;
// app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

module.exports.handler = serverless(app);
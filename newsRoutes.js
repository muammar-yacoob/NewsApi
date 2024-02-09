const express = require('express');
const { scrapeNews } = require('./newsScraper');
const router = express.Router();

router.get('/', (req, res) => {
    res.send('Welcome to the news scraper!');
});

http://localhost:8001/api/news/?keyword=war&name=bbc
router.get('/api/news/:name?', async (req, res) => {
    const { keyword, name } = req.query; // Correctly extracting keyword and name

    if (!keyword) {
        return res.status(400).send('Keyword query parameter is required');
    }

    try {
        const headlines = await scrapeNews(keyword, name); // name can be undefined
        res.json({ results: headlines, count: headlines.length });
    } catch (error) {
        console.error('Failed to fetch news:', error);
        res.status(500).send('Error scraping news');
    }
});


module.exports = router;

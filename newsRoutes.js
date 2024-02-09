const express = require('express');
const { scrapeNews } = require('./newsScraper');
const router = express.Router();

router.get('/', (req, res) => {
    res.send('Welcome to the news scraper!');
});

router.get('/api/news', async (req, res) => {
    const { keyword } = req.query;
    if (!keyword) {
        return res.status(400).send('Keyword query parameter is required');
    }

    try {
        const headlines = await scrapeNews(keyword);
        res.json({ results: headlines, count: headlines.length });
    } catch (error) {
        console.error('Failed to fetch news:', error);
        res.status(500).send('Error scraping news');
    }
});

module.exports = router;
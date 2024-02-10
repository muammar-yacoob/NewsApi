const express = require('express');
const { scrapeNews } = require('./newsScraper');
const router = express.Router();

router.get('/', (req, res) => {
    res.send('Welcome to the news scraper!');
});

http://localhost:8001/api/news/?keyword=war&name=bbc&thumb=true
router.get('/api/news/:name?', async (req, res) => {
    const { keyword, name, thumb } = req.query; 

    if (!keyword) {
        return res.status(400).send('Keyword query parameter is required');
    }

    const includeThumb = thumb == 'true';

    try {
        const headlines = await scrapeNews(keyword, name, includeThumb); 
        res.json({ results: headlines, count: headlines.length });
    } catch (error) {
        console.error('Failed to fetch news:', error);
        res.status(500).send('Error scraping news');
    }
});

module.exports = router;
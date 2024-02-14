const express = require('express');
const { scrapeNews } = require('./newsScraper');
const router = express.Router();

// Landing page route
router.get('/', (req, res) => {
    const currentDomain = req.protocol + '://' + req.get('host');
    const exampleLink = `${currentDomain}/api/news?keyword=war&name=bbc&thumb=true`;
    res.send(`<center><h2>Welcome to the news scraper!</h2><br>Example usage: <a href="${exampleLink}">${exampleLink}</a></center>`);
});

http://localhost:8888/api/news/?keyword=war&name=bbc&thumb=true
router.get('/api/news/:name?', async (req, res) => {
    const { keyword, name, thumb } = req.query; 

    if (!keyword) {
        return res.status(400).send('Keyword query parameter is required');
    }

    const includeThumb = thumb === 'true';
    const startTime = Date.now(); // Start timing

    try {
        const headlines = await scrapeNews(keyword, name, includeThumb);
        const duration = Date.now() - startTime; // Calculate duration in milliseconds

        res.json({
            results: headlines,
            count: headlines.length,
            queryTime: `${duration} ms` // Include query time in milliseconds
        });
    } catch (error) {
        console.error('Failed to fetch news:', error);
        res.status(500).send('Error scraping news');
    }
});

module.exports = router;
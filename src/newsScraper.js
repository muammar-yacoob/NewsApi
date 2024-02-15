const axios = require('axios');
const cheerio = require('cheerio');
const newspapers = require('./newspapers');

const defaultImageUrl = 'http://localhost:8888/public/imgs/newspaper.png';

async function scrapeNews(keyword, name, thumb) {
    let targetNewspapers = newspapers;

    if (name) {
        targetNewspapers = targetNewspapers.filter(newspaper => newspaper.name === name);
        if (targetNewspapers.length === 0) {
            console.error(`No newspaper found with the name "${name}"`);
            return [];
        }
    }

    const allHeadlines = [];
    const seenTitles = new Set(); // Set to track seen titles

    for (const newspaper of targetNewspapers) {
        try {
            const response = await axios.get(newspaper.address);
            const $ = cheerio.load(response.data);
            const keywordRegex = new RegExp(`\\b${keyword}\\b`, 'i');

            const links = $('a').toArray();
            for (const element of links) {
                const title = $(element).text().trim();
                let url = $(element).attr('href');
                if (url.startsWith('/')) {
                    url = new URL(url, newspaper.address).href;
                }

                if (keywordRegex.test(title) && !seenTitles.has(title)) {
                    seenTitles.add(title); // Prevent processing the same title more than once
                    
                    // Initialize newsItem without imageUrl
                    let newsItem = { title, url, source: newspaper.name };

                    if (thumb) {
                        // Asynchronously fetch the image URL, if thumb is true
                        newsItem.imageUrl = await getFirstImageUrl(url).catch(() => defaultImageUrl);
                    }

                    allHeadlines.push(newsItem);
                }
            }
        } catch (error) {
            console.error(`Error scraping ${newspaper.name}:`, error);
        }
    }

    return allHeadlines;
}

async function getFirstImageUrl(url) {
    const response = await axios.get(url);
    const $ = cheerio.load(response.data);
    let imageUrl = $('img').first().attr('src');
    if (imageUrl && !imageUrl.startsWith('http')) {
        imageUrl = new URL(imageUrl, url).toString();
    }
    return imageUrl || defaultImageUrl; // Ensure imageUrl defaults to defaultImageUrl if undefined
}

module.exports = { scrapeNews };

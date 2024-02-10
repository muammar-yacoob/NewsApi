const axios = require('axios');
const cheerio = require('cheerio');
const newspapers = require('./newspapers');

const defaultImageUrl = 'http://localhost:8001/imgs/newspaper.png';

async function scrapeNews(keyword, name, thumb) {
    let targetNewspapers = newspapers;

    if (name) {
        const filteredNewspapers = newspapers.filter(newspaper => newspaper.name === name);
        if (filteredNewspapers.length === 0) {
            console.error(`No newspaper found with the name "${name}"`);
            return [];
        }
        targetNewspapers = filteredNewspapers;
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
                const baseUrl = new URL(newspaper.address).origin;

                if (url && url.startsWith('/')) {
                    url = baseUrl + url;
                }

                if (url && keywordRegex.test(title) && !seenTitles.has(title)) {
                    let newsItem = { title: title, url: url, source: newspaper.name };

                    if (thumb) {
                        try {
                            let imageUrl = await getFirstImageUrl(url);
                            newsItem.imageUrl = imageUrl || defaultImageUrl;
                        } catch (error) {
                            console.error(`Failed to fetch image for ${url}:`, error);
                            newsItem.imageUrl = defaultImageUrl;
                        }
                    }

                    allHeadlines.push(newsItem);
                    seenTitles.add(title); // Mark this title as seen
                }
            }
        } catch (error) {
            console.error(`Error scraping ${newspaper.name}:`, error);
            continue;
        }
    }

    return allHeadlines;
}

async function getFirstImageUrl(url) {
    try {
        const response = await axios.get(url);
        const $ = cheerio.load(response.data);
        let imageUrl = $('img').first().attr('src');

        if (imageUrl && !imageUrl.startsWith('http')) {
            imageUrl = new URL(imageUrl, url).toString();
        }

        return imageUrl;
    } catch (error) {
        console.error('Failed to fetch image:', error);
        return undefined; // Allow for default image handling
    }
}

module.exports = { scrapeNews };
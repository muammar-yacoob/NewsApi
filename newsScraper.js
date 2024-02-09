const axios = require('axios');
const cheerio = require('cheerio');
const newspapers = require('./newspapers');

/**
 * Scrapes news headlines and links from each newspaper URL that contain the specified keyword.
 * @param {string} keyword - The keyword to filter headlines.
 * @returns {Promise<Array<{title: string, link: string, source: string}>>} - A promise that resolves to an array of headline objects.
 */
async function scrapeNews(keyword) {
    const scrapeTasks = newspapers.map(async ({ name, address }) => {
        try {
            const response = await axios.get(address);
            const $ = cheerio.load(response.data);
            const headlines = [];
            const keywordRegex = new RegExp(`\\b${keyword}\\b`, 'i'); // This is correct for regex matching

            $('a').each((_, element) => {
                const source = name;
                const title = $(element).text();
                const baseUrl = new URL(address).origin;
                let url = $(element).attr('href'); // Change const to let
                if(url.startsWith('/')) { // Simplified check for relative URLs
                    url = baseUrl + url;
                }
            
                if (keywordRegex.test(title)) {
                    headlines.push({ title, url, source });
                }
            });
            

            return headlines;
        } catch (error) {
            console.error(`Error scraping ${name}:`, error);
            return [];
        }
    });

    return Promise.all(scrapeTasks).then(results => results.flat());
}

module.exports = { scrapeNews };
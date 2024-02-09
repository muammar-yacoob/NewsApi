const axios = require('axios');
const cheerio = require('cheerio');
const newspapers = require('./newspapers');

async function scrapeNews(keyword, name) {
    let targetNewspapers = newspapers;

    // If a name is provided, filter for that specific newspaper. Otherwise, target all newspapers.
    if (name) {
        const filteredNewspapers = newspapers.filter(newspaper => newspaper.name === name);
        if (filteredNewspapers.length === 0) {
            console.error(`No newspaper found with the name "${name}"`);
            return [];
        }
        targetNewspapers = filteredNewspapers;
    }

    const allHeadlines = [];
    for (const newspaper of targetNewspapers) {
        try {
            const response = await axios.get(newspaper.address);
            const $ = cheerio.load(response.data);
            const keywordRegex = new RegExp(`\\b${keyword}\\b`, 'i');

            $('a').each((_, element) => {
                const title = $(element).text();
                let url = $(element).attr('href');
                const baseUrl = new URL(newspaper.address).origin;

                // Ensure absolute URL
                if (url.startsWith('/')) {
                    url = baseUrl + url;
                }

                if (keywordRegex.test(title)) {
                    allHeadlines.push({
                        title,
                        url,
                        source: newspaper.name,
                    });
                }
            });
        } catch (error) {
            console.error(`Error scraping ${newspaper.name}:`, error);
            continue;
        }
    }

    return allHeadlines;
}

module.exports = { scrapeNews };
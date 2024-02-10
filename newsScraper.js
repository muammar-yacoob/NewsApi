const axios = require('axios');
const cheerio = require('cheerio');
const newspapers = require('./newspapers');

async function scrapeNews(keyword, name) {
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
    for (const newspaper of targetNewspapers) {
        try {
            const response = await axios.get(newspaper.address);
            const $ = cheerio.load(response.data);
            const keywordRegex = new RegExp(`\\b${keyword}\\b`, 'i');

            const links = $('a').toArray(); // Convert jQuery object to an array for iteration
            for (const element of links) {
                const title = $(element).text().trim();
                let url = $(element).attr('href');
                const baseUrl = new URL(newspaper.address).origin;

                if (url && url.startsWith('/')) {
                    url = baseUrl + url;
                }

                if (url && keywordRegex.test(title)) {
                    // Ensure the URL is not undefined or null before proceeding
                    try {
                        let imageUrl = await getFirstImageUrl(url); 
                        allHeadlines.push({
                            title: title,
                            url: url,
                            source: newspaper.name,
                            imageUrl: imageUrl
                        });
                    } catch (error) {
                        console.error(`Failed to fetch image for ${url}:`, error);
                        // Optionally push the headline with a default or empty imageUrl
                    }
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

        if (!imageUrl.startsWith('http')) {
            // Convert relative URLs to absolute
            imageUrl = new URL(imageUrl, url).toString();
        }

        return imageUrl;
    } catch (error) {
        console.error('Failed to fetch image:', error);
        throw error; // Rethrow to handle it in the calling context
    }
}

module.exports = { scrapeNews };

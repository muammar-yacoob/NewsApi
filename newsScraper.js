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
                let imageUrl = getImageUrl($, element, baseUrl);

                if (keywordRegex.test(title)) {
                    allHeadlines.push({
                        title: title,
                        url: url,
                        source: newspaper.name,
                        imageUrl: imageUrl
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

function getImageUrl($, element, baseUrl) {
    const defaultImageUrl = 'https://spark-games.co.uk/images/logo.png';
    let imageUrl = $(element).find('img').attr('src') ||
        $(element).siblings('img').attr('src') ||
        $(element).closest('article, section').find('img').attr('src') ||
        $(element).find('img').attr('data-src'); // Attempt to find an image URL


    // If no image URL is found, then assign a default image URL
    if (!imageUrl) {
        imageUrl = defaultImageUrl;
    } else if (!imageUrl.startsWith('http')) {
        imageUrl = new URL(imageUrl, baseUrl).toString(); // Convert relative URLs to absolute
    }
    return imageUrl;
}

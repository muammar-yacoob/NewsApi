const axios = require('axios');
const cheerio = require('cheerio');
const newspapers = require('./newspapers');

async function scrapeNews(keyword, name) {
    let newspaperToScrape = newspapers;
    if(name){
        newspaperToScrape = newspapers.find((newspaper) => newspaper.name === name);
    }
    if(!newspaperToScrape){
        return [];
    }
    const { address } = newspaperToScrape;
    try {
        const response = await axios.get(address);
        const $ = cheerio.load(response.data);
        const headlines = [];
        const keywordRegex = new RegExp(`\\b${keyword}\\b`, 'i');

        $('a').each((_, element) => {
            const source = name;
            const title = $(element).text();
            const baseUrl = new URL(address).origin;
            let url = $(element).attr('href');
            if(url.startsWith('/')) {
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
}

module.exports = { scrapeNews };

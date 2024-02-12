# News Fetching API

This API fetches news articles based on a keyword search. It also supports filtering news by the name of the newsletter and optionally includes thumbnail images of the news titles.

## Features

- **Keyword Search**: Fetch news articles related to a specific keyword.
- **Filter by Newsletter**: Optionally filter results by a specific news source.
- **Thumbnail Images**: Optionally include thumbnail images for each news article.

## API Usage

To fetch news articles, make a GET request to the API with the following parameters:
- `keyword` (required): The keyword to search for in news articles.
- `thumb` (optional): Set to `true` to include thumbnail images in the response.
- `name` (optional): Specify the name of the newsletter to filter results by a specific news source.
Example:
```shell
http://localhost:8001/api/news/?keyword=tax&thumb=true&name=bbc
```
output:
```json
{
"results": [
{
"title": "Councillors recommend 16% council tax hike",
"url": "https://www.bbc.co.uk/news/uk-wales-68272334",
"source": "bbc",
"imageUrl": "https://ichef.bbci.co.uk/news/976/cpsprodpb/0DD6/production/_132624530_tenby_gettyimages-1475141702.jpg"
},
{
"title": "What is council tax and how much is it going up?",
"url": "https://www.bbc.co.uk/news/uk-politics-55765504",
"source": "bbc",
"imageUrl": "https://ichef.bbci.co.uk/news/976/cpsprodpb/16773/production/_132591029_gettyimages-1393688319-1.jpg"
}
],
"count": 2,
"queryTime": "616 ms"
}
```
The API sources news from a predefined list of newsletters defined in `newspapers.js`. You can extend this list by adding new entries:

```javascript
const newspapers = [
    {
        name: 'bbc',
        address: 'https://www.bbc.co.uk/news',
    },
    {
        name: 'guardian',
        address: 'https://www.theguardian.com/uk',
    },
    {
        name: 'aljazeera',
        address: 'https://www.aljazeera.com',
    },
    // Add more sources here
];
Each entry should include the name of the newsletter and its address URL.

Contribution
Contributions and stars  are most welcome!
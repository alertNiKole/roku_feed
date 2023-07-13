// Import dependencies
const fetch = require('node-fetch');
const parseString = require('xml2js').parseString;
const moment = require('moment');
const podcastFeedURL = process.env.ANCHOR_RSS_FEED_URL;

module.exports = async (req, res) => {
  try {
    console.log('Roku Feed Initialized...');

    // Fetch the XML data from the Anchor RSS feed
    const response = await fetch(podcastFeedURL);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.text();

    parseString(data, async (err, result) => {
      if (err) {
        throw new Error(`Parse error! message: ${err.message}`);
      }

      console.log('Parsing is in progress');

      // Transformed data object
      const transformedData = {
        providerName: 'MaxDistro Live',
        lastUpdated: new Date().toISOString(),
        language: 'en',
        series: [
          {
            id: 'MDL_Meta_Mind_Shift',
            title: 'Meta Mind Shift Show',
            seasons: [
              {
                seasonNumber: 2,
                episodes: result.rss.channel[0].item.map((item, index) => ({
                  id: `MDL_MetaMindShift_S002E${index}`,
                  title: item.title[0],
                  content: {
                    streamUrl: item.enclosure[0].$.url,
                    contentType: "mp4",
                    language: "en"
                  },
                  thumbnail: item['itunes:image'] ? item['itunes:image'][0].$.href : '',
                  releaseDate: moment(item.pubDate[0]).toISOString(),
                  shortDescription: item.description[0],
                  longDescription: item['content:encoded'] ? item['content:encoded'][0] : ''
                }))
              }
            ],
            genres: ['technology', 'sci-fi', 'gaming', 'science-fiction', 'educational']
          }
        ]
      }

      console.log('Parsing has completed');

      res.status(200);
      res.setHeader('Content-Type', 'application/json');
      res.send(JSON.stringify(transformedData));
    });
  } catch (error) {
    console.error('Error occurred:', error);
    res.status(500);
    res.setHeader('Content-Type', 'text/plain');
    res.send(`Internal server error: ${error.message}`);
  }
};

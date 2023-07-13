//Ah those requriements and variables
const express = require('express');
const app = express();
const port = process.env.PORT || 3000;
const fs = require('fs');
const xml2js = require('xml2js');
const moment = require('moment');

app.get('/roku-feed', async (req, res) => {
  const data = fs.readFileSync('path_to_your_podcast_feed.xml');
  const result = await xml2js.parseStringPromise(data);

  // Transformed data object
  const transformedData = {
    providerName: 'MaxDistro Live',
    lastUpdated: new Date().toISOString(),
    language: 'en',
    series: [
      {
        id: 'MDL_Meta_Mind_Shift_Bonus',
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

  res.type('application/json');
  res.send(transformedData);
});

app.listen(port, () => {
  console.log(`Server listening at http://localhost:${port}`)
});

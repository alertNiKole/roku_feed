//Ah those requriements and variables
const express = require('express');
const app = express();
const port = process.env.PORT || 3000;
const fs = require('fs');
const xml2js = require('xml2js');

//Test connectivity
app.get('/', (req, res) => {
  res.send('Whats up!!')
});
// Get the feed
app.get('/roku-feed', async (req, res) => {
  const data = fs.readFileSync('podcast-rss.xml');
  const result = await xml2js.parseStringPromise(data);

  // Here you would transform the `result` object into the format expected by Roku.
  // For now, let's just return the unmodified object:

  res.type('application/rss+xml');
  res.send(result);
});

app.listen(port, () => {
  console.log(`Server listening at http://localhost:${port}`)
});

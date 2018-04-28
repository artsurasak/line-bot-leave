'use strict';

const line = require('@line/bot-sdk');
const express = require('express');
const http = require('http');

// create LINE SDK config from env variables
const config = {
  channelAccessToken: 'wNGFPyRYMYL1ZuaxZBZN+gw/1FOMR52WrEGtybbWfLlXsyIJU+2NUrUB70DQzT1ID4Jhwh34P4mc3fFdIEI7rtjUToiUzOlxjmtEfS/mekbd01VYgAYZybnHi9y0Q3REK0oaVFJricEwTEehEYaOGgdB04t89/1O/w1cDnyilFU=',
  channelSecret: '553bc1a177fb9b042fa30b3544357169',
};

// create LINE SDK client
const client = new line.Client(config);

// create Express app
// about Express itself: https://expressjs.com/
const app = express();

// register a webhook handler with middleware
// about the middleware, please refer to doc
app.post('/callback', line.middleware(config), (req, res) => {
	//console.log('tesst');
  Promise
    .all(req.body.events.map(handleEvent))
    .then((result) => res.json(result))
    .catch((err) => {
      console.error(err);
      res.status(500).end();
    });
});

app.get("/", function(req, res) {
    res.send("home");
});

// event handler
function handleEvent(event) {
  if (event.type !== 'message' || event.message.type !== 'text') {
    // ignore non-text-message event
    return Promise.resolve(null);
  }

  // create a echoing text message
  const echo = { type: 'text', text: event.message.text };

  // use reply API
  return client.replyMessage(event.replyToken, echo);
}

// listen on port
// http.listen(process.env.PORT || 3000, function(){
//   console.log('listening on', http.address().port);
// });
const port = process.env.PORT || 8080;
app.listen(port, () => {
 console.log(`listening on ${port}`);
});

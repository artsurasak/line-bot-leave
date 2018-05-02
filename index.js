const express = require('express');
const line = require('@line/bot-sdk');
const middleware = require('@line/bot-sdk').middleware
const request = require('request');
const bodyParser = require('body-parser');
require('dotenv').config();
const app = express();
//const port = process.env.PORT || 4000
const config = {
	channelAccessToken: 'tBhTD7sK0F9OGHySgdufkJcV8o2cDLywJHJljJ6M2mfZkL19E6aJdVVlkaf0YkWcD4Jhwh34P4mc3fFdIEI7rtjUToiUzOlxjmtEfS/mekbMCeuWwTzvDWdcy7BvnBfsfEUKairLG/zQ39bPVfFDFwdB04t89/1O/w1cDnyilFU=',
	channelSecret: '5cbfc7a20eba3df7981bae6d5216988f'
}
//const client = line.client(config);
app.use(bodyParser.urlencoded({extended: true}))
app.use(bodyParser.json(''))
app.post('/webhook', (req, res) => {
      let reply_token = req.body.events[0].replyToken
      let event_text = req.body.events[0].message.text
      reply(reply_token,event_text)
      res.sendStatus(200)
})
app.get("/", function(req, res) {
    res.send("home");
});
app.set('port', (process.env.PORT || 4000))
app.listen(app.get('port'), () => {
 console.log(`listening on `,app.get('port'));
});


function reply(reply_token,event_text) {
    let headers = {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer {tBhTD7sK0F9OGHySgdufkJcV8o2cDLywJHJljJ6M2mfZkL19E6aJdVVlkaf0YkWcD4Jhwh34P4mc3fFdIEI7rtjUToiUzOlxjmtEfS/mekbMCeuWwTzvDWdcy7BvnBfsfEUKairLG/zQ39bPVfFDFwdB04t89/1O/w1cDnyilFU=}'
    }
    //var event_text = event_text.text.toLowerCase();
            //console.log(msgtext);
    if (event_text === 'text'){
    	var msgText = '010000';
    	// data = require('./connectDB');
    	// data.executesql(function(result){
    	// 	msgText = result;
    	// 	//console.log(result);
    	// });
        msg = {
                'type': 'text',
                'text': msgtext
        }
    }else if (event_text === 'image'){
          msg = {
                  'type': 'image',
                  'originalContentUrl': 'https://www.thesun.co.uk/wp-content/uploads/2017/03/fifa-17-2.jpg?strip=all&w=742&quality=100',
                  'previewImageUrl': 'https://images.performgroup.com/di/library/GOAL/a6/bb/fifa-18-ronaldo_lx3r88bpjpk91re36ukdgomrj.jpg?t=2027563652&w=620&h=430'
          }
    }else if (event_text === 'location'){
        msg = {
                  "type": "location",
                  "title": "my location",
                  "address": "〒150-0002 東京都渋谷区渋谷２丁目２１−１",
                  "latitude": 35.65910807942215,
                  "longitude": 139.70372892916203
          }
    }
    let body = JSON.stringify({
        replyToken: reply_token,
        messages: [msg]
    })
    request.post({
        url: 'https://api.line.me/v2/bot/message/reply',
        headers: headers,
        body: body
    }, (err, res, body) => {
        console.log('status = ' + res.statusCode);
    });
}

/*'use strict';

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

const port = process.env.PORT || 8080;
app.listen(port, () => {
 console.log(`listening on ${port}`);
});*/

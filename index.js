const express = require('express');
const line = require('@line/bot-sdk');
//const client = line.Client;
//const middleware = require('@line/bot-sdk').middleware
const request = require('request');
const bodyParser = require('body-parser');
require('dotenv').config();
const sql = require('mssql');
const app = express();
//const port = process.env.PORT || 4000
const config = {
	channelAccessToken: 'tBhTD7sK0F9OGHySgdufkJcV8o2cDLywJHJljJ6M2mfZkL19E6aJdVVlkaf0YkWcD4Jhwh34P4mc3fFdIEI7rtjUToiUzOlxjmtEfS/mekbMCeuWwTzvDWdcy7BvnBfsfEUKairLG/zQ39bPVfFDFwdB04t89/1O/w1cDnyilFU=',
	channelSecret: '5cbfc7a20eba3df7981bae6d5216988f'
}
const client = new line.Client(config);
//client = new client(config);
app.use(bodyParser.urlencoded({extended: true}))
app.use(bodyParser.json(''))
app.post('/webhook', (req, res) => {
      //let reply_token = req.body.events[0].replyToken
      //let event_text = req.body.events[0].message.text
      //let userID = req.body.events[0].source.userId
      //reply(reply_token,event_text,userID)
      reply('','','')
      res.sendStatus(200)
})
app.get("/", function(req, res) {
    res.send("home");
});
app.set('port', (process.env.PORT || 4000))
app.listen(app.get('port'), () => {
 console.log(`listening on `,app.get('port'));
});


function reply(reply_token,event_text,userID) {
    let headers = {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer {tBhTD7sK0F9OGHySgdufkJcV8o2cDLywJHJljJ6M2mfZkL19E6aJdVVlkaf0YkWcD4Jhwh34P4mc3fFdIEI7rtjUToiUzOlxjmtEfS/mekbMCeuWwTzvDWdcy7BvnBfsfEUKairLG/zQ39bPVfFDFwdB04t89/1O/w1cDnyilFU=}'
    }
  
     // data = require('./connectDB');
     //    var displayName = 'SP'
     //    data.executesql(displayName,function(result){
     //        console.log("วัน : " + result[0].TYPE + " คงเหลือ : " + result[0].remain) 
     //        console.log("วัน : " + result[1].TYPE + " คงเหลือ : " + result[1].remain) 
     //        console.log("วัน : " + result[2].TYPE + " คงเหลือ : " + result[2].remain) 
     //        console.log("วัน : " + result[3].TYPE + " คงเหลือ : " + result[3].remain) 
            //console.log("คงเหลือ : " + result[0].remain) ;


            /*msg = {
                    type: 'text',
                    text: result
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
              })*/
          //});  

     if (event_text === 'สถิติการลา'){
        client.getProfile(userID)
          .then((profile) => {
            var displayName = profile.displayName
            data = require('./connectDB');
            data.executesql(displayName,function(result){
            msg = {
                    type: 'text',
                    text: "วัน" + result[0].TYPE + " คงเหลือ " + result[0].remain + " วัน"
                  }
                  // ,
                  // {
                  //   type: 'text',
                  //   text: "วัน" + result[1].TYPE + " คงเหลือ " + result[1].remain + " วัน"
                  // },
                  // {
                  //   type: 'text',
                  //   text: "วัน" + result[2].TYPE + " คงเหลือ " + result[2].remain + " วัน"
                  // },
                  // {
                  //   type: 'text',
                  //   text: "วัน" + result[3].TYPE + " คงเหลือ " + result[3].remain + " วัน"
                  // }
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
              })
          });
           
        })
        .catch((err) => {
          console.log('error')
          console.log(err);
        });
      }else if(event_text === 'profile'){
        client.getProfile(userID)
          .then((profile) => {
            var displayName = profile.displayName
          	msg = {
                    type: 'text',
                    text: profile.displayName
           	 	}
            	// {
            	// 	type: 'text',
             //        text: profile.displayName
            	// },
            	// {
            	// 	type: 'text',
             //        text: profile.pictureUrl
            	// },
            	// {
            	// 	type: 'text',
             //        text: profile.statusMessage
            	// }
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
              })
        })
        .catch((err) => {
        	console.log('error')
        	console.log(err);
        });
      }
     
    /*if (event_text === 'text'){
       
    	//var msgText = '010000';
    	//var msgText = '010000';
      	//var msgText
      	//data = require('./connectDB');
      	//data.executesql(function(result){
      	
          msg = {
                  type: 'text',
                  text: "'" + executesql() + "'"
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
    });*/
}
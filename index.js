const express = require('express');
const line = require('@line/bot-sdk');
const moment = require('moment');
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
      //let messageID = req.body.events[0].message.id
      //let userID = req.body.events[0].source.userId
      //reply(reply_token,event_text,userID,messageID)
      //isValidTime()
      //compareDate()
      calculateNoLeave()
      res.sendStatus(200)
})
app.get("/", function(req, res) {
    res.send("home");
});
app.set('port', (process.env.PORT || 4000))
app.listen(app.get('port'), () => {
 console.log(`listening on `,app.get('port'));
});

function strDateMoreEndDate(StartDate,EndDate){
	var _strDate = new Date(StartDate);
	var _endDate = new Date(EndDate);
	if (_strDate <= _endDate){
		return false;
	}else{
		return true;	
	} 
}

function isValidDate(s) {
  var bits = s.split('-');
  var d = new Date(bits[0], bits[1] - 1, bits[2]);
  return d && (d.getMonth() + 1) == bits[1];
}

function isValidTime(t){
  re=/^([0-9]|0[0-9]|1[0-9]|2[0-3]):[0-5][0-9]$/;
  return re.test(t);
}

// function calculateDay(FromDate,Todate){
//     date1 = new Date(FromDate)
//     date2 = new Date(Todate)
//     var seconds = Math.floor((date2 - (date1))/1000);
//     var minutes = Math.floor(seconds/60);
//     var hours = Math.floor(minutes/60);
//     var days = Math.floor(hours/24);
//     hours = hours-(days*24);
//     minutes = minutes-(days*24*60)-(hours*60);
//     seconds = seconds-(days*24*60*60)-(hours*60*60)-(minutes*60);
//     console.log(days)
//     console.log(hours)
//     console.log(minutes)
//     console.log(seconds)
// }

function calculateNoLeave(fDate,fTime,tDate,tTime){
	fDate = '2018-05-01';
	fTime = '08:00';
	tDate = '2018-05-02';
	tTime = '16:30';
	var startDate = moment('2018-05-01 08:00','YYYY-MM-DD HH:mm')
	var EndDate = moment('2018-05-02 16:30','YYYY-MM-DD HH:mm')
	var startHour = moment('08:00','HH:mm')
	var EndHour = moment('16:30','HH:mm')
	//var startDate = moment([2007, 0, 28])
	//var EndDate = moment([2007, 0, 29])
	//a.diff(b, 'days') 
	//var secondsDiff = moment.duration(EndDate.diff(startDate)).asDays();
	var secondsDiff = EndDate.diff(startDate,'days')
	var hoursDiff = EndHour.diff(startHour,'hours',true)
	var minuteDiff = EndHour.diff(startHour,'minutes',true)
	console.log(secondsDiff)
	console.log(hoursDiff)
	console.log(minuteDiff)
	//console.log(startDate);
	//console.log(EndDate);
 }

function reply(reply_token,event_text,userID,messageID) {
    let headers = {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer {tBhTD7sK0F9OGHySgdufkJcV8o2cDLywJHJljJ6M2mfZkL19E6aJdVVlkaf0YkWcD4Jhwh34P4mc3fFdIEI7rtjUToiUzOlxjmtEfS/mekbMCeuWwTzvDWdcy7BvnBfsfEUKairLG/zQ39bPVfFDFwdB04t89/1O/w1cDnyilFU=}'
    }
     if (event_text === 'สถิติการลา'){
        client.getProfile(userID)
          .then((profile) => {
            //var displayName = profile.displayName
            var userId = profile.userId
            data = require('./connectDB');
            data.executesql(userId,function(result){
            let body = JSON.stringify({
                  replyToken: reply_token,
                  messages: [{
                                type: 'text',
                                text: "วัน" + result[0].TYPE + " คงเหลือ " + result[0].remain + " วัน"
                              }
                              ,
                              {
                                type: 'text',
                                text: "วัน" + result[1].TYPE + " คงเหลือ " + result[1].remain + " วัน"
                              },
                              {
                                type: 'text',
                                text: "วัน" + result[2].TYPE + " คงเหลือ " + result[2].remain + " วัน"
                              },
                              {
                                type: 'text',
                                text: "วัน" + result[3].TYPE + " คงเหลือ " + result[3].remain + " วัน"
                              }]
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
      }else if(event_text === 'userid'){
        client.getProfile(userID)
          .then((profile) => {
            msg = {
                    type: 'text',
                    text: profile.userId
                  }
            client.replyMessage(reply_token,msg)
        })
        .catch((err) => {
        	console.log('error')
        	console.log(err);
        });
      }else if(event_text === 'สร้างคำร้องการลา'){
        msg = {
                type: 'text',
                text: "ใส่ประเภทการลา"
              }
              client.replyMessage(reply_token, msg);
      }else if (msg.text === 'ใส่ประเภทการลา'){
          leaveType = event_text;
          msg = {
                type: 'text',
                text: "กรุณาระบุวันที่เริ่มลา"
              }
              client.replyMessage(reply_token, msg);
      }else if ((msg.text === 'กรุณาระบุวันที่เริ่มลา') || (msg.text === 'ข้อมูลวันที่เริ่มลาไม่ถูกต้อง กรุณาระบุใหม่อีกครั้ง')) {
            [event_text].forEach(function(s) {
              if(isValidDate(s)){
                fdate = event_text
                msg = {
                    type: 'text',
                    text: "กรุณาระบุเวลาเริ่มต้นลา"
                }
              }else{
                //fdate = event_text
                msg = {
                    type: 'text',
                    text: "ข้อมูลวันที่เริ่มลาไม่ถูกต้อง กรุณาระบุใหม่อีกครั้ง"
                }
              }
            })
            client.replyMessage(reply_token,msg)
      }else if ((msg.text === 'กรุณาระบุเวลาเริ่มต้นลา') || (msg.text === 'ข้อมูลเวลาเริ่มลาไม่ถูกต้อง กรุณาระบุใหม่อีกครั้ง')){
          if(isValidTime(event_text)){
             ftime = event_text
             msg = {
                      type: 'text',
                      text: "กรุณาระบุวันที่สิ้นสุดการลา"
                    }
          }else {
             msg = {
                      type: 'text',
                      text: "ข้อมูลเวลาเริ่มลาไม่ถูกต้อง กรุณาระบุใหม่อีกครั้ง"
                    }
          }
          client.replyMessage(reply_token,msg)
      }else if ((msg.text === 'กรุณาระบุวันที่สิ้นสุดการลา') || (msg.text === 'ข้อมูลวันที่สิ้นสุดการลาไม่ถูกต้อง กรุณาระบุใหม่อีกครั้ง') || (msg.text === 'ข้อมูลวันสื้นสุดการลา น้อยกกว่าวันเริ่มต้นการลา กรุณาระบุใหม่อีกครั้ง')){
          //tdate = event_text
          [event_text].forEach(function(s) {
              if(isValidDate(s)){
                if(strDateMoreEndDate(fdate,event_text)){
          				msg = {
		                    type: 'text',
		                    text: "ข้อมูลวันสื้นสุดการลา น้อยกกว่าวันเริ่มต้นการลา กรุณาระบุใหม่อีกครั้ง"
                		}
		          }else{
						tdate = event_text
		                msg = {
		                    type: 'text',
		                    text: "กรุณาระบุเวลาสิ้นสุดการลา"
                		}
		          }
              }else{
                //fdate = event_text
                msg = {
                    type: 'text',
                    text: "ข้อมูลวันที่สิ้นสุดการลาไม่ถูกต้อง กรุณาระบุใหม่อีกครั้ง"
                }
              }
            })
          client.replyMessage(reply_token,msg)
      }else if ((msg.text === 'กรุณาระบุเวลาสิ้นสุดการลา') || (msg.text === 'ข้อมูลเวลาสิ้นสุดการลาไม่ถูกต้อง กรุณาระบุใหม่อีกครั้ง')){
        if(isValidTime(event_text)){
             ttime = event_text
             msg = {
                      type: 'text',
                      text: "กรุณาระบุสาเหตุการลา"
                    }
          }else {
             msg = {
                      type: 'text',
                      text: "ข้อมูลเวลาสิ้นสุดการลาไม่ถูกต้อง กรุณาระบุใหม่อีกครั้ง"
                    }
          }
          client.replyMessage(reply_token,msg)
      }else if (msg.text === 'กรุณาระบุสาเหตุการลา'){
          if (event_text === 'Next'){
            Note = ''
          }else{
            Note = event_text
          }
          msg = {
                  type: 'text',
                  text: "กรุณาระบุชื่อผู้ติดต่อระหว่างลา"
                }
          client.replyMessage(reply_token,msg)
      }else if (msg.text === 'กรุณาระบุชื่อผู้ติดต่อระหว่างลา'){
          if (event_text === 'Next'){
            contactName = ''
          }else{
            contactName = event_text
          }
          msg = {
                  type: 'text',
                  text: "เบอร์โทรศัพท์ผู้ติดต่อระหว่างลา"
                }
          client.replyMessage(reply_token,msg)
      }else if (msg.text === 'เบอร์โทรศัพท์ผู้ติดต่อระหว่างลา'){
          if (event_text === 'Next'){
            contactTel = ''
          }else{
            contactTel = event_text
          }
          msg = {
                  type: 'text',
                  text: leaveType + " " + fdate + " " + ftime + " " + tdate + " " + ttime + " " + Note + " " + contactName + " " + contactTel
                }
          client.replyMessage(reply_token,msg)
      }else if (event_text === 'ยืนยัน'){
            client.getProfile(userID)
                .then((profile) => {
                    var lineUserID = profile.userId
                    data = require('./connectDB');
                    noLeave = calculateNoLeave(fdate,ftime,tdate,ttime)
                    data.userDTL(lineUserID,function(userDTL){
                        data.insertReqLeave(leaveType,userDTL[0].DeptID,userDTL[0].EMP_CODE,fdate,ftime,tdate,ttime,'1','0',Note,contactName,contactTel,function(result){
                        msg = {
                            type: 'text',
                            text: result
                        }
                          client.replyMessage(reply_token,msg)
                        });
                    })
                  })
                  .catch((err) => {
                          console.log('error')
                          console.log(err);
                  });
      }else{
        msg = {
                  type: 'text',
                  text: 'ข้อมูลไม่ถูกต้อง กรุณาระบุใหม่อีกครั้ง'
                }
        client.replyMessage(reply_token,msg)
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
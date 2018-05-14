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
      let reply_token = req.body.events[0].replyToken
      let event_text = req.body.events[0].message.text
      let messageID = req.body.events[0].message.id
      let userID = req.body.events[0].source.userId
      reply(reply_token,event_text,userID,messageID)
      //isValidTime()
      //isValidDate('2000-12-01')
      //compareDate()
      //calculateNoLeave()
      //calculateHourLeave()
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
	if (bits[0].length == 4){
		var validDate = moment(s,"YYYY-MM-DD").isValid();
		return validDate
	}else{
		return false
	}
}

function isValidTime(t){
  re=/^([0-9]|0[0-9]|1[0-9]|2[0-3]):[0-5][0-9]$/;
  return re.test(t);
}

function addDays(date, days) {
  var result = new Date(date);
  result.setDate(result.getDate() + days);
  return result;
}

function noWeekend(fDate,diffDay){
    var resultDate
    var Weekend = 0
    for(var i = 0;i<=diffDay;i++){
        resultDate = addDays(fDate,i)
        //console.log(resultDate);
        var day = resultDate.getDay();
        //console.log(day)
        if((day == 6) || (day == 0)){
          Weekend += 1
        }
    }
    return Weekend;
    //resultDate = moment(resultDate).format('YYYY-MM-DD')
}
 
function calculateNoLeave(fDate,tDate,fTime,tTime,callback){
	//fDate = '2018-04-12';
	//tDate = '2018-04-16';
  var callbackString = {};
  var resultDateWeekend
  var noDateWeekend
	var startDate = moment(fDate,'YYYY-MM-DD')
	var EndDate = moment(tDate,'YYYY-MM-DD')
	var daysDiff = EndDate.diff(startDate,'days')
  data = require('./connectDB');
    data.dateHoliday(fDate,tDate,function(Holiday){
        resultDateWeekend = noWeekend(fDate,daysDiff)
        //console.log(resultDateWeekend);
        HolidayDate = Holiday
        //console.log(HolidayDate)
        if(resultDateWeekend > HolidayDate){
          noDateWeekend = resultDateWeekend
        }else{noDateWeekend = HolidayDate}
        daysDiff = daysDiff - noDateWeekend
        //var fTime = '09:00'
        //var tTime = '18:00'
        var startHour = moment(fTime,'HH:mm')
        var EndHour = moment(tTime,'HH:mm')
        var hoursDiff = EndHour.diff(startHour,'hours',true)
        if((fTime = '09:00') && (tTime == '18:00')){
          hoursDiff = '0' 
          daysDiff = daysDiff + 1
        }
        //console.log(daysDiff)
        //console.log(hoursDiff)
        callbackString.Days = daysDiff
        callbackString.Hours = hoursDiff
        callback(callbackString)
        //return [daysDiff,hoursDiff]
    })
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
      	// data = require('./connectDB');
       //  data.LeaveType('1',function(result1){
       //  	data.LeaveType('2',function(result2){
       //  		data.LeaveType('3',function(result3){
       //  			data.LeaveType('4',function(result4){
        				 msg = [{
				                type: 'text',
				                text: "ใส่ประเภทการลา"
				              }
				               ,
				               {
				               	type: 'text',
				               	text: "1 => ลาป่วย\n 2 => ลากิจ\n 3 => ลาพักผ่อน\n 4 => ลาคลอด "
				               }]
				        client.replyMessage(reply_token, msg);
        // 			})
        // 		})
        // 	})
        // })
      }else if (msg[0].text === 'ใส่ประเภทการลา'){
          leaveType = event_text;
          msg = [{
                type: 'text',
                text: "กรุณาระบุวันที่เริ่มลา"
              },
              {
              	type: 'text',
              	text: "Format YYYY-MM-DD => 2018-05-01"
              }
              ]
              client.replyMessage(reply_token, msg);
      }else if ((msg[0].text === 'กรุณาระบุวันที่เริ่มลา') || (msg[0].text === 'ข้อมูลวันที่เริ่มลาไม่ถูกต้อง กรุณาระบุใหม่อีกครั้ง')) {
            [event_text].forEach(function(s) {
              if(isValidDate(s)){
                strDate = event_text
                msg = [{
		                    type: 'text',
		                    text: "กรุณาระบุเวลาเริ่มต้นลา"
		                },
		                {
		                	type: 'text',
		                	text: "Format HH:MM => 09:00"
		                }]
              }else{
                //fdate = event_text
                msg = [{
                    type: 'text',
                    text: "ข้อมูลวันที่เริ่มลาไม่ถูกต้อง กรุณาระบุใหม่อีกครั้ง"
                }]
              }
            })
            client.replyMessage(reply_token,msg)
      }else if ((msg[0].text === 'กรุณาระบุเวลาเริ่มต้นลา') || (msg[0].text === 'ข้อมูลเวลาเริ่มลาไม่ถูกต้อง กรุณาระบุใหม่อีกครั้ง')){
          if(isValidTime(event_text)){
             strTime = event_text
             msg = [{
                      	type: 'text',
                      	text: "กรุณาระบุวันที่สิ้นสุดการลา"
                    },
                    {
                    	type: 'text',
                      	text: "Format YYYY-MM-DD => 2018-05-31"
                    }]
          }else {
             msg = [{
                      type: 'text',
                      text: "ข้อมูลเวลาเริ่มลาไม่ถูกต้อง กรุณาระบุใหม่อีกครั้ง"
                    }]
          }
          client.replyMessage(reply_token,msg)
      }else if ((msg[0].text === 'กรุณาระบุวันที่สิ้นสุดการลา') || (msg[0].text === 'ข้อมูลวันที่สิ้นสุดการลาไม่ถูกต้อง กรุณาระบุใหม่อีกครั้ง') || (msg[0].text === 'ข้อมูลวันสื้นสุดการลา น้อยกกว่าวันเริ่มต้นการลา กรุณาระบุใหม่อีกครั้ง')){
          //tdate = event_text
          [event_text].forEach(function(s) {
              if(isValidDate(s)){
                if(strDateMoreEndDate(strDate,event_text)){
          				msg = [{
		                    type: 'text',
		                    text: "ข้อมูลวันสื้นสุดการลา น้อยกกว่าวันเริ่มต้นการลา กรุณาระบุใหม่อีกครั้ง"
                		}]
		          }else{
						endDate = event_text
		                msg = [{
		                    type: 'text',
		                    text: "กรุณาระบุเวลาสิ้นสุดการลา"
                		},
		                {
		                	type: 'text',
		                	text: "Format HH:MM => 18:00"
		                }]
		          }
              }else{
                //fdate = event_text
                msg = [{
                    type: 'text',
                    text: "ข้อมูลวันที่สิ้นสุดการลาไม่ถูกต้อง กรุณาระบุใหม่อีกครั้ง"
                }]
              }
            })
          client.replyMessage(reply_token,msg)
      }else if ((msg[0].text === 'กรุณาระบุเวลาสิ้นสุดการลา') || (msg[0].text === 'ข้อมูลเวลาสิ้นสุดการลาไม่ถูกต้อง กรุณาระบุใหม่อีกครั้ง')){
        if(isValidTime(event_text)){
             endTime = event_text
             msg = [{
                      type: 'text',
                      text: "กรุณาระบุสาเหตุการลา (ถ้ามี)\n ถ้าไม่มีเลือก Next"
                    }]
          }else {
             msg = [{
                      type: 'text',
                      text: "ข้อมูลเวลาสิ้นสุดการลาไม่ถูกต้อง กรุณาระบุใหม่อีกครั้ง"
                    }]
          }
          client.replyMessage(reply_token,msg)
      }else if (msg[0].text === 'กรุณาระบุสาเหตุการลา (ถ้ามี)\n ถ้าไม่มีเลือก Next'){
          if (event_text === 'Next'){
            Note = ''
          }else{
            Note = event_text
          }
          msg = [{
                  type: 'text',
                  text: "กรุณาระบุชื่อผู้ติดต่อระหว่างลา (ถ้ามี)\n ถ้าไม่มีเลือก Next"
                }]
          client.replyMessage(reply_token,msg)
      }else if (msg[0].text === 'กรุณาระบุชื่อผู้ติดต่อระหว่างลา (ถ้ามี)\n ถ้าไม่มีเลือก Next'){
          if (event_text === 'Next'){
            contactName = ''
          }else{
            contactName = event_text
          }
          msg = [{
                  type: 'text',
                  text: "กรุณาระบุเบอร์โทรศัพท์ผู้ติดต่อระหว่างลา (ถ้ามี)\n ถ้าไม่มีเลือก Next"
                }]
          client.replyMessage(reply_token,msg)
      }else if (msg[0].text === 'กรุณาระบุเบอร์โทรศัพท์ผู้ติดต่อระหว่างลา (ถ้ามี)\n ถ้าไม่มีเลือก Next'){
          if (event_text === 'Next'){
            contactTel = ''
           
          }else{
            contactTel = event_text
          }
           data = require('./connectDB');
        	data.LeaveType(leaveType,function(result){
        		msg = [{
		                    type: 'text',
		                  	text: "ประเภทการลา => " + result + "\n วันเวลา => " + strDate + " " + strTime + " ถึง " + endDate + " " + endTime + "\nสาเหตุการลา => " + Note + "\nชื่อผู้ติดต่อระหว่างลา => " + contactName + "\nเบอร์โทรศัพท์ผู้ติดต่อระหว่างลา => " + contactTel
                		},
		                {
		                	type: 'text',
		                	text: "กรุณายืนยันข้อมูล"
		                }
		                // {
		                // 	type: 'text',
		                // 	text: "สาเหตุการลา => " + Note
		                // },
		                // {
		                // 	type: 'text',
		                // 	text: "ชื่อผู้ติดต่อระหว่างลา => " + contactName
		                // },
		                // {
		                // 	type: 'text',
		                // 	text: "เบอร์โทรศัพท์ผู้ติดต่อระหว่างลา => " + contactTel
		                // },
		                // {
		                // 	type: 'text',
		                // 	text: "กรุณายืนยันข้อมูล"
		                // }
		                ]
		            client.replyMessage(reply_token,msg)
        	})
      }else if (msg[1].text === 'กรุณายืนยันข้อมูล'){
      		if(event_text === 'ยืนยัน'){
      			client.getProfile(userID)
                .then((profile) => {
                    var lineUserID = profile.userId
                    data = require('./connectDB');
                    data.userDTL(lineUserID,function(userDTL){
                        //var noLeave = calculateNoLeave(fdate,ftime,tdate,ttime,function(noLeave,noLeaveHour))
                        calculateNoLeave(fdate,tdate,ftime,ttime,function(noLeave){
                          var days = noLeave.Days
                          var hours = noLeave.Hours
                            data.insertReqLeave(leaveType,userDTL[0].DeptID,userDTL[0].EMP_CODE,strDate,strTime,endDate,endTime,days,hours,Note,contactName,contactTel,function(result){
                              msg = {
                                type: 'text',
                                text: result
                              }
                              client.replyMessage(reply_token,msg)
                            });
                        })
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
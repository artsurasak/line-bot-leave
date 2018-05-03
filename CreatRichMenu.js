
const config = require('./config.js');
const line = require('@line/bot-sdk');
const client = new line.Client(config);

client.createRichMenu({
        size: {
          width: 2500,
          height: 1686
        },
        selected: true,
        name: 'CryptoCurrency Page 2',
        chatBarText: 'CryptoCurrency',
        areas: [
          {
            bounds: {
              x: 0,
              y: 0,
              width: 833,
              height: 843
            },
            action: {
              type: 'message',
              text: 'OMG'
            }
          },
          {
            bounds: {
              x: 834,
              y: 0,
              width: 833,
              height: 843
            },
            action: {
              type: 'message',
              text: 'DAS'
            }
          },
          {
            bounds: {
              x: 1667,
              y: 0,
              width: 833,
              height: 843
            },
            action: {
              type: 'message',
              text: 'PREVIOUS'
            }
          },
          {
            bounds: {
              x: 0,
              y: 843,
              width: 833,
              height: 843
            },
            action: {
              type: 'message',
              text: 'GOLD'
            }
          },
          {
            bounds: {
              x: 834,
              y: 843,
              width: 833,
              height: 843
            },
            action: {
              type: 'message',
              text: 'LTC'
            }
          },
          {
            bounds: {
              x: 1667,
              y: 843,
              width: 833,
              height: 843
            },
            action: {
              type: "datetimepicker",
              label: "Subscribe",
              data: "subscribe",
              mode: "time",
              text: "Subscribe",
              initial: "08:00"
            }
          }
        ]
      })
}).then((richMenuId) => {
    fs.readFile("./.env", 'utf8', function (err,data) {
        if (err) {
            return console.log(err);
        }
        const result = data.replace(/CRYPTO_PAGE_2_RICH_MENU_ID=.*/g, `CRYPTO_PAGE_2_RICH_MENU_ID=${richMenuId}`);
        
        fs.writeFile("./.env", result, 'utf8', function (err) {
            if (err) return console.log(err);
        });
    });
    console.log("richMenuId: " + richMenuId)
    client.setRichMenuImage(richMenuId, fs.createReadStream('./rich-menu/menu-page-2.jpg'))
})
.catch((error) => console.log(error.originalError.response.data, error))
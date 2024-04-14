const db = require("../_helpers/db");
const dbSubscription = db.subscription;
const webpush = require('web-push');
var count = 1;
async function send(req, res) {
    var result = await dbSubscription.find()
  const results = await Promise.all(result.map(async (k, v) => {
    count = count +1
    const publicVapidKey = "BEKPLQAEHd_3zRpN2m-BM0tXaePeRODsKc_UBh75ptZwUo4Wtg7AJCklz_caWCcB3S6iTAntMlH6CK_PdUxqem4";
    const privateVapidKey = "V6m2WCVjEcciyazC0oNgBvivkLx1pZWREwoxgw8-6xY";
    
    webpush.setVapidDetails("mailto: <hemu9571782430@gmail.com>", publicVapidKey, privateVapidKey);

   
    const subscription = JSON.parse(k.subscription);
  
    const payload = JSON.stringify({
        "title": "Real Ludo king",
        "body": "🤑 New Challenge of Rs-2000 ⚔️",
        "icon": "https://realludoking.com/static/media/Realludokinglogo.png",
        "image": "https://realludoking.com/static/media/Realludokinglogo.png",
        "badge": "https://realludoking.com/static/media/Realludokinglogo.png",
        
      });
    webpush.sendNotification(subscription, payload).catch(console.log);
   // console.log("result",JSON.parse(k.subscription))
    console.log("count",count)
  })
  )
  
  }

module.exports = {
  send,
  
};

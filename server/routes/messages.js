const express = require('express');
const router = express.Router();
var _busBookingDetails = "../jsonData/busBooking.json"
//Include the library botbuilder
let builder = require('botbuilder')
console.log(_busBookingDetails);
// Create chat connector with the default id and password
let connector = new builder.ChatConnector({
  appId: '07ba745f-24ec-4e2b-b841-d898016526ea',
  appPassword: 'vnwvcfPVJA69=]hCBY362!%'
})

var bot = new builder.UniversalBot(connector, function (session) {
  session.send("Sorry couldn't understant what you just typed. Please enter 'Help'");
});
var recognizer = new builder.LuisRecognizer('https://westus.api.cognitive.microsoft.com/luis/v2.0/apps/9f1d74f2-f379-4f0a-b41d-5a5e460c1c29?subscription-key=84ac1bb781c64202b63e755f00314733&verbose=true&timezoneOffset=0&q=');
bot.recognizer(recognizer);

bot.dialog('/', function (session, args) {
  session.send("Sorry couldn't understant what you just typed. Please enter 'Help'");
});

bot.dialog('Greetings', [
  function (session) {
    if (session.userData.name) {
      session.send('Hello %s!', session.userData.name);
    } else {
      builder.Prompts.text(session, 'Hi! What is your name?');
    }
  },
  function (session, results) {
    if (session.userData.name) {
      session.send(`Hello %s!,`, session.userData.name);
      session.send(`Need Help! Type "Help".`);
    } else {
      session.userData.name = results.response;
      session.send('Hello %s!', session.userData.name);
      session.send(`Need Help! Type "Help".`);
    }
  }
]).triggerAction({
  matches: 'Greetings'
});

// bot.dialog('Help', [
//   function (session, args, next) {
//     builder.Prompts.choice(session, 'I can help you with the following please select from below? Please enter 1 or 2!', CardNames);
//   },
//   function (session, results) {
//     var selectedOption = results.response.entity;
//     if (selectedOption == CardNames[1]) {
//       searchBy(session);
//     } else if (selectedOption == CardNames[0]) {
//       session.conversationData.filter = undefined;
//       showingProducts(session);
//     }
//   }
// ]).triggerAction({
//   matches: 'Help'
// });



router.post('/', connector.listen());


module.exports = router;

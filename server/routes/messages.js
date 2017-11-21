const express = require('express');
const router = express.Router();
var _busBookingDetails = "../jsonData/busBooking.json"
var request = require('request');

//Include the library botbuilder
let builder = require('botbuilder')
// console.log(_busBookingDetails);
// request(_busBookingDetails, function (error, response, body) {
//   if (error) {
//     console.log('error:', error); // Print the error if one occurred
//   } else {
//     productsFiltered = JSON.parse(body);
//     console.log(productsFiltered);
//   }
// });
// Create chat connector with the default id and password
let connector = new builder.ChatConnector({
  appId: "07ba745f-24ec-4e2b-b841-d898016526ea",
  appPassword: "vnwvcfPVJA69=]hCBY362!%"
})

var bot = new builder.UniversalBot(connector);
var recognizer = new builder.LuisRecognizer('https://westus.api.cognitive.microsoft.com/luis/v2.0/apps/9f1d74f2-f379-4f0a-b41d-5a5e460c1c29?subscription-key=84ac1bb781c64202b63e755f00314733&spellCheck=true&verbose=true&timezoneOffset=0&q=');
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


router.post('/', connector.listen());


module.exports = router;

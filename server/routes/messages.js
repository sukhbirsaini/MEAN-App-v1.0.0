const express = require('express');
const router = express.Router();

//Include the library botbuilder
let builder = require('botbuilder')

// Create chat connector with the default id and password
let connector = new builder.ChatConnector({
  appId: '07ba745f-24ec-4e2b-b841-d898016526ea',
  appPassword: 'vnwvcfPVJA69=]hCBY362!%'
})

var bot = new builder.UniversalBot(connector, function (session) {
  session.send("Hi... I'm the Inventory Management bot. I can search product in inventory.");
});

var recognizer = new builder.LuisRecognizer('https://westus.api.cognitive.microsoft.com/luis/v2.0/apps/9f1d74f2-f379-4f0a-b41d-5a5e460c1c29?subscription-key=84ac1bb781c64202b63e755f00314733&verbose=true&timezoneOffset=0&q=');
bot.recognizer(recognizer);


bot.dialog('Bye', [
  function (session, args, next) {
    session.send('Sorry');
  }
]).triggerAction({
  matches: 'Bye'
});


router.post('/', connector.listen());


module.exports = router;

const express = require('express');
const router = express.Router();

//Include the library botbuilder
let builder = require('botbuilder')

// Create chat connector with the default id and password
let connector = new builder.ChatConnector({
  appId: process.env.microsoftChatBot2AppID,
  appPassword: process.env.microsoftChatBot2Password
})

var bot = new builder.UniversalBot(connector, function (session) {
  session.send(process.env.S3_KEY);
});

var recognizer = new builder.LuisRecognizer(process.env.LuisQueryURLForChatBOT2);
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

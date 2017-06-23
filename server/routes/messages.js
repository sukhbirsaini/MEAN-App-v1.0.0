const express = require('express');
const router = express.Router();

//Include the library botbuilder
let builder = require('botbuilder')

// Create chat connector with the default id and password
let connector = new builder.ChatConnector({
  appId: 'f98507f6-efd6-4c28-8938-cf0dcf81d851',
  appPassword: 'hF4jmbJsUd2X1eiN7ccEk6T'
})

// let bot = new builder.UniversalBot(connector, (session)=>{

// 	let name = session.message.user.name
// 	let message = session.message.text
// 	session.send(name + " said "  + message)
// })
var bot = new builder.UniversalBot(connector, function (session) {
  session.send("Hi... I'm the Inventory Management bot. I can search product in inventory.");
});

var userName;
// You can provide your own model by specifing the 'LUIS_MODEL_URL' environment variable
// This Url can be obtained by uploading or creating your model from the LUIS portal: https://www.luis.ai/
var recognizer = new builder.LuisRecognizer('https://westus.api.cognitive.microsoft.com/luis/v2.0/apps/005d9add-f16f-4a67-b589-ee83530fc99a?subscription-key=84ac1bb781c64202b63e755f00314733&timezoneOffset=0&verbose=true&spellCheck=true&q=');
bot.recognizer(recognizer);

bot.dialog('SearchProduct', [
  function (session, args, next) {
    // try extracting entities
    var encyclopediaEntity = builder.EntityRecognizer.findEntity(args.intent.entities, 'encyclopedia');
    var productEntity = builder.EntityRecognizer.findEntity(args.intent.entities, 'product');
    // var airportEntity = builder.EntityRecognizer.findEntity(args.intent.entities, 'AirportCode');
    if (encyclopediaEntity) {
      console.log("into encyclopedia")
      // city entity detected, continue to next step
      // session.dialogData.searchType = 'product';
      next({
        response: encyclopediaEntity.entity
      });
      // } else if (airportEntity) {
      //     // airport entity detected, continue to next step
      //     session.dialogData.searchType = 'airport';
      //     next({ response: airportEntity.entity });
    } else {
      // no entities detected, ask user for a destination
      session.send("Sorry couldn't find the product you were looking for!");
      // builder.Prompts.text(session, "Sorry couldn't find the product you were looking for!");
    }
  },
  function (session, results) {
    var product = results.response;
    console.log(product);
    var message = 'Looking for product: %s';
    // if (session.dialogData.searchType === 'airport') {
    //   message += ' near %s airport...';
    // } else {
    //   message += ' in %s...';
    // }

    session.send(message, product);

    // // Async search
    // Store
    //   .searchHotels(destination)
    //   .then(function (hotels) {
    //     // args
    //     session.send('I found %d hotels:', hotels.length);

    //     var message = new builder.Message()
    //       .attachmentLayout(builder.AttachmentLayout.carousel)
    //       .attachments(hotels.map(hotelAsAttachment));

    //     session.send(message);

    //     // End
    //     session.endDialog();
    //   });
  }
]).triggerAction({
  matches: 'SearchProduct'
});

bot.dialog('Greetings', [
  function (session, args, next) {
    session.send('Hi, Welcome to Product Inventory! Whats your name?');
  },
  function (session, results) {


    userName = session.message.text;
    session.send('Hi,' + userName + '! How may I help you?');
    // try extracting entities
    // var productEntity = builder.EntityRecognizer.findEntity(args.intent.entities, 'builtin.geography.city');
    //     var airportEntity = builder.EntityRecognizer.findEntity(args.intent.entities, 'AirportCode');
    //     if (cityEntity) {
    //         // city entity detected, continue to next step
    //         session.dialogData.searchType = 'city';
    //         next({ response: cityEntity.entity });
    //     } else if (airportEntity) {
    //         // airport entity detected, continue to next step
    //         session.dialogData.searchType = 'airport';
    //         next({ response: airportEntity.entity });
    //     } else {
    //         // no entities detected, ask user for a destination
    //         builder.Prompts.text(session, 'Please enter your destination');
    //     }
    // },
    // function (session, results) {
    //     var destination = results.response;

    //     var message = 'Looking for hotels';
    //     if (session.dialogData.searchType === 'airport') {
    //         message += ' near %s airport...';
    //     } else {
    //         message += ' in %s...';
    //     }

    //     session.send(message, destination);

    //     // Async search
    //     Store
    //         .searchHotels(destination)
    //         .then(function (hotels) {
    //             // args
    //             session.send('I found %d hotels:', hotels.length);

    //             var message = new builder.Message()
    //                 .attachmentLayout(builder.AttachmentLayout.carousel)
    //                 .attachments(hotels.map(hotelAsAttachment));

    //             session.send(message);

    //             // End
    //             session.endDialog();
    //         });
  }
]).triggerAction({
  matches: 'Greetings'
});

bot.dialog('Bye', [
  function (session, args, next) {
    session.send('Sorry');
  }
]).triggerAction({
  matches: 'Bye'
});


router.post('/', connector.listen());


module.exports = router;

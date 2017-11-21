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


bot.dialog('Greeting', [
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
  matches: 'Greeting'
});
var seeAllBuses = "See All Buses";
var FindBy = "Find Bus";
var CardNames = [seeAllBuses, FindBy];
bot.dialog('Help', [
  function (session, args, next) {
    builder.Prompts.choice(session, 'I can help you with the following please select from below? Please enter 1 or 2!', CardNames);
  },
  function (session, results) {
    var selectedOption = results.response.entity;
    if (selectedOption == CardNames[1]) {
      searchBy(session);
    } else if (selectedOption == CardNames[0]) {
      session.conversationData.filter = undefined;
      showingProducts(session);
    }
  }
]).triggerAction({
  matches: 'Help'
});
var Name = 'Search by Name of bus';
var Origin = 'Search by Origin of bus';
var Destination = 'Search by Destination of bus';
var CategoriesOfHelp = [Name, Origin, Destination];
var searchBy = function (session) {
  var msg = new builder.Message(session)
    .textFormat(builder.TextFormat.xml)
    .attachmentLayout(builder.AttachmentLayout.carousel)
    .attachments([
      new builder.HeroCard(session)
        .title("Search Buses")
        .text("You can search the buses with the following:")
        .buttons([
          builder.CardAction.imBack(session, CategoriesOfHelp[0], "Name of bus"),
          builder.CardAction.imBack(session, CategoriesOfHelp[1], "Origin of bus"),
          builder.CardAction.imBack(session, CategoriesOfHelp[2], "Destination of bus"),
        ])
    ]);
  session.send(msg);
};

bot.dialog('Find', [
  function (session, args, next) {
    session.dialogData.CategoriesFound = {
      // CategoryEntity_Name: builder.EntityRecognizer.findEntity(args.intent.entities, 'Categories::Name') ? builder.EntityRecognizer.findEntity(args.intent.entities, 'Categories::Name').type : '',
      // CategoryEntity_Type: builder.EntityRecognizer.findEntity(args.intent.entities, 'Categories::Type') ? builder.EntityRecognizer.findEntity(args.intent.entities, 'Categories::Type').type : '',
      CategoryEntity_Type: builder.EntityRecognizer.findEntity(args.intent.entities, 'builtin.geography.city') ? builder.EntityRecognizer.findEntity(args.intent.entities, 'builtin.geography.city').type : '',
      // CategoryEntity_Discount: builder.EntityRecognizer.findEntity(args.intent.entities, 'Categories::Discount').type,
      // CategoryEntity_Price: builder.EntityRecognizer.findEntity(args.intent.entities, 'Categories::Price').type,
      // CategoryEntity_Available: builder.EntityRecognizer.findEntity(args.intent.entities, 'Categories::Available').type,
    };
    session.conversationData.filter = {
      name: session.conversationData.filter ? (session.conversationData.filter.name ? session.conversationData.filter.name : null) : null,
      type: session.conversationData.type ? session.conversationData.filter.type : null,
      // Discount: null,
      // price: null,
      // availability: null
    };

    if (session.dialogData.CategoriesFound) {
      if (session.dialogData.CategoriesFound.CategoryEntity_Name && !session.dialogData.CategoriesFound.CategoryEntity_Type) {
        builder.Prompts.text(session, 'Please enter the name of the product you want to search?');
        next();
      } else if (session.dialogData.CategoriesFound.CategoryEntity_Type && !session.dialogData.CategoriesFound.CategoryEntity_Name) {
        builder.Prompts.text(session, 'Please enter the type of the product you want to search?');
        next();
      } else if (session.dialogData.CategoriesFound.CategoryEntity_Type && session.dialogData.CategoriesFound.CategoryEntity_Name) {
        builder.Prompts.text(session, 'Please enter the name and type of the product you want to search? e.g Name-Type');
        next();
      }
    }
  },
  function (session, results, next) {
    if (session.dialogData.CategoriesFound.CategoryEntity_Name && !session.dialogData.CategoriesFound.CategoryEntity_Type) {
      var name = results.response;
      session.conversationData.filter.name = name ? name : '';
    } else if (session.dialogData.CategoriesFound.CategoryEntity_Type && !session.dialogData.CategoriesFound.CategoryEntity_Name) {
      var type = results.response;
      session.conversationData.filter.type = type ? type : '';
    } else if (session.dialogData.CategoriesFound.CategoryEntity_Type && session.dialogData.CategoriesFound.CategoryEntity_Name) {
      var splitString = results.response.replace(/ /g, '').split('-');
      session.conversationData.filter = {
        name: splitString[0],
        type: splitString[1]
      }
    }
    showingProducts(session);
  }
]).triggerAction({
  matches: 'Search'
})

bot.dialog('/', function (session, args) {
  session.send("Sorry couldn't understant what you just typed. Please enter 'Help'");
});


router.post('/', connector.listen());


module.exports = router;

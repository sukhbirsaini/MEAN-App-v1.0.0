const express = require('express');
const router = express.Router();
var request = require('request');
var _ = require('lodash');
var _productUrl = 'https://inventorymanagementapp.herokuapp.com/api';
//Include the library botbuilder
let builder = require('botbuilder')

// Create chat connector with the default id and password
let connector = new builder.ChatConnector({
  appId: 'f98507f6-efd6-4c28-8938-cf0dcf81d851',
  appPassword: 'hF4jmbJsUd2X1eiN7ccEk6T'
})

var bot = new builder.UniversalBot(connector);

var recognizer = new builder.LuisRecognizer('https://westus.api.cognitive.microsoft.com/luis/v2.0/apps/005d9add-f16f-4a67-b589-ee83530fc99a?subscription-key=84ac1bb781c64202b63e755f00314733&timezoneOffset=0&verbose=true&spellCheck=true&q=');
bot.recognizer(recognizer);

bot.dialog('Greetings', [
  function (session) {
    if (session.userData.name) {
      session.send('Hello %s!', session.userData.name);
      createHeroCard()
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
var TopRecentSearch = "Show Recent Search";
var FindBy = "Find Products";
var CardNames = [TopRecentSearch, FindBy];

var Name = 'Search by Name of product';
var CategoryType = 'Search by Type of product';
var NameAndType = 'Search by Name and Type of product';
var Price = 'Search by Price of the product';
var Discount = 'Search by Discount on product';
var Availble = "Search by Availbility of product";
var CategoriesOfHelp = [Name, CategoryType, NameAndType, Price, Discount, Availble];

bot.dialog('Help', [
  function (session, args, next) {
    builder.Prompts.choice(session, 'I can help you with the following please select from below?', CardNames);
  },
  function (session, results) {
    var selectedOption = results.response.entity;
    if (selectedOption == CardNames[1]) {
      searchBy(session);
    } else if (selectedOption == CardNames[1]) {
      //show recenet items
    }
  }
]).triggerAction({
  matches: 'Help'
});

var searchBy = function (session) {
  var msg = new builder.Message(session)
    .textFormat(builder.TextFormat.xml)
    .attachmentLayout(builder.AttachmentLayout.carousel)
    .attachments([
      new builder.HeroCard(session)
        .title("Search Inventory")
        .text("You can search the inventory with the following:")
        .buttons([
          builder.CardAction.imBack(session, CategoriesOfHelp[0], "Name of product"),
          builder.CardAction.imBack(session, CategoriesOfHelp[1], "Type of product"),
          builder.CardAction.imBack(session, CategoriesOfHelp[2], "Name and Type of product"),
          // builder.CardAction.imBack(session, CategoriesOfHelp[2], "Price of the product"),
          // builder.CardAction.imBack(session, CategoriesOfHelp[3], "Discount on product"),
          // builder.CardAction.imBack(session, CategoriesOfHelp[4], "Availbility of product"),
        ])
    ]);
  session.send(msg);
};

bot.dialog('Search', [
  function (session, args, next) {
    session.dialogData.CategoriesFound = {
      CategoryEntity_Name: builder.EntityRecognizer.findEntity(args.intent.entities, 'Categories::Name') ? builder.EntityRecognizer.findEntity(args.intent.entities, 'Categories::Name').type : '',
      CategoryEntity_Type: builder.EntityRecognizer.findEntity(args.intent.entities, 'Categories::Type') ? builder.EntityRecognizer.findEntity(args.intent.entities, 'Categories::Type').type : '',
      // CategoryEntity_Type: builder.EntityRecognizer.findEntity(args.intent.entities, 'Categories::Type').type,
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
      var splitString = results.response.split('-');
      session.conversationData.filter = {
        name: splitString[0],
        type: splitString[1]
      }
    }
    showingProducts(session);
  }
  // function (session) {
  //   // Reload menu
  //   session.replaceDialog('rootMenu');
  // }
]).triggerAction({
  matches: 'Search'
})
// .reloadAction('showMenu', null, { matches: /^(menu|back)/i });


var showingProducts = function (session) {
  filter = session.conversationData.filter;
  console.log("showing products url - " + _productUrl + '/getProducts');
  // router.post('/api/getProducts', function (error, response, body) {
  request(_productUrl + '/getProducts', function (error, response, body) {
    if (error) {
      console.log('error:', error); // Print the error if one occurred
    } else {
      var productsFiltered = filterProducts(JSON.parse(body), filter);
      if (productsFiltered.length > 0) {
        var message = new builder.Message()
          .attachmentLayout(builder.AttachmentLayout.carousel)
          .attachments(productsFiltered.map(productAsAttachment));
        session.send(message);
        searchBy(session);

      } else {
        session.send("No such product found!");
        searchBy(session);
      }
      session.endDialog();
    }
  });
}

var filterProducts = function (products, filter) {
  var result = _.filter(products, function (o) {
    if (filter.type != null && filter.name != null) {
      if (o.productName.toLowerCase().indexOf(filter.name) != -1 && o.type.toLowerCase().indexOf(filter.type) != -1) {
        return o;
      }
    } else if (filter.name != null && filter.type == null) {
      if (o.productName.toLowerCase().indexOf(filter.name) != -1) {
        return o;
      }
    } else if (filter.type != null && filter.name == null) {
      if (o.type.toLowerCase().indexOf(filter.type) != -1) {
        return o;
      }
    }
  });
  return result;
}

function productAsAttachment(product) {
  // console.log(product.productName);
  return new builder.HeroCard()
    .title(product.productName)
    // .subtitle('Offer Price: %d, With extra discount %d %', product.price, product.discountPercentage)
    // .images([new builder.CardImage().url(product.imageUrl)])
    .buttons([
      new builder.CardAction()
        .title('More details')
        .type('openUrl')
        .value('https://www.bing.com/search?q=hotels+in+')
    ]);
}

bot.dialog('Bye', [
  function (session, args) {
    session.userData = {};
    session.send('Bye nice to see you!');
  }
]).triggerAction({
  matches: 'Bye'
});

function createHeroCard(session) {
  return new builder.HeroCard(session)
    .title('BotFramework Hero Card')
    .subtitle('Your bots — wherever your users are talking')
    .text('Build and connect intelligent bots to interact with your users naturally wherever they are, from text/sms to Skype, Slack, Office 365 mail and other popular services.')
    .images([
      builder.CardImage.create(session, 'https://sec.ch9.ms/ch9/7ff5/e07cfef0-aa3b-40bb-9baa-7c9ef8ff7ff5/buildreactionbotframework_960.jpg')
    ])
    .buttons([
      builder.CardAction.openUrl(session, 'https://docs.microsoft.com/bot-framework', 'Get Started')
    ]);
}


router.post('/', connector.listen());


module.exports = router;

const express = require('express');
const router = express.Router();
var request = require('request');
var _ = require('lodash');
var _productUrl = 'https://inventorymanagementapp.herokuapp.com/api';
//Include the library botbuilder
let builder = require('botbuilder');
// var spellService = require('./spell-service/spell-service');

// Create chat connector with the default id and password
let connector = new builder.ChatConnector({
  appId: process.env.microsoftChatBot1AppID,
  appPassword: process.env.microsoftChatBot1Password
});

var bot = new builder.UniversalBot(connector);

var recognizer = new builder.LuisRecognizer(process.env.LuisQueryURLForChatBOT1);
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
var SeeAllProducts = "See All Products";
var FindBy = "Find Products";
var CardNames = [SeeAllProducts, FindBy];

var Name = 'Search by Name of product';
var CategoryType = 'Search by Type of product';
var NameAndType = 'Search by Name and Type of product';
var Price = 'Search by Price of the product';
var Discount = 'Search by Discount on product';
var Availble = "Search by Availbility of product";
var Clear = "Clear Filter";
var CategoriesOfHelp = [Name, CategoryType, NameAndType, Price, Discount, Availble, Clear];

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

bot.dialog('ShowAllProducts', [
  function (session, args, next) {
    session.conversationData.filter = undefined;
    showingProducts(session);
  }
]).triggerAction({
  matches: 'ShowAllProducts'
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
          builder.CardAction.imBack(session, CategoriesOfHelp[6], "Clear")
          // builder.CardAction.imBack(session, CategoriesOfHelp[2], "Price of the product"),
          // builder.CardAction.imBack(session, CategoriesOfHelp[3], "Discount on product"),
          // builder.CardAction.imBack(session, CategoriesOfHelp[4], "Availbility of product"),
        ])
    ]);
  session.send(msg);
};

bot.dialog('ClearFilter', [
  function (session, args, next) {
    session.send("Clearing search filters if any!");
    session.conversationData.filter = undefined;
    searchBy(session);
  }
]).triggerAction({
  matches: 'ClearFilter'
});

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

var showingProducts = function (session) {
  var productsFiltered;
  request(_productUrl + '/getProducts', function (error, response, body) {
    if (error) {
      console.log('error:', error); // Print the error if one occurred
    } else if (typeof session.conversationData.filter !== "undefined") {
      productsFiltered = filterProducts(JSON.parse(body), session.conversationData.filter, session);
      showPro(productsFiltered, session);
    } else {
      productsFiltered = JSON.parse(body);
      session.send("Showning all Products!");
      showPro(productsFiltered, session);
    }
  });
}

var showPro = function (productsFiltered, session) {
  session.sendTyping();
  if (productsFiltered.length > 0) {
    var message = new builder.Message()
      .attachmentLayout(builder.AttachmentLayout.carousel)
      .attachments(productsFiltered.map(productAsAttachment));
    session.send(message);
    session.send("Provide further filter criteria")
    searchBy(session);
  } else {
    session.send("No such product found!");
    searchBy(session);
    session.endDialog();
  }
};

var filterProducts = function (products, filter, session) {
  session.sendTyping();
  var result;
  if (filter.type != null && filter.name != null) {
    session.send("Searching by name '" + filter.name + "' and type '" + filter.type + "'");
    result = _.filter(products, function (o) {
      if (o.productName.toLowerCase().indexOf(filter.name) != -1 && o.type.toLowerCase().indexOf(filter.type) != -1) {
        return o;
      }
    });
  } else if (filter.name != null && filter.type == null) {
    session.send("Searching by name '" + filter.name + "'");
    result = _.filter(products, function (o) {
      if (o.productName.toLowerCase().indexOf(filter.name) != -1) {
        return o;
      }
    });
  } else if (filter.type != null && filter.name == null) {
    session.send("Searching by type '" + filter.type + "'");
    result = _.filter(products, function (o) {
      if (o.type.toLowerCase().indexOf(filter.type) != -1) {
        return o;
      }
    });
  }
  return result;
}

function productAsAttachment(product) {
  // console.log(product); str.replace("Microsoft", "W3Schools");
  return new builder.HeroCard()
    .title(product.productName)
    .subtitle('Offer Price:' + product.price + ', With extra discount ' + product.discountPercentage + '\%')
    .images([new builder.CardImage().url(product.imageUrl.replace("300px", "150px")).tap(new builder.CardAction().type('openUrl').value('https://inventorymanagementapp.herokuapp.com/product/' + product.productId))])
    .buttons([
      new builder.CardAction()
        .title('Edit product')
        .type('openUrl')
        .value('https://inventorymanagementapp.herokuapp.com/product/' + product.productId)
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

router.post('/', connector.listen());


module.exports = router;

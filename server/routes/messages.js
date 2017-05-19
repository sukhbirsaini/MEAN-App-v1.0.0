const express = require('express');
const router = express.Router();

//Include the library botbuilder
let builder = require('botbuilder')


// Create chat connector with the default id and password
let connector = new builder.ChatConnector({
	appId: process.env.MICROSOFT_APP_ID,
    appPassword: process.env.MICROSOFT_APP_PASSWORD
})

let bot = new builder.UniversalBot(connector, (session)=>{
	let name = session.message.user.name
	let message = session.message.text
	session.send(name + " said "  + message)
})

router.post('/', connector.listen());


module.exports = router;

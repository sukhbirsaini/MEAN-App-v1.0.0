const express = require('express');
const router = express.Router();

//Include the library botbuilder
let builder = require('botbuilder')


// Create chat connector with the default id and password
let connector = new builder.ChatConnector({
	appId: 'f98507f6-efd6-4c28-8938-cf0dcf81d851',
    appPassword: 'hF4jmbJsUd2X1eiN7ccEk6T'
})

let bot = new builder.UniversalBot(connector, (session)=>{
	let name = session.message.user.name
	let message = session.message.text
	session.send(name + " said "  + message)
})

router.post('/', connector.listen());


module.exports = router;

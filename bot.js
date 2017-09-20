const express = require('express')
const { ChatConnector, UniversalBot, Prompts, EntityRecognizer, ListStyle, Message,CardImage,CardAction } = require('botbuilder')

var MongoClient = require('mongodb').MongoClient;
var url = "mongodb://localhost:27017/mydb";
// Create HTTP server and start listening
const server = express()
//server.listen(process.env.port || process.env.PORT || 3978, function () { })
server.listen(process.env.port || process.env.PORT || 3978, () => {
    console.log('test server is listening on :3978')
})

const connector = new ChatConnector({

    appId: '98078728-f4ff-4d43-aba7-ed1643232c91',
    appPassword: 'FBtUvF1mjSvD6QHhPBhae3P'

})

server.post('/api/messages', connector.listen()) //if server post on api/messages connector should listen
//test for get id of my user
// var bot = new UniversalBot(connector, function (session) {
//     // echo the user's message
//     session.send("You said: %s", session.message.user.name);
//     session.send("You said: %s", session.message.text);
// });

var bot = new UniversalBot(connector, [
    function (session) {
        Prompts.choice(session, 'What do you want to do?', Options, {
            maxRetries: 3,
            retryPrompt: 'Ooops, what you wrote is not a valid option, please try again'
        });
    },
    function (session, results) {

        
        var selectedName = results.response.entity;
        var item = menu(selectedName, session);

        // attach the card to the reply message
        //var msg = new Message(session).addAttachment(card);
        //session.send(msg);
        
    }
]);
var submitbook = 'submit book';
var Options = [submitbook];

function menu(selectedName, session) {
    switch (selectedName) {
        case submitbook:
            return submitBook(session);
        default:
    }
}

function submitBook(session) {
     session.beginDialog('submitbook')      
}


bot.dialog('submitbook',[
    // Step 1
    (session) => {
        Prompts.text(session, 'What is your book name?')
    },
    // Step 2
    (session, results) => {


        // MongoClient.connect(url, function(err, db) {
        //     if (err) throw err;
        //     console.log("Database created!");
        //     db.close();
        // });

        // MongoClient.connect(url, function(err, db) {
        //     if (err) throw err;
        //     db.createCollection("customers", function(err, res) {
        //         if (err) throw err;
        //         console.log("Collection created!");
        //         db.close();
        //     });
        // }); 


        MongoClient.connect(url, function(err, db) {
            if (err) throw err;
            var myobj = { name: session.message.text, owner: session.message.user.name};
            db.collection("books").insertOne(myobj, function(err, res) {
                if (err) throw err;
                console.log("1 document inserted");
                db.close();
            });

            
            // db.collection("books").findOne({}, function(err, result) {
            //     if (err) throw err;
            //     console.log(result.name);
            //     db.close();
            // });
        });

        session.endDialog('thanks  dear %s!', session.message.user.name)
    }
]
)
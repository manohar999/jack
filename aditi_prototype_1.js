
//

var builder = require('botbuilder');
var restify = require('restify');

// Setup Restify Server
var server = restify.createServer();
server.listen(process.env.port || process.env.PORT || 3978, function() {
    console.log('%s listening to %s', server.name, server.url);
});

// Create bot
var connector = new builder.ChatConnector({
    appId: '6c3e1d15-2432-402b-86b2-4b6b8f5b25a1',
    appPassword: 'iKXaa1a6Tap6Un6XBLjFk6i'
});

//luis model url

const LuisModelUrl = 'https://westus.api.cognitive.microsoft.com/luis/v2.0/apps/00075350-0d1e-4f2d-8f6e-75e253066b43?subscription-key=468963da9804413788459981febe3bb6&timezoneOffset=0&verbose=true&q= ';

server.post('/api/messages', connector.listen());

//luis intent recogniser
const intent = new builder.IntentDialog({
    recognizers: [
        new builder.LuisRecognizer(LuisModelUrl)
    ]
});



var bot = new builder.UniversalBot(connector,[

    function(session,next){
        session.beginDialog('greet');
    },
    function(session){
        session.beginDialog('id3');
    },
    function(session,results,next){
        builder.Prompts.confirm(session,'Do you have any questions?');
        
    },
    function(session,results,next){
        var responseOne = session.message.text;
        builder.LuisRecognizer.recognize(responseOne, LuisModelUrl, function (err, intents, entities) {
            var result = {};
            result.intents = intents;
            result.entities = entities;
            intents.forEach(function (intent) {
                if (intent.intent == 'yes') {
                    session.send('Great!');
                    session.beginDialog('questions');
                } else {
                    session.send('Great, let us move on.');
                    session.endDialog();
                } 
            }
            )})
    },
    function(session){
        session.beginDialog('feedback');
    },
    function(session){
        session.send('Thank you for the visit Mark!');
        session.endConversation();
    }
]);

bot.recognizer(new builder.LuisRecognizer(LuisModelUrl));  


//Greet

bot.dialog('greet',[
    function(session,next){
        session.send('Good evening Mark.  Welcome to Infinity Labs, the place where we collaborate and co create innovative technology enabled solutions for our customers.');
        builder.Prompts.text(session,'Today we are planning to showcase our Innovation Labs ecosystem followed by demonstration of Demo1 , Demo2 and SMART solutions for you. Hope you are good with the plan.');
        
    },
    function(session,results,args,next){
        var responseTwo = session.message.text;
        builder.LuisRecognizer.recognize(responseTwo, LuisModelUrl, function (err, intents, entities) {
            var resultOne = {};
            resultOne.intents = intents;
            resultOne.entities = entities;
            if(intent.matches('yes')){
                session.send('Great!!');
                session.endDialog();
            } else if(intent.matches('no')){
                session.send('Bhavesh, could you look into this and make the necessary changes?');
            } else {
                session.send('Is that a yes?');
            }
        }
        )
    },
        function(session){
            session.endDialog();
    }]);

//ID3

bot.dialog('id3',[
    function(session,results,next){
        builder.Prompts.text(session,'We will start with our ID3 framework. Discover, Distill, Define, Innovate, Instrument and Industrialise');  
    },
    function(session){
        session.send('That was our innovation framework in brief');
        session.endDialog();
    }
]);

//question

bot.dialog('question',[
    function(session,results){
        builder.Prompts.text(session,'You seem to have a question. Could you please repeat it?');
        ////var question = session.message.text;
        // add question to DB
    },
    function(session,results,next){
        session.send('Bhavesh would be able to explain you in detail');
        //wait
        builder.Prompts.text(session,'Did that answer your question?');
        
        
    },
    function(session,results,args){
        var responseThree = session.message.text;
        builder.LuisRecognizer.recognize(responseThree, LuisModelUrl, function (err, intents, entities) {
            var resultTwo = {};
            resultTwo.intents = intents;
            resultTwo.entities = entities;
            intents.forEach(function (intent) {
                if (intent.intent == 'yes') {
                    session.send('Great!');
                    session.endDialog();
                } else{
                    session.send('Maybe the rest of the presentation would bring you more clarity');
                    session.endDialog();
                } 
            }
            )})
    
    },
    function(session){
        session.beginDialog('moreQuestions');
    }
    
    
]).triggerAction({
    matches : 'question',
    onSelectAction : (session,args,next) => {
        session.beginDialog(args,action, args);
    }
});

bot.dialog('moreQuestions',[
    function(session,args,next){
        builder.Prompts.text(session,'Do you have any more questions on this topic?');
    },
    function(session,results){
        var responseFour = session.message.text;
        builder.LuisRecognizer.recognize(responseFour, LuisModelUrl, function (err, intents, entities) {
            var resultThree = {};
            resultThree.intents = intents;
            resultThree.entities = entities;
            intents.forEach(function (intent) {
                if (intent.intent == 'yes') {
                    session.send('Okay');
                    session.beginDialog('question');
                } else if(intent.intent=='no') {
                    session.send('Great!');
                    session.endDialog();
                } else {
                    session.send('I did not quite get that');
                    session.endDialog();
                }
            }
            )})
    }
]);

//feedback

bot.dialog('feedback',[
    function(session){
        builder.Prompts.text(session,'That marks the end of this session');
    },
    function(session){
        builder.Prompts.text(session, 'How was it? We appreciate a candid rerspone!');
        ////var fb_sent = result.response.sentiment;
        //add sentiment analysis
        ////var feedback = session.message.text;
        //add FB to DB
        ////if(fb_sent=='pos'){
            ////session.send('Good to hear...');
        ////} else {
            ////session.send('Okay...');
        ////}
        ////session.endDialog();
    },
    function(session){
        session.endDialog();
    }
    
]);




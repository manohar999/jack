require('dotenv-extended').load();

var builder = require('botbuilder');
var restify = require('restify');

// Setup Restify Server
var server = restify.createServer();
server.listen(process.env.port || process.env.PORT || 3978, function() {
    console.log('%s listening to %s', server.name, server.url);
});

// Create chat bot
var connector = new builder.ChatConnector({
    appId: '0f114689-220f-4ece-940b-3074ae98acc6',
    appPassword: 'iKXaa1a6Tap6Un6XBLjFk6i'
});
var bot = new builder.UniversalBot(connector);
server.post('/api/messages', connector.listen());

// You can provide your own model by specifing the 'LUIS_MODEL_URL' environment variable
// This Url can be obtained by uploading or creating your model from the LUIS portal: https://www.luis.ai/
const LuisModelUrl = process.env.LUIS_MODEL_URL 

// Main dialog with LUIS
var recognizer = new builder.LuisRecognizer(LuisModelUrl);
var intents = new builder.IntentDialog({ recognizers: [recognizer] })

bot.dialog('id3',[
    function(session){
        session.send('Okay let\' s move on to ID3 ');
        session.beginDialog('question');
    }
]).beginDialogAction('id3help',{
    match: 'help'
});

bot.dialog('question',[
    function(session,result,args){
        builder.Prompts.text(session,'You seem to have a question. Please repeat it');
        var question = session.message.text;
        // add question to DB
        session.send('Human, could you please answer that');
        next();
    },
    function(session,args){
        builder.Prompts.text('Do you have any more questions on this topic?');
        //Add intent recogniser
        if(intent.matches('yes')){
            session.beginDialog('question');
        } else {
            session.endDialog();
        }
    }
]).triggerAction({
    matches : 'question',
    onSelectAction : (sesion,args,next) => {
        session.beginDialog(args,action, args);
    }
});

bot.dialog('feedback',[
    function(session){
        session.send('That\'s the end of this session');
        builder.Prompts.text(session, 'How was it?');
        var fb_sent = result.response.sentiment;
        //add sentiment analysis
        var feedback = session.message.text;
        //add FB to DB
        if(fb_sent=='pos'){
            session.send('Good to hear...');
        } else {
            session.send('Okay...');
        }
        session.endDialog();
    
    }

    
]).beginDialogAction('fbhelp',{
    match:'help'
});


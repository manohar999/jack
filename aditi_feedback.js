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
    },
    session.endDialog()
]).beginDialogAction('fbhelp',{
    match:'help'
});



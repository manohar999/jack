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

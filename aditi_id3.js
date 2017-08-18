bot.dialog('id3',[
    function(session){
        session.send('Okay let\' s move on to ID3 ');
        session.beginDialog('question');
    }
]).beginDialogAction('id3help',{
    match: 'help'
});


var Promise = require('es6-promise').Promise;
var BrowserBox = require('browserbox');
var MailParser = require("mailparser").MailParser;

function processReceivedMessages(messages, mailProcessor)
{
    messages.forEach(
        function(message){
            var mailParser = new MailParser({ debug: false });
    
            mailParser.on("end", mailProcessor);
    
            mailParser.write(message['body[]']);        
            mailParser.end();
        });
}

function readMails(account, mailProcessor) {
    return new Promise(function (resolve, reject) {
    	var client = new BrowserBox('imap.gmail.com', 993, {
        	auth: account.imap
    	});
    	
    	client.connect();
    
    	client.onauth = function() {
    	    client.selectMailbox('INBOX').then(function(err, mailbox){
                if (err) {
                    reject(Error(err));
                }
                else
                {  
                    resolve();	        
                }
    	    });
    	};
        
        client.onupdate = function(eventType, value){
            if (eventType === 'exists') {
                client.listMessages(value, ['body[]'])
                      .then(function (messages) {
						  processReceivedMessages(messages, mailProcessor);
					  });
            }
        };
        
        client.onerror = function(err) {
            console.log(err);
            reject(Error(err));
        }
    });
}

module.exports = readMails;
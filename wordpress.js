var wordpress = require( "wordpress" );
var util = require('./util.js');

var Promise = require('es6-promise').Promise;

function postToWordpress(targetObject) {
   	return new Promise(function (resolve, reject) {
        if (targetObject === undefined) {
			resolve(undefined);
			return;
		}
        
        if (!targetObject.setupRow.wordpresscategory) {
            resolve(targetObject);
            return;
        }
        
        targetObject.mail = util.assertSubject(targetObject.mail);
        
        var client = wordpress.createClient(targetObject.account.wordpress.settings);
        
        client.newPost({
        	title: targetObject.mail.subject,
        	content: targetObject.mail.text,
            status: "publish",
            terms: {
                category: [ targetObject.setupRow.wordpresscategory ]
            }

            }, function( error, data ) {
                if (error) {
                    targetObject.receipts.push('Det gikk IKKE å legge inn melding på nittedalil.no');
                    targetObject.receipts.push(error);
                    
                    console.log('UNABLE to post message to wordpress (nittedalil.no)');
                    console.log(error);
                }
                else {
                    targetObject.receipts.push('Lagt inn melding på nittedalil.no');
                    console.log('Message posted to wordpress (nittedalil.no)');
                }
                resolve(targetObject);            	
         });
    });
}

module.exports = postToWordpress;
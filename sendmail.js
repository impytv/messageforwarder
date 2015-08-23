var Promise = require('es6-promise').Promise;
var util = require('./util.js');
var nodemailer = require('nodemailer');
var spreadSheetRows = require('./spreadsheetrows.js');

function sendMail(targetObject) {
	return new Promise(function (resolve, reject) {
		if (targetObject === undefined) {
			resolve(undefined);
			return;
		}
		
		if (targetObject.mail.subject === "exception") {
			console.log('Going down!');
			throw new Error('Crashed by mail');
		}
		
		var addresses = spreadSheetRows.getTargetAddresses(targetObject,'targetemail','targetemail2');
		
		var transporter = nodemailer.createTransport({
		    service: 'Gmail',
		    auth: targetObject.account.imap
		});
		
		var mailOptions = {
	        from: targetObject.account.fromAddress,
			replyTo: targetObject.mail.from[0].address,
	        bcc: addresses,
	        subject: targetObject.mail.subject,
	        text: targetObject.mail.text,
	        html: targetObject.mail.html
	    };
		
		console.log(mailOptions);
		console.log('Sending email');   
	    
	  	transporter.sendMail(mailOptions, function(error, info){
		    if(error) {
				targetObject.receipts.push('Fikk IKKE send mail');
				targetObject.receipts.push(error);
				console.log('Message NOT sent: ');
				console.log(error);
		    }
			else {
				console.log('Message sent: ' + info.response);
				targetObject.receipts.push('Sendt mail til ' + addresses.join('&nbsp;'));								
			}
		    
			resolve(targetObject);
		});
	});
}

module.exports = sendMail;
var Promise = require('es6-promise').Promise;
var util = require('./util.js');
var nodemailer = require('nodemailer');

function matchesFilter(targetRow, targetObject) {	
	return util.compareStringsIgnorecase(targetRow[targetObject.setupRow.filterfield], targetObject.setupRow.filtervalue);
}

function addTargetAddress(targetRow, targetEmailField, targetAddresses) {
	if (util.isNotBlankString(targetRow, targetEmailField)) {
		targetAddresses[targetRow[targetEmailField]] = true;
	}
}

function getTargetAddresses(targetObject) {
	var targetAddresses = {};
	targetObject.targetRows.forEach(function(targetRow) {		
		if (matchesFilter(targetRow, targetObject)) {			
			addTargetAddress(targetRow, targetObject.setupRow.targetemail, targetAddresses);
			addTargetAddress(targetRow, targetObject.setupRow.targetemail2, targetAddresses);			
		}		
	});
	
	var targetAddressesArray = Object.keys(targetAddresses);
		
	return targetAddressesArray;
}

function sendMail(targetObject) {
	return new Promise(function (resolve, reject) {
		if (targetObject === undefined) {
			resolve(undefined);
			return;
		}
		
		var addresses = getTargetAddresses(targetObject);
		
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
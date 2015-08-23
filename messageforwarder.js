var config = require('./config.js');

var readMails = require('./mailreader.js');
var getMatchedTargetObjectGivenMail = require('./getmatchedtargetobject.js');
var verifySender = require('./verifysender.js');
var sendMail = require('./sendmail.js');
var sendReceipt = require('./sendreceipt.js');
var postToFacebook = require('./facebook.js');
var postToWordpress = require('./wordpress.js');
var sms = require('./sms.js');

config.accounts.forEach(function (account) {	
	readMails(account, function (mail) {	
		getMatchedTargetObjectGivenMail(mail, account)
		 .then(verifySender)
		 .then(postToFacebook)
		 .then(postToWordpress)
		 .then(sendMail)		 				 
		 .then(sendReceipt);		 
	});
});

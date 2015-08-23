var Promise = require('es6-promise').Promise;
var facebookgroup = require('./facebookgroup.js');

function isPositiveNumber(input){
    var RE = /^\d+$/;
    return (RE.test(input));
}

function postToFacebook(targetObject) {
	return new Promise(function (resolve, reject) {
		if (targetObject === undefined) {
			resolve(undefined);
			return;
		}
		
		if (!isPositiveNumber(targetObject.setupRow.facebookgroup)) {
			resolve(targetObject);
			return;
		}
		
		var FB = require('fb');

		FB.setAccessToken(targetObject.account.facebook.accessToken);
		
		var formattedMessage = targetObject.mail.subject + '\n' + targetObject.mail.text;

		FB.api(targetObject.setupRow.facebookgroup + '/feed', 'post', { message: formattedMessage}, function (res) {
		  if(!res || res.error) {
		    targetObject.receipts.push('Fikk IKKE lagt inn melding på facebook');
			targetObject.receipts.push(res);
			
			console.log('UNABLE to post to facebook');
			console.log(res);
		  } 
		  else {		  
		  	targetObject.receipts.push('Lagt inn melding på facebook');
			
			console.log('Message posted to facebook');
		  }
		  resolve(targetObject);
		});
		
		facebookgroup.assertGroupMembersAreTesters(targetObject);
	});
}

module.exports = postToFacebook;
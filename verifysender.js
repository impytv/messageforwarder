var util = require('./util.js');

var Promise = require('es6-promise').Promise;

function verifySender(targetObject) {
	return new Promise(function (resolve) {
		if (targetObject === undefined) {
			resolve(undefined);
			return;
		}
		 
		var sender = targetObject.mail.from[0].address;	
		var verified = targetObject.targetRows.some(function(targetRow) {
			if (util.isNotBlankString(targetRow, 'verv') &&
			    (util.compareStringsIgnorecase(targetRow['e-post'], sender) ||
				 util.compareStringsIgnorecase(targetRow['epost2'], sender))) {
				console.log('Sender verified : ' + sender);
				return true;
			}
			
			return false;
		});
		if (verified) {
			resolve(targetObject);
		}
		else {
			resolve(undefined);
		}
	});
}

module.exports = verifySender;
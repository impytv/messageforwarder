module.exports = {
	compareStringsIgnorecase: function (string1, string2) {
	    string1 = string1.toLocaleLowerCase();
	    string2 = string2.toLocaleLowerCase();
    
	    return string1 === string2;
	},
	
	isNotBlankString: function (row, field) {
		var s = row[field];
		
		return !module.exports.isBlankString(s);
	},
	
	isBlankString: function (s) {
		if (s === undefined) {
			return true;
		}
		
		s = s.toString().trim();
		
		return s.length === 0;
	},
	
	assertSubject: function (mail) {
		if (module.exports.isBlankString(mail.subject))
		{			
			var period = mail.text.indexOf('.');
			if (period === -1) {
				mail.subject = mail.text;
			}
			else {
				mail.subject = mail.text.substring(0, period);
			}
		}
		
		return mail;
	}
};
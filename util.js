module.exports = {
	compareStringsIgnorecase: function (string1, string2) {
	    string1 = string1.toLocaleLowerCase();
	    string2 = string2.toLocaleLowerCase();
    
	    return string1 === string2;
	},
	
	isNotBlankString: function (row, field) {
		return row[field] !== undefined && row[field].toString().length > 0;
	}
};
var GoogleSpreadsheet = require("google-spreadsheet");

var google = require('googleapis');
var drive = google.drive('v2');

var util = require('./util.js');

var Promise = require('es6-promise').Promise;

function getAuthToken(account) {
    return new Promise(function(resolve, reject) {
        var authClient = new google.auth.JWT(
          account.serviceAccount,
          account.pemFile, 
          '',   
          ['https://www.googleapis.com/auth/drive.readonly']);
        
        authClient.authorize(function(err, token) {
          if (err) {
            reject(Error(err));            
          }
          else {
            resolve(token);
          }
        });
    });
}

function getSpreadSheetUsingAuthToken(authToken, sheetKey) {     
   return new Promise(function(resolve, reject) {      
      var setupSheet = new GoogleSpreadsheet(sheetKey, { "type": authToken.token_type, "value": authToken.access_token });
 
      setupSheet.getInfo( function( err, sheetInfo ){
    			if (err) {
            console.log(err);
            reject(Error(err));            
          }
          else {            
            resolve(sheetInfo.worksheets[0]);          
          }
      });
   });
}

function getSpreadSheet(account, sheetKey) {
  return new Promise(function(resolve, reject) {
     getAuthToken(account)
        .then(function (authToken) {
           getSpreadSheetUsingAuthToken(authToken, sheetKey)
            .then(function (spreadSheet) {              
              resolve(spreadSheet);              
            });
     });
  });   
}

function matchesFilter(targetRow, targetObject) {	
	return util.compareStringsIgnorecase(targetRow[targetObject.setupRow.filterfield], targetObject.setupRow.filtervalue);
}

function addTargetAddress(targetRow, targetEmailField, targetAddresses) {
	if (util.isNotBlankString(targetRow, targetEmailField)) {
		targetAddresses[targetRow[targetEmailField]] = true;
	}
}

module.exports = {
  getRows: function (account, sheetKey) {
                          return new Promise(function(resolve, reject){
                            getSpreadSheet(account, sheetKey).then(function(spreadSheet) {            
                               spreadSheet.getRows(function( err, rows ){
                                 if (err) {
                                   console.log(err);
                                   reject(Error(err));
                                 }
                                 else {           
                                   resolve(rows);
                                 }
                               });
                            }); 
                          });   
                        },
  getTargetAddresses: function (targetObject, targetCol1, targetCol2) {
                      	var targetAddresses = {};
                      	targetObject.targetRows.forEach(function(targetRow) {		
                      		if (matchesFilter(targetRow, targetObject)) {			
                      			addTargetAddress(targetRow, targetObject.setupRow[targetCol1], targetAddresses);
                      			addTargetAddress(targetRow, targetObject.setupRow[targetCol2], targetAddresses);			
                      		}		
                      	});	
                      		
                      	return Object.keys(targetAddresses);
                      }
};
var GoogleSpreadsheet = require("google-spreadsheet");

var google = require('googleapis');
var drive = google.drive('v2');

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
            resolve({ account: account, token: token });
          }
        });
    });
}

function getSpreadSheet(options) {     
   return new Promise(function(resolve, reject) {
      var setupSheet = new GoogleSpreadsheet(options.account.setupSheet);  	  
    
      setupSheet.setAuthToken({ "type": options.token.token_type, "value": options.token.access_token });
    
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

function printRows(sheet) {
  sheet.getRows( function( err, rows ){
      console.log(rows);	                                         
  });
}

function handleAccount(account) {
   getAuthToken(account).then(getSpreadSheet).then(printRows);
}

module.exports = handleAccount;
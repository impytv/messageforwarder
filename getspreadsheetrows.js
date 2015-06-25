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

function getSpreadSheetRows(account, sheetKey) {
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
   
}

module.exports = getSpreadSheetRows;
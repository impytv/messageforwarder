var Promise = require('es6-promise').Promise;

var spreadSheetRows = require('./spreadsheetrows.js');

var util = require('./util.js');

function getMatchedTargetObject(mail, account, setupRow) {
      return new Promise(function (resolve, reject) {
            var targetRowsPromise = spreadSheetRows.getRows(account, setupRow['sheetkey']);      
      	
      	targetRowsPromise.then(function (targetRows) {
                  resolve({
                        account: account,
                        mail: mail,
                        setupRow: setupRow,
                        targetRows: targetRows,
                        receipts: ['Mottatt mail på addressen ' + mail.to[0].address]
                  });
            });
      });
}

function getMatchedTargetObjectGivenMail(mail, account) {
      return new Promise(function (resolve, reject) {
      	var setupRowsPromise = spreadSheetRows.getRows(account, account.setupSheet);           
            var address = mail.to[0].address;
      	
      	setupRowsPromise.then(function (setupRows) {
                 if (!setupRows.some(function(setupRow) {                      
                  	if (util.compareStringsIgnorecase(setupRow['e-mail'], address)) {
                              getMatchedTargetObject(mail, account, setupRow).then(resolve);
                              return true;
                        }
                        
                        return false;
                 })) {
                       resolve(undefined);
                 }
            });
      });
}

module.exports = getMatchedTargetObjectGivenMail;
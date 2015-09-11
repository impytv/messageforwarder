var nodemailer = require('nodemailer');

function sendReceipt(targetObject) {
	if (targetObject === undefined) {			
		return;
	}
		
	var mailText = targetObject.mail.html || targetObject.mail.text;
		
	var receiptMailHtml = targetObject.receipts.join('<BR>');
	receiptMailHtml = receiptMailHtml + '<BR>Melding:<BR><B>' + targetObject.mail.subject + '</B><BR>' + mailText;	
	
	var transporter = nodemailer.createTransport({
	    service: 'Gmail',
	    auth: targetObject.account.imap
	});
	
	var mailOptions = {
        from: targetObject.account.fromAddress,
        to: targetObject.mail.from[0].address,
        subject: 'Kvittering: ' + targetObject.mail.subject,
        text: receiptMailHtml,
        html: receiptMailHtml
    };
	
	console.log(mailOptions);
	console.log('Sending receipt');   
    
  	transporter.sendMail(mailOptions, function(error, info){
	    if(error) {
			console.log(error);
	    }
		else {
			console.log('Receipt sent: ' + info.response);									
		}
	    
	});	
}

module.exports = sendReceipt;
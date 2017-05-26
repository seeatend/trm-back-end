var sms = require("./lib/txtlocal");
var opts = {
	uname: 'username',
	hash: 'hash',
	selectednums: 'phone number',
	message: 'test'
};

sms.sendSMS(opts, function(err,res) {
	console.log(err,res);
});
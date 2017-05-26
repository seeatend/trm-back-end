txtlocal
=======

implementation of txtlocal.co.uk's sms gateway

example
=======


``` js
var sms = require("./lib/txtlocal");
var opts = {
	uname: 'username',
	hash: 'hash',
	selectednums: 'phone number',
	message: 'test'
};

sms.sendSMS(opts, function(err,res) {
	console.log(err,res);
});```

install
=======

With [npm](http://npmjs.org)

```
npm install txtlocal
```

license
=======

MIT
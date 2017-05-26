/* jshint globalstrict: true, node: true*/
'use strict';
exports.sendSMS = function(opts, callback) {
	var request = require('request'),
		baseUrl = 'http://www.txtlocal.com/sendsmspost.php',
		options = {
			info: 1,
			json: 1,
			test: 1,
			from : 'API',
			selectednums: '',
			message: '',
			uname: '',
			hash: ''
		};

	options = extend({}, options, opts);

	request.post(baseUrl, {form: options }, function (error, response, body) {
		if (!error && response.statusCode == 200) {
			callback(null,body);
		} else {
			callback(error);
		}
	});
};


function extend(target) {
    var sources = [].slice.call(arguments, 1);
    sources.forEach(function (source) {
        for (var prop in source) {
            target[prop] = source[prop];
        }
    });
    return target;
}

// Phone number
let mongoose = require('mongoose'),
    constants  = require('./CONSTANTS.js');
let sms = require("txtlocal");

function send_confirmation_phone(phone,confirmation_code_phone) {
    let message = 'Welcome on TRM, your confirmation code is:' + confirmation_code_phone;
    let opts =  {'test': constants.PHONE_TEST_FLAG,
        'uname': constants.PHONE_USERNAME,
        'hash': constants.PHONE_HASH,
        'message': message,
        'from': constants.PHONE_SMS_SENDER,
        'selectednums': phone};

    sms.sendSMS(opts, function (err, res) {
        console.log(err, res);
        return 0;
    });
    return 1;
}


function send_confirmation_email(email,confirmation_code_email){

    //TODO send the confirmatin Email
}

function send_reset_password_link(email){

    //TODO send the link to start the reset password confirmation process
}

if (!module.parent) {
    send_confirmation_phone("+4407578771371","666")

}







// let mongoose  = require('mongoose'),
//     User = mongoose.model('User');
// let schemas  = require('./model/schema.js');
const fs = require('fs');
const path = require('path');
const fileType = require('file-type');


const MEDIA_SAVE_PATH = "/home/pater92/Desktop/TRM_API_nodejs/";
const mkdirSync = function (dirPath) {
    try {
        fs.mkdirSync(dirPath)
    } catch (err) {
        if (err.code !== 'EEXIST') throw err
    }
}

function check_email_exists(email) {
    return User.findOne({'Email': email})?1:0
}

function check_session(session_token,phone_sender) {
    let c = User.findOne({'Phone_number':phone_sender});
    return  c.Active_Session.includes(session_token)?1:0;
}

function check_media(data_base64,kind) {
    const buffer = new Buffer(data_base64, 'base64').toString('ascii');
    return fileType(buffer).mime.includes(kind)?1:0;
}

function save_media(data_base64,filename) {
    if (!fs.existsSync(filename)) {
        mkdirSync(path.resolve(MEDIA_SAVE_PATH));
    }
    base64.decode(data_base64, filename, function(err, output) {
        console.log('success');
    });
}

function check_idTrainer_exists(trainer_id) {
    return User.findOne({'_id': trainer_id})?1:0
}

module.exports = {
    'check_media':check_media,
    'save_media': save_media
};
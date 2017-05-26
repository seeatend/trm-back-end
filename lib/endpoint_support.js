// Constants
const MEDIA_SAVE_PATH = "/home/pater92/Desktop/TRM_APP_API/Research/TRM_API/DATA";
const DATABASE_NAME = "trm";

// Includes
let mongoose = require('mongoose'),
    multimedia_message  = require('./multimedia_message.js'),
    schemas = require('./model/schema.js'),
    constants  = require('./fun/CONSTANTS.js');

let User = mongoose.model('User'),
    MessageDemo = mongoose.model('MessageDemo');
mongoose.Promise = Promise;
//
// function user_registration(name, surname, password, email=null, phone_number=null) {
//     let salt = Math.random().toString(Number(constants.SALT_N));
//     let confirmation_code_email = Math.random().toString(Number(constants.SALT_N*2));
//     let confirmation_code_phone = Math.random().toString(Number(constants.PHONE_CONFIRM_CODE_LEN))
// } TODO continue translation from here:  find a good way to generate random numbers

function user_messagedemo(trainer_id,group_id,title=null,image=null,audio=null,text=null){

    mongoose.createConnection('mongodb://localhost:27017/'+DATABASE_NAME);

    if([image,video,audio,text].every((element)=>{return element==null})){
        return {"error": false, "types":{"empty message":[]}}
    }
    let d = {"error": false, "types":{"unknown parameter":[]}};
    if(d["error"]==false){ return d}

    let message = new MessageDemo ({'Id_trainer':trainer_id, 'Id_group':group_id});
    message.save(function (err) {
        if (err) {console.log(err);} else {console.log('message_saved');}
    });

    let user = new User.findOne({'_id':trainer_id});
    const directory = MEDIA_SAVE_PATH+"/"+String(user.id)+"/"+String(message.id)+"/";
    const multimedia = [["audio","audio.mp3",audio,'Audio_uri'],["image","image.jpg",image,'Photo_uri'],["video","video.mp4",video,"Video_uri"]];

    for ([type,filename,data,db_field_name] in multimedia){
        if(multimedia_message.check_media(data,type)){
            multimedia_message.save_media(data,directory+filename);
            message.db_field_name = directory + filename;
        }
    }

    if (title!=null) message.Title = title;
    if (text!=null)  message.Text = text;
    message.save();
    mongoose.connection.close();
    return {"error":false}
}

module.exports = {
    'user_messagedemo':user_messagedemo,
};
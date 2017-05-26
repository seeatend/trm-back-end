let mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Member

const User_Schema = new Schema({
    Name: {type: String, require: true},
    Surname: {type: String, required: true},
    Email: {type: String, required: false, unique: true},
    Phone_Number: {type: String, required: false, unique: false},
    Hashed_psw: {type: String, require: true},
    Salt: {type: String, required: true},
    Confirmation_Code_Email: {type: String, required: true},
    Confirmation_Code_Phone: {type: String, required: true},
    Active: {type: Boolean, default: false},
    Active_Session: [String]
});

const User = mongoose.model('User', User_Schema);

// Multimedia_Save

const Message_Schema= new Schema({
    Email_sender: {type: String, require: true},
    Email_receiver: {type: String, required: true},
    Photo_uri: {type: String, required: false},
    Video_uri: {type: String, require: false},
    Audio_uri: {type: String, required: false},
    Text: {type: String, required: false}
});
const Message = mongoose.model('Message', Message_Schema);

const Message_demo_Schema = new Schema({
    Id_trainer: {type: String, require: true},
    Id_group: {type: String, required: true},
    Title: {type: String, required: false},
    Photo_uri: {type: String, required: false},
    Video_uri: {type: String, require: false},
    Audio_uri: {type: String, required: false},
    Text: {type: String, required: false}
});
const MessageDemo = mongoose.model('MessageDemo', Message_demo_Schema);

// Session

const Session_Token_Schema = new Schema({
    Start:{type:Number,required:true},
    End:{type:Number, required:true}
});
const Session_Token = mongoose.model('Session_Token', Session_Token_Schema);

module.exports = {
    'MessageDemo':MessageDemo,
    'User':User
};
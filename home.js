let express = require('express');
let app = express();
let endpoint_support  = require('./lib/endpoint_support.js');
let check_data = require('./lib/fun/check_data.js');

// for errors
let EventEmitter = require('events').EventEmitter;
let emitter = new EventEmitter();

function getData(request,names,function_to_apply) {
    let d = {};
    for (let item in names){
        try{
            if (request.method == 'POST'){
                const q = request.post.item
                if(q!=null && q.length>0 && q!='None'){d[item]=q}
            }
            else{
                const q = request.query.item
                if(q!=null && q.length>0 && q!='None'){d[item]=q}
            }
        }catch (e){}
    }

    if(d.length<1){
        emitter.emit('error', new Error(
            '{"message":{"error":true,"types":"Wrong Parameters"},"status_code":406}'));
    }

    // Second Stage, check the informations
    let tmp = check_data.check_Input(d);
    if (tmp["error"]){
        emitter.emit('error', new Error('{"message":'+tmp+', "status_code":412}'));
    }

    try{
        tmp =function_to_apply(d);
    }catch(e) {
        emitter.emit('error', new Error(
        '{"message":{"error":true,"types":"Wrong Parameters"},"status_code":406}'));
    }
    if (tmp["error"]){
        emitter.emit('error', new Error('{"message":'+tmp+', "status_code":412}'));
    }
    return tmp;
}

emitter.on('error', function(err) {
    const tmp_dict = JSON.parse(err.message);
    console.error(tmp_dict["message"]);
});

function home() {
    return "Hi to everyone. I' am alive!! :)"
}

function registration(request) {
    const registration_keys = ["name", "surname", "password", "email", "phone_number"];
    return JSON.stringify(getData(request,registration_keys,user_registration));
}

function confirmation(request) {
    const confirmation_keys = ["confirmation_code_phone","confirmation_code_email"];
    return JSON.stringify(getData(request, confirmation_keys,user_confirmation));
}

function login(request) {
    const login_keys = ["email","phone_number","password"];
    return JSON.stringify(getData(request, confirmation_keys,login_keys));
}

function logout(request) {
    const logout_keys = ["session_token"];
    return JSON.stringify(getData(request, logout_keys, user_logout));
}

function reset_pswd_start(request) {
    const resetpswdstart_keys = ["email"];
    return JSON.stringify(getData(request, resetpswdstart_keys, resetpswdstart_keys));
}

function reset_pswd_finalize(){
    const resetpswdlive_keys = ["email","confirmation_code_email","password"];
    return JSON.stringify(getData(request, resetpswdlive_keys, resetpswdstart_keys));
}

function message() {
    const message_keys = ["session_token", "email_sender", "email_receiver", "image", "video", "audio", "text"];
    return JSON.stringify(getData(request, message_keys, user_message));
}

function messagedemo(request) {
    const  message_keys = ["trainer_id", "group_id", "title", "image", "video", "audio", "text"]
    return JSON.stringify(getData(request,message_keys,endpoint_support.user_messagedemo));
}

app.get('/', function(req, res){res.send(home(req));});
app.post('/', function(req, res){res.send(home(req));});


app.get('/user/registration', function(req, res){res.send(messagedemo(req));});
app.post('/user/registration', function(req, res){res.send(messagedemo(req));});

app.get('/user/confirmation', function(req, res){res.send(confirmation(req));});
app.post('/user/confirmation', function(req, res){res.send(confirmation(req));});

app.get('/user/login', function(req, res){res.send(login(req));});
app.post('/user/login', function(req, res){res.send(login(req));});

app.get('/user/logout', function(req, res){res.send(logout(req));});
app.post('/user/logout', function(req, res){res.send(logout(req));});

app.get('/user/resetpswdstart', function(req, res){res.send(reset_pswd_start(req));});
app.post('/user/resetpswdstart', function(req, res){res.send(reset_pswd_start(req));});

app.get('/user/resetpswdfinalize', function(req, res){res.send(reset_pswd_finalize(req));});
app.post('/user/resetpswdfinalize', function(req, res){res.send(reset_pswd_finalize(req));});

app.get('/user/message', function(req, res){res.send(message(req));});
app.post('/user/message', function(req, res){res.send(message(req));});

app.get('/user/messagedemo', function(req, res){res.send(messagedemo(req));});
app.post('/user/messagedemo', function(req, res){res.send(messagedemo(req));});

app.listen(5000);
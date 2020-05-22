/*设置用户数据结构,暴露构造函数*/
const mongoose = require('mongoose');


const userSchema =new mongoose.Schema({
    username:String,
    password:String,
    isAdmin:{
        type:Boolean,
        default:false
    }
});

let User = mongoose.model('users',userSchema);

//初始数据
/*
new User({
    username:'a1',
    password:'a1',
}).save()*/

module.exports =User;
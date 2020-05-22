/*专门处理登录,注册的ajax请求的路由*/

const express = require('express');
const router = express.Router();
const User = require('../schema/users');

let responseDate = {};

/*注册验证*/
router.post('/register',(req,res)=>{
    let {username,password,repassword} = req.body;

    //简单注册验证
    if(username ===''){
        responseDate.code =1;
        responseDate.msg = '用户名不能为空'
        res.send(JSON.stringify(responseDate))
        return
    }
    if(password ===''){
        responseDate.code =2;
        responseDate.msg = '密码不能为空'
        res.send(JSON.stringify(responseDate))
        return
    }
    if(repassword !== password){
        responseDate.code =3;
        responseDate.msg = '两次密码不一致';
        res.send(JSON.stringify(responseDate))
        return
    }

    //数据验证
    User.findOne({username}).then((result)=>{
        if(result){
            responseDate.code =4;
            responseDate.msg = '用户已注册';
            res.send(JSON.stringify(responseDate))
            return
        }

        //新用户,存储数据
        new User({
            username,
            password
        }).save().then(()=>{
            responseDate.code =0;
            responseDate.msg = '注册成功';
            res.send(JSON.stringify(responseDate));
        })
    })

});

/*登录验证*/
router.post('/login',(req,res)=>{
    let {username,password,repassword} = req.body;

    //简单验证
    if(username ===''){
        responseDate.code =1;
        responseDate.msg = '用户名不能为空'
        res.send(JSON.stringify(responseDate))
        return
    }
    if(password ===''){
        responseDate.code =2;
        responseDate.msg = '密码不能为空'
        res.send(JSON.stringify(responseDate))
        return
    }

    User.findOne({username}).then((result)=>{
        if(password === result.password){
            responseDate.code =0;
            responseDate.msg = "登陆成功";
            responseDate.userInfo={
                id:result._id,
                username:result.username,
                isAdmin:result.isAdmin
            }

            //下发cookie
            res.cookie('userInfo',JSON.stringify(responseDate.userInfo),{
                maxAge:9000000
            })
            res.send(JSON.stringify(responseDate))
        }
    })
})

router.get('/logout',(req,res)=>{
    res.cookie('userInfo','');
    res.send('')
})
module.exports =router;
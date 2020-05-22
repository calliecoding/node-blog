/*入口文件*/

const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');


//连接数据库
mongoose.connect('mongodb://localhost:27017/blog',{ useUnifiedTopology: true,useNewUrlParser: true },(err)=>{
    if(err){
        console.log('数据库连接失败')
    }else{
        console.log('数据库连接成功')
    }
});


const app = express();
app.use(express.static('public'));
app.set('view engine','ejs');
app.use(bodyParser.urlencoded({
    extended:false
}));
app.use(cookieParser())


app.use((req,res,next)=>{
    //第二次访问,先查找cookie
    if(req.cookies.userInfo){
        req.userInfo = JSON.parse(req.cookies.userInfo)
    };
    next()
});

//划分子路由
app.use('/',require('./routers/main'));//首页
app.use('/api',require('./routers/api'));//登录注册
app.use('/admin',require('./routers/admin'));//后台管理

app.listen(5000);

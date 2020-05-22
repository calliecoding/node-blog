/*专门处理前台路由*/

const express = require('express');
const router = express.Router();
const Catogory = require('../schema/category');
const Content = require('../schema/content');

let data ={};

//统一渲染导航栏
router.use((req,res,next)=>{
    //获取导航栏所有分类
    Catogory.find().then((results)=>{
        data.categories = results;
    });
    next()
});

//渲染首页
router.get('/',(req,res)=>{
    let where = {};//记录当前所在分类的id
    if(req.query.category){
        where.category= req.query.category
    }

    Content.find(where).countDocuments().then((count)=>{
        //获取文章数量
        data.count = count;
        //分页
        data.limit = 3;
        data.page =+req.query.page|| 1;
        data.skip = (data.page-1)*data.limit;
        data.pageMax = Math.ceil(count/data.limit);
        return Content.find(where).limit(data.limit).skip(data.skip).sort({_id:-1}).populate(['category','author'])
    }).then((contents)=>{
        //获取单页的文章信息
        data.contents = contents;


        res.render('main/index',{
            userInfo:req.userInfo,
            data
        })
    })


});

//渲染阅读全文页面
router.get('/view',(req,res)=>{
    //获取当前文章的id
    let contentId = req.query.contentId;
    Content.findById(contentId).populate(['category','author']).then((content)=>{
        content.view ++; //更新阅读量
        return content.save()

    }).then((content)=>{
        res.render('main/view',{
            data,
            content,
            userInfo: req.userInfo,
        })
    })
});

//接受post数据,评论
router.post('/comment',(req,res)=>{
    if(!req.userInfo){
        //未登录
        data.code = 1
        res.send(data)
        return
    }

    let{comment,contentId}=req.body//获取评论,文章ID

    let commentData = {
        comment,
        time:new Date,
        author:req.userInfo.username
    }
    Content.findById(contentId).then((content)=>{
        //进入路由时,阅读量+1
        content.view++;
        content.comment.push(commentData)
        return content.save()

    }).then((content)=>{
        //把数据传给前台进行渲染
        res.send(content)
    })


})

//初始化页面,自动显示评论
router.get('/comment',(req,res)=>{
    let contentId = req.query.contentId;//获取,文章ID
    Content.findById(contentId).then((content)=>{
        res.send(content);//交给前台渲染
    })
})

module.exports =router;

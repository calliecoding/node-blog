/*专门处理后台管理的路由*/

const express = require('express');
const router = express.Router();
const User = require('../schema/users');
const catogory = require('../modules/category/category');
const content = require('../modules/content/content');


/*拦截非管理员账户*/
router.use((req,res,next)=>{
    req.userInfo = JSON.parse(req.cookies.userInfo);
    if(!req.userInfo.isAdmin){
        res.send('你不是管理员,没有权限访问');
        return
    }
    next()
})

router.get('/',(req,res)=>{
    res.render('admin/index',{
        userInfo:req.userInfo
    })
})//渲染首页


router.get('/user',(req,res)=>{

    /*
        第1页,skip 0条
        第2页,skip 2条
        第3页,skip 4条
        第n页,skip 2*(n-1)条
    */

    /*
    page的传递
    初始为1,render传给ejs模板渲染
    页面中点击下一页,页数变2,2放在查询字符串中,后台通过req.query拿到

    */
    let limit = 2;
    let page =+req.query.page|| 1;
    let skip = (page-1)*limit;

    User.countDocuments().then((count)=>{
        let pageMax = Math.ceil(count/limit);
        page = Math.min(pageMax,page);
        page = Math.max(1,page)
        User.find().limit(limit).skip(skip).sort({_id:-1}).then((results)=>{
            res.render('admin/user/index',{
                userInfo:req.userInfo,
                results,
                page,
                pageMax
            })
        })
    });
    //res.send('ok')

});//渲染用户管理页


/*分类的相关服务*/
router.get('/category/add',catogory.showAdd);//渲染分类添加页
router.post('/category/add',catogory.add);//添加分类,处理post数据
router.get('/category',catogory.showIndex)//渲染分页管理首页
router.get('/category/update',catogory.showUpdate)//染分页修改首页
router.post('/category/update',catogory.updateCatogory)//更新分类,处理post数据
router.get('/category/delete',catogory.showDelete)//染分页修改首页
router.post('/category/delete',catogory.deleteCatogory)//染分页修改首页

/*文章内容的相关服务*/
router.get('/content/add',content.showAdd);//渲染内容添加页
router.post('/content/add',content.add);//添加内容,处理post数据
router.get('/content',content.showIndex);//渲染内容添加页
router.get('/content/update',content.showUpdate);//渲染内容修改页
router.post('/content/update',content.updateContent);//更新内容,处理post数据
router.get('/content/delete',content.showDelete);//渲染内容删除页
router.post('/content/delete',content.deleteContent);//删除内容,处理post数据




module.exports =router;
/*专门处理Content数据库的计算*/

const Content = require('../../schema/content');
const Category = require('../../schema/category');

module.exports.showAdd = function(req,res){
    Category.find().then((results)=>{
        res.render('admin/content/add',{
            userInfo:req.userInfo,
            results
        })
    })

};

module.exports.add=function(req,res){
    let{category,title,description,content} = req.body;
    let id = req.userInfo.id;
    //console.log(id)

    //简单过滤
    if(title ===''){
        res.render('admin/error',{
            userInfo:req.userInfo,
            optionMessage:{
                location:'内容管理',
                option:'内容添加',
                message:'标题不能为空'
            }
        })
        return
    };
    if(description ===''){
        res.render('admin/error',{
            userInfo:req.userInfo,
            optionMessage:{
                location:'内容管理',
                option:'内容添加',
                message:'简介不能为空'
            }
        })
        return
    };
    if(content ===''){
        res.render('admin/error',{
            userInfo:req.userInfo,
            optionMessage:{
                location:'内容管理',
                option:'内容添加',
                message:'内容不能为空'
            }
        })
        return
    };

    Content.findOne({title}).then((result)=>{
        if(result){
            res.render('admin/error',{
                userInfo:req.userInfo,
                optionMessage:{
                    location:'内容管理',
                    option:'内容添加',
                    message:'标题已经存在,无法重复添加'
                }
            });
            return
        }
        new Content({
            category,
            title,
            description,
            content,
            author:id
        }).save();
    });
    res.render('admin/success',{
        userInfo:req.userInfo,
        optionMessage:{
            location:'内容管理',
            option:'内容添加',
            message:'内容添加成功',
            href:'返回首页'
        },
        url:'/admin/content'
    })

};

module.exports.showIndex = function (req,res) {
    let limit = 2;
    let page =+req.query.page|| 1;
    let skip = (page-1)*limit;

    Content.countDocuments().then((count)=>{
        let pageMax = Math.ceil(count/limit);
        Content.find().limit(limit).skip(skip).sort({_id:-1}).populate(['category','author']).then((results)=>{
            res.render('admin/content/index',{
                userInfo:req.userInfo,
                results,
                page,
                pageMax,
            })
        })

    })
};

module.exports.showUpdate = function(req,res){

    let {id} = req.query;

    Content.findOne({_id:id}).populate('category').then((result)=>{
        if(result){
            res.render('admin/content/update',{
                userInfo:req.userInfo,
                result
            })
        }
    })

};

module.exports.updateContent = function(req,res){
    let id = req.query.id;
    let{title,description,content}=req.body;

    //120 排除内容为空的情况
    if(title ===""){
        res.render('admin/error',{
            userInfo:req.userInfo,
            optionMessage:{
                location:'内容首页',
                option:'内容修改',
                message:'内容标题不能为空'
            }
        });
        return;
    };
    if(description ===""){
        res.render('admin/error',{
            userInfo:req.userInfo,
            optionMessage:{
                location:'内容首页',
                option:'内容修改',
                message:'内容简介不能为空'
            }
        });
        return;
    };
    if(content ===""){
        res.render('admin/error',{
            userInfo:req.userInfo,
            optionMessage:{
                location:'内容首页',
                option:'内容修改',
                message:'内容主体不能为空'
            }
        });
        return;
    };

    Content.updateOne({_id:id},{$set:{title,description,content}}).then((result)=>{
        if(result.nModified){
            res.render('admin/success',{
                userInfo:req.userInfo,
                optionMessage:{
                    location:'内容首页',
                    option:'内容修改',
                    message:'内容更改成功',
                    //返回分类首页
                    href:"返回内容首页"
                },
                url:'/admin/content' //返回分类首页)
            })
        }else{
            res.render('admin/error',{
                userInfo:req.userInfo,
                optionMessage:{
                    location:'内容首页',
                    option:'内容修改',
                    message:'内容没有变化',
                    //返回分类首页
                    href:"返回内容首页"
                },
                url:'/admin/content' //返回分类首页)
            })
        }
    })

};

module.exports.showDelete = function (req,res) {

    let id = req.query.id;

    Content.findById(id).populate('category').then((result)=>{
        if(result){
            res.render('admin/content/delete',{
                userInfo:req.userInfo,
                result
            })
        }
    })

};

module.exports.deleteContent = function(req,res){
    let id = req.query.id;
    let title = req.body.title;
    //前台验证
    if(title===''){
        res.render('admin/error',{
            userInfo:req.userInfo,
            optionMessage:{
                location:'内容首页',
                option:'内容删除',
                message:'内容标题不能为空'
            }
        });
        return;
    }

    Content.deleteOne({title:title}).then((result)=>{
        if(!result.deletedCount){//删除失败
            res.render('admin/error',{
                userInfo:req.userInfo,
                optionMessage:{
                    location:'内容首页',
                    option:'内容删除',
                    message:'文章不存在'
                }
            });
            return;
        }
        res.render('admin/success',{
            userInfo:req.userInfo,
            optionMessage:{
                location:'内容首页',
                option:'内容删除',
                message:'文章删除成功',
                //返回分类首页
                href:"返回内容首页"
            },
            url:'/admin/content' //返回分类首页)
        })
    })
};
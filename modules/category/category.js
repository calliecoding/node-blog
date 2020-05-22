const Category = require('../../schema/category');

//分类添加页面
module.exports.showAdd = function (req,res) {
    res.render('admin/category/add',{
        userInfo:req.userInfo
    })
};

//数据处理:添加分类
module.exports.add = function (req,res) {
    let {category} = req.body;
    //简单验证
    if(category ===''){
        res.render('admin/error',{
            userInfo:req.userInfo,
            optionMessage:{
                location:'分类管理',
                option:'分类添加',
                message:'分类不能为空'
            }
        })
        return
    }
    //数据库验证
    Category.findOne({name:category}).then((result)=>{
        if(result){
            res.render('admin/error',{
                userInfo:req.userInfo,
                optionMessage:{
                    location:'分类管理',
                    option:'分类添加',
                    message:'分类已存在'
                }
            })
            return
        }else{
            new Category({
                name:category
            }).save();
            res.render('admin/success',{
                userInfo:req.userInfo,
                optionMessage:{
                    location:'分类管理',
                    option:'分类添加',
                    message:'分类添加成功',
                    href:'返回首页'
                },
                url:'/admin/category'
            })
        }

    })
};

//分类管理页面
module.exports.showIndex = function (req,res) {
    let limit = 2;
    let page =+req.query.page|| 1;
    let skip = (page-1)*limit;

    Category.countDocuments().then((count)=>{
        let pageMax = Math.ceil(count/limit);

        Category.find().limit(limit).skip(skip).sort({_id:-1}).then((results)=>{
            res.render('admin/category/index',{
                userInfo:req.userInfo,
                results,
                page,
                pageMax,
            })
        })

    })
};

module.exports.showUpdate = function(req,res){
    let {category} = req.query;
    res.render('admin/category/update',{
        userInfo:req.userInfo,
        category
    })
}
module.exports.showDelete = function (req,res) {
    let {category} = req.query;
    res.render('admin/category/delete',{
        userInfo:req.userInfo,
        category
    })
};

module.exports.updateCatogory = function(req,res){
    let cate = req.query.category; //更新前的分类
    let {category} = req.body

    if(category ===''){
        res.render('admin/error',{
            userInfo:req.userInfo,
            optionMessage:{
                location:'分类管理',
                option:'分类修改',
                message:'分类不能为空'
            }
        })
        return
    }

    //数据库验证,先查找,后更新

    Category.findOne({name:category}).then((result)=>{
        if(result){//分类已经存在
            res.render('admin/error',{
                userInfo:req.userInfo,
                optionMessage:{
                    location:'分类管理',
                    option:'分类修改',
                    message:'分类已经存在,无法重复修改'
                }
            })
            return
        }
        Category.updateOne({name:cate},{$set:{name:category}}).then((result)=>{
            if(result.nModified){
                res.render('admin/success',{
                    userInfo:req.userInfo,
                    optionMessage:{
                        location:'分类管理',
                        option:'分类修改',
                        message:'分类修改成功',
                        href:'返回首页'
                    },
                    url:'/admin/category'
                })
            }
        })

    })

};

module.exports.deleteCatogory = function(req,res){
    let cate = req.query.category; //更新前的分类
    let {category} = req.body

    if(category ===''){
        res.render('admin/error',{
            userInfo:req.userInfo,
            optionMessage:{
                location:'分类管理',
                option:'分类修改',
                message:'分类不能为空'
            }
        })
        return
    }

    Category.deleteOne({name:category}).then((result)=>{

        if(!result.deletedCount){
            res.render('admin/error',{
                userInfo:req.userInfo,
                optionMessage:{
                    location:'分类管理',
                    option:'分类删除',
                    message:'分类不存在,无法删除'
                }
            })
        }else{
            res.render('admin/success',{
                userInfo:req.userInfo,
                optionMessage:{
                    location:'分类管理',
                    option:'分类删除',
                    message:'分类删除成功',
                    href:'返回首页'
                },
                url:'/admin/category'
            })
        }
    })


}

## 博客

用node.js写一个简单的博客

## 目录文件结构

* modules:存放数据计算的文件

* public:存放静态资源

* router:
  * mian:处理前台的服务
  * admin:处理后台服务
  * api:处理登陆注册的ajax请求

* views:存放后台模板

* app.js: 项目文件入口

## 项目地址

源码地址：

## 功能

- [ ] 登录,注册信息的后台验证
- [ ] 退出账户,刷新登录状态
- [ ] cookie保存登录状态
- [ ] 后台管理系统
- [ ] 后台分类/文章的增删改查
- [ ] 限制数据的显示个数,自动分页
- [ ] 首页阅读全文
- [ ] 首页评论功能
- [ ] 评论自动分页

## 技术栈

语言:JS(es6)

后端:

* Express：简洁而灵活的 node.js Web应用框架
* body-parse（中间件）：解析post请求的数据
* cookie-parse（中间件）:解析cookie
* ejs:后台渲染模板
* mongoose:在node中操作数据库存储用户信息
* Bootstrap:css框架
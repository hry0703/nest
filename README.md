## node版本
nvm use 20.11.1

## CMS
- Admin后台管理模块 admin
- API接口模块 api
- 共享模块 shared

## 创建模块
```js
nest generate module admin
nest generate module api
nest generate module shared

// 创建controller  --no-spec 不生成测试文件 --flat 不生成目录   
// 不加--flat 会生成在controllers下生成dashboard目录再生成controllers/dashboard/dashboard.controller.ts
// 加--flat 会生成在controllers下生成dashboard.controller.ts
generate controller admin/controllers/dashboard --no-spec --flat  
```

## admin
- 后台管理模块直接使用 nest+handlerbar
  - 会话 session
- api 
   - jwt token  htmlx

## 支持会话
```
npm install cookie-parser express-session @nestjs/platform-express
```


## 支持模板引擎 


## xxO
- Dto 数据传输对象 当我们的客户向服务器发送数据的时候传递的对象叫DTO
- 服务器在处理请求的时候要操作数据库，操作的是entity实体
- 最后服务器向客户端返回结果的叫vo,这个vo也可以使用entity来使用


## 解决这个问题有两种办法 
1. 封装专门的VO
2. 可以使用class-transformer自动转换


nest g generateList tag 标签 --collection=/c/code/nest/zfnest/cms-generator
nest g generateList article 文章 --collection=/c/code/nest/zfnest/cms-generator
nest g generateTree category 分类 --collection=/c/code/nest/zfnest/cms-generator

nest g resource role 生成一套module controller service entity




从性能上来说
redis>mongodb>mysql
几十万>几万>几千 
从可靠性来说
mysql>mongodb>redis
从灵活性上来
redis>mongodb>mysql



##快捷生成
npm i cms-resource

nest g cms-resource role --collection=./node_modules/cms-resource
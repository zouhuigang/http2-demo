### yarn和npm区别

npm install === yarn 
npm install taco --save === yarn add taco
npm uninstall taco --save === yarn remove taco
npm install taco --save-dev === yarn add taco --dev
npm update --save === yarn upgrade


### nest安装

#### 安装node最新稳定版

    nvm install --lts

#### 安装yarn下的nestjs cli

    yarn global add @nestjs/cli
    
#### 创建新项目

     nest new http2


### react支持

    yarn add react react-dom next
    
### ui框架

https://material-ui.com/   
https://github.com/mui-org/material-ui/tree/master/examples/nextjs 

http://expressjs.com/zh-cn/api.html#res.sendFile
https://expressjs.com/zh-cn/guide/using-template-engines.html

#### 启动
    nvm use
    yarn start
    
 访问:
 
    http://localhost:3000/
    

### 本地https证书

    mkdir -p cert
    mkcert http2.baixing.cn localhost

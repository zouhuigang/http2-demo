import {NestFactory} from '@nestjs/core';
import {AppModule} from './app.module';
/**文件操作*/
import * as fs from 'fs';
import * as bunyan from 'bunyan';
import * as spdy from 'spdy';
import {ExpressAdapter} from '@nestjs/platform-express';
import * as express from 'express';
import * as engines from 'consolidate';
import * as https from 'https';

/**日志文件*/
const log = bunyan.createLogger({name: 'nest-architecture'});


/**
 * 模板文件(jade虽然看着更简洁，但是不能直接使用html，感觉太恶心了，所以兼容ejs)
 * server.set('view engine', 'pug');
 * server.set("view engine", "ejs");
 * */
async function initExpressServer() {
    const server = express();
    server.set('views', './views');
    /**
     * 设置三种html文件后缀对应的解析引擎
     * */
    server.engine('jade', engines.jade);
    server.engine('ejs', engines.ejs);
    server.engine('html', engines.ejs);

    /**
     * 指定引擎扩展名的省略，代码里可以省略后缀
     * */
    server.set('view engine', "html");

    //静态文件
    server.use(express.static('public'));
    return server;
}


/**
 * https://docs.nestjs.com/faq/multiple-servers
 * */
async function bootstrap() {

    //https证书
    const httpsOptions = {
        key: fs.readFileSync('./cert/http2.baixing.cn+1-key.pem'),
        cert: fs.readFileSync('./cert/http2.baixing.cn+1.pem'),
    };

    //模板配置
    const server = await initExpressServer();

    //app init
    const app = await NestFactory.create(AppModule, new ExpressAdapter(server));
    await app.init();

    //http1.1
    https.createServer(httpsOptions, server).listen(8001, () => log.info(`http1.1 Server listening on https://localhost:8001`));

    //http2
    spdy.createServer(httpsOptions, server).listen(8002, () => log.info('http2 Server listening on https://localhost:8002'));

}

bootstrap();

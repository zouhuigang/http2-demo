import {NestFactory} from '@nestjs/core';
import {AppModule} from './app.module';
/**文件操作*/
import * as fs from 'fs';
import * as bunyan from 'bunyan';
import * as spdy from 'spdy';
import {ExpressAdapter} from '@nestjs/platform-express';
import * as express from 'express';

/**日志文件*/
const log = bunyan.createLogger({name: 'nest-architecture'});

async function bootstrap() {

    //https证书
    const httpsOptions = {
        key: fs.readFileSync('./cert/http2.baixing.cn+1-key.pem'),
        cert: fs.readFileSync('./cert/http2.baixing.cn+1.pem'),
    };

    //http1.1
    // const app = await NestFactory.create(AppModule, {httpsOptions});
    // await app.listen(3000);

    //http2
    const server = express();
    //pug模板文件
    server.set('views', './views')
    server.set('view engine', 'pug');
    //静态文件
    server.use(express.static('public'));

    const app = await NestFactory.create(AppModule, new ExpressAdapter(server));
    await app.init();

    spdy.createServer(httpsOptions, server).listen(8000, () => console.log('Started Nest server (using SPDY) on https://localhost:8000'))

    log.info(`Server listening in http://localhost:3000}....`);

}

bootstrap();

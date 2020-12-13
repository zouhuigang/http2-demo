import {Controller, Get, Param, Req, Res} from '@nestjs/common';
import {AppService} from './app.service';
import {Request, Response} from 'express';
import * as zlib from 'zlib';
import * as fs from 'fs';
import {helper} from './helper';

const JS_OPTION = {
    status: 200, // optional
    method: 'GET', // optional
    request: {
        accept: '*/*'
    },
    response: {
        'content-type': 'application/javascript',
        'content-encoding': 'gzip'
    }
}


const CSS_OPTION = {
    status: 200, // optional
    method: 'GET', // optional
    request: {
        accept: '*/*'
    },
    response: {
        'content-type': 'text/css',
        'content-encoding': 'gzip'
    }
}


@Controller()
export class AppController {
    constructor(private readonly appService: AppService) {
    }

    @Get('/http2')
    public async home(@Param() params, @Req() req: Request, @Res() res) {
        var stream = res.push('/main.js', {
            status: 200, // optional
            method: 'GET', // optional
            request: {
                accept: '*/*'
            },
            response: {
                'content-type': 'application/javascript'
            }
        })
        stream.on('error', function () {
        })
        stream.end('alert("hello from push stream!");')
        // res.end('<script src="/main.js"></script>')


        var helloJs = fs.readFileSync('./public/hello.js', "utf8")
        res.push('/hello.js', JS_OPTION, function (err, stream) {
            if (err) return;
            zlib.gzip(helloJs, function (err, buf) {
                stream.end(buf);
            })
        });

        var helloCss = fs.readFileSync('./public/hello.css', "utf8")
        res.push('/hello.css', CSS_OPTION, function (err, stream) {
            if (err) return;
            zlib.gzip(helloCss, function (err, buf) {
                stream.end(buf);
            })
        });


        let publicFiles = helper.getFiles('./public/images/bs/')

        let imgResource = publicFiles.get('/img2.jpg')
        res.push("/images/bs/img2.jpg", {response: imgResource.headers}, function (err, stream) {
            if (err) return;
            stream.end(fs.readFileSync(imgResource.fileDescriptor));
            // zlib.gzip(fs.readFileSync(imgResource.fileDescriptor), function (err, buf) {
            //     stream.end(buf);
            // })
        });

        //图片的预加载
        res.append('Link', ['</images/bs/img1.jpg>; rel=preload; as=image']);

        return res.render('index.pug', {title: '演示服务器推送', message: '服务器推送了吗!'});
    }


    @Get("differ")
    public async differ(@Param() params, @Req() req: Request, @Res() res) {
        return res.render('differ', {title: 'http1.1和http2.0对比测试'});
    }


    @Get("http1.1")
    public async getHttp1(@Param() params, @Req() req: Request, @Res() res) {
        return res.render('http.ejs', {title: 'http1.1测试', time: new Date().getTime()});
    }

    @Get("http2.0")
    public async getHttp2(@Param() params, @Req() req: Request, @Res() res) {
        return res.render('http.ejs', {title: 'http2.0测试', time: new Date().getTime()});
    }

    @Get("differ-push")
    public async differPush(@Param() params, @Req() req: Request, @Res() res) {
        return res.render('differ-push', {title: 'http1.1和http2.0推送对比测试'});
    }

    @Get("http2.0-push")
    public async getHttp2Push(@Param() params, @Req() req: Request, @Res() res) {
        let time = new Date().getTime();
        let total = 180;
        let publicFiles = helper.getFiles('./public/images/ad/')

        for (let i = 1; i <= total; i++) {
            let imgId = 'image_' + (i < 10 ? '0' + i : i) + '.jpg';

            let imgResource = publicFiles.get('/' + imgId)
            res.push("/images/ad/" + imgId + '?t=' + time, {response: imgResource.headers}, function (err, stream) {
                if (err) return;
                stream.end(fs.readFileSync(imgResource.fileDescriptor));
            });
        }

        return res.render('http.ejs', {title: 'http2.0推送测试', 'time': time});
    }


    @Get()
    getHello(): string {
        return this.appService.getHttpVersion1();
    }


}

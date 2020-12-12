import {Controller, Get, Param, Req, Res} from '@nestjs/common';
import {AppService} from './app.service';
import {Request, Response} from 'express';
import * as zlib from 'zlib';
import * as fs from 'fs';

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


        return res.render('index.pug', {title: '演示服务器推送', message: '服务器推送了吗!'});
    }


    @Get("differ")
    public async differ(@Param() params, @Req() req: Request, @Res() res) {
        return res.render('differ', {title: 'http1.1和http2.0对比测试'});
    }


    @Get("http1.1")
    public async getHttp1(@Param() params, @Req() req: Request, @Res() res) {
        return res.render('http.ejs', {title: 'http1.1测试'});
    }

    @Get("http2.0")
    public async getHttp2(@Param() params, @Req() req: Request, @Res() res) {
        return res.render('http.ejs', {title: 'http2.0测试'});
    }


    @Get()
    getHello(): string {
        return this.appService.getHttpVersion1();
    }


}

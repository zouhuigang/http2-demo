import {Controller, Get, Param, Req, Res} from '@nestjs/common';
import {AppService} from './app.service';
import {Request, Response} from 'express';
import * as zlib from 'zlib';
import * as fs from 'fs';

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


        var options = {
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

        var helloJs = fs.readFileSync('./public/hello.js', "utf8")
        res.push('/hello.js', options, function (err, stream) {
            if (err) return;
            zlib.gzip(helloJs, function (err, buf) {
                stream.end(buf);
            })
        });


        return res.render('index', {title: '演示服务器推送', message: '服务器推送了吗!'});
    }


    @Get()
    getHello(): string {
        return this.appService.getHttpVersion1();
    }


}

import {Injectable} from '@nestjs/common';

@Injectable()
export class AppService {
    getHttpVersion1(): string {
        return 'http 1.1';
    }
}

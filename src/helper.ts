import * as fs from 'fs';
import * as mime from 'mime';
import * as path from 'path';

export class helper {
    static getFiles(baseDir: string) {
        const files = new Map()

        fs.readdirSync(baseDir).forEach((fileName) => {
            const filePath = path.join(baseDir, fileName)
            const fileDescriptor = fs.openSync(filePath, 'r')
            const stat = fs.fstatSync(fileDescriptor)
            // const contentType = mime.lookup(filePath)
            const contentType = mime.getType(filePath)

            files.set(`/${fileName}`, {
                fileDescriptor,
                headers: {
                    'content-length': stat.size,
                    'last-modified': stat.mtime.toUTCString(),
                    'content-type': contentType
                }
            })
        })

        return files
    }
}

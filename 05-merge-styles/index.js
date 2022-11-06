const path = require('path');
const fs = require('fs');

const file = fs.readdir(path.join(__dirname, 'styles'), { encoding: 'utf8', withFileTypes: true }, (err, files) => {
    if (err) throw err;
    files.forEach(file => {
        const fileExtName = path.extname(file.name);
        fs.writeFile(
            path.join(__dirname, 'project-dist', 'bundle.css'), '',
            (err) => {
                if (err) throw err;
            }
        );
        if (fileExtName == '.css') {
            const readableStream = fs.createReadStream(path.join(__dirname, 'styles', file.name), 'utf-8');
            let data = '';
            readableStream.on('data', chunk => data += chunk);
            readableStream.on('end', () => {
                fs.appendFile(
                    path.join(__dirname, 'project-dist', 'bundle.css'),
                    data,
                    (err) => {
                        if (err) throw err;
                    }
                );
            });
            readableStream.on('error', error => console.log('Error', error.message));
        }
    });
});
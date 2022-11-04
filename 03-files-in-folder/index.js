const path = require('path');
const fs = require('fs');
const file = fs.readdir(path.join(__dirname, 'secret-folder'), { encoding: 'utf8', withFileTypes: true }, (err, files) => {
    if (err) throw err;
    files.forEach(file => {
        const fileInfo = {};
        if (file.isDirectory()) {
            // console.log('this file is directory:', file.name)
        }
        else {
            const fileExtName = path.extname(file.name);
            const fileName = path.basename(file.name, fileExtName);
            const filePath = path.join(__dirname, 'secret-folder', file.name);
            // console.log(path.join(__dirname, 'secret-folder', file.name))
            fs.stat(filePath, (err, stats) => {
                if (err) throw err;
                console.log(fileName, '-', fileExtName, '-', (Math.round(stats.size / 1024 * 1000)) / 1000 + 'kb');
            });
        }
    })
});
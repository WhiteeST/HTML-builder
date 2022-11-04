const path = require('path');
const fs = require('fs');

const copyPath = path.join(__dirname, 'files-copy');

fs.mkdir(copyPath, { recursive: true }, (err) => {
    // => [Error: EPERM: operation not permitted, mkdir 'C:\']
});

const file = fs.readdir(path.join(__dirname, 'files'), { encoding: 'utf8', withFileTypes: true }, (err, files) => {
    if (err) throw err;
    files.forEach(file => {
        console.log(file.name);
        const filePathSource = path.join(__dirname, 'files', file.name);
        const filePathDestination = path.join(copyPath, file.name);
        // destination.txt will be created or overwritten by default.
        fs.copyFile(filePathSource, filePathDestination, (err) => {
            if (err) throw err;
        });
    });
});
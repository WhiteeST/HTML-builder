const path = require('path');
const fs = require('fs');

const copyPath = path.join(__dirname, 'files-copy');

fs.mkdir(copyPath, { recursive: true }, (err) => {
    // => [Error: EPERM: operation not permitted, mkdir 'C:\']
});

const file = fs.readdir(path.join(__dirname, 'files'), { encoding: 'utf8', withFileTypes: true }, (err, files) => {
    if (err) throw err;
    files.forEach(file => {
        const filePathSource = path.join(__dirname, 'files', file.name);
        const filePathDestination = path.join(copyPath, file.name);
        fs.copyFile(filePathSource, filePathDestination, (err) => {
            if (err) throw err;
            //Переписать с Callback => Промисы => Async await;
            //Сначала проходятся по файлам, а потом после загрузки копируются
        });
    });
});

const path = require('path');
const fs = require('fs');
const fsPromises = require('fs').promises;
// const fs = require('fs/promises');
const copyPath = path.join(__dirname, 'files-copy');

async function removeDir() {
    try {
        await fsPromises.rm(copyPath, { recursive: true, force: true });
        fs.mkdir(copyPath, { recursive: true }, (err) => {
            if (err) throw err;
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
    } catch (err) {
        console.error('Error occurred while reading directory!', err);
    }
}
removeDir();
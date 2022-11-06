const path = require('path');
const fs = require('fs');
const { strict } = require('assert');
const fsPromises = require('fs').promises;
const pathProjectDist = path.join(__dirname, 'project-dist');

async function htmlBuildPage() {
    try {
        await fsPromises.rm(pathProjectDist, { recursive: true, force: true });
        await fsPromises.rm(path.join(pathProjectDist, 'assets'), { recursive: true, force: true });
        fs.mkdir(pathProjectDist, { recursive: true }, (err) => {
            if (err) throw err;
        });

        const pathToSource = path.join(__dirname, 'assets');
        const pathToDestination = path.join(pathProjectDist, 'assets');

        copyDirectory(pathToSource, pathToDestination);
        htmlReplaceComponent();
        buildStyles();
    } catch (err) {
        console.error('Error occurred while reading directory!', err);
    }
}
async function copyDirectory(source, destination) {
    fs.mkdir(destination, { recursive: true }, (err) => {
        if (err) throw err;
    });

    const files = await fsPromises.readdir(source, { encoding: 'utf8', withFileTypes: true });
    for (const file of files) {
        if (file.isDirectory()) {
            const subfolder = path.join(source, file.name);
            const subdistination = path.join(destination, file.name);
            copyDirectory(subfolder, subdistination);
        }
        else {
            const filePathSource = path.join(source, file.name);
            const filePathDestination = path.join(destination, file.name);
            await fsPromises.copyFile(filePathSource, filePathDestination); buildStyles
        }
    }
}

async function htmlReplaceComponent() {
    const components = [];
    try {
        let htmlMain = await fsPromises.readFile(path.join(__dirname, 'template.html'), 'utf-8');
        const regexp = /\{\{([\s\S]+?)\}\}/g;

        const matchComponentArray = [...htmlMain.matchAll(regexp)];
        for (const item of matchComponentArray) {
            components.push(item[1]);
        }
        for (const component of components) {
            const pathToComponentSource = path.join(__dirname, 'components', `${component}.html`);
            try {
                const componentData = await fsPromises.readFile(pathToComponentSource, 'utf-8');
                const re = `{{${component}}}`;
                htmlMain = htmlMain.replace(re, componentData);
            }
            catch (err) {
                console.log(err, 'Не получилось прочесть файл компонента');
            }
        }
        fs.writeFile(
            path.join(pathProjectDist, 'index.html'),
            htmlMain,
            (err) => {
                if (err) throw err;
            }
        );
    } catch (err) {
        console.log(err);
    }
}

async function buildStyles() {
    fs.readdir(path.join(__dirname, 'styles'), { encoding: 'utf8', withFileTypes: true }, (err, files) => {
        if (err) throw err;
        files.forEach(file => {
            const fileExtName = path.extname(file.name);
            fs.writeFile(
                path.join(pathProjectDist, 'style.css'), '',
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
                        path.join(pathProjectDist, 'style.css'),
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
}
htmlBuildPage();


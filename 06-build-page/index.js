const path = require('path');
const fs = require('fs');
const fsPromises = require('fs').promises;
const pathProjectDist = path.join(__dirname, 'project-dist');

Object.defineProperty(global, '__stack', {
  get: function () {
    var orig = Error.prepareStackTrace;
    Error.prepareStackTrace = function (_, stack) { return stack; };
    var err = new Error;
    Error.captureStackTrace(err, arguments.callee);
    var stack = err.stack;
    Error.prepareStackTrace = orig;
    return stack;
  }
});
Object.defineProperty(global, '__line', {
  get: function () {
    return __stack[1].getLineNumber();
  }
});

//console.log(__line);

async function removeDir() {
  try {
    //console.log(__line);
    await fsPromises.rm(pathProjectDist, { recursive: true, force: true });
    await fsPromises.rm(path.join(pathProjectDist, 'assets'), { recursive: true, force: true });
    fs.mkdir(pathProjectDist, { recursive: true }, (err) => {
      if (err) throw err;
    });
    //console.log(__line);
    // const files = await fsPromises.readdir(path.join(__dirname, 'assets'), { encoding: 'utf8', withFileTypes: true });

    // fs.readdir(path.join(__dirname, 'assets'), { encoding: 'utf8', withFileTypes: true }, (err, files) => {
    //     if (err) throw err;
    // });

    //console.log(__line);
    //console.log(path.join(__dirname, 'assets'), '\r\n', path.join(pathProjectDist, 'assets'));

    copyDirectory(path.join(__dirname, 'assets'), path.join(pathProjectDist, 'assets'));
    //console.log(__line);
    htmlFileHandler();

    //console.log(__line);

    //Copy styles ------------------------------------------
    fs.readdir(path.join(__dirname, 'styles'), { encoding: 'utf8', withFileTypes: true }, (err, files) => {
      //console.log(__line);
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
                // //console.log('Файл был создан');
              }
            );
          });
          // readableStream.on('error', error => //console.log('Error', error.message));
        }
      });
    });
  } catch (err) {
    console.error('Error occurred while reading directory!', err);
  }
}

removeDir();
async function copyDirectory(source, destination) {
  //console.log(__line);
  fs.mkdir(destination, { recursive: true }, (err) => {
    if (err) throw err;
  });

  const files = await fsPromises.readdir(source, { encoding: 'utf8', withFileTypes: true });
  // fs.readdir(path.join(__dirname, 'assets'), { encoding: 'utf8', withFileTypes: true }, (err, files) => {
  //     if (err) throw err;
  // });
  //console.log(__line);

  for (const file of files) {
    if (file.isDirectory()) {
      const subfolder = path.join(source, file.name);
      const subdistination = path.join(destination, file.name);
      copyDirectory(subfolder, subdistination);
    }
    else {
      const filePathSource = path.join(source, file.name);
      const filePathDestination = path.join(destination, file.name);
      await fsPromises.copyFile(filePathSource, filePathDestination);
    }
  }
}

async function htmlFileHandler() {
  // const readableStream = await fs.createReadStream(path.join(__dirname, 'template.html'), 'utf-8');
  // let data = '';
  const components = ['articles', 'header', 'footer'];
  let htmlMain = await fsPromises.readFile(path.join(__dirname, 'template.html'), 'utf-8');

  for (component of components) {
    //console.log('component = ', component)
    const componentData = await fsPromises.readFile(path.join(__dirname, 'components', `${component}.html`), 'utf-8');
    const re = `{{${component}}}`;
    htmlMain = htmlMain.replace(re, componentData);
  }

  //console.log(__line);
  fs.writeFile(
    path.join(pathProjectDist, 'index.html'),
    htmlMain,
    (err) => {
      if (err) throw err;
    }
  );
  //console.log(__line);
  // readableStream.on('data', chunk => data += chunk);
  // readableStream.on('end', () => {
  //   //console.log('indexOf=\n', data.slice(data.indexOf('{{header}}')));
  //   fs.writeFile(
  //     path.join(__dirname, 'text.html'),
  //     data,
  //     (err) => {
  //       if (err) throw err;
  //     }
  //   );
  // });
  // readableStream.on('error', error => //console.log('Error', error.message));
}


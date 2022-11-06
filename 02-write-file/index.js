const { stdin, stdout, stderr } = process;
const fs = require('fs');
const path = require('path');

stdout.write('Приветствую, давайте сохраним ваш текст:\n(для выхода введите "exit")\n');

// create file
fs.writeFile(
    path.join(__dirname, 'text.txt'),
    '',
    (err) => {
        if (err) throw err;
    }
);

// input event handle
stdin.on('data', data => {
    const dataString = data.toString();
    if (dataString.toLocaleLowerCase() === 'exit\r\n')
        process.exit();
    else {
        fs.appendFile(
            path.join(__dirname, 'text.txt'),
            dataString,
            (err) => {
                if (err) throw err;
            }
        );
    }
});

// exit event handle
process.on('SIGINT', function () {
    process.exit();
});
process.on('exit', code => {
    if (code === 0) {
        stderr.write('До свидания');
    } else {
        stderr.write(`Что-то пошло не так. Программа завершилась с кодом ${code}`);
    }
});



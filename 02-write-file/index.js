const process = require('process');
const fs = require('fs');
const { stdin, stdout } = process;
const path = require('path');
const output = fs.createWriteStream(path.join(__dirname, 'consoleText.txt'));

stdout.write('Enter text\n');
stdin.on('data', data => {
  if (data.toString() === 'exit\n'){
    process.exit();
  }
  output.write(data);
});

process.on('SIGINT',()=> process.exit());

process.on('exit', () => {
  console.log('Good Bye!');
});
const client = require('../index.js');
const chalk = require('chalk');

client.on('ready', () => {
	let grow = [
		"█▀▀ █▀█ █▀█ █░█░█",
    "█▄█ █▀▄ █▄█ ▀▄▀▄▀"
	];

  console.log(chalk.blue("-".repeat(30)));
	console.log(chalk.green(grow.join('\n')));
  console.log(chalk.green.bold("IS READY!"))
});

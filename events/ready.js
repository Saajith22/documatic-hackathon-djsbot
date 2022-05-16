const client = require('../index.js');
const chalk = require('canvas');

client.on('ready', () => {
	let grow = [
		"█▀▀ █▀█ █▀█ █░█░█",
    "█▄█ █▀▄ █▄█ ▀▄▀▄▀"
	];

  console.log(chalk.blue("STATUS =>"));
	console.log(chalk.green(grow.join('\n')));
  console.log(chalk.green.bold("IS READY!"))
});

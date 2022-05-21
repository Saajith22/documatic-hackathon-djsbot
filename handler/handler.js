const fs = require("fs");
const chalk = require("chalk");
const client = require("../index.js");

//COMMANDS
console.log(chalk.blue.bold("-".repeat(30)));
console.log(chalk.yellow.bold("COMMANDS"));
fs.readdirSync("./commands/").forEach((dir) => {
  fs.readdirSync(`./commands/${dir}`).forEach((f) => {
    let file = require(`../commands/${dir}/${f}`);
    let name = file.name;

    if(name) client.commands.set(name, file);
    if(file.aliases) {
      file.aliases.forEach(alias => client.commands.set(alias, file))
    }
    
    console.log(`Command Loaded | ${name}`)
  });
});

//EVENTS
console.log(chalk.blue.bold("-".repeat(30)));
console.log(chalk.yellow.bold("EVENTS"));
fs.readdirSync("./events/").forEach((file) => {
  console.log(file.replace(".js", ""));
  require(`../events/${file}`);
});
console.log(chalk.blue.bold("-".repeat(30)));

const { Client, Collection } = require("discord.js");
const { prefix, token } = require("./config.json");

const client = new Client({
  intents: ["GUILDS", "GUILD_MESSAGES", "GUILD_MEMBERS"]
});

client.prefix = prefix;
client.commands = new Collection();
module.exports = client;

//HANDLER
require("./handler/handler.js");

client.login(token);

const { Client, Collection } = require("discord.js");
const { prefix, token, mongoURL } = require("./config.json");

const client = new Client({
  intents: ["GUILDS", "GUILD_MESSAGES", "GUILD_MEMBERS"],
});

client.prefix = prefix;
client.commands = new Collection();
client.createButtonCollector = async (msg, id, author, func) => {
  const collector = msg.createMessageComponentCollector({
    filter: async (i) => {
      await i.deferUpdate().catch((e) => null);
      if (author === i.user.id) return true;
      else
        return void (await i.followUp({
          content: "You can not use this button!",
          ephemeral: true,
        }));
    },
    time: 60000,
    max: 1,
    componentType: "BUTTON",
  });

  collector.on("collect", async (i) => {
    if (i.customId === id) {
      await func(i);
    }
  });
};

client.collectMsg = async (msg, embed, func) => {
  await msg.channel.send({
    embeds: [embed]
  });

  const collector = msg.channel.createMessageCollector({
    filter: (m) => m.author.id === msg.author.id,
    time: 60000,
    max: 1,
  });

  collector.on("collect", func);
};

module.exports = client;

//HANDLER
require("./handler/handler.js");

const mongo = require("mongoose");
mongo
  .connect(mongoURL, {
    useNewUrlParser: true,
  })
  .then(console.log("Connected to DB!!"));

client.login(token);

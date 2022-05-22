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
    embeds: [embed],
  });

  const collector = msg.channel.createMessageCollector({
    filter: (m) => m.author.id === msg.author.id,
    time: 60000,
    max: 1,
  });

  collector.on("collect", func);
};

const db = require("./models/users");
client.formatXP = async (p, player, xp) => {
  const data = await db.findOne({
    user: player,
  });

  if (!data) return;

  const pet = data.pets.find((pe) => pe.name === p.name);

  let playerXp = data.lvl * 20;
  if (xp === playerXp) data.lvl++;
  else if (xp > playerXp) {
    data.lvl++;
    data.xp = xp - playerXp;
  } else data.xp = xp;

  let petXp = pet.lvl * 10;
  if (xp === petXp) pet.lvl++;
  else if (xp > petXp) {
    pet.lvl++;
    pet.xp = xp - petXp;
  } else pet.xp = xp;

  pet.str + 5;

  await db.findOneAndUpdate(
    {
      user: player,
    },
    data
  );
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

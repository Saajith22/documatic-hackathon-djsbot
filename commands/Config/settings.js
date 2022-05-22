const { MessageEmbed, Message, Client } = require("discord.js");
const settings = require("../../data/settings.json");
const db = require("../../models/users");

module.exports = {
  name: "settings",
  description: "Change some of the settings!",
  /**
   *
   * @param {Client} client
   * @param {Message} message
   * @param {String[]} args
   * @returns
   */
  run: async (client, message, args) => {
    const data = await db.findOne({
      user: message.author.id,
    });

    if (!data)
      return message.reply("It seems like you haven't started the game yet!");

    const mapped = settings.map(
      (s, i) =>
        `**${++i}. \`${s.name}\` (ID: ${s.id})**\n*Current:* **${
          data.info[s.current] || "None"
        }**`
    );

    const embed = new MessageEmbed()
      .setTitle("Settings")
      .setDescription(mapped.join("\n"))
      .setColor("GREEN")
      .setFooter({
        text: "Choose the setting you want to change by typing it's id!",
      });

    const msg = await message.channel.send({
      embeds: [embed],
    });

    const collector = msg.channel.createMessageCollector({
      filter: (m) => m.author.id === message.author.id,
      time: 60000,
      max: 1,
    });

    const sendingEmbed = new MessageEmbed()
      .setTitle("Choose your pet:")
      .setDescription(data.pets.map((p, i) => `${++i}. **${p.name}**`).join("\n"))
      .setFooter({
        text: "Type in the pet's name.",
      })
      .setColor("GREEN");

    collector.on("collect", async (m) => {
      switch (parseInt(m)) {
        case 1:
          await client.collectMsg(message, sendingEmbed, async (m) => {
            let { content } = m;
            let foundPet = data.pets.find(
              (p) => p.name.toLowerCase() === content.toLowerCase()
            );
            if (!foundPet)
              return m.reply("You do not own that pet. Process canceled.");

            data.info.chosen = foundPet;
            await db.findOneAndUpdate({ user: message.author.id }, data);

            return m.reply(
              `You have successfully chosen **${foundPet.name}** as your chosen pet!`
            );
          });
          break;

        default:
          await m.reply("Unknown setting id! Process canceled.");
          break;
      }
    });
  },
};

const { MessageEmbed, Message, Client } = require("discord.js");
const db = require("../../models/users");
const { pagination } = require("../../data/functions");

module.exports = {
  name: "pets",
  description: "See your current pets!",
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

    const { pets } = data;
    const embeds = pets.map((pet) => {
      const stats = [
        `**Health:** ${makeBar(pet.health, 100)}`,
        `**Happiness:** ${makeBar(pet.happy, 100)}`,
        `**Strength:** ${pet.str}`,
      ];

      return new MessageEmbed()
        .setTitle(`${pet.name} - Level ${pet.lvl}`)
        .setThumbnail(pet.img)
        .addFields([
          {
            name: "Stats",
            value: `>>> ${stats.join("\n")}`,
          },
        ])
        .setColor("YELLOW");
    });

    await pagination(message, message.author.id, embeds);
  },
};

function makeBar(amount, total) {
  let percentage = (amount / total) * 100;
  let block = "■";
  let empty = "□";
  let length = 10;
  let howMany = amount / length;
  let bar = block.repeat(howMany);
  if (bar.length < length) bar += empty.repeat(length - howMany);

  return `[${bar}] (${percentage}%)`;
}

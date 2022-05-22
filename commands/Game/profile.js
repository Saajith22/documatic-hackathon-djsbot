const { MessageEmbed, Message, Client } = require("discord.js");
const db = require("../../models/users");

module.exports = {
  name: "profile",
  description: "See your profile.",
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

    const { lvl, coins, pets } = data;
    const embed = new MessageEmbed()
      .setAuthor({
        name: `${message.author.username}'s profile`,
      })
      .setThumbnail(message.author.displayAvatarURL())
      .addFields([
        {
          name: "Level:",
          value: `> \`${lvl}\``,
        },
        {
          name: "Wallet:",
          value: `> \`${coins}🪙\``,
        },
        {
          name: "Pets:",
          value: `>>> ${pets.map((p) => `**${p.name}** (Level ${p.lvl})`).join("\n")}`,
        },
      ])
      .setColor("GREEN");

    await message.channel.send({
      embeds: [embed],
    });
  },
};

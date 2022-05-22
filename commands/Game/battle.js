const { MessageEmbed, Message, Client } = require("discord.js");
const db = require("../../models/users");

module.exports = {
  name: "battle",
  description: "Battle some enemies and gain rewards!",
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

    let { chosen } = data.info;
    if (!chosen) {
      chosen = data.pets[0];
      message.reply(
        "**Warning:** You have not selected your pet! By default, your first pet will go to the battle.\nIt will receive all the XP."
      );
    }

    message.reply(chosen.name);
  },
};

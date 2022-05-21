const { MessageEmbed, Message, Client } = require("discord.js");

module.exports = {
  name: "author",
  description: "The creator of this game!!",
  /**
   *
   * @param {Client} client
   * @param {Message} message
   * @param {String[]} args
   * @returns
   */
  run: async (client, message, args) => {
    return message.reply("This game was made by Saajith#1001");
  },
};

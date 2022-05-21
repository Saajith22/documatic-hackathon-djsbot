const { MessageEmbed, Message, Client } = require("discord.js");
const { readdirSync } = require("fs");
const { pagination } = require("../../data/functions");

module.exports = {
  name: "help",
  aliases: ["h"],
  emoji: "🚑",
  description: "Shows all available bot commands.",
  /**
   *
   * @param {Client} client
   * @param {Message} message
   * @param {String} args
   * @returns
   */
  run: async (client, message, args) => {
    const prefix = client.prefix;
    const color = "GREEN";

    let cots = [];

    if (!args[0]) {
      //categories to ignore
      let ignored = ["birthday", "owner"];

      const emo = {
        fun: "🎆",
        giveaway: "🎉",
        info: "📻",
        mod: "🔨",
        presence: "🎌",
        utility: ":comet:",
        purge: "🧨",
        key: "🔑",
        ticket: "🎫",
        counting: "🔢",
        socialmedia: "📱",
        economy: "💰",
      };

      readdirSync("./commands").map(async (dir) => {
        const commands = readdirSync(`./commands/${dir}/`).filter((file) =>
          file.endsWith(".js")
        );

        let cmds = commands.map((e) => {
          let obyy = new Object();

          e = e.replace(".js", "");

          const des = client.commands.get(e)?.description;

          obyy = {
            name: `\`${e}\``,
            value: des || "No description",
            inline: true,
          };

          return obyy;
        });

        let cmdObjData = {
          dir,
          cmdd: cmds,
        };

        cots.push(cmdObjData);
      });

      let embeds = [];

      cots.forEach((cot) => {
        const embed = new MessageEmbed()
          .setTitle(
            `${cot.dir.charAt(0).toUpperCase() + cot.dir.slice(1)} Commands!`
          )
          .setDescription(
            `Use \`${prefix}help\` followed by a command name to get more information on a command.\nFor example: \`${prefix}help start\`.\n\n`
          )
          .setColor(color);

        cot.cmdd.forEach((ecmdd) => {
          embed.addFields(ecmdd);
        });

        embeds.push(embed);
      });

      await pagination(message, message.author.id, embeds);
    } else {
      const command =
        client.commands.get(args[0].toLowerCase()) ||
        client.commands.find(
          (c) => c.aliases && c.aliases.includes(args[0].toLowerCase())
        );

      if (!command) {
        const embed = new MessageEmbed()
          .setTitle(
            `Invalid command! Use \`${prefix}help\` for all of my commands!`
          )
          .setColor("RED");
        return await message.channel.send({
          embeds: [embed],
        });
      }

      const embed = new MessageEmbed()
        .setTitle("Command Details:")
        .addField(
          "Command:",
          command.name ? `\`${command.name}\`` : "No name for this command."
        )
        .addField(
          "Aliases:",
          command.aliases
            ? `\`${command.aliases.join("` `")}\``
            : "No aliases for this command."
        )
        .addField(
          "Usage:",
          command.usage
            ? `\`${prefix}${command.name} ${command.usage}\``
            : `\`${prefix}${command.name}\``
        )
        .addField(
          "Command Description:",
          command.description
            ? command.description
            : "No description for this command."
        )
        .setTimestamp()
        .setColor(color);
      return await message.channel.send({
        embeds: [embed],
      });
    }
  },
};

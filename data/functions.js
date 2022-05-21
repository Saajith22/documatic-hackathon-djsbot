const {
  Message,
  MessageActionRow,
  MessageButton,
  MessageEmbed,
} = require("discord.js");

/**
 *
 * @param {Message} msg
 * @param {String} author
 * @param {MessageEmbed[]} embeds
 */
async function pagination(msg, author, embeds) {
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
    componentType: "BUTTON"
  });
  let page = 0;

  const components = [
    new MessageActionRow().addComponents(
      new MessageButton()
        .setCustomId("back")
        .setEmoji("⬅️")
        .setStyle("PRIMARY"),
      new MessageButton().setCustomId("next").setEmoji("➡️").setStyle("PRIMARY")
    ),
  ];

  await msg.edit({
    embeds: [embeds[page]],
    components,
  });

  collector.on("collect", async (i) => {
    if (i.customId === "next") {
      page++;
    } else page--;

    await msg.edit({
      embeds: [embeds[page]],
    });
  });
}

module.exports = { pagination };

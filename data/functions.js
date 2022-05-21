const {
  Message,
  MessageActionRow,
  MessageButton,
  MessageEmbed,
} = require("discord.js");

const pets = require("./pets.json");

/**
 *
 * @param {Message} msg
 * @param {String} author
 * @param {MessageEmbed[]} embeds
 * @param {{ button: MessageButton, func: Function }[]} extra
 */
async function pagination(msg, author, embeds, extra) {
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
    componentType: "BUTTON",
  });

  let page = 0;
  let propIds = extra.map((e) => e.button.customId);

  const components = [
    new MessageActionRow().addComponents(
      new MessageButton()
        .setCustomId("back")
        .setEmoji("⬅️")
        .setStyle("PRIMARY"),
      new MessageButton()
        .setCustomId("next")
        .setEmoji("➡️")
        .setStyle("PRIMARY"),
      ...extra.map((e) => e.button)
    ),
  ];

  await msg.edit({
    embeds: [embeds[page]],
    components,
    files: [],
  });

  collector.on("collect", async (i) => {
    if (propIds.includes(i.customId)) {
      let found = extra.find((e) => e.button.customId === i.customId);
      if (found.button.customId === "select")
        return await found.func(author, pets[page].name, msg);
      else return await found.func();
    }

    if (i.customId === "next") {
      page + 1 >= embeds.length ? (page = 0) : page++;
    } else page - 1 < 0 ? (page = embeds.length - 1) : page--;

    await msg.edit({
      embeds: [embeds[page]],
    });
  });
}

module.exports = { pagination };

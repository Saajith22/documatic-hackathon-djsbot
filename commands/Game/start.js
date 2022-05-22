const {
  Client,
  Message,
  MessageEmbed,
  MessageAttachment,
  MessageActionRow,
  MessageButton,
} = require("discord.js");
const Canvas = require("canvas");

const pets = require("../../data/pets.json");
const { pagination } = require("../../data/functions.js");
const { addCreature } = require("../../data/creatures.js");
const db = require("../../models/users");

module.exports = {
  name: "start",
  description: "Start the game!",
  /**
   * @param {Client} client
   * @param {Message} message
   * @param {String[]} args
   */
  run: async (client, message, args) => {

    const data = await db.findOne({
      user: message.author.id
    });
    
    if(data) return message.reply("You have already started your game!!");

    //load font
    Canvas.registerFont("./fonts/Skranji-Regular.ttf", {
      family: "'Skranji', cursive",
    });

    const canvas = Canvas.createCanvas(500, 100);
    const ctx = canvas.getContext("2d");

    ctx.fillStyle = "white";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.font = "65px 'Skranji', cursive";
    ctx.fillStyle = "green";
    ctx.fillText("GROW", canvas.width / 2 - 85, 75);

    const attach = new MessageAttachment(canvas.toBuffer(), "grow.png");

    const embed = new MessageEmbed()
      .setTitle("Welcome to GROW!")
      .setDescription(
        "Grow is a game based on growing your creatures and keeping them happy! \n\nChoose your first pet by clicking the **'Next'** button!"
      )
      .setImage("attachment://grow.png")
      .setColor("YELLOW");

    const row = new MessageActionRow().addComponents(
      new MessageButton()
        .setCustomId("next")
        .setLabel("Next")
        .setStyle("PRIMARY")
    );

    let msg = await message.channel.send({
      embeds: [embed],
      files: [attach],
      components: [row],
    });

    await client.createButtonCollector(
      msg,
      "next",
      message.author.id,
      async (i) => {
        const embeds = pets.map((pet) => {
          return new MessageEmbed()
            .setTitle(pet.name)
            .setThumbnail(pet.img)
            .addFields([
              {
                name: "Moves",
                value: `>>> ${pet.moves.join("\n")}`,
                inline: true,
              },
              {
                name: "Strength",
                value: pet.str.toString(),
                inline: true,
              },
            ])
            .setColor("YELLOW")
            .setFooter({
              text: "Press the check mark to select!!",
            });
        });

        const extraProps = [
          {
            button: new MessageButton()
              .setEmoji("✅")
              .setCustomId("select")
              .setStyle("SUCCESS"),
            func: addCreature,
          },
        ];

        await pagination(msg, message.author.id, embeds, extraProps);
      }
    );
  },
};

const { Client, Message, MessageEmbed, MessageAttachment, MessageActionRow, MessageButton } = require("discord.js");
const Canvas = require("canvas");

const pets = require("../../data/pets.json");
const { pagination  } = require("../../data/functions.js");

module.exports = {
  name: "start",
  description: "Start the game!",
  /**
   * @param {Client} client
   * @param {Message} message
   * @param {String[]} args
   */
  run: async(client, message, args) => {

    //load font
    Canvas.registerFont("./fonts/Skranji-Regular.ttf", { family: "'Skranji', cursive" })

    const canvas = Canvas.createCanvas(500, 100);
    const ctx = canvas.getContext("2d");

    ctx.fillStyle = "white";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.font = "65px 'Skranji', cursive";
    ctx.fillStyle = "green";
    ctx.fillText("GROW", canvas.width / 2 - 65, 65);

    const attach = new MessageAttachment(canvas.toBuffer(), "grow.png");
    
    const embed = new MessageEmbed()
    .setTitle("Welcome to GROW!")
    .setDescription("Grow is a game based on growing your creatures and keeping them happy! \n\nChoose your first pet by clicking the 'Next' button!")
    .setImage("attachment://grow.png")
    .setColor("YELLOW");

    const row = new MessageActionRow()
    .addComponents(
      new MessageButton()
      .setCustomId("next")
      .setLabel("Next")
      .setStyle("PRIMARY")
    )


    let msg = await message.channel.send({
      embeds: [embed],
      files: [attach],
      components: [row]
    });

    await client.createButtonCollector(msg, "next", message.author.id, async(i) => {
      const embeds = pets.map(pet => {
        return new MessageEmbed()
        .setTitle(pet.name)
        .setDescription(pet.moves.join("\n"))
        .setColor("YELLOW")
      });
      
      await msg.edit({
        files: [],
        components: []
      });

      await pagination(msg, message.author.id, embeds)
    });
  }
}
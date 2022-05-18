const { Client, Message, MessageEmbed, MessageAttachment } = require("discord.js");
const Canvas = require("canvas");

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
    ctx.fillText("GROW", canvas.width / 2 + 65, 65);

    const attach = new MessageAttachment(canvas.toBuffer(), "grow.png");
    
    const embed = new MessageEmbed()
    .setTitle("Welcome to GROW!")
    .setDescription("Grow is a game based on growing your creatures and keeping them happy!")
    .setImage("attachment://grow.png")
    .setColor("YELLOW");


    message.channel.send({
      embeds: [embed],
      files: [attach]
    });
  }
}
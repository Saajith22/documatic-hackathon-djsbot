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

    const enemy = {
      name: randomName(),
      str: chosen.lvl + 5,
      health: chosen.lvl * 20,
      bounty: chosen.health * Math.floor(Math.random() * 3) + 1,
    };

    const player = {
      name: chosen.name,
      str: chosen.str,
      health: chosen.health,
    };

    const embed = new MessageEmbed()
      .setTitle("Battle")
      .setColor("GOLD")
      .setDescription("```Battle Status```")
      .addFields([
        {
          name: player.name,
          value: `>>> **Health:** ${player.health}%\n**Strength:** ${player.str}`,
          inline: true,
        },
        {
          name: enemy.name,
          value: `>>> **Health:** ${enemy.health}%\n**Strength:** ${enemy.str}`,
          inline: true,
        },
      ]);

    let msg = await message.channel.send({
      embeds: [embed],
    });

    const editEmbed = (embed, description) => {
      embed.description = `\`\`\`${description}\`\`\``;
      embed.fields = [
        {
          name: player.name,
          value: `>>> **Health:** ${player.health}%\n**Strength:** ${player.str}`,
          inline: true,
        },
        {
          name: enemy.name,
          value: `>>> **Health:** ${enemy.health}%\n**Strength:** ${enemy.str}`,
          inline: true,
        },
      ];

      return embed;
    };

    const dealDamage = async (person, target) => {
      let dmg = Math.floor(Math.random() * person.str) + 10;
      target.health = target.health - dmg < 0 ? 0 : target.health - dmg;

      await msg.edit({
        embeds: [
          editEmbed(
            embed,
            `${person.name} attacked ${target.name} and dealt ${dmg}% damage!`
          ),
        ],
      });
    };

    const doIt = async () => {
      if (player.health > 0 && enemy.health > 0) {
        await dealDamage(player, enemy);

        setTimeout(async () => {
          if (enemy.health === 0) return;
          await dealDamage(enemy, player);
        }, 2000);

        setTimeout(async () => await doIt(), 5000);
      } else {
        let winner = player.health > 0 ? player.name : enemy.name;
        let xp =
          winner === player.name
            ? chosen.lvl + Math.floor(Math.random() * 45)
            : chosen.lvl + Math.floor(Math.random() * 15);

        let prize =
          winner === player.name
            ? `**Rewards:**\n\`${enemy.bounty}🪙\`\n\`${xp} XP\``
            : `**Rewards:**\n\`${xp} XP\``;
        await message.reply(
          `The battle between **${player.name}** and **${enemy.name}** has ended!. The winner is **${winner}**\n\n${prize}`
        );

        let find = data.pets.find((p) => p.name === player.name);
        if (winner === player.name) data.coins += enemy.bounty;

        find.health = player.health;
        client.formatXP(find, message.author.id, xp);
        data.info.chosen = find;

        await db.findOneAndUpdate(
          {
            user: message.author.id,
          },
          data
        );
      }
    };

    setTimeout(async () => await doIt(), 3000);
  },
};

function randomName() {
  let firsts = ["Spider", "Rock", "Tree", "Blizard"];
  let seconds = ["King", "Infant", "Queen", "Wizard"];

  const random = (arr) => arr[Math.floor(Math.random() * arr.length)];

  let name = `${random(firsts)} ${random(seconds)}`;
  return name;
}

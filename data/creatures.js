const pets = require("./pets.json");
const db = require("../models/users");

function getPet(name) {
  let pet = pets.find((p) => p.name === name);
  if (!pet) return false;
  return pet;
}

async function addCreature(id, name, msg) {
  const data = await db.findOne({
    user: id,
  });

  let found = getPet(name);
  if (!found) return;

  if (!data) {
    await db.create({
      user: id,
      lvl: 1,
      pets: [
        {
          ...found,
          lvl: 1,
        },
      ],
      coins: 100,
    });
  } else {
    data.pets.push({
      ...found,
      lvl: 1,
    });
    data.save();
  }

  await msg.channel.send(`You received a pet! It's a **${found.name}**!!`);
  await msg.delete();
}

module.exports = {
  addCreature,
};

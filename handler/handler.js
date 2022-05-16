const fs = require("fs");

//EVENTS
console.log("EVENTS => ");
fs.readdirSync("./events/").forEach((file) => {
  console.log(file.replace(".js", ""));
  require(`../events/${file}`);
});

const data = require("./pets.json");

function getPet(name) {
 let pet = data.find(p => p.name === name);
 if(!pet) return false;
 return pet;
}
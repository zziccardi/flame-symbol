
const characters = null;
const weapons    = null;

class Character {
    constructor(name) {
        if (characters === null) console.log("reading from file");
        
        // I think the files should only need to be read once each if done this
        // way, rather than every time an instance is made
        characters = characters || require("./data/characters.json");
        weapons    = weapons    || require("./data/weapons.json");
        
        
    }
}

module.exports = Character;


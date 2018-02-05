
const characterJSON = require("../data/characters.json");
const weaponJSON    = require("../data/weapons.json");

class Character {
    
    /**
     * Create a Character by reading its data from the JSON file
     * @param {String} name - the name of the character this object will represent
     */
    constructor(name) {        
        let data = characterJSON[name];
        
        this.name       = name;
        this.weaponType = data["weapon-type"];
        this.movement   = data.movement;
        this.stats      = data.stats;
        //this.weapon     = new Weapon();
    }
    
}

module.exports = Character;

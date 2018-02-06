
import Weapon from "../classes/Weapon.js";

import charactersJSON from "../data/characters.json";

export default class Character {
    
    /**
     * Create a Character by reading its data from the JSON file
     * @param {String} name - the name of the character this object will represent
     */
    constructor(name) {        
        let data = charactersJSON[name];
        
        this.name       = name;
        this.weaponType = data["weapon-type"];
        this.movement   = data.movement;
        this.stats      = data.stats;
        this.weapon     = new Weapon(data.weapon, this.weaponType);
    }
    
}

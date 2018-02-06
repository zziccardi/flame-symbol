
import weaponsJSON from "../data/weapons.json";

export default class Weapon {
    
    /**
     * Create a weapon by reading its data from the JSON file
     * @param {String} name - the weapon's name
     * @param {String} type - the weapon's type
     */
    constructor(name, type) {
        let weaponData = null;
        
        for (let weapon of weaponsJSON[type]) {
            if (weapon.name === name) {
                weaponData = weapon;
                break;
            }
        }
        
        this.name  = name;
        this.type  = type;
        this.might = weaponData.might;
        
        // TODO: Determine range based on weapon type
    }
    
}

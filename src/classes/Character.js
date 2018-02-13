
import Weapon from "../classes/Weapon.js";

import charactersJSON from "../data/characters.json";

import constants from "../constants.js";


export default class Character {
    
    /**
     * Create a Character by reading its data from the JSON file
     * @param {String} name - the name of the character this object will represent
     */
    constructor(name, team) {        
        let data = charactersJSON[name];
        
        this.name             = name;
        this.weaponType       = data["weapon-type"];
        this.movementType     = data["movement-type"];
        this.stats            = data.stats;
        this.weapon           = new Weapon(data.weapon, this.weaponType);
        this.playerNumber     = team;
        this.hasMoved         = false;
        this.position = {
            x: null,
            y: null
        };
        this.movement = 0;
        this.sprite   = null;
        
        if(this.movementType === "infantry") {
            this.movement = 5;
        }
        else if(this.movementType === "armored") {
            this.movement = 3;
        }
        else if(this.movementType === "cavalry") {
            this.movement = 7;
        }
        else if(this.movementType === "flier") {
            this.movement = 6;
        }

        // Healthbar and Health related items
        this.healthBar = null;
        this.currentHP = this.stats.hp;
        this.hpIsScrolling = false;
        this.scrollingHP = this.currentHP;
        
        //Movement information
        this.movement = {
            isMoving : false,
            spritePath : [],
            movedInSprite : 0
        };
    }
    
    /**
     * Move the character to a new tile
     * @param {Cursor} cursor - the cursor instance (indicates the destination)
     * @return this - a reference to this character, to be added to the destination tile
     */
    move(cursor) {
        // Move the character based on where the cursor currently is
        //this.sprite.position.set(
        //    cursor.position.x * constants.TILESIZE,
        //    cursor.position.y * constants.TILESIZE
        //);
        
        this.hasMoved = true;
        cursor.spriteMoving = true;
        this.position.x = cursor.position.x;
        this.position.y = cursor.position.y;
        
        // Update the destination tile to include the character that just moved there
        return this;
    }
    
    /**
     * Attack a character on the opponent's team
     * @param {Character} recipient - the other player's unit who is being attacked
     */
    attack(recipient) {
        console.log(`${this.name} initiates on ${recipient.name}`);
        
        
        // 1. Initiate on opponent
        let status = this.doAttackCalculations(recipient);
        
        // The recipient dies, so end combat
        if (status === "recipient dies") {
            return status;
        }
        
        //this.hpIsScrolling = true;;
        //while(this.hpIsScrolling) {}
        
        console.log(`${recipient.name} counterattacks ${this.name}`);
        
        
        // 2. Opponent counterattacks
        status = recipient.doAttackCalculations(this);
        
        // The initiator was killed on the recipient's counterattack, so end combat
        if (status === "recipient dies") {
            return "initiator dies";
        }
        
        
        // 3. If the initiator is significantly faster than the recipient, the
        // former does a follow-up attack
        if (this.stats.speed - recipient.stats.speed >= 5) {
            console.log(`${this.name} performs a follow-up attack on ${recipient.name}`);
            
            return this.doAttackCalculations(recipient);
        }
        
        
        // 4. If the recipient is significantly faster than the initiator, the
        // former does a second (follow-up) counterattack
        else if (recipient.stats.speed - this.stats.speed >= 5) {
            console.log(`${recipient.name} performs a follow-up counterattack on ${this.name}`);
            
            return recipient.doAttackCalculations(this);
        }
    }
    
    /**
     * Determine the damage to be dealt and subtract it from the opponent's HP
     * @param {Character} recipient - the character that receives the attack
     * @return {String} status - a string indicating whether the recpient dies,
     * or null otherwise
     * @private
     */
    doAttackCalculations(recipient) {
        // Add the weapon's might to this character's attack
        let attackStrength = this.stats.attack + this.weapon.might;
        
        console.log("Attack strength: " + attackStrength);
        
        attackStrength = Math.floor(attackStrength * this.getEffectivenessMultiplier(recipient));
        
        console.log("Attack strength with multiplier: " + attackStrength);
        
        // TODO: Handle magic and ranged attacks
        
        // Subtract the opponent's defense from the damage to determine how much
        // to lower the opponent's HP
        let damage = attackStrength - recipient.stats.defense;
        
        console.log("Damage to subtract from HP: " + damage);
        
        // The recipient's defense is high enough that no damage is dealt
        if (damage <= 0) {
            return null;
        }
        
        recipient.currentHP -= damage;
        
        // If a character's hp goes below 0, set it to 0 for HP bar purposes
        if (recipient.currentHP < 0) {
            recipient.currentHP = 0;
        }
        
        recipient.healthBar.decreaseHealth(recipient.currentHP, recipient.stats.hp);
        
        console.log("Recipient HP: " + recipient.currentHP);
        
        if (recipient.currentHP === 0) {
            return "recipient dies";
        }
        
        return null;
    }
    
    /**
     * Modify the attack strength depending on the weapon effectiveness
     * @param {Character} recipient - the character that receives the attack
     * @return {Number} multiplier
     * @private
     */
    getEffectivenessMultiplier(recipient) {
        if ((this.weaponType === "sword" && recipient.weaponType === "axe")   ||
            (this.weaponType === "lance" && recipient.weaponType === "sword") ||
            (this.weaponType === "axe"   && recipient.weaponType === "lance")) {
            return 1.2;
        }
        
        if ((this.weaponType === "sword" && recipient.weaponType === "lance") ||
            (this.weaponType === "lance" && recipient.weaponType === "axe")   ||
            (this.weaponType === "axe"   && recipient.weaponType === "sword")) {
            return 0.8;
        }
        
        return 1;
    }
}

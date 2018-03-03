
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
        
        //bool determining if a character has moved within the current turn
        //A character should not be allowed to move if it has already moved in that turn
        this.hasMoved         = false;
        
        //X and Y coordinates representing the tile the character currently occupies
        this.position = {
            x: null,
            y: null
        };
        
        //The amount of tiles a character can move in a turn, based on their class
        this.movement = 0;
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
        
        //An array of nearby tiles the unit can interact with. How far away a character can interact depends on their reach
        this.interactableTiles;
        this.reach;
        if(this.weaponType === "sword" || this.weaponType === "lance" || this.weaponType === "axe") {
            this.reach = 1;
        }
        if(this.weaponType === "bow") {
            this.reach = 2;
        }
        
        //The sprite the character uses
        this.sprite   = null;

        // Healthbar and Health related items
        this.healthBar = null;
        this.currentHP = this.stats.hp;
        this.hpIsScrolling = false;
        this.scrollingHP = this.currentHP;
        
        //Sprite Movement information
        this.movingSpriteInfo = {
            
            //Bool determining if a sprite is currently in motion
            isMoving : false,
            
            //The path the sprite will take
            spritePath : [],
            
            //The number of pixels a sprite has moved within a tile
            movedInTile : 0
        };
    }
    
    /**
     * Move the character to a new tile
     * @param {Cursor} cursor - the cursor instance (indicates the destination)
     * @return {Character} this - a reference to this character, to be added to the destination tile
     */
    move(cursor) {
        // Move the character based on where the cursor currently is
        //this.sprite.position.set(
        //    cursor.position.x * constants.TILESIZE,
        //    cursor.position.y * constants.TILESIZE
        //);
        
        this.movingSpriteInfo.isMoving = true;
        
        this.position.x = cursor.position.x;
        this.position.y = cursor.position.y;
        this.hasMoved = true;
        
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
    
    /**
     * Every time a character moves, the interactable Tiles are updated based on the character's new position
     * Each tile is pushed into the array, regardless if it is a valid tile
     * Once all tiles are pushed, loop through the array and remove invalid (out of range) tiles
     */
    updateInteractableTiles() {
        this.interactableTiles = [];
        
        //Characters with a reach of 1 can interact with tiles that are one space away vertically and horizontally
        if(this.reach === 1) {
            //Vertical & Horizontal Tiles 1 space away
            this.interactableTiles.push({x:this.position.x+1, y:this.position.y})
            this.interactableTiles.push({x:this.position.x-1, y:this.position.y})
            this.interactableTiles.push({x:this.position.x, y:this.position.y+1})
            this.interactableTiles.push({x:this.position.x, y:this.position.y-1})
        }
        
        //Characters with a reach of 2 can interact with tiles that are one or two spaces away vertically and horizontally, and one space diagonally
        else if(this.reach === 2) {
            //Vertical & Horizontal Tiles 2 spaces away
            this.interactableTiles.push({x:this.position.x+2, y:this.position.y})
            this.interactableTiles.push({x:this.position.x-2, y:this.position.y})
            this.interactableTiles.push({x:this.position.x, y:this.position.y+2})
            this.interactableTiles.push({x:this.position.x, y:this.position.y-2})
            
            //Diagonal Tiles 1 space away
            this.interactableTiles.push({x:this.position.x+1, y:this.position.y+1})
            this.interactableTiles.push({x:this.position.x-1, y:this.position.y+1})
            this.interactableTiles.push({x:this.position.x+1, y:this.position.y+1})
            this.interactableTiles.push({x:this.position.x+1, y:this.position.y-1})
        }
        
        this.interactableTiles.forEach((tile, index) => {
            if(tile.x > constants.NUM_TILES-1 || tile.x < 0 || tile.y > constants.NUM_TILES-1 || tile.y < 0) {
                this.interactableTiles.splice(index, 1);
            }
        });
    }
    
    /**
     * 
     * @param {object} PIXI - Pixi object
     */
    desaturateSprite(PIXI) {
        let colorMatrix = new PIXI.filters.ColorMatrixFilter();
        
        this.sprite.filters = [colorMatrix];
        
        colorMatrix.desaturate();
    }
    
    /**
     * 
     * @param {object} PIXI - Pixi object
     */
    saturateSprite(PIXI) {
        let colorMatrix = new PIXI.filters.ColorMatrixFilter();
        
        this.sprite.filters = [colorMatrix];
        
        colorMatrix.reset();
    }
}

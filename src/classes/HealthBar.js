import constants from "../constants.js";

const TextStyle = PIXI.TextStyle;
const Text      = PIXI.Text;

// The text style for the HP
const hpTextStyle = new TextStyle({
    fontFamily: "Futura",
    fontSize: 12,
    fill: "white"
});


export default class HealthBar {
    constructor(canvas) {
        this.canvas             = canvas;
        this.healthBarObject    = null;
        this.hpTextObject       = null;
    }

    makeHealthBar(character, charCounter) {
        let counter = charCounter;
        
        // Values dependant on which team the character is on
        let code;
        let spacing;
        
        // Check the character's team
        if(character.playerNumber === 1) {
            code = 0x0000ff;
            spacing = 50;
        }
        else {
            code = 0xff0000;
            spacing = 225;
        }
        
        // Create the HP bar container
        // This container will contain all the individual pieces of the bar
        // (The HP text, name text, red rectangle, etc.)
        this.healthBarObject = new PIXI.DisplayObjectContainer();
        this.healthBarObject.position.set(constants.BOARDSIZE + spacing, (counter*40) + 25);
        this.canvas.addChild(this.healthBarObject);

        // Create the black background rectangle
        let innerBar = new PIXI.Graphics();
        innerBar.beginFill(0x000000);
        innerBar.drawRect(0, 0, character.stats.hp * constants.PIXEL_PER_HP, 15);
        innerBar.endFill();
        this.healthBarObject.addChild(innerBar);

        // Create the front red rectangle
        let outerBar = new PIXI.Graphics();
        outerBar.beginFill(code);
        outerBar.drawRect(0, 0, character.stats.hp * constants.PIXEL_PER_HP, 15);
        outerBar.endFill();
        this.healthBarObject.addChild(outerBar);

        // Save the outer bar as a field in the health bar container for later access
        this.healthBarObject.outer = outerBar;
        
        // Write the character's name above the HP Bar
        // Add the character name text as a child in the Health Bar Graphic
        let characterName = new Text(character.name, hpTextStyle);
        characterName.x = 0;
        characterName.y = -17;
        this.healthBarObject.addChild(characterName);
        
        // Write the character's HP inside the HP Bar
        // Add the HP text as a child in the Health Bar Graphic
        let characterHP = new Text(`${character.currentHP} / ${character.stats.hp}`, hpTextStyle);
        characterHP.x = 3;
        characterHP.y = 0;
        this.healthBarObject.addChild(characterHP);
        
        // Save the HP text into the Health Bar for later access
        this.healthBarObject.hpTextObject = characterHP;
    }
    
    decreaseHealth(currentHP, maxHP) {
        this.healthBarObject.outer.width = currentHP * constants.PIXEL_PER_HP;
        this.healthBarObject.hpTextObject.text = `${currentHP} / ${maxHP}`;
    }
}

import constants from "../constants.js";
import Character from "./Character.js";

const TextStyle = PIXI.TextStyle;
const Text      = PIXI.Text;

// The text style for the HP
const hpTextStyle = new TextStyle({
    fontFamily: "Futura",
    fontSize: 12,
    fill: "white"
});


export default class HealthBar {
    constructor(char, canvas) {
        this.character      = char;
        this.canvas         = canvas;
    }

    makeHealthBar(charCounter) {
        //Values dependant on which team the character is on
        let code;
        let spacing;
        let counter;
        
        //Check the character's team
        if(this.character.playerNumber === 1) {
            code = 0x0000ff;
            spacing = 50;
            counter = charCounter;
        }
        else {
            code = 0xff0000;
            spacing = 225;
            counter = charCounter;
        }
        
        //Write the character's name above the HP Bar
        let characterName = new Text(this.character.name, hpTextStyle);
        characterName.x = constants.BOARDSIZE + spacing;
        characterName.y = (counter*40) + 10;
        this.canvas.addChild(characterName);
    
        //Create the HP bar
        let healthBar = new PIXI.DisplayObjectContainer();
        healthBar.position.set(constants.BOARDSIZE + spacing, (counter*40) + 25);
        this.canvas.addChild(healthBar);

        //Create the black background rectangle
        let innerBar = new PIXI.Graphics();
        innerBar.beginFill(0x000000);
        innerBar.drawRect(0, 0, this.character.stats.hp * constants.PIXEL_PER_HP, 15);
        innerBar.endFill();
        healthBar.addChild(innerBar);

        //Create the front red rectangle
        let outerBar = new PIXI.Graphics();
        outerBar.beginFill(code);
        outerBar.drawRect(0, 0, this.character.stats.hp * constants.PIXEL_PER_HP, 15);
        outerBar.endFill();
        healthBar.addChild(outerBar);

        //Save the bars into the character for later access
        healthBar.outer = outerBar;
        
        //Save the HP bar for later alteration
        this.character.outerHPBar = healthBar.outer;
        
        //Write a number over the hp bar to represent the numerical HP
        let characterHP = new Text(`${this.character.currentHP} / ${this.character.stats.hp}`, hpTextStyle);
        characterHP.x = constants.BOARDSIZE+spacing;
        characterHP.y = (counter*40) + 25;
        this.canvas.addChild(characterHP);
        
        this.character.hpText = characterHP;
    }
}

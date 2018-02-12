
import constants from "../constants.js";

export default class Cursor {
    constructor() {
        this.isSelected = false;
        this.position = {x:0, y:0};
        
        this.notSelectedSprite = null;
        this.selectedSprite = null;
        this.targetSprite = null;
        
        this.selectedCharacter = null;
        this.startingTile = {
            x: null,
            y: null
        };
        
        this.distanceLeft = null;
        
        this.currentSprite = this.notSelectedSprite;
        
        this.targetArray = [];
        this.targetArrayIndex = 0;
        
        this.spritePath = [];
        this.movedInSprite = 0;
        this.spriteMoving = false;
    }
    
    toggleSprites() {
        this.isSelected = !this.isSelected;
        this.currentSprite.visible = false;
        this.currentSprite = (this.currentSprite === this.selectedSprite)
            ? this.notSelectedSprite
            : this.selectedSprite;
        this.currentSprite.visible = true;
        this.currentSprite.position.set(
            this.position.x * constants.TILESIZE,
            this.position.y * constants.TILESIZE
        );
    }
}

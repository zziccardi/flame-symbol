
import constants from "../constants.js";

export default class Cursor {
    constructor() {
        this.isSelected = false;
        this.position = {x:0, y:0};
        
        this.notSelectedSprite = null;
        this.selectedSprite = null;
        this.targetSprite = null;
        
        this.startingTile = {
            x: null,
            y: null
        };
        
        this.distanceLeft = null;
        
        this.currentSprite = this.notSelectedSprite;
        
        this.targetArray = [];
        this.targetArrayIndex = 0;
        
        this.trailSprites = [];
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
    
    moveCursor(x, y, selectedCharacter) {

        //Move the cursor if the inputted direction does not send it out of the grid
        if(this.position.x + x >= 0 &&
        this.position.x + x <= constants.NUM_TILES-1 &&
        this.position.y + y >= 0 &&
        this.position.y + y <= constants.NUM_TILES-1) {
            
            this.position.x += x;
            this.position.y += y;
            
            this.currentSprite.x += x*constants.TILESIZE
            this.currentSprite.y += y*constants.TILESIZE
        }
        
        //This stuff only gets executed if a character is currently selected
        if(this.isSelected) {
            let pathArray = selectedCharacter.movingSpriteInfo.spritePath;
            
            //If the cursor is moving backwards, remove the most recent move and add increment remaining distance
            if(pathArray[0] &&
            pathArray[pathArray.length-1].x === -x * constants.PIXEL_PER_FRAME &&
            pathArray[pathArray.length-1].y === -y * constants.PIXEL_PER_FRAME) {
                this.distanceLeft++;
                selectedCharacter.movingSpriteInfo.spritePath.pop();
            }
            else {
                this.distanceLeft--;
                selectedCharacter.movingSpriteInfo.spritePath.push({x:x*constants.PIXEL_PER_FRAME, y:y*constants.PIXEL_PER_FRAME});
                //If the player tries to move the cursor too far, reset cursor
                if(this.distanceLeft < 0) {
                    
                    this.distanceLeft++;
                    
                    this.position.x -= x;
                    this.position.y -= y;
                    
                    this.currentSprite.x -= x * constants.TILESIZE;
                    this.currentSprite.y -= y * constants.TILESIZE;
                    
                    pathArray.pop();
                }
            }
        }
    }
    
    moveCursorAttacking(moveLeftRight, player) {
        this.targetArrayIndex += moveLeftRight;
        
        if(this.targetArrayIndex > this.targetArray.length-1) this.targetArrayIndex = 0;
        else if(this.targetArrayIndex < 0) this.targetArrayIndex = this.targetArray.length-1;
        
        this.currentSprite.x  = this.targetArray[this.targetArrayIndex].sprite.position.x;
        this.currentSprite.y  = this.targetArray[this.targetArrayIndex].sprite.position.y;
        this.position.x       = this.targetArray[this.targetArrayIndex].position.x;
        this.position.y       = this.targetArray[this.targetArrayIndex].position.y;
        
        player.selectedCharacter = this.targetArray[this.targetArrayIndex];
        


    }
}

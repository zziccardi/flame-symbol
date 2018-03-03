// Import constants
import constants from "../constants.js";

export default class Player {
    
    constructor(characters, color, playerNumber) {
        this.playerNumber = playerNumber;
        
        //Array of characters the player possesses 
        this.characters = characters;
        
        //The player's color
        this.color = color;
        
        //The character currently selected by the player
        this.selectedCharacter = null;
        
        //Starting positions for Player 1's characters
        this.characterCoordinates1 = [
            {x : 0, y : 0},
            {x : 2, y : 0},
            {x : 1, y : 1},
            {x : 0, y : 2},
            {x : 2, y : 2}
        ]
        
        //Starting positions for Player 2's characters
        this.characterCoordinates2 = [
            {x : constants.NUM_TILES-1, y : constants.NUM_TILES-1},
            {x : constants.NUM_TILES-3, y : constants.NUM_TILES-1},
            {x : constants.NUM_TILES-2, y : constants.NUM_TILES-2},
            {x : constants.NUM_TILES-1, y : constants.NUM_TILES-3},
            {x : constants.NUM_TILES-3, y : constants.NUM_TILES-3}
        ]
        
        //Starting positions for Player 3's characters
        this.characterCoordinates3 = [
            {x : 0, y : constants.NUM_TILES-1},
            {x : 2, y : constants.NUM_TILES-1},
            {x : 1, y : constants.NUM_TILES-2},
            {x : 0, y : constants.NUM_TILES-3},
            {x : 2, y : constants.NUM_TILES-3}
        ]
        
        //Starting positions for Player 4's characters
        this.characterCoordinates4 = [
            {x : 0, y : constants.NUM_TILES-1},
            {x : 2, y : constants.NUM_TILES-1},
            {x : 1, y : constants.NUM_TILES-2},
            {x : 0, y : constants.NUM_TILES-3},
            {x : 2, y : constants.NUM_TILES-3}
        ]
        
    }
}
// Import constants
import constants from "../constants.js";

export default class Player2 {
    
    constructor(characters, color) {
        this.playerNumber = 2;
        this.characters = characters;
        this.color = color;
        
        this.characterCoordinates = [
            {x : constants.NUM_TILES-1, y : constants.NUM_TILES-1},
            {x : constants.NUM_TILES-3, y : constants.NUM_TILES-1},
            {x : constants.NUM_TILES-2, y : constants.NUM_TILES-2},
            {x : constants.NUM_TILES-1, y : constants.NUM_TILES-3},
            {x : constants.NUM_TILES-3, y : constants.NUM_TILES-3}
        ]
    }
}
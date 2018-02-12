// Import constants
import constants from "../constants.js";

export default class Player1 {
    
    constructor(characters, color) {
        this.playerNumber = 1;
        this.characters = characters;
        this.color = color;
        
        this.characterCoordinates = [
            {x : 0, y : 0},
            {x : 2, y : 0},
            {x : 1, y : 1},
            {x : 0, y : 2},
            {x : 2, y : 2}
        ]
    }
}
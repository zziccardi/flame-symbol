
import Character    from "./classes/Character.js";
import Tile         from "./classes/Tile.js";
import Player       from "./classes/Player.js";
import Cursor       from "./classes/Cursor.js";
import HealthBar    from "./classes/HealthBar.js";

import createKey from "./utilities/createKey.js";

import charactersJSON from "./data/characters.json";

import constants from "./constants.js";

// Let C9 know this is included in the HTML
/* global PIXI */

const Application  = PIXI.Application;
const Container    = PIXI.Container;
const loader       = PIXI.loader;
const Sprite       = PIXI.Sprite;
const TextStyle    = PIXI.TextStyle;
const Text         = PIXI.Text;

// Pixi stuff
let app = null;
let gameScene, gameOverScene, state;

//Current turn, the turn progresses by one every time all players have made their moves
let turn = 1;

// Text-related objects and styles
let turnAndMovesMsgStyle, turnMessage, movesMessage;

// The cursor (the colored sprite that shows the user where they are selecting)
let cursor = new Cursor();

// List of all characters across all players, list appended to by reading JSON file
let characters = [];

// Create the players, may allow choosing team and yellow and green options later
let player1 = new Player([], "blue", 1);
let player2 = new Player([], "red", 2);

// Player whose turn it is
let activePlayer = player1;

//2-D array of tiles
let tiles = [];

//List of pressable keys
//Diretional Keys used for moving the cursor
//A used for selecting a character/tile
//S for deselecting a character
let keys = {
    left:  createKey(37),
    up:    createKey(38),
    right: createKey(39),
    down:  createKey(40),
    a:     createKey(65),
    s:     createKey(83)
};

main();

function main() {
    // Create the canvas
    app = new Application({
        width: constants.BOARDSIZE + 400,
        height: constants.BOARDSIZE,
    });
    
    
    //info = new PIXI.DisplayObjectContainer();
    
    document.getElementById("main").appendChild(app.view);
    
    // load the sprite sheet
    loader
        .add("../src/images/sprites/spritesheet.json")
        .load(setup);
    
    // Generate the map tiles
    for (let i = 0; i < constants.NUM_TILES; i++) {
        let row = [];
        
        for (let j = 0; j < constants.NUM_TILES; j++) {
            row.push(new Tile(j, i, 1));
        }
        
        tiles.push(row);
    }
}

function setup() {
    // Make the game scene and add it to the app stage
    gameScene = new Container();
    app.stage.addChild(gameScene);
    
    // Loop through the characters, add them to the overall array and to the individual player arrays
    for (const key of Object.keys(charactersJSON)) {
        let character = new Character(key, 1);
        
        characters.push(character);
        
        player1.characters.push(character);
    }
    
    // TEMP DUPLICATE CODE BELOW
    
    // Loop through the characters, add them to the overall array and to the individual player arrays
    for (const key of Object.keys(charactersJSON)) {
        let character = new Character(key, 2);
        
        characters.push(character);
        
        player2.characters.push(character);
    }
    
    let spritesheet = loader.resources["../src/images/sprites/spritesheet.json"].textures;
    
    loadTerrain();
    loadCharacters();
    
    function loadTerrain() {
        for(let i = 0; i < constants.BOARDSIZE; i += constants.TILESIZE) {
            for(let j = 0; j < constants.BOARDSIZE; j += constants.TILESIZE) {
                let sprite = new Sprite(spritesheet["grass.png"]);
        
                sprite.scale.set(constants.SCALE, constants.SCALE);

                // Set the character on the grid based on their grid position
                sprite.position.set(i, j);
                
                gameScene.addChild(sprite);
            }
        }
    }
    
    function loadCharacters() {
        // Counters when looping through both player arrays
        let player1Counter = 0;
        let player2Counter = 0;
        
        let hpTextStyle = new TextStyle({
            fontFamily: "Futura",
            fontSize: 12,
            fill: "white"
        });
        
        characters.forEach((char) => {
            //Value dependant on which team the character is on
            let counter;
            
            //Check the character's team
            if(char.playerNumber === 1) {
                counter = player1Counter;
            }
            else {
                counter = player2Counter;
            }
            
            // Create the HP bar
            char.healthBar = new HealthBar(gameScene);
            char.healthBar.makeHealthBar(char, counter);
     
            // Set the filename for the character sprite
            let fileName = char.name.toLowerCase();
            
            if (char.playerNumber == 1) {
                fileName += `-${player1.color}.png`;
            }
            else {
                fileName += `-${player2.color}.png`;
            }
            let sprite = new Sprite(spritesheet[fileName]);
            
            // Set the character on the grid based on their grid position from the character JSON
            if(char.playerNumber === 1) {
                sprite.position.set(
                    player1.characterCoordinates1[player1Counter].x * constants.TILESIZE, 
                    player1.characterCoordinates1[player1Counter].y * constants.TILESIZE
                );
                // Update the character's position
                char.position = player1.characterCoordinates1[player1Counter];
                player1Counter++;
            }
            else {
                sprite.position.set(
                    player2.characterCoordinates2[player2Counter].x * constants.TILESIZE, 
                    player2.characterCoordinates2[player2Counter].y * constants.TILESIZE
                );
                // Update the character's position
                char.position = player2.characterCoordinates2[player2Counter];
                player2Counter++;
            }
            
            sprite.scale.set(constants.SCALE, constants.SCALE);
            
            gameScene.addChild(sprite);
            
            char.sprite = sprite;
            
            // Set the tile to be occupied by the rendered character
            tiles[char.position.x][char.position.y].character = char;
        });
        
    }
    
    // Create the 'turn' and 'moves remaining' message styles
    turnAndMovesMsgStyle = new TextStyle({
        fontFamily: "Futura",
        fontSize: 25,
        fill: "white",
    });
    
    turnMessage = new Text("Player 1's turn!", turnAndMovesMsgStyle);
    turnMessage.x = constants.BOARDSIZE + 125;
    turnMessage.y = constants.BOARDSIZE - 175;
    gameScene.addChild(turnMessage);
    
    movesMessage = new Text("Moves remaining:", turnAndMovesMsgStyle);
    movesMessage.x = constants.BOARDSIZE + 110;
    movesMessage.y = constants.BOARDSIZE - 125;
    gameScene.addChild(movesMessage);
    
    // Create the cursor sprite
    cursor.notSelectedSprite = new Sprite(spritesheet["cursor.png"]);
    cursor.notSelectedSprite.scale.set(constants.SCALE, constants.SCALE);
    cursor.notSelectedSprite.visible = false;
    gameScene.addChild(cursor.notSelectedSprite);
    
    // Create the selected cursor sprite
    cursor.selectedSprite = new Sprite(spritesheet["cursor-selected.png"]);
    cursor.selectedSprite.scale.set(constants.SCALE, constants.SCALE);
    cursor.selectedSprite.visible = false;
    gameScene.addChild(cursor.selectedSprite);
    
    // Create the target cursor sprite
    cursor.targetSprite = new Sprite(spritesheet["cursor-target.png"]);
    cursor.targetSprite.scale.set(constants.SCALE, constants.SCALE);
    cursor.targetSprite.visible = false;
    gameScene.addChild(cursor.targetSprite);
    
    // Set the current sprite to the not selected sprite
    cursor.currentSprite = cursor.notSelectedSprite;
    
    // Make the not selected cursor visible
    cursor.notSelectedSprite.visible = true;
    
    // Create the gameOverScene
    gameOverScene = new Container();
    app.stage.addChild(gameOverScene);
    
    // Set gameOverScene to false since game isn't over when the game initially starts
    gameOverScene.visible = false;
    
    // Create the text sprite and add it to the gameOverScene
    let messageStyle = new TextStyle({
        fontFamily: "Futura",
        fontSize: 50,
        fill: "white"
    });
    
    let message;
    if(player1.characters[0]) {
        message = new Text(`${player1.color} team wins`, messageStyle);
    }
    else {
        message = new Text(`${player2.color} team wins`, messageStyle);
    }
    
    message.x = constants.BOARDSIZE / 3;
    message.y = constants.BOARDSIZE / 2;
    gameOverScene.addChild(message);
    
    // Set the game state
    state = play;
    
    // Start the game loop 
    app.ticker.add(delta => gameLoop(delta));
}

function gameLoop(delta) {
    state(delta);
}

function gameOver() {
    gameScene.visible = false;
    gameOverScene.visible = true;
}

function play() {
    
    //Check each character to see if they are currently moving
    for(let i = 0; i < characters.length; i++) {
        if(characters[i].movingSpriteInfo.isMoving) {
            let char = characters[i];
            
            //If no more tiles to move, stop movement
            if(!char.movingSpriteInfo.spritePath[0]) {
                char.movingSpriteInfo.isMoving = false;
            }
            //Move the sprite
            else if(char.movingSpriteInfo.movedInTile !== constants.TILESIZE) {
                //Increment the x or y position
                char.sprite.position.x += char.movingSpriteInfo.spritePath[0].x;
                char.sprite.position.y += char.movingSpriteInfo.spritePath[0].y;
                //Keep track of how far in the tile the sprite has moved
                char.movingSpriteInfo.movedInTile += constants.PIXEL_PER_FRAME;
            }
            //Character is done moving within it's current sprite, remove the first element
            else{
                char.movingSpriteInfo.movedInTile = 0;
                char.movingSpriteInfo.spritePath.splice(0, 1);
                
            }
        }
    }
    
    //SCROLLING HP STUFF CURRENTLY BROKEN
    // let characterToScrollHp;
    // for(let i=0; i < characters.length; i++) {
    //     if(characters[i].hpIsScrolling) {characterToScrollHp = characters[i];}
    //     console.log(characterToScrollHp);
    // }
    // if(characterToScrollHp) {
    //     if(characterToScrollHp.scrollingHP === characterToScrollHp.currentHP) {
    //         characterToScrollHp.hpIsScrolling = false;
    //     }
    //     else {
    //         characterToScrollHp.outerHPBar.width -= constants.PIXEL_PER_HP;
    //         characterToScrollHp.hpText--;
    //         characterToScrollHp.scrollingHP -= constants.PIXEL_PER_HP
    //     }
        
    // }
    
    // If either player runs out of characters, the game is over, so update the state
    if (!player1.characters[0] || !player2.characters[0]) {
        state = gameOver;
        return;
    }
    
    // If all characters have moved for the current active player, it is time to switch turns
    // Reset the characters for the new active player to be able to be moved again
    if(checkIfAllCharsMoved()) {
        // Prepare for this player's next turn
        activePlayer.characters.forEach((char) => {
            char.hasMoved = false;
            char.saturateSprite(PIXI);
        });

        if (activePlayer === player1) {
            activePlayer = player2;
            //turnMessage.text = "Player 2's turn!";
        }
        else{
            activePlayer = player1;
            turn++;
            //turnMessage.text = "Player 1's turn!";
        }
    }
    
    
    // TODO: Set the cursor to the current player's first unit
    
    
}

function changeMovementText() {
    movesMessage.text = "Moves remaining: " + cursor.distanceLeft;
}

// Check each character the active player has
// If all characters have moved for the current player, return true; false otherwise
function checkIfAllCharsMoved() {
    for(let i=0; i < activePlayer.characters.length; i++) {
        if(activePlayer.characters[i].hasMoved === false) {
            return false;
        }
    }
    
    return true;
}

keys.down.press = () => {
    
    //Cursor is targetting enemies, do nothing
    if(cursor.currentSprite === cursor.targetSprite) {
        return;
    }
    
    cursor.moveCursor(0, 1, activePlayer.selectedCharacter);
    changeMovementText();

};

keys.up.press = () => {
    
    //Cursor is targetting enemies, do nothing
    if(cursor.currentSprite === cursor.targetSprite) {
        return;
    }

    cursor.moveCursor(0, -1, activePlayer.selectedCharacter);
    
    changeMovementText();
    
};

//FIXME: Currently switching between multiple targets to attack is broken, need to fix

keys.left.press = () => {
    if(cursor.currentSprite === cursor.targetSprite) {
        // cursor.currentSprite.x  = cursor.targetArray[cursor.targetArrayIndex].sprite.position.x;
        // cursor.currentSprite.y  = cursor.targetArray[cursor.targetArrayIndex].sprite.position.y;
        // cursor.position.x       = cursor.targetArray[cursor.targetArrayIndex].position.x;
        // cursor.position.y       = cursor.targetArray[cursor.targetArrayIndex].position.y;
        
        // activePlayer.selectedCharacter = cursor.targetArray[cursor.targetArrayIndex];
        
        
        // if (cursor.targetArrayIndex === cursor.targetArray.length-1) cursor.targetArrayIndex = 0;
        // else cursor.targetArrayIndex++;
        
        cursor.moveCursorAttacking(-1, activePlayer);
        
        return;
    }
    
    cursor.moveCursor(-1, 0, activePlayer.selectedCharacter);
    changeMovementText();
};

keys.right.press = () => {
    if(cursor.currentSprite === cursor.targetSprite) {
        // cursor.currentSprite.x  = cursor.targetArray[cursor.targetArrayIndex].sprite.position.x;
        // cursor.currentSprite.y  = cursor.targetArray[cursor.targetArrayIndex].sprite.position.y;
        // cursor.position.x       = cursor.targetArray[cursor.targetArrayIndex].position.x;
        // cursor.position.y       = cursor.targetArray[cursor.targetArrayIndex].position.y;
        
        // activePlayer.selectedCharacter = cursor.targetArray[cursor.targetArrayIndex];
        
        
        // if(cursor.targetArrayIndex === cursor.targetArray.length-1) cursor.targetArrayIndex = 0;
        // else cursor.targetArrayIndex++;
        
        cursor.moveCursorAttacking(+1, activePlayer);
        
        return;
    }
    
    cursor.moveCursor(1, 0, activePlayer.selectedCharacter);
    changeMovementText();
};

// TODO : Sometimes the game doesn't let you select any character on the board,
// probably because it thinks a character for a team hasn't moved yet in the turn,
// when in reality the character is dead/just died

keys.a.press = () => {
    // Trying to fix error below...
    if (cursor.position.x > 14 || cursor.position.y > 14) {
        debugger;
    }
    
    // FIXME: This breaks when there are two enemies adjacent to you and you
    // try to attack one of them
    let currentTile = tiles[cursor.position.x][cursor.position.y];
    
    if (!currentTile) {
        console.error("Error setting currentTile", currentTile);
        return;
    }

    // If we're currently targeting an enemy to attack
    if (cursor.currentSprite === cursor.targetSprite) {
        selectEnemyToAttack(currentTile);
    }
    
    // If a was clicked and a character is currently selected
    if (cursor.isSelected) {
        // The player chose not to move, so simply mark their turn as moved
        if ((cursor.startingTile.x === cursor.position.x &&
            cursor.startingTile.y === cursor.position.y)) {
            // Cursor is no longer selecting something
            cursor.toggleSprites();
            currentTile.character.hasMoved = true;
            currentTile.character.desaturateSprite(PIXI);
            movesMessage.text = "Moves remaining:";
        }
        
        // FIXME: Can't access property "character" of null occurs here sometimes
        // Make sure no character exists on this tile, and then place the character
        // on this tile after moving it
        if (!currentTile.character) {
            currentTile.character = activePlayer.selectedCharacter.move(cursor);
            
            currentTile.character.desaturateSprite(PIXI);
            
            // Set the old tile where the character originally came from to empty
            tiles[cursor.startingTile.x][cursor.startingTile.y].character = null;
            
            // Cursor is no longer selecting something
            cursor.toggleSprites();
            
            movesMessage.text = "Moves remaining:";
        }
        
        let status = checkIfCanAttack();
        
        if (status === "switched mode") {
            return;
        }
        
        // If all characters have moved for the current active player, it is time to switch turns
        if(checkIfAllCharsMoved()) {
            // FIXME: Need to make sure that if character dies, the correct player turn message
            // is printed
            if(currentTile.character === null) {
                turnMessage.text = "Player 2's turn!";
            }
            else {
                if(currentTile.character.playerNumber == 1) {
                    turnMessage.text = "Player 2's turn!";
                }
                else {
                    turnMessage.text = "Player 1's turn!";
                }
            }
        }
        
        return;
    }
    
    // If a character is present here and it is on the active player's team and it hasn't previously
    // moved in this turn, select it
    if (currentTile.character &&
        activePlayer.characters.includes(currentTile.character) &&
        !currentTile.character.hasMoved) {
        
        selectCharacter(currentTile);
    }
};

keys.s.press = () => {
    // Reset the sprite path if the player changed their mind
    activePlayer.selectedCharacter.movingSpriteInfo.spritePath = [];
    
    if (cursor.isSelected) {
        cursor.toggleSprites();
    }
    
    //If in target mode, and user decides not to attack, set back to regular gameplay
    if (cursor.currentSprite == cursor.targetSprite) {
        cursor.currentSprite.visible = false;
        cursor.currentSprite = cursor.notSelectedSprite;
        cursor.currentSprite.visible = true;
        cursor.currentSprite.position.set = (
            cursor.position.x * constants.TILESIZE,
            cursor.position.y * constants.TILESIZE
        );
    }
    
    movesMessage.text = "Moves remaining:";
};

// *****************************************************************************

function selectCharacter(currentTile) {
    // Change the cursor sprite from unselected to selected
    cursor.toggleSprites();
    
    // Save the character we just picked up into the cursor
    activePlayer.selectedCharacter = currentTile.character;
    
    // Save the tile from which the character was moved from for future reference
    cursor.startingTile.x = cursor.position.x;
    cursor.startingTile.y = cursor.position.y;
    
    // Set the distance the character can travel
    cursor.distanceLeft = currentTile.character.movement;
    
    movesMessage.text = "Moves remaining: " + cursor.distanceLeft;
}

function selectEnemyToAttack(currentTile) {
    let initiator = activePlayer.selectedCharacter;
    let recipient = tiles[cursor.position.x][cursor.position.y].character;
    
    let status = initiator.attack(recipient);
    
    
    if (status === "recipient dies") {
        let opponentPlayer = (activePlayer === player1)
            ? player2
            : player1;
        
        let recipientIndex = null;
        
        for (let i = 0; i < opponentPlayer.characters.length; i++) {
            if (opponentPlayer.characters[i] === recipient) {
                recipientIndex = i;
                break;
            }
        }
        
        recipient.sprite.destroy();
        
        // Is this necessary too?
        gameScene.removeChild(recipient.sprite);
        
        //No more character within the tile
        tiles[cursor.position.x][cursor.position.y].character = null;
        
        //Remove the character from the player's lineup of characters
        opponentPlayer.characters.splice(recipientIndex, 1);
    }
    else if (status === "initiator dies") {
        let initiatorIndex = null;
        
        for (let i = 0; i < activePlayer.characters.length; i++) {
            if (activePlayer.characters[i] === initiator) {
                initiatorIndex = i;
                break;
            }
        }
        
        initiator.sprite.destroy();
        
        // Is this necessary too?
        gameScene.removeChild(initiator.sprite);
        
        tiles[initiator.position.x][initiator.position.y] = null;
        
        activePlayer.characters.splice(initiatorIndex, 1);
    }
    
    cursor.currentSprite.visible = false;
    cursor.currentSprite = cursor.notSelectedSprite;
    cursor.currentSprite.visible = true;
    cursor.currentSprite.position.set(
        cursor.position.x * constants.TILESIZE,
        cursor.position.y * constants.TILESIZE
    );
    
    // FIXME: Need to make sure that if character dies, the correct player turn message
    // is printed
    // if(currentTile.character === null) {
    //     turnMessage.text = "Player 2's turn!"
    // }
    
    // If all characters have moved for the current active player, it is time to switch turns
    if(checkIfAllCharsMoved()) {
        // FIXME: Need to make sure that if character dies, the correct player turn message
        // is printed
        if(currentTile.character === null) {
            turnMessage.text = "Player 2's turn!";
        }
        else {
            if(currentTile.character.playerNumber == 1) {
                turnMessage.text = "Player 2's turn!";
            }
            else {
                turnMessage.text = "Player 1's turn!";
            }
        }
    }
}

function checkIfCanAttack() {
    
    //Update the list of tiles the character can interact with
    activePlayer.selectedCharacter.updateInteractableTiles();
    
    let adjacentEnemies = [];
    
    cursor.targetArray = [];
    cursor.targetArrayIndex = 0;
    
    //Loop through each tile, check if anything is in the tile
    activePlayer.selectedCharacter.interactableTiles.forEach((tile) => {
        let characterInTile = tiles[tile.x][tile.y].character;
        if(characterInTile && characterInTile.playerNumber !== activePlayer.playerNumber) {
            adjacentEnemies.push(characterInTile);
            cursor.targetArray.push(characterInTile);
        }
    })
    
    // At least one enemy found, switch to target mode
    if (adjacentEnemies[0]) {
        cursor.currentSprite.visible = false;
        cursor.currentSprite = cursor.targetSprite;
        cursor.currentSprite.visible = true;
        cursor.currentSprite.position.set(
            adjacentEnemies[0].position.x * constants.TILESIZE,
            adjacentEnemies[0].position.y * constants.TILESIZE
        );
        cursor.position.x = adjacentEnemies[0].position.x;
        cursor.position.y = adjacentEnemies[0].position.y;
        
        return "switched mode";
    }
}

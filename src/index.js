// Import classes
import Character from "./classes/Character.js";
import Tile      from "./classes/Tile.js";
import Player1   from "./classes/Player1.js";
import Player2   from "./classes/Player2.js";
import Cursor    from "./classes/Cursor.js";

// Import JSON
import charactersJSON from "./data/characters.json";

// Import constants
import constants from "./constants.js";

const Application  = PIXI.Application;
const Container    = PIXI.Container;
const loader       = PIXI.loader;
const Sprite       = PIXI.Sprite;
const TextStyle    = PIXI.TextStyle;
const Text         = PIXI.Text;

// Pixi stuff
let app = null;
let gameScene, gameOverScene, state;

//Current Turn
var turn = 1;

//Text-related objects and styles
let turnAndMovesMsgStyle, turnMessage, movesMessage;

let cursor = new Cursor();

// List of characters, list appended to by reading JSON file
let characters = [];

// Create the players, may allow choosing team and yellow and green options later
let player1 = new Player1([], "blue");
let player2 = new Player2([], "red");

// Player whose turn it is
let activePlayer = player1;

let tiles = [];

let leftKey  = createKey(37);
let upKey    = createKey(38);
let rightKey = createKey(39);
let downKey  = createKey(40);
let aKey     = createKey(65);
let sKey     = createKey(83);

main();

function main() {
    // Create the canvas
    app = new Application({
        width: constants.BOARDSIZE + 400,
        height: constants.BOARDSIZE + 200,
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
        
        characters.forEach((char) => {
            let messageStyle = new TextStyle({
                fontFamily: "Futura",
                fontSize: 12,
                fill: "white"
            });
            
            //Values dependant on which team the character is on
            var code;
            var spacing;
            var counter;
            
            //Check the character's team
            if(player1.characters.includes(char)) {
                code = 0x0000ff
                spacing = 50;
                counter = player1Counter;
            }
            else {
                code = 0xFF3300
                spacing = 200;
                counter = player2Counter;
            }
            
            let characterName = new Text(char.name, messageStyle);
            characterName.x = constants.BOARDSIZE+spacing
            characterName.y = (counter*40)+10;
            gameScene.addChild(characterName);
            
            //Create the HP bar
            let healthBar = new PIXI.DisplayObjectContainer();
            healthBar.position.set(constants.BOARDSIZE+spacing, (counter*40)+25)
            gameScene.addChild(healthBar);

            //Create the black background rectangle
            let innerBar = new PIXI.Graphics();
            innerBar.beginFill(0x000000);
            innerBar.drawRect(0, 0, char.currentHP*3, 15);
            innerBar.endFill();
            healthBar.addChild(innerBar);
    
            //Create the front red rectangle
            let outerBar = new PIXI.Graphics();
            outerBar.beginFill(code);
            outerBar.drawRect(0, 0, char.currentHP*3, 15);
            outerBar.endFill();
            healthBar.addChild(outerBar);
    
            healthBar.outer = outerBar;
            
            //Save the HP bar for later alteration
            char.outerHPBar = healthBar.outer;
            
            let characterHP = new Text(`${char.currentHP} / ${char.stats.hp}`, messageStyle);
            characterHP.x = constants.BOARDSIZE+spacing
            characterHP.y = (counter*40)+25;
            gameScene.addChild(characterHP);
            
            char.hpText = characterHP;
            
            // Set the filename
            let fileName = char.name.toLowerCase();
            
            if (char.playerNumber == 1) {
                fileName += `-${player1.color}.png`;
            }
            else {
                fileName += `-${player2.color}.png`;
            }
            let sprite = new Sprite(spritesheet[fileName]);
            
            // Set the character on the grid based on their grid position from the character JSON
            if(player1.characters.includes(char)) {
                sprite.position.set(
                    player1.characterCoordinates[player1Counter].x * constants.TILESIZE, 
                    player1.characterCoordinates[player1Counter].y * constants.TILESIZE
                );
                // Update the character's position
                char.position = player1.characterCoordinates[player1Counter];
                player1Counter++;
            }
            else {
                sprite.position.set(
                    player2.characterCoordinates[player2Counter].x * constants.TILESIZE, 
                    player2.characterCoordinates[player2Counter].y * constants.TILESIZE
                );
                // Update the character's position
                char.position = player2.characterCoordinates[player2Counter];
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
    turnMessage.y = constants.BOARDSIZE - 225;
    gameScene.addChild(turnMessage);
    
    movesMessage = new Text("Moves remaining:", turnAndMovesMsgStyle);
    movesMessage.x = constants.BOARDSIZE + 110;
    movesMessage.y = constants.BOARDSIZE - 175;
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
    
    // Set gameOverScene to false since game isn't over when the game initially
    // starts
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
    // If either player runs out of characters, the game is over, so update the state
    if (!player1.characters[0] || !player2.characters[0]) {
        state = gameOver;
        return;
    }
    
    // Check each character the active player has
    // If all characters have moved, it is time to switch turns
    let allCharactersMoved = true;
    
    for(let i=0; i < activePlayer.characters.length; i++) {
        if(activePlayer.characters[i].hasMoved === false) {
            allCharactersMoved = false;
            break;
        }
    }
    
    // All characters for the active player have moved, so switch characters and
    // reset the characters for the new active player to be able to be moved again
    if(allCharactersMoved) {
        // Prepare for this player's next turn
        activePlayer.characters.forEach((char) => {
            char.hasMoved = false;
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
        //alert(`It is ${activePlayer.color} team's turn`)
    }
    
    
    // TODO: Set the cursor to the current player's first unit
    
    
}

downKey.press = () => {
    if(cursor.currentSprite === cursor.targetSprite) {
        return;
    }
    
    if (cursor.position.y < constants.NUM_TILES-1 && (cursor.distanceLeft > 0 || cursor.isSelected == false)) {
        cursor.currentSprite.y   += constants.TILESIZE;
        cursor.position.y        += 1;
        cursor.distanceLeft--;
    }
    
    if (cursor.isSelected) movesMessage.text = "Moves remaining: " + cursor.distanceLeft;
};

upKey.press = () => {
    if(cursor.currentSprite === cursor.targetSprite) {
        return;
    }
    
    if (cursor.position.y > 0 && (cursor.distanceLeft > 0 || cursor.isSelected == false)) {
        cursor.currentSprite.y   -= constants.TILESIZE;
        cursor.position.y        -= 1;
        cursor.distanceLeft--;
        
        //movesMessage.text = "Moves remaining: " + cursor.distanceLeft;
    }
    
    if(cursor.isSelected) movesMessage.text = "Moves remaining: " + cursor.distanceLeft;
}

leftKey.press = () => {
    if(cursor.position.x > 0 && cursor.currentSprite === cursor.targetSprite) {
        cursor.currentSprite.x  = cursor.targetArray[cursor.targetArrayIndex].position.x;
        cursor.currentSprite.y  = cursor.targetArray[cursor.targetArrayIndex].position.y;
        cursor.position.x       = cursor.targetArray[cursor.targetArrayIndex].position.x;
        cursor.position.y       = cursor.targetArray[cursor.targetArrayIndex].position.y;
        
        if(cursor.targetArrayIndex === cursor.targetArray.length-1) cursor.targetArrayIndex = 0;
        else cursor.targetArrayIndex++;
        
        //cursor.selectedCharacter = cursor.targetArray[cursor.targetArrayIndex];
        
        return;
    }
    
    if (cursor.position.x > 0 && (cursor.distanceLeft > 0 || cursor.isSelected == false)) {
        cursor.currentSprite.x  -= constants.TILESIZE;
        cursor.position.x       -= 1;
        cursor.distanceLeft--;
        
        //movesMessage.text = "Moves remaining: " + cursor.distanceLeft;
    }
    
    if(cursor.isSelected) movesMessage.text = "Moves remaining: " + cursor.distanceLeft;
};

rightKey.press = () => {
    if(cursor.position.x < constants.NUM_TILES-1 && cursor.currentSprite === cursor.targetSprite) {
        cursor.currentSprite.x  = cursor.targetArray[cursor.targetArrayIndex].position.x;
        cursor.currentSprite.y  = cursor.targetArray[cursor.targetArrayIndex].position.y;
        cursor.position.x       = cursor.targetArray[cursor.targetArrayIndex].position.x;
        cursor.position.y       = cursor.targetArray[cursor.targetArrayIndex].position.y;
        
        if(cursor.targetArrayIndex === cursor.targetArray.length-1) cursor.targetArrayIndex = 0;
        else cursor.targetArrayIndex++;
        
        //cursor.selectedCharacter = cursor.targetArray[cursor.targetArrayIndex];
        
        return;
    }
    
    if (cursor.position.x < constants.NUM_TILES-1 && (cursor.distanceLeft > 0 || cursor.isSelected == false)) {
        cursor.currentSprite.x   += constants.TILESIZE;
        cursor.position.x        += 1;
        cursor.distanceLeft--;
        
        //movesMessage.text = "Moves remaining: " + cursor.distanceLeft;
    }
    
    if(cursor.isSelected) movesMessage.text = "Moves remaining: " + cursor.distanceLeft;
};

aKey.press = () => {
    //console.log(activePlayer.characters);
    
    // FIXME: This bugs out because it can sometimes be undefined
    let currentTile = tiles[cursor.position.x][cursor.position.y];

    // If we're currently targeting an enemy to attack
    if (cursor.currentSprite === cursor.targetSprite) {
        let initiator = cursor.selectedCharacter;
        let recipient = tiles[cursor.position.x][cursor.position.y].character;
        
        let status = initiator.attack(recipient);
        
        //console.log("Recipient HP: " + recipient.currentHP);
        //console.log("Initiator HP: " + initiator.currentHP);
        
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
            
            // TODO: Remove healthbar
            
            recipient.sprite.destroy();
            
            // Is this necessary too?
            gameScene.removeChild(recipient.sprite);
            
            tiles[cursor.position.x][cursor.position.y].character = null;
            
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
            
            // TODO: Remove healthbar
            
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
        
        // // TODO :: FIX ME!!! Need to make sure that if character dies, the correct player turn message
        // // is printed
        // if(currentTile.character === null) {
        //     turnMessage.text = "Player 2's turn!"
        // }
        // else {
        //     if(currentTile.character.playerNumber == 2) {
        //         turnMessage.text = "Player 2's turn!"
        //     }
        //     else {
        //         turnMessage.text = "Player 1's turn!"
        //     }
        // }
        
        // *********************************************************************
        // Check each character the active player has
        // If all characters have moved, it is time to switch turns
        let allCharactersMoved = true;
        
        for(let i=0; i < activePlayer.characters.length; i++) {
            if(activePlayer.characters[i].hasMoved === false) {
                allCharactersMoved = false;
                break;
            }
        }
        
        if(allCharactersMoved) {
            // TODO :: FIX ME!!! Need to make sure that if character dies, the correct player turn message
            // is printed
            if(currentTile.character === null) {
                turnMessage.text = "Player 2's turn!"
            }
            else {
                if(currentTile.character.playerNumber == 1) {
                    turnMessage.text = "Player 2's turn!"
                }
                else {
                    turnMessage.text = "Player 1's turn!"
                }
            }
        }
    }
    
    // The current cursor is in select mode
    if (cursor.isSelected) {
        // The player chose not to move, so simply mark their turn as moved
        if ((cursor.startingTile.x === cursor.position.x &&
            cursor.startingTile.y === cursor.position.y)) {
            // Cursor is no longer selecting something
            cursor.toggleSprites();
            currentTile.character.hasMoved = true;
        }
        
        // Make sure they don't try to move their character onto the same spot as another
        // character
        if(!tiles[cursor.position.x][cursor.position.y].character) {
            
            // Make sure no character exists on this tile, and then place the character
            // on this tile after moving it
            if(!currentTile.character) {
                currentTile.character = cursor.selectedCharacter.move(cursor);
                
                // Set the old tile where the character originally came from to empty
                tiles[cursor.startingTile.x][cursor.startingTile.y].character = null;
                
                // Cursor is no longer selecting something
                cursor.toggleSprites();
                
                movesMessage.text = "Moves remaining:";
            }
        }
        
        // Check if player is adjacent to any opponents
        let adjacentEnemies = [];
        cursor.targetArray = [];
        cursor.targetArrayIndex = 0;
        
        //debugger;
        
        // First check if character exists in above tile (but not if we're in the top row)
        // If character exists, make sure it is an enemy character
        if (cursor.selectedCharacter.position.y !== 0) {
            let characterInTileAbove = tiles[cursor.position.x][cursor.position.y-1].character;
            
            if (characterInTileAbove &&
                (characterInTileAbove.playerNumber !== activePlayer.playerNumber)) {
                adjacentEnemies.push(characterInTileAbove);
                cursor.targetArray.push(characterInTileAbove.sprite);
            }
        }
        
        if (cursor.selectedCharacter.position.y !== constants.NUM_TILES-1) {
            let characterInTileBelow = tiles[cursor.position.x][cursor.position.y+1].character;
            
            if (characterInTileBelow &&
                (characterInTileBelow.playerNumber !== activePlayer.playerNumber)) {
                adjacentEnemies.push(characterInTileBelow);
                cursor.targetArray.push(characterInTileBelow.sprite);
            }
        }
        
        if (cursor.selectedCharacter.position.x !== constants.NUM_TILES-1) {
            let characterInTileRight = tiles[cursor.position.x+1][cursor.position.y].character;
            
            if (characterInTileRight &&
                (characterInTileRight.playerNumber !== activePlayer.playerNumber)) {
                adjacentEnemies.push(characterInTileRight);
                cursor.targetArray.push(characterInTileRight.sprite);
            }  
        }
        
        if (cursor.selectedCharacter.position.x !== 0) {
            let characterInTileLeft = tiles[cursor.position.x-1][cursor.position.y].character;
            
            if (characterInTileLeft &&
                (characterInTileLeft.playerNumber !== activePlayer.playerNumber)) {
                adjacentEnemies.push(characterInTileLeft);
                cursor.targetArray.push(characterInTileLeft.sprite);
            }
        }
        
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
            
            return;
        }
        
        // if(currentTile.character.playerNumber == 1) {
        //     turnMessage.text = "Player 2's turn!"
        // }
        // else {
        //     turnMessage.text = "Player 1's turn!"
        // }
        
        // *********************************************************************
        // Check each character the active player has
        // If all characters have moved, it is time to switch turns
        let allCharactersMoved = true;
        
        for(let i=0; i < activePlayer.characters.length; i++) {
            if(activePlayer.characters[i].hasMoved === false) {
                allCharactersMoved = false;
                break;
            }
        }
        
        if(allCharactersMoved) {
            // TODO :: FIX ME!!! Need to make sure that if character dies, the correct player turn message
            // is printed
            if(currentTile.character === null) {
                turnMessage.text = "Player 2's turn!"
            }
            else {
                if(currentTile.character.playerNumber == 1) {
                    turnMessage.text = "Player 2's turn!"
                }
                else {
                    turnMessage.text = "Player 1's turn!"
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
        
        // Change the cursor sprite from unselected to selected
        cursor.toggleSprites();
        
        // Save the character we just picked up into the cursor
        cursor.selectedCharacter = currentTile.character;
        
        // Save the tile from which the character was moved from for future reference
        cursor.startingTile.x = cursor.position.x;
        cursor.startingTile.y = cursor.position.y;
        
        // Set the distance the character can travel
        cursor.distanceLeft = currentTile.character.movement;
        
        movesMessage.text = "Moves remaining: " + cursor.distanceLeft;
    }
};

sKey.press = () => {
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

// From https://github.com/kittykatattack/learningPixi#keyboard
function createKey(keyCode) {
    let key = {};
    key.code = keyCode;
    key.isDown = false;
    key.isUp = true;
    key.press = null;
    key.release = null;
    
    // The `downHandler`
    key.downHandler = event => {
        if (event.keyCode === key.code) {
            if (key.isUp && key.press) key.press();
            key.isDown = true;
            key.isUp = false;
        }
        event.preventDefault();
    };

    // The `upHandler`
    key.upHandler = event => {
        if (event.keyCode === key.code) {
            if (key.isDown && key.release) key.release();
            key.isDown = false;
            key.isUp = true;
        }
        event.preventDefault();
    };

    // Attach event listeners
    window.addEventListener("keydown", key.downHandler.bind(key), false);
    window.addEventListener("keyup", key.upHandler.bind(key), false);
    
    return key;
}

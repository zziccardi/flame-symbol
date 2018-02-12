/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 2);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";

// Currently, the game is a 15x15 board, each tile is 48x48 pixels, and the board is 720x720 pixels
const constants = {
    BOARDSIZE: 576,
    TILESIZE: 48,
    SCALE: 1.5,
    NUM_TILES: 12
};

/* harmony default export */ __webpack_exports__["a"] = (constants);


/***/ }),
/* 1 */
/***/ (function(module, exports) {

module.exports = {"Lyn":{"weapon-type":"sword","movement-type":"infantry","stats":{"hp":37,"attack":28,"speed":37,"defense":26,"resistance":29},"weapon":"Sol Katti"},"Marth":{"weapon-type":"sword","movement-type":"infantry","stats":{"hp":41,"attack":31,"speed":34,"defense":29,"resistance":23},"weapon":"Falchion"},"Frederick":{"weapon-type":"axe","movement-type":"cavalry","stats":{"hp":43,"attack":35,"speed":25,"defense":36,"resistance":14},"weapon":"Steel Axe"},"Hinoka":{"weapon-type":"lance","movement-type":"flier","stats":{"hp":41,"attack":35,"speed":32,"defense":25,"resistance":24},"weapon":"Hinoka's Spear"}}

/***/ }),
/* 2 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__classes_Character_js__ = __webpack_require__(3);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__classes_Tile_js__ = __webpack_require__(6);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__classes_Player1_js__ = __webpack_require__(7);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__classes_Player2_js__ = __webpack_require__(8);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__classes_Cursor_js__ = __webpack_require__(9);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5__data_characters_json__ = __webpack_require__(1);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5__data_characters_json___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_5__data_characters_json__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_6__constants_js__ = __webpack_require__(0);
// Import classes






// Import JSON


// Import constants


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

let cursor = new __WEBPACK_IMPORTED_MODULE_4__classes_Cursor_js__["a" /* default */]();

// List of characters, list appended to by reading JSON file
let characters = [];

// Create the players, may allow choosing team and yellow and green options later
let player1 = new __WEBPACK_IMPORTED_MODULE_2__classes_Player1_js__["a" /* default */]([], "blue");
let player2 = new __WEBPACK_IMPORTED_MODULE_3__classes_Player2_js__["a" /* default */]([], "red");

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
        width: __WEBPACK_IMPORTED_MODULE_6__constants_js__["a" /* default */].BOARDSIZE + 400,
        height: __WEBPACK_IMPORTED_MODULE_6__constants_js__["a" /* default */].BOARDSIZE + 200,
    });
    
    
    //info = new PIXI.DisplayObjectContainer();
    
    document.getElementById("main").appendChild(app.view);
    
    // load the sprite sheet
    loader
        .add("../src/images/sprites/spritesheet.json")
        .load(setup);
    
    // Generate the map tiles
    for (let i = 0; i < __WEBPACK_IMPORTED_MODULE_6__constants_js__["a" /* default */].NUM_TILES; i++) {
        let row = [];
        
        for (let j = 0; j < __WEBPACK_IMPORTED_MODULE_6__constants_js__["a" /* default */].NUM_TILES; j++) {
            row.push(new __WEBPACK_IMPORTED_MODULE_1__classes_Tile_js__["a" /* default */](j, i, 1));
        }
        
        tiles.push(row);
    }
}

function setup() {
    // Make the game scene and add it to the app stage
    gameScene = new Container();
    app.stage.addChild(gameScene);
    
    // Loop through the characters, add them to the overall array and to the individual player arrays
    for (const key of Object.keys(__WEBPACK_IMPORTED_MODULE_5__data_characters_json___default.a)) {
        let character = new __WEBPACK_IMPORTED_MODULE_0__classes_Character_js__["a" /* default */](key, 1);
        
        characters.push(character);
        
        player1.characters.push(character);
    }
    
    // TEMP DUPLICATE CODE BELOW
    
    // Loop through the characters, add them to the overall array and to the individual player arrays
    for (const key of Object.keys(__WEBPACK_IMPORTED_MODULE_5__data_characters_json___default.a)) {
        let character = new __WEBPACK_IMPORTED_MODULE_0__classes_Character_js__["a" /* default */](key, 2);
        
        characters.push(character);
        
        player2.characters.push(character);
    }
    
    let spritesheet = loader.resources["../src/images/sprites/spritesheet.json"].textures;
    
    loadTerrain();
    loadCharacters();
    
    function loadTerrain() {
        for(let i = 0; i < __WEBPACK_IMPORTED_MODULE_6__constants_js__["a" /* default */].BOARDSIZE; i += __WEBPACK_IMPORTED_MODULE_6__constants_js__["a" /* default */].TILESIZE) {
            for(let j = 0; j < __WEBPACK_IMPORTED_MODULE_6__constants_js__["a" /* default */].BOARDSIZE; j += __WEBPACK_IMPORTED_MODULE_6__constants_js__["a" /* default */].TILESIZE) {
                let sprite = new Sprite(spritesheet["grass.png"]);
        
                sprite.scale.set(__WEBPACK_IMPORTED_MODULE_6__constants_js__["a" /* default */].SCALE, __WEBPACK_IMPORTED_MODULE_6__constants_js__["a" /* default */].SCALE);

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
            characterName.x = __WEBPACK_IMPORTED_MODULE_6__constants_js__["a" /* default */].BOARDSIZE+spacing
            characterName.y = (counter*40)+10;
            gameScene.addChild(characterName);
            
            //Create the HP bar
            let healthBar = new PIXI.DisplayObjectContainer();
            healthBar.position.set(__WEBPACK_IMPORTED_MODULE_6__constants_js__["a" /* default */].BOARDSIZE+spacing, (counter*40)+25)
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
            characterHP.x = __WEBPACK_IMPORTED_MODULE_6__constants_js__["a" /* default */].BOARDSIZE+spacing
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
                    player1.characterCoordinates[player1Counter].x * __WEBPACK_IMPORTED_MODULE_6__constants_js__["a" /* default */].TILESIZE, 
                    player1.characterCoordinates[player1Counter].y * __WEBPACK_IMPORTED_MODULE_6__constants_js__["a" /* default */].TILESIZE
                );
                // Update the character's position
                char.position = player1.characterCoordinates[player1Counter];
                player1Counter++;
            }
            else {
                sprite.position.set(
                    player2.characterCoordinates[player2Counter].x * __WEBPACK_IMPORTED_MODULE_6__constants_js__["a" /* default */].TILESIZE, 
                    player2.characterCoordinates[player2Counter].y * __WEBPACK_IMPORTED_MODULE_6__constants_js__["a" /* default */].TILESIZE
                );
                // Update the character's position
                char.position = player2.characterCoordinates[player2Counter];
                player2Counter++;
            }
            
            sprite.scale.set(__WEBPACK_IMPORTED_MODULE_6__constants_js__["a" /* default */].SCALE, __WEBPACK_IMPORTED_MODULE_6__constants_js__["a" /* default */].SCALE);
            
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
    turnMessage.x = __WEBPACK_IMPORTED_MODULE_6__constants_js__["a" /* default */].BOARDSIZE + 125;
    turnMessage.y = __WEBPACK_IMPORTED_MODULE_6__constants_js__["a" /* default */].BOARDSIZE - 225;
    gameScene.addChild(turnMessage);
    
    movesMessage = new Text("Moves remaining:", turnAndMovesMsgStyle);
    movesMessage.x = __WEBPACK_IMPORTED_MODULE_6__constants_js__["a" /* default */].BOARDSIZE + 110;
    movesMessage.y = __WEBPACK_IMPORTED_MODULE_6__constants_js__["a" /* default */].BOARDSIZE - 175;
    gameScene.addChild(movesMessage);
    
    // Create the cursor sprite
    cursor.notSelectedSprite = new Sprite(spritesheet["cursor.png"]);
    cursor.notSelectedSprite.scale.set(__WEBPACK_IMPORTED_MODULE_6__constants_js__["a" /* default */].SCALE, __WEBPACK_IMPORTED_MODULE_6__constants_js__["a" /* default */].SCALE);
    cursor.notSelectedSprite.visible = false;
    gameScene.addChild(cursor.notSelectedSprite);
    
    // Create the selected cursor sprite
    cursor.selectedSprite = new Sprite(spritesheet["cursor-selected.png"]);
    cursor.selectedSprite.scale.set(__WEBPACK_IMPORTED_MODULE_6__constants_js__["a" /* default */].SCALE, __WEBPACK_IMPORTED_MODULE_6__constants_js__["a" /* default */].SCALE);
    cursor.selectedSprite.visible = false;
    gameScene.addChild(cursor.selectedSprite);
    
    // Create the target cursor sprite
    cursor.targetSprite = new Sprite(spritesheet["cursor-target.png"]);
    cursor.targetSprite.scale.set(__WEBPACK_IMPORTED_MODULE_6__constants_js__["a" /* default */].SCALE, __WEBPACK_IMPORTED_MODULE_6__constants_js__["a" /* default */].SCALE);
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
    
    message.x = __WEBPACK_IMPORTED_MODULE_6__constants_js__["a" /* default */].BOARDSIZE / 3;
    message.y = __WEBPACK_IMPORTED_MODULE_6__constants_js__["a" /* default */].BOARDSIZE / 2;
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
    
    if (cursor.position.y < __WEBPACK_IMPORTED_MODULE_6__constants_js__["a" /* default */].NUM_TILES-1 && (cursor.distanceLeft > 0 || cursor.isSelected == false)) {
        cursor.currentSprite.y   += __WEBPACK_IMPORTED_MODULE_6__constants_js__["a" /* default */].TILESIZE;
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
        cursor.currentSprite.y   -= __WEBPACK_IMPORTED_MODULE_6__constants_js__["a" /* default */].TILESIZE;
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
        cursor.currentSprite.x  -= __WEBPACK_IMPORTED_MODULE_6__constants_js__["a" /* default */].TILESIZE;
        cursor.position.x       -= 1;
        cursor.distanceLeft--;
        
        //movesMessage.text = "Moves remaining: " + cursor.distanceLeft;
    }
    
    if(cursor.isSelected) movesMessage.text = "Moves remaining: " + cursor.distanceLeft;
};

rightKey.press = () => {
    if(cursor.position.x < __WEBPACK_IMPORTED_MODULE_6__constants_js__["a" /* default */].NUM_TILES-1 && cursor.currentSprite === cursor.targetSprite) {
        cursor.currentSprite.x  = cursor.targetArray[cursor.targetArrayIndex].position.x;
        cursor.currentSprite.y  = cursor.targetArray[cursor.targetArrayIndex].position.y;
        cursor.position.x       = cursor.targetArray[cursor.targetArrayIndex].position.x;
        cursor.position.y       = cursor.targetArray[cursor.targetArrayIndex].position.y;
        
        if(cursor.targetArrayIndex === cursor.targetArray.length-1) cursor.targetArrayIndex = 0;
        else cursor.targetArrayIndex++;
        
        //cursor.selectedCharacter = cursor.targetArray[cursor.targetArrayIndex];
        
        return;
    }
    
    if (cursor.position.x < __WEBPACK_IMPORTED_MODULE_6__constants_js__["a" /* default */].NUM_TILES-1 && (cursor.distanceLeft > 0 || cursor.isSelected == false)) {
        cursor.currentSprite.x   += __WEBPACK_IMPORTED_MODULE_6__constants_js__["a" /* default */].TILESIZE;
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
            
            recipient.sprite.destroy();
            
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
            
            initiator.sprite.destroy();
            
            gameScene.removeChild(initiator.sprite);
            
            tiles[initiator.position.x][initiator.position.y] = null;
            
            activePlayer.characters.splice(initiatorIndex, 1);
        }
        
        cursor.currentSprite.visible = false;
        cursor.currentSprite = cursor.notSelectedSprite;
        cursor.currentSprite.visible = true;
        cursor.currentSprite.position.set(
            cursor.position.x * __WEBPACK_IMPORTED_MODULE_6__constants_js__["a" /* default */].TILESIZE,
            cursor.position.y * __WEBPACK_IMPORTED_MODULE_6__constants_js__["a" /* default */].TILESIZE
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
        
        if (cursor.selectedCharacter.position.y !== __WEBPACK_IMPORTED_MODULE_6__constants_js__["a" /* default */].NUM_TILES-1) {
            let characterInTileBelow = tiles[cursor.position.x][cursor.position.y+1].character;
            
            if (characterInTileBelow &&
                (characterInTileBelow.playerNumber !== activePlayer.playerNumber)) {
                adjacentEnemies.push(characterInTileBelow);
                cursor.targetArray.push(characterInTileBelow.sprite);
            }
        }
        
        if (cursor.selectedCharacter.position.x !== __WEBPACK_IMPORTED_MODULE_6__constants_js__["a" /* default */].NUM_TILES-1) {
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
                adjacentEnemies[0].position.x * __WEBPACK_IMPORTED_MODULE_6__constants_js__["a" /* default */].TILESIZE,
                adjacentEnemies[0].position.y * __WEBPACK_IMPORTED_MODULE_6__constants_js__["a" /* default */].TILESIZE
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
            cursor.position.x * __WEBPACK_IMPORTED_MODULE_6__constants_js__["a" /* default */].TILESIZE,
            cursor.position.y * __WEBPACK_IMPORTED_MODULE_6__constants_js__["a" /* default */].TILESIZE
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


/***/ }),
/* 3 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__classes_Weapon_js__ = __webpack_require__(4);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__data_characters_json__ = __webpack_require__(1);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__data_characters_json___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_1__data_characters_json__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__constants_js__ = __webpack_require__(0);







class Character {
    
    /**
     * Create a Character by reading its data from the JSON file
     * @param {String} name - the name of the character this object will represent
     */
    constructor(name, team) {        
        let data = __WEBPACK_IMPORTED_MODULE_1__data_characters_json___default.a[name];
        
        this.name             = name;
        this.weaponType       = data["weapon-type"];
        this.movementType     = data["movement-type"];
        this.stats            = data.stats;
        this.weapon           = new __WEBPACK_IMPORTED_MODULE_0__classes_Weapon_js__["a" /* default */](data.weapon, this.weaponType);
        this.playerNumber     = team;
        this.currentHP        = this.stats.hp;
        this.hasMoved         = false;
        this.position = {
            x: null,
            y: null
        };
        this.movement = 0;
        this.sprite   = null;
        
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
        
        this.outerHPBar = null;
        this.hpText = null;
    }
    
    /**
     * Move the character to a new tile
     * @param {Cursor} cursor - the cursor instance (indicates the destination)
     * @return this - a reference to this character, to be added to the destination tile
     */
    move(cursor) {
        // Move the character based on where the cursor currently is
        this.sprite.position.set(
            cursor.position.x * __WEBPACK_IMPORTED_MODULE_2__constants_js__["a" /* default */].TILESIZE,
            cursor.position.y * __WEBPACK_IMPORTED_MODULE_2__constants_js__["a" /* default */].TILESIZE
        );
        
        this.hasMoved = true;
        this.position.x = cursor.position.x;
        this.position.y = cursor.position.y;
        
        // Update the destination tile to include the character that just moved there
        return this;
    }
    
    /**
     * Attack a character on the opponent's team
     * @param {Character} recipient - the other player's unit who is being attacked
     */
    attack(recipient) {
        // 1. Initiate on opponent
        let status = this.doAttackCalculations(this, recipient);
        
        // The recipient dies, so end combat
        if (status === "recipient dies") {
            return status;
        }
        
        // 2. Opponent counterattacks
        status = this.doAttackCalculations(recipient, this);
        
        // The initiator was killed on the recipient's counterattack, so end combat
        if (status === "recipient dies") {
            return "initiator dies";
        }
        
        // 3. If the initiator is significantly faster than the recipient, the
        // former does a follow-up attack
        if (this.stats.speed - recipient.stats.speed >= 5) {
            return this.doAttackCalculations(this, recipient);
        }
    }
    
    /**
     * Determine the damage to be dealt and subtract it from the opponent's HP
     * @param {Character} initiator - the character that initiates the attack
     * @param {Character} recipient - the character that receives the attack
     * @private
     */
    doAttackCalculations(initiator, recipient) {
        // Add the weapon's might to this character's attack
        let attackStrength = initiator.stats.attack + initiator.weapon.might;
        
        console.log("Attack strength: " + attackStrength);
        
        attackStrength = Math.floor(attackStrength * this.getEffectivenessMultiplier(recipient));
        
        console.log("Attack strength with multiplier: " + attackStrength);
        
        // TODO: Handle magic attacks
        
        // Subtract the opponent's defense from the damage to determine how much
        // to lower the opponent's HP
        let damage = attackStrength - recipient.stats.defense;
        
        console.log("Damage to subtract from HP: " + damage);
        
        // The recipient's defense is high enough that no damage is dealt
        if (damage <= 0) {
            return;
        }
        
        recipient.currentHP -= damage;
        
        //Decrease health bar
        recipient.outerHPBar.width = recipient.currentHP * 3;
        recipient.hpText.text = `${recipient.currentHP} / ${recipient.stats.hp}`
        
        console.log("Recipient HP: " + recipient.currentHP);
        
        if (recipient.currentHP <= 0) {
            return "recipient dies";
        }
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
}
/* harmony export (immutable) */ __webpack_exports__["a"] = Character;



/***/ }),
/* 4 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__data_weapons_json__ = __webpack_require__(5);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__data_weapons_json___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0__data_weapons_json__);



class Weapon {
    
    /**
     * Create a weapon by reading its data from the JSON file
     * @param {String} name - the weapon's name
     * @param {String} type - the weapon's type
     */
    constructor(name, type) {
        let weaponData = null;
        
        for (let weapon of __WEBPACK_IMPORTED_MODULE_0__data_weapons_json___default.a[type]) {
            if (weapon.name === name) {
                weaponData = weapon;
                break;
            }
        }
        
        this.name  = name;
        this.type  = type;
        this.might = weaponData.might;
        
        // TODO: Determine range based on weapon type
    }
    
}
/* harmony export (immutable) */ __webpack_exports__["a"] = Weapon;



/***/ }),
/* 5 */
/***/ (function(module, exports) {

module.exports = {"sword":[{"name":"Sol Katti","might":16},{"name":"Falchion","might":16}],"lance":[{"name":"Hinoka's Spear","might":16}],"axe":[{"name":"Steel Axe","might":8}]}

/***/ }),
/* 6 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";

class Tile {
    
    constructor(xPos, yPos, terrain) {
        this.terrain            = terrain;
        this.xPos               = xPos;
        this.yPos               = yPos;
        this.character          = null;
    }

}
/* harmony export (immutable) */ __webpack_exports__["a"] = Tile;



/***/ }),
/* 7 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__constants_js__ = __webpack_require__(0);
// Import constants


class Player1 {
    
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
/* harmony export (immutable) */ __webpack_exports__["a"] = Player1;


/***/ }),
/* 8 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__constants_js__ = __webpack_require__(0);
// Import constants


class Player2 {
    
    constructor(characters, color) {
        this.playerNumber = 2;
        this.characters = characters;
        this.color = color;
        
        this.characterCoordinates = [
            {x : __WEBPACK_IMPORTED_MODULE_0__constants_js__["a" /* default */].NUM_TILES-1, y : __WEBPACK_IMPORTED_MODULE_0__constants_js__["a" /* default */].NUM_TILES-1},
            {x : __WEBPACK_IMPORTED_MODULE_0__constants_js__["a" /* default */].NUM_TILES-3, y : __WEBPACK_IMPORTED_MODULE_0__constants_js__["a" /* default */].NUM_TILES-1},
            {x : __WEBPACK_IMPORTED_MODULE_0__constants_js__["a" /* default */].NUM_TILES-2, y : __WEBPACK_IMPORTED_MODULE_0__constants_js__["a" /* default */].NUM_TILES-2},
            {x : __WEBPACK_IMPORTED_MODULE_0__constants_js__["a" /* default */].NUM_TILES-1, y : __WEBPACK_IMPORTED_MODULE_0__constants_js__["a" /* default */].NUM_TILES-3},
            {x : __WEBPACK_IMPORTED_MODULE_0__constants_js__["a" /* default */].NUM_TILES-3, y : __WEBPACK_IMPORTED_MODULE_0__constants_js__["a" /* default */].NUM_TILES-3}
        ]
    }
}
/* harmony export (immutable) */ __webpack_exports__["a"] = Player2;


/***/ }),
/* 9 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__constants_js__ = __webpack_require__(0);



class Cursor {
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
    }
    
    toggleSprites() {
        this.isSelected = !this.isSelected;
        this.currentSprite.visible = false;
        this.currentSprite = (this.currentSprite === this.selectedSprite)
            ? this.notSelectedSprite
            : this.selectedSprite;
        this.currentSprite.visible = true;
        this.currentSprite.position.set(
            this.position.x * __WEBPACK_IMPORTED_MODULE_0__constants_js__["a" /* default */].TILESIZE,
            this.position.y * __WEBPACK_IMPORTED_MODULE_0__constants_js__["a" /* default */].TILESIZE
        );
    }
}
/* harmony export (immutable) */ __webpack_exports__["a"] = Cursor;



/***/ })
/******/ ]);
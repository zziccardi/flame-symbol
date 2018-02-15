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
    
    //Amount to upscale character sprites and tiles by
    SCALE: 1,
    
    //Number of tiles per row and column
    NUM_TILES: 12,
    
    //Number of pixels a moving sprite progresses per frame
    PIXEL_PER_FRAME: 8,
    
    //Number of pixels that makes up one segment of HP
    PIXEL_PER_HP: 3
};

//Number of pixels that make up the length or width of a tile
constants.TILESIZE = constants.SCALE * 32;

//Number of pixels that make up a row or column of the game board
constants.BOARDSIZE = constants.TILESIZE * constants.NUM_TILES;

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
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__classes_Player_js__ = __webpack_require__(7);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__classes_Cursor_js__ = __webpack_require__(8);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__classes_HealthBar_js__ = __webpack_require__(9);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5__utilities_createKey_js__ = __webpack_require__(10);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_6__data_characters_json__ = __webpack_require__(1);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_6__data_characters_json___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_6__data_characters_json__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_7__constants_js__ = __webpack_require__(0);













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

//Current turn, the turn progresses by one every time all player's have made their moves
let turn = 1;

// Text-related objects and styles
let turnAndMovesMsgStyle, turnMessage, movesMessage;

// The cursor (the colored sprite that shows the user where they are selecting)
let cursor = new __WEBPACK_IMPORTED_MODULE_3__classes_Cursor_js__["a" /* default */]();

// List of all characters across all players, list appended to by reading JSON file
let characters = [];

// Create the players, may allow choosing team and yellow and green options later
let player1 = new __WEBPACK_IMPORTED_MODULE_2__classes_Player_js__["a" /* default */]([], "blue", 1);
let player2 = new __WEBPACK_IMPORTED_MODULE_2__classes_Player_js__["a" /* default */]([], "red", 2);

// Player whose turn it is
let activePlayer = player1;

//2-D array of tiles
let tiles = [];

//List of pressable keys
//Diretional Keys used for moving the cursor
//A used for selecting a character/tile
//S for deselecting a character
let keys = {
    left:  Object(__WEBPACK_IMPORTED_MODULE_5__utilities_createKey_js__["a" /* default */])(37),
    up:    Object(__WEBPACK_IMPORTED_MODULE_5__utilities_createKey_js__["a" /* default */])(38),
    right: Object(__WEBPACK_IMPORTED_MODULE_5__utilities_createKey_js__["a" /* default */])(39),
    down:  Object(__WEBPACK_IMPORTED_MODULE_5__utilities_createKey_js__["a" /* default */])(40),
    a:     Object(__WEBPACK_IMPORTED_MODULE_5__utilities_createKey_js__["a" /* default */])(65),
    s:     Object(__WEBPACK_IMPORTED_MODULE_5__utilities_createKey_js__["a" /* default */])(83)
};

main();

function main() {
    // Create the canvas
    app = new Application({
        width: __WEBPACK_IMPORTED_MODULE_7__constants_js__["a" /* default */].BOARDSIZE + 400,
        height: __WEBPACK_IMPORTED_MODULE_7__constants_js__["a" /* default */].BOARDSIZE,
    });
    
    
    //info = new PIXI.DisplayObjectContainer();
    
    document.getElementById("main").appendChild(app.view);
    
    // load the sprite sheet
    loader
        .add("../src/images/sprites/spritesheet.json")
        .load(setup);
    
    // Generate the map tiles
    for (let i = 0; i < __WEBPACK_IMPORTED_MODULE_7__constants_js__["a" /* default */].NUM_TILES; i++) {
        let row = [];
        
        for (let j = 0; j < __WEBPACK_IMPORTED_MODULE_7__constants_js__["a" /* default */].NUM_TILES; j++) {
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
    for (const key of Object.keys(__WEBPACK_IMPORTED_MODULE_6__data_characters_json___default.a)) {
        let character = new __WEBPACK_IMPORTED_MODULE_0__classes_Character_js__["a" /* default */](key, 1);
        
        characters.push(character);
        
        player1.characters.push(character);
    }
    
    // TEMP DUPLICATE CODE BELOW
    
    // Loop through the characters, add them to the overall array and to the individual player arrays
    for (const key of Object.keys(__WEBPACK_IMPORTED_MODULE_6__data_characters_json___default.a)) {
        let character = new __WEBPACK_IMPORTED_MODULE_0__classes_Character_js__["a" /* default */](key, 2);
        
        characters.push(character);
        
        player2.characters.push(character);
    }
    
    let spritesheet = loader.resources["../src/images/sprites/spritesheet.json"].textures;
    
    loadTerrain();
    loadCharacters();
    
    function loadTerrain() {
        for(let i = 0; i < __WEBPACK_IMPORTED_MODULE_7__constants_js__["a" /* default */].BOARDSIZE; i += __WEBPACK_IMPORTED_MODULE_7__constants_js__["a" /* default */].TILESIZE) {
            for(let j = 0; j < __WEBPACK_IMPORTED_MODULE_7__constants_js__["a" /* default */].BOARDSIZE; j += __WEBPACK_IMPORTED_MODULE_7__constants_js__["a" /* default */].TILESIZE) {
                let sprite = new Sprite(spritesheet["grass.png"]);
        
                sprite.scale.set(__WEBPACK_IMPORTED_MODULE_7__constants_js__["a" /* default */].SCALE, __WEBPACK_IMPORTED_MODULE_7__constants_js__["a" /* default */].SCALE);

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
            char.healthBar = new __WEBPACK_IMPORTED_MODULE_4__classes_HealthBar_js__["a" /* default */](gameScene);
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
                    player1.characterCoordinates1[player1Counter].x * __WEBPACK_IMPORTED_MODULE_7__constants_js__["a" /* default */].TILESIZE, 
                    player1.characterCoordinates1[player1Counter].y * __WEBPACK_IMPORTED_MODULE_7__constants_js__["a" /* default */].TILESIZE
                );
                // Update the character's position
                char.position = player1.characterCoordinates1[player1Counter];
                player1Counter++;
            }
            else {
                sprite.position.set(
                    player2.characterCoordinates2[player2Counter].x * __WEBPACK_IMPORTED_MODULE_7__constants_js__["a" /* default */].TILESIZE, 
                    player2.characterCoordinates2[player2Counter].y * __WEBPACK_IMPORTED_MODULE_7__constants_js__["a" /* default */].TILESIZE
                );
                // Update the character's position
                char.position = player2.characterCoordinates2[player2Counter];
                player2Counter++;
            }
            
            sprite.scale.set(__WEBPACK_IMPORTED_MODULE_7__constants_js__["a" /* default */].SCALE, __WEBPACK_IMPORTED_MODULE_7__constants_js__["a" /* default */].SCALE);
            
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
    turnMessage.x = __WEBPACK_IMPORTED_MODULE_7__constants_js__["a" /* default */].BOARDSIZE + 125;
    turnMessage.y = __WEBPACK_IMPORTED_MODULE_7__constants_js__["a" /* default */].BOARDSIZE - 175;
    gameScene.addChild(turnMessage);
    
    movesMessage = new Text("Moves remaining:", turnAndMovesMsgStyle);
    movesMessage.x = __WEBPACK_IMPORTED_MODULE_7__constants_js__["a" /* default */].BOARDSIZE + 110;
    movesMessage.y = __WEBPACK_IMPORTED_MODULE_7__constants_js__["a" /* default */].BOARDSIZE - 125;
    gameScene.addChild(movesMessage);
    
    // Create the cursor sprite
    cursor.notSelectedSprite = new Sprite(spritesheet["cursor.png"]);
    cursor.notSelectedSprite.scale.set(__WEBPACK_IMPORTED_MODULE_7__constants_js__["a" /* default */].SCALE, __WEBPACK_IMPORTED_MODULE_7__constants_js__["a" /* default */].SCALE);
    cursor.notSelectedSprite.visible = false;
    gameScene.addChild(cursor.notSelectedSprite);
    
    // Create the selected cursor sprite
    cursor.selectedSprite = new Sprite(spritesheet["cursor-selected.png"]);
    cursor.selectedSprite.scale.set(__WEBPACK_IMPORTED_MODULE_7__constants_js__["a" /* default */].SCALE, __WEBPACK_IMPORTED_MODULE_7__constants_js__["a" /* default */].SCALE);
    cursor.selectedSprite.visible = false;
    gameScene.addChild(cursor.selectedSprite);
    
    // Create the target cursor sprite
    cursor.targetSprite = new Sprite(spritesheet["cursor-target.png"]);
    cursor.targetSprite.scale.set(__WEBPACK_IMPORTED_MODULE_7__constants_js__["a" /* default */].SCALE, __WEBPACK_IMPORTED_MODULE_7__constants_js__["a" /* default */].SCALE);
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
    
    message.x = __WEBPACK_IMPORTED_MODULE_7__constants_js__["a" /* default */].BOARDSIZE / 3;
    message.y = __WEBPACK_IMPORTED_MODULE_7__constants_js__["a" /* default */].BOARDSIZE / 2;
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
            else if(char.movingSpriteInfo.movedInTile !== __WEBPACK_IMPORTED_MODULE_7__constants_js__["a" /* default */].TILESIZE) {
                //Increment the x or y position
                char.sprite.position.x += char.movingSpriteInfo.spritePath[0].x;
                char.sprite.position.y += char.movingSpriteInfo.spritePath[0].y;
                //Keep track of how far in the tile the sprite has moved
                char.movingSpriteInfo.movedInTile += __WEBPACK_IMPORTED_MODULE_7__constants_js__["a" /* default */].PIXEL_PER_FRAME;
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
    if(cursor.currentSprite === cursor.targetSprite) {
        return;
    }
    
    if (cursor.position.y < __WEBPACK_IMPORTED_MODULE_7__constants_js__["a" /* default */].NUM_TILES-1 && (cursor.distanceLeft > 0 || cursor.isSelected === false)) {
        cursor.currentSprite.y   += __WEBPACK_IMPORTED_MODULE_7__constants_js__["a" /* default */].TILESIZE;
        cursor.position.y        += 1;
    }
    
    if(cursor.isSelected && cursor.distanceLeft > 0) {
        let pathArray = cursor.selectedCharacter.movingSpriteInfo.spritePath;
        if(pathArray[0] && pathArray[pathArray.length-1].x === 0 && pathArray[pathArray.length-1].y === -__WEBPACK_IMPORTED_MODULE_7__constants_js__["a" /* default */].PIXEL_PER_FRAME) {
            cursor.distanceLeft++;
            cursor.selectedCharacter.movingSpriteInfo.spritePath.pop();
        }
        else {
            cursor.distanceLeft--;
            cursor.selectedCharacter.movingSpriteInfo.spritePath.push({x:0, y:__WEBPACK_IMPORTED_MODULE_7__constants_js__["a" /* default */].PIXEL_PER_FRAME})
        }
        changeMovementText();
        
    }
};

keys.up.press = () => {
    //Cursor is targetting enemies
    if(cursor.currentSprite === cursor.targetSprite) {
        return;
    }
    
    if (cursor.position.y > 0 && (cursor.distanceLeft > 0 || cursor.isSelected === false)) {
        cursor.currentSprite.y   -= __WEBPACK_IMPORTED_MODULE_7__constants_js__["a" /* default */].TILESIZE;
        cursor.position.y        -= 1;
        
        //movesMessage.text = "Moves remaining: " + cursor.distanceLeft;
    }
    
    if(cursor.isSelected && cursor.distanceLeft > 0) {
        let pathArray = cursor.selectedCharacter.movingSpriteInfo.spritePath;
        
        //If last element of the pathArra
        if(pathArray[0] && pathArray[pathArray.length-1].x === 0 && pathArray[pathArray.length-1].y === __WEBPACK_IMPORTED_MODULE_7__constants_js__["a" /* default */].PIXEL_PER_FRAME) {
            cursor.distanceLeft++;
            cursor.selectedCharacter.movingSpriteInfo.spritePath.pop();
        }
        else {
            cursor.distanceLeft--;
            cursor.selectedCharacter.movingSpriteInfo.spritePath.push({x:0, y:-__WEBPACK_IMPORTED_MODULE_7__constants_js__["a" /* default */].PIXEL_PER_FRAME})
        }
        changeMovementText();
    }
};

//FIXME: Currently switching between multiple targets to attack is broken, need to fix

keys.left.press = () => {
    if(cursor.position.x > 0 && cursor.currentSprite === cursor.targetSprite) {
        cursor.currentSprite.x  = cursor.targetArray[cursor.targetArrayIndex].sprite.position.x;
        cursor.currentSprite.y  = cursor.targetArray[cursor.targetArrayIndex].sprite.position.y;
        cursor.position.x       = cursor.targetArray[cursor.targetArrayIndex].position.x;
        cursor.position.y       = cursor.targetArray[cursor.targetArrayIndex].position.y;
        
        cursor.selectedCharacter = cursor.targetArray[cursor.targetArrayIndex];
        
        console.log(cursor.selectedCharacter);
        console.log(cursor.position);
        
        if (cursor.targetArrayIndex === cursor.targetArray.length-1) cursor.targetArrayIndex = 0;
        else cursor.targetArrayIndex++;
        
        return;
    }
    
    if (cursor.position.x > 0 && (cursor.distanceLeft > 0 || cursor.isSelected === false)) {
        cursor.currentSprite.x  -= __WEBPACK_IMPORTED_MODULE_7__constants_js__["a" /* default */].TILESIZE;
        cursor.position.x       -= 1;
        
        //movesMessage.text = "Moves remaining: " + cursor.distanceLeft;
    }
    
    if(cursor.isSelected && cursor.distanceLeft > 0) {
        let pathArray = cursor.selectedCharacter.movingSpriteInfo.spritePath;
        if(pathArray[0] && pathArray[pathArray.length-1].x === __WEBPACK_IMPORTED_MODULE_7__constants_js__["a" /* default */].PIXEL_PER_FRAME && pathArray[pathArray.length-1].y === 0) {
            cursor.distanceLeft++;
            cursor.selectedCharacter.movingSpriteInfo.spritePath.pop();
        }
        else {
            cursor.distanceLeft--;
            cursor.selectedCharacter.movingSpriteInfo.spritePath.push({x:-__WEBPACK_IMPORTED_MODULE_7__constants_js__["a" /* default */].PIXEL_PER_FRAME, y:0})
        }
        changeMovementText();
        
    }
};

keys.right.press = () => {
    if(cursor.position.x < __WEBPACK_IMPORTED_MODULE_7__constants_js__["a" /* default */].NUM_TILES-1 && cursor.currentSprite === cursor.targetSprite) {
        cursor.currentSprite.x  = cursor.targetArray[cursor.targetArrayIndex].sprite.position.x;
        cursor.currentSprite.y  = cursor.targetArray[cursor.targetArrayIndex].sprite.position.y;
        cursor.position.x       = cursor.targetArray[cursor.targetArrayIndex].position.x;
        cursor.position.y       = cursor.targetArray[cursor.targetArrayIndex].position.y;
        
        cursor.selectedCharacter = cursor.targetArray[cursor.targetArrayIndex];
        
        console.log(cursor.selectedCharacter);
        console.log(cursor.position);
        
        if(cursor.targetArrayIndex === cursor.targetArray.length-1) cursor.targetArrayIndex = 0;
        else cursor.targetArrayIndex++;
        
        return;
    }
    
    if (cursor.position.x < __WEBPACK_IMPORTED_MODULE_7__constants_js__["a" /* default */].NUM_TILES-1 && (cursor.distanceLeft > 0 || cursor.isSelected === false)) {
        cursor.currentSprite.x   += __WEBPACK_IMPORTED_MODULE_7__constants_js__["a" /* default */].TILESIZE;
        cursor.position.x        += 1;
        
        //movesMessage.text = "Moves remaining: " + cursor.distanceLeft;
    }
    
    if(cursor.isSelected && cursor.distanceLeft > 0) {
        let pathArray = cursor.selectedCharacter.movingSpriteInfo.spritePath;
        if(pathArray[0] && pathArray[pathArray.length-1].x === -__WEBPACK_IMPORTED_MODULE_7__constants_js__["a" /* default */].PIXEL_PER_FRAME && pathArray[pathArray.length-1].y === 0) {
            cursor.distanceLeft++;
            cursor.selectedCharacter.movingSpriteInfo.spritePath.pop();
        }
        else {
            cursor.distanceLeft--;
            cursor.selectedCharacter.movingSpriteInfo.spritePath.push({x:__WEBPACK_IMPORTED_MODULE_7__constants_js__["a" /* default */].PIXEL_PER_FRAME, y:0})
        }
        changeMovementText();
        
    }
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
            currentTile.character = cursor.selectedCharacter.move(cursor);
            
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
    cursor.selectedCharacter.movingSpriteInfo.spritePath = [];
    
    if (cursor.isSelected) {
        cursor.toggleSprites();
    }
    
    //If in target mode, and user decides not to attack, set back to regular gameplay
    if (cursor.currentSprite == cursor.targetSprite) {
        cursor.currentSprite.visible = false;
        cursor.currentSprite = cursor.notSelectedSprite;
        cursor.currentSprite.visible = true;
        cursor.currentSprite.position.set = (
            cursor.position.x * __WEBPACK_IMPORTED_MODULE_7__constants_js__["a" /* default */].TILESIZE,
            cursor.position.y * __WEBPACK_IMPORTED_MODULE_7__constants_js__["a" /* default */].TILESIZE
        );
    }
    
    movesMessage.text = "Moves remaining:";
};

// *****************************************************************************

function selectCharacter(currentTile) {
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

function selectEnemyToAttack(currentTile) {
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
        cursor.position.x * __WEBPACK_IMPORTED_MODULE_7__constants_js__["a" /* default */].TILESIZE,
        cursor.position.y * __WEBPACK_IMPORTED_MODULE_7__constants_js__["a" /* default */].TILESIZE
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
    // Check if player is adjacent to any opponents
    let adjacentEnemies = [];
    
    cursor.targetArray = [];
    cursor.targetArrayIndex = 1;
    
    // First check if character exists in above tile (but not if we're in the top row)
    // If character exists, make sure it is an enemy character
    if (cursor.selectedCharacter.position.y !== 0) {
        let characterInTileAbove = tiles[cursor.position.x][cursor.position.y-1].character;
        
        if (characterInTileAbove &&
            (characterInTileAbove.playerNumber !== activePlayer.playerNumber)) {
            adjacentEnemies.push(characterInTileAbove);
            cursor.targetArray.push(characterInTileAbove);
        }
    }
    
    if (cursor.selectedCharacter.position.y !== __WEBPACK_IMPORTED_MODULE_7__constants_js__["a" /* default */].NUM_TILES-1) {
        let characterInTileBelow = tiles[cursor.position.x][cursor.position.y+1].character;
        
        if (characterInTileBelow &&
            (characterInTileBelow.playerNumber !== activePlayer.playerNumber)) {
            adjacentEnemies.push(characterInTileBelow);
            cursor.targetArray.push(characterInTileBelow);
        }
    }
    
    if (cursor.selectedCharacter.position.x !== __WEBPACK_IMPORTED_MODULE_7__constants_js__["a" /* default */].NUM_TILES-1) {
        let characterInTileRight = tiles[cursor.position.x+1][cursor.position.y].character;
        
        if (characterInTileRight &&
            (characterInTileRight.playerNumber !== activePlayer.playerNumber)) {
            adjacentEnemies.push(characterInTileRight);
            cursor.targetArray.push(characterInTileRight);
        }  
    }
    
    if (cursor.selectedCharacter.position.x !== 0) {
        let characterInTileLeft = tiles[cursor.position.x-1][cursor.position.y].character;
        
        if (characterInTileLeft &&
            (characterInTileLeft.playerNumber !== activePlayer.playerNumber)) {
            adjacentEnemies.push(characterInTileLeft);
            cursor.targetArray.push(characterInTileLeft);
        }
    }
    
    // At least one enemy found, switch to target mode
    if (adjacentEnemies[0]) {
        cursor.currentSprite.visible = false;
        cursor.currentSprite = cursor.targetSprite;
        cursor.currentSprite.visible = true;
        cursor.currentSprite.position.set(
            adjacentEnemies[0].position.x * __WEBPACK_IMPORTED_MODULE_7__constants_js__["a" /* default */].TILESIZE,
            adjacentEnemies[0].position.y * __WEBPACK_IMPORTED_MODULE_7__constants_js__["a" /* default */].TILESIZE
        );
        cursor.position.x = adjacentEnemies[0].position.x;
        cursor.position.y = adjacentEnemies[0].position.y;
        
        return "switched mode";
    }
}


/***/ }),
/* 3 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__classes_Weapon_js__ = __webpack_require__(4);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__data_characters_json__ = __webpack_require__(1);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__data_characters_json___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_1__data_characters_json__);





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
        
        //bool determining if a character has moved within the current turn
        //A character should not be allowed to move if it has already moved in that turn
        this.hasMoved         = false;
        
        //X and Y coordinates representing the tile the character currently occupies
        this.position = {
            x: null,
            y: null
        };
        
        //The amount of tiles a character can move in a turn, based on their class
        this.movement = 0;
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
        
        //The sprite the character uses
        this.sprite   = null;

        // Healthbar and Health related items
        this.healthBar = null;
        this.currentHP = this.stats.hp;
        this.hpIsScrolling = false;
        this.scrollingHP = this.currentHP;
        
        //Sprite Movement information
        this.movingSpriteInfo = {
            
            //Bool determining if a sprite is currently in motion
            isMoving : false,
            
            //The path the sprite will take
            spritePath : [],
            
            //The number of pixels a sprite has moved within a tile
            movedInTile : 0
        };
    }
    
    /**
     * Move the character to a new tile
     * @param {Cursor} cursor - the cursor instance (indicates the destination)
     * @return {Character} this - a reference to this character, to be added to the destination tile
     */
    move(cursor) {
        // Move the character based on where the cursor currently is
        //this.sprite.position.set(
        //    cursor.position.x * constants.TILESIZE,
        //    cursor.position.y * constants.TILESIZE
        //);
        
        this.movingSpriteInfo.isMoving = true;
        
        this.position.x = cursor.position.x;
        this.position.y = cursor.position.y;
        this.hasMoved = true;
        
        // Update the destination tile to include the character that just moved there
        return this;
    }
    
    /**
     * Attack a character on the opponent's team
     * @param {Character} recipient - the other player's unit who is being attacked
     */
    attack(recipient) {
        console.log(`${this.name} initiates on ${recipient.name}`);
        
        
        // 1. Initiate on opponent
        let status = this.doAttackCalculations(recipient);
        
        // The recipient dies, so end combat
        if (status === "recipient dies") {
            return status;
        }
        
        //this.hpIsScrolling = true;;
        //while(this.hpIsScrolling) {}
        
        console.log(`${recipient.name} counterattacks ${this.name}`);
        
        
        // 2. Opponent counterattacks
        status = recipient.doAttackCalculations(this);
        
        // The initiator was killed on the recipient's counterattack, so end combat
        if (status === "recipient dies") {
            return "initiator dies";
        }
        
        
        // 3. If the initiator is significantly faster than the recipient, the
        // former does a follow-up attack
        if (this.stats.speed - recipient.stats.speed >= 5) {
            console.log(`${this.name} performs a follow-up attack on ${recipient.name}`);
            
            return this.doAttackCalculations(recipient);
        }
        
        
        // 4. If the recipient is significantly faster than the initiator, the
        // former does a second (follow-up) counterattack
        else if (recipient.stats.speed - this.stats.speed >= 5) {
            console.log(`${recipient.name} performs a follow-up counterattack on ${this.name}`);
            
            return recipient.doAttackCalculations(this);
        }
    }
    
    /**
     * Determine the damage to be dealt and subtract it from the opponent's HP
     * @param {Character} recipient - the character that receives the attack
     * @return {String} status - a string indicating whether the recpient dies,
     * or null otherwise
     * @private
     */
    doAttackCalculations(recipient) {
        // Add the weapon's might to this character's attack
        let attackStrength = this.stats.attack + this.weapon.might;
        
        console.log("Attack strength: " + attackStrength);
        
        attackStrength = Math.floor(attackStrength * this.getEffectivenessMultiplier(recipient));
        
        console.log("Attack strength with multiplier: " + attackStrength);
        
        // TODO: Handle magic and ranged attacks
        
        // Subtract the opponent's defense from the damage to determine how much
        // to lower the opponent's HP
        let damage = attackStrength - recipient.stats.defense;
        
        console.log("Damage to subtract from HP: " + damage);
        
        // The recipient's defense is high enough that no damage is dealt
        if (damage <= 0) {
            return null;
        }
        
        recipient.currentHP -= damage;
        
        // If a character's hp goes below 0, set it to 0 for HP bar purposes
        if (recipient.currentHP < 0) {
            recipient.currentHP = 0;
        }
        
        recipient.healthBar.decreaseHealth(recipient.currentHP, recipient.stats.hp);
        
        console.log("Recipient HP: " + recipient.currentHP);
        
        if (recipient.currentHP === 0) {
            return "recipient dies";
        }
        
        return null;
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
    
    /**
     * 
     * @param {object} PIXI - Pixi object
     */
    desaturateSprite(PIXI) {
        let colorMatrix = new PIXI.filters.ColorMatrixFilter();
        
        this.sprite.filters = [colorMatrix];
        
        colorMatrix.desaturate();
    }
    
    /**
     * 
     * @param {object} PIXI - Pixi object
     */
    saturateSprite(PIXI) {
        let colorMatrix = new PIXI.filters.ColorMatrixFilter();
        
        this.sprite.filters = [colorMatrix];
        
        colorMatrix.reset();
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


class Player {
    
    constructor(characters, color, playerNumber) {
        this.playerNumber = playerNumber;
        this.characters = characters;
        this.color = color;
        
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
            {x : __WEBPACK_IMPORTED_MODULE_0__constants_js__["a" /* default */].NUM_TILES-1, y : __WEBPACK_IMPORTED_MODULE_0__constants_js__["a" /* default */].NUM_TILES-1},
            {x : __WEBPACK_IMPORTED_MODULE_0__constants_js__["a" /* default */].NUM_TILES-3, y : __WEBPACK_IMPORTED_MODULE_0__constants_js__["a" /* default */].NUM_TILES-1},
            {x : __WEBPACK_IMPORTED_MODULE_0__constants_js__["a" /* default */].NUM_TILES-2, y : __WEBPACK_IMPORTED_MODULE_0__constants_js__["a" /* default */].NUM_TILES-2},
            {x : __WEBPACK_IMPORTED_MODULE_0__constants_js__["a" /* default */].NUM_TILES-1, y : __WEBPACK_IMPORTED_MODULE_0__constants_js__["a" /* default */].NUM_TILES-3},
            {x : __WEBPACK_IMPORTED_MODULE_0__constants_js__["a" /* default */].NUM_TILES-3, y : __WEBPACK_IMPORTED_MODULE_0__constants_js__["a" /* default */].NUM_TILES-3}
        ]
        
        //Starting positions for Player 3's characters
        this.characterCoordinates3 = [
            {x : 0, y : __WEBPACK_IMPORTED_MODULE_0__constants_js__["a" /* default */].NUM_TILES-1},
            {x : 2, y : __WEBPACK_IMPORTED_MODULE_0__constants_js__["a" /* default */].NUM_TILES-1},
            {x : 1, y : __WEBPACK_IMPORTED_MODULE_0__constants_js__["a" /* default */].NUM_TILES-2},
            {x : 0, y : __WEBPACK_IMPORTED_MODULE_0__constants_js__["a" /* default */].NUM_TILES-3},
            {x : 2, y : __WEBPACK_IMPORTED_MODULE_0__constants_js__["a" /* default */].NUM_TILES-3}
        ]
        
        //Starting positions for Player 4's characters
        this.characterCoordinates4 = [
            {x : 0, y : __WEBPACK_IMPORTED_MODULE_0__constants_js__["a" /* default */].NUM_TILES-1},
            {x : 2, y : __WEBPACK_IMPORTED_MODULE_0__constants_js__["a" /* default */].NUM_TILES-1},
            {x : 1, y : __WEBPACK_IMPORTED_MODULE_0__constants_js__["a" /* default */].NUM_TILES-2},
            {x : 0, y : __WEBPACK_IMPORTED_MODULE_0__constants_js__["a" /* default */].NUM_TILES-3},
            {x : 2, y : __WEBPACK_IMPORTED_MODULE_0__constants_js__["a" /* default */].NUM_TILES-3}
        ]
        
    }
}
/* harmony export (immutable) */ __webpack_exports__["a"] = Player;


/***/ }),
/* 8 */
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
            this.position.x * __WEBPACK_IMPORTED_MODULE_0__constants_js__["a" /* default */].TILESIZE,
            this.position.y * __WEBPACK_IMPORTED_MODULE_0__constants_js__["a" /* default */].TILESIZE
        );
    }
}
/* harmony export (immutable) */ __webpack_exports__["a"] = Cursor;



/***/ }),
/* 9 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__constants_js__ = __webpack_require__(0);


const TextStyle = PIXI.TextStyle;
const Text      = PIXI.Text;

// The text style for the HP
const hpTextStyle = new TextStyle({
    fontFamily: "Futura",
    fontSize: 12,
    fill: "white"
});


class HealthBar {
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
        this.healthBarObject.position.set(__WEBPACK_IMPORTED_MODULE_0__constants_js__["a" /* default */].BOARDSIZE + spacing, (counter*40) + 25);
        this.canvas.addChild(this.healthBarObject);

        // Create the black background rectangle
        let innerBar = new PIXI.Graphics();
        innerBar.beginFill(0x000000);
        innerBar.drawRect(0, 0, character.stats.hp * __WEBPACK_IMPORTED_MODULE_0__constants_js__["a" /* default */].PIXEL_PER_HP, 15);
        innerBar.endFill();
        this.healthBarObject.addChild(innerBar);

        // Create the front red rectangle
        let outerBar = new PIXI.Graphics();
        outerBar.beginFill(code);
        outerBar.drawRect(0, 0, character.stats.hp * __WEBPACK_IMPORTED_MODULE_0__constants_js__["a" /* default */].PIXEL_PER_HP, 15);
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
        this.healthBarObject.outer.width = currentHP * __WEBPACK_IMPORTED_MODULE_0__constants_js__["a" /* default */].PIXEL_PER_HP;
        this.healthBarObject.hpTextObject.text = `${currentHP} / ${maxHP}`;
    }
}
/* harmony export (immutable) */ __webpack_exports__["a"] = HealthBar;



/***/ }),
/* 10 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (immutable) */ __webpack_exports__["a"] = createKey;

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


/***/ })
/******/ ]);
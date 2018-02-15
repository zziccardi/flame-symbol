
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

export default constants;

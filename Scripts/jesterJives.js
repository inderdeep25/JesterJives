var _stage = document.getElementById("stage");
var _canvas = document.querySelector("canvas");
_canvas.width = 1024;
_canvas.height = 768;
var surface = _canvas.getContext("2d");
var tileSize = 128;
var numOfColumns = _canvas.width/tileSize;
var numOfRows = _canvas.height/tileSize;
console.log("Col : " + numOfColumns + ", Row : " + numOfRows);
var numOfMaxLandTilesInRow = 3;
var previousTileType = -1;
var playerImages = [new Image(), new Image()];
/* states is an array of objects where each object is a state with an enter, update and exit function. These
 functions get called in the changeState function. */

var State = {
    MENU_STATE : 0,
    GAME_STATE : 1,
    HELP_STATE : 2,
    CREDITS_STATE : 3
};

var buttonType = {
    START : 0,
    HELP : 1,
    EXIT : 2
};

var TileType = {
    TOP_LEFT : 16,
    BOTTOM_LEFT : 11,
    TOP_RIGHT : 17,
    BOTTOM_RIGHT : 12,
    TOP_HORIZONTAL : 18,
    BOTTOM_HORIZONTAL : 8,
    LEFT_VERTICAL : 3,
    RIGHT_VERTICAL : 5,
    LAND_TILE_2: 24,
    LAND_TILE_4 : 21,
    LAND_TILE_L:22,
    LAND_TILE_L_OPP:23,
    TRAP_TILE : 19

};

var PlayerImageType = {
    PLAYER_LEFT : 0,
    PLAYER_RIGHT : 1
};

var KeyCode = {
    W : 87,
    A : 65,
    S : 83,
    D : 68,
    UP_ARROW : 38,
    LEFT_ARROW : 37,
    RIGHT_ARROW : 39,
    DOWN_ARROW : 40
};

var stateContainer = [
    {   enter: enterMenu, // Main menu state.
        update: updateMenu,
        exit: exitMenu
    },
    {   enter: enterGame, // Game state.
        update: updateGame,
        exit: exitGame
    },
    {   enter: enterHelp, // Help state.
        update: updateHelp,
        exit: exitHelp
    }
];


// These two variables should be indices for the states array.
var lastState = -1;
var currState = -1;

// The buttons array stores information about all buttons for my simple UI that just changes states.
var buttons = [
    {   img:"Resources/Images/btnStart.png",// Start button
        imgO:"Resources/Images/btnStartO.png",
        x:448,
        y:512,
        w:128,
        h:32,
        over:false,
        click:onStartClick
    },
    {    img:"Resources/Images/btnHelp.png", // Help button
        imgO:"Resources/Images/btnHelpO.png",
        x:64,
        y:704,
        w:128,
        h:32,
        over:false,
        click:onHelpClick
    },
    {    img:"Resources/Images/btnExit.png", // Exit button
        imgO:"Resources/Images/btnExitO.png",
        x:832,
        y:704,
        w:128,
        h:32,
        over:false,
        click:onExitClick
    }
];

// Player Characteristics
var player ={
    x: 64,
    y: 640, //y:canvas.height/2,
    width: 64, // To ensure not to touch the outside of the canvas or wall, etc
    height: 64, // MAKE SURE TO CHANGE THIS FOR DIFFERENT SPRITE!!!!
    speed: 6, // Maximum player speed
    velX: 0, // To ensure that the player can navigate at different speeds, not just one const
    velY: 0,
    img: playerImages[1],

    //Animation properties/methods
    direction: 1, //1 is facing right, 0 is facing left
    idle: true, //true by default
    running: false, //false by default
    jumping: false, //false by default
    frameIndex: 0,
    currentFrame: 0,
    framesPerSprite: 3, //the number of frames the individual sprite will be drawn for
    animate: function()//animates the player, gets called from updateAnimation function
    {
        this.currentFrame++;
        if(this.currentFrame == this.framesPerSprite)
        {
            this.frameIndex++;
            this.currentFrame = 0;
            if(this.frameIndex == 10)
            {
                this.frameIndex = 0;
            }
        }
    }

};

var tiles = [];
var numOfTotalTiles = 25;
for(var i = 1 ; i <= numOfTotalTiles ; i++){
    tiles[i-1] = "Resources/Images/Tiles/Tile (" + i + ").png";
}

var map = [];

// The activeBtns array is set in each enter function for each state and holds the buttons currently on screen.
var activeBtns = [];
var numAssets = 6;
var assetsLoaded = 0;

var mouse = {x:0, y:0}; // Stores mouse position in canvas.

const fps = 30; // or 60. The game's set frame rate all update functions will run at.
const fpsMS = 1/fps*1000; // The frames per second as a millisecond interval.
var updateIval;

// Movement input bools
var aPressed = false;
var dPressed = false;
var wPressed = false;
var sPressed = false;
var friction = 0.9;
var gravity = 0.4;

window.addEventListener("keydown", onKeyDown);
window.addEventListener("keyup", onKeyUp);
window.addEventListener("load", loadAssets);
_canvas.addEventListener("mousemove", updateMouse);
_canvas.addEventListener("click", onMouseClick);

// The loadAssets function currently only creates the Image objects for all the buttons.
function loadAssets(event)
{
    for (var i = 0; i < buttons.length; i++)
    {
        var tempBtn = new Image();
        tempBtn.src = buttons[i].img;
        tempBtn.addEventListener("load", onAssetLoad);
        buttons[i].img = tempBtn; // .img used to hold the path string, now it holds the actual image object.
        var tempBtnO = new Image();
        tempBtnO.src = buttons[i].imgO;
        tempBtnO.addEventListener("load", onAssetLoad);
        buttons[i].imgO = tempBtnO;
    }

    //Load player images
    playerImages[0].src = "Resources/Images/Player/playerLeft2.png";
    playerImages[1].src = "Resources//Images/Player/playerRight2.png";
}

function onAssetLoad(event)
{
    if (++assetsLoaded == numAssets)
        initGame();
}

function initGame()
{
    // This function can be called to kick-off the game when all important main/menu assets are loaded.
    changeState(State.MENU_STATE); // Change to menu state.
}

// Player Input
function onKeyDown(event)
{
    event.preventDefault();
    switch (event.keyCode)
    {
        case KeyCode.LEFT_ARROW:
        case KeyCode.A:
            if (aPressed == false)
                aPressed = true;
            break;
        case KeyCode.RIGHT_ARROW:
        case KeyCode.D:
            if (dPressed == false)
                dPressed = true;
            break;
        case KeyCode.UP_ARROW:
        case KeyCode.W:
            if (wPressed == false)
                wPressed = true;
            break;
        case KeyCode.DOWN_ARROW:
        case KeyCode.S: // S
            if (sPressed == false)
                sPressed = true;
            break;
    }
}

function onKeyUp(event)
{
    event.preventDefault();
    switch(event.keyCode)
    {
        case KeyCode.LEFT_ARROW:
        case KeyCode.A:
            aPressed = false;
            break;
        case KeyCode.RIGHT_ARROW:
        case KeyCode.D:
            dPressed = false;
            break;
        case KeyCode.UP_ARROW:
        case KeyCode.W:
            wPressed = false;
            break;
        case KeyCode.DOWN_ARROW:
        case KeyCode.S:
            sPressed = false;
            break;
    }
}

function checkInput()
{
    if (aPressed == true) // left
    {
        player.dir = 0;
        player.idle = false;
        player.running = true;
        player.img = playerImages[PlayerImageType.PLAYER_LEFT];
        if (player.velX > -player.speed)
        {
            player.velX--;
        }
    }
    else if (dPressed == true) // Right
    {
        player.dir = 1;
        player.idle = false;
        player.running = true;
        player.img = playerImages[PlayerImageType.PLAYER_RIGHT];
        if (player.velX < player.speed)
        {
            player.velX++;
        }
    }
    else if(player.jumping == false)
    {
        player.idle = true;
        player.running = false;
        if (player.dir == 1)
            player.img = playerImages[PlayerImageType.PLAYER_RIGHT];
        else
            player.img = playerImages[PlayerImageType.PLAYER_LEFT];
    }
    if (wPressed == true) // Jump
    {
        player.idle = false;
        if(!player.jumping)
        {
            player.jumping = true;
            player.velY = -player.speed*2
        }
    }
    /*else if (sPressed == true)
     {
     player.height = 32;
     player.img.src = "../Resources/Images/playerProto2.png";
     }
     else if(sPressed == false)
     {
     player.height = 64;
     player.img.src = "../Resources/Images/playerProto1.png";
     }*/

    player.x += player.velX;
    player.y += player.velY;
    player.velX *= friction;
    player.velY += gravity;

    if (player.x >= _canvas.width-player.width - tileSize/2)
    {
        player.x = _canvas.width-player.width - tileSize/2;
    }
    else if (player.x <= tileSize/2)
    {
        player.x = tileSize/2;
    }

    if(player.y >= _canvas.height-player.height - tileSize/2){
        player.y = _canvas.height - player.height - tileSize/2;
        player.jumping = false;
    }
}

function updateAnimation()
{
    player.animate();
}

function changeState(stateToRun)
{
    if (stateToRun >= 0 && stateToRun < stateContainer.length) // Just a check to see if the state to run is valid.
    {
        if (currState >= 0) // The only time this doesn't run is the very first state change.
        {
            clearInterval(updateIval); // Stops the current setInterval method, which is the update function for the current state.
            stateContainer[currState].exit(); // Will call the appropriate exit function of the current state.
        }
        lastState = currState;
        currState = stateToRun;
        stateContainer[currState].enter(); // Will call the appropriate enter function of the current state. For initialization, etc.
        updateIval = setInterval(stateContainer[currState].update, fpsMS);
    }
    else
        console.log("Invalid stateToRun!");
}

function enterMenu()
{
    console.log("Entering menu state.");
    _stage.style.backgroundColor = "cyan";
    activeBtns = [ buttons[buttonType.START] ];
}

function updateMenu()
{
    console.log("In menu state.");
    checkButtons();
    render();

}

function exitMenu()
{
    console.log("Exiting menu state.");
}

function enterGame()
{
    console.log("Entering game state.");
    _stage.style.backgroundColor = "grey";
    activeBtns = [ buttons[buttonType.HELP], buttons[buttonType.EXIT] ];
    generateMap();
}

function generateMap()
{
    setupEmptyMapArray();
    generateRandomLandTiles();
}

function generateRandomLandTiles()
{
    var numOfLandTilesInCurrentRow = 0;
    var numOfTrapsInCurrentRow = 0;

    for(var i = 1 ; i < numOfRows - 1; i++)
    {
        for ( var j = 1 ; j < (numOfColumns - 1); j++)
        {
            var rand = Math.random() * 10;

            if(previousTileType != TileType.LAND_TILE_4 && rand > 0 && rand < 3 && numOfLandTilesInCurrentRow <= numOfMaxLandTilesInRow)
            {
                map[i][j] = getImageForPath(tiles[TileType.LAND_TILE_4]);
                numOfLandTilesInCurrentRow++;
                previousTileType = TileType.LAND_TILE_4;
            }
            else if(previousTileType != TileType.LAND_TILE_2 && rand > 3 && rand < 6 && numOfLandTilesInCurrentRow <= numOfMaxLandTilesInRow)
            {
                map[i][j] = getImageForPath(tiles[TileType.LAND_TILE_2]);
                numOfLandTilesInCurrentRow++;
                previousTileType = TileType.LAND_TILE_2;
            }
            else if(previousTileType != TileType.LAND_TILE_L && rand > 6 && rand < 9 && numOfLandTilesInCurrentRow <= numOfMaxLandTilesInRow)
            {
                map[i][j] = getImageForPath(tiles[TileType.LAND_TILE_L]);
                numOfLandTilesInCurrentRow++;
                previousTileType = TileType.LAND_TILE_L;
            }
            // else if(i%2==0 && rand > 0 && rand <= 3 && (numOfTrapsInCurrentRow + numOfLandTilesInCurrentRow) < (numOfColumns-2))
            // {
            //     map[i][j] = getImageForPath(tiles[TileType.TRAP_TILE]);
            //     numOfTrapsInCurrentRow++;
            // }

        }
        numOfLandTilesInCurrentRow = 0;
    }
}

function renderBorderTiles()
{
    var i, j;

    //setup corner images
    surface.drawImage(getImageForPath(tiles[TileType.TOP_LEFT]), 0, 0);
    surface.drawImage(getImageForPath(tiles[TileType.TOP_RIGHT]), 7.5*tileSize, 0);
    surface.drawImage(getImageForPath(tiles[TileType.BOTTOM_LEFT]), 0, 5.5*tileSize);
    surface.drawImage(getImageForPath(tiles[TileType.BOTTOM_RIGHT]), 7.5*tileSize, 5.5*tileSize);

    //setup top horizontal tiles
    for ( i = 1 ; i < 15 ; i++)
    {
        surface.drawImage(getImageForPath(tiles[TileType.TOP_HORIZONTAL]) , i * tileSize/2, 0);
    }

    //setup bottom horizontal tiles
    for ( i = 1 ; i < 15; i++)
    {
        surface.drawImage(getImageForPath(tiles[TileType.BOTTOM_HORIZONTAL]) , i * tileSize/2, 5.5*tileSize);
    }

    //setup left vertical tiles
    for ( j = 1 ; j < 11; j++)
    {
        surface.drawImage(getImageForPath(tiles[TileType.LEFT_VERTICAL]),0,j*tileSize/2);
    }

    //setup right vertical tiles
    for ( j = 1 ; j < 11; j++)
    {
        surface.drawImage(getImageForPath(tiles[TileType.RIGHT_VERTICAL]) , 7.5*tileSize, j*tileSize/2 );
    }
}

function setupEmptyMapArray()
{
    var i = 0 , j = 0 ;
    for (i = 0 ; i < numOfRows ; i++)
    {
        map[i] = [];
        for(j = 0 ; j < numOfColumns; j++)
        {
            map[i][j] = "empty";
        }
    }
}

function updateGame()
{
    console.log("In game state.");
    checkButtons();
    render();
    checkInput();
    updateAnimation();
}

function exitGame()
{
    console.log("Exiting game state.");
}

function enterHelp()
{
    console.log("Entering help state.");
    _stage.style.backgroundColor = "green";
    activeBtns = [ buttons[buttonType.EXIT] ];
}

function updateHelp()
{
    console.log("In help state.");
    checkButtons();
    render();
}

function exitHelp()
{
    console.log("Exiting help state.");
}

// This checkButtons function is basically a box-collision-based test with the mouse location and each active button.
function checkButtons()
{
    for (var i = 0; i < activeBtns.length; i++)
    {
        activeBtns[i].over = false;
        if(!(mouse.x < activeBtns[i].x ||
            mouse.x > activeBtns[i].x+activeBtns[i].w ||
            mouse.y < activeBtns[i].y ||
            mouse.y > activeBtns[i].y+activeBtns[i].h))
        {
            activeBtns[i].over = true; // If our mouse is inside the button box, flip the over flag to true.
        }
    }
}
/* If we click the mouse and one of the buttons happens to have their over flag set to true, run its click function.
 I need to do this because my buttons are drawn as part of the canvas and can't have events on them. */
function onMouseClick()
{
    for (var i = 0; i < activeBtns.length; i++)
    {
        if (activeBtns[i].over == true)
        {
            activeBtns[i].click();
            break;
        }
    }
}

// Basically being used just for each button. Draws the button image based on its over property.
function render()
{
    surface.clearRect(0, 0, _canvas.width, _canvas.height);
    document.body.style.cursor = "default";

    if(currState == State.GAME_STATE)
    {
        renderBorderTiles();

        for(var i = 0; i < numOfRows ; i++)
        {
            for (var j = 0 ; j < numOfColumns ; j++)
            {
                if(map[i][j] !== "empty")
                {
                    surface.drawImage(map[i][j], j * tileSize, i * tileSize);
                }
            }
        }


        //DRAW PLAYER
        if (player.idle == true)
            surface.drawImage(player.img,
                0, 0, player.width, player.height,
                player.x, player.y, player.width, player.height);
        else if(player.jumping == true)
            surface.drawImage(player.img,
                player.dir ? player.width*2 : player.width*7 , 256, player.width, player.height,
                player.x, player.y, player.width, player.height);
        else if(player.running == true)
            surface.drawImage(player.img,
                player.frameIndex*player.width, 128, player.width, player.height,
                player.x, player.y, player.width, player.height);


    }

    for (var i = 0; i < activeBtns.length; i++)
    {
        if (activeBtns[i].over == true)
        {
            surface.drawImage(activeBtns[i].imgO, activeBtns[i].x, activeBtns[i].y);
            document.body.style.cursor = "pointer";
        }
        else
            surface.drawImage(activeBtns[i].img, activeBtns[i].x, activeBtns[i].y);
    }

}

function onStartClick()
{
    changeState(State.GAME_STATE);
}

function onHelpClick()
{
    changeState(State.HELP_STATE);
}

function onExitClick()
{
    if (currState == State.GAME_STATE)
        changeState(State.MENU_STATE);
    else if (currState == State.HELP_STATE)
        changeState(State.GAME_STATE);
}

// This function sets the mouse x and y position as it is on the canvas where 0,0 is top-left of canvas.
function updateMouse(event)
{
    var rect = _canvas.getBoundingClientRect();
    mouse.x = event.clientX - rect.left;
    mouse.y = event.clientY - rect.top;
}

function getImageForPath(path)
{
    var img = new Image();
    img.src = path;
    return img;
}

var _stage = document.getElementById("stage");
var _canvas = document.querySelector("canvas");
_canvas.width = 1024;
_canvas.height = 768;
var surface = _canvas.getContext("2d");
var tileSize = 64;
var numOfColumns = _canvas.width/tileSize;
var numOfRows = _canvas.height/tileSize;

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
                    RIGHT_VERTICAL : 5

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

var tiles = [];
var numOfTotalTiles = 19;
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
    var i = 0, j = 0 ;

    //setup corner images
    map[0][0] = getImageForPath(tiles[TileType.TOP_LEFT]);
    map[0][numOfColumns-1] = getImageForPath(tiles[TileType.TOP_RIGHT]);
    map[numOfRows-1][0] = getImageForPath(tiles[TileType.BOTTOM_LEFT]);
    map[numOfRows-1][numOfColumns-1] = getImageForPath(tiles[TileType.BOTTOM_RIGHT]);

    //setup top horizontal tiles
    for ( i = 1 ; i < numOfColumns-1; i++)
    {
        map[0][i] = getImageForPath(tiles[TileType.TOP_HORIZONTAL]);
    }

    //setup bottom horizontal tiles
    for ( i = 1 ; i < numOfColumns-1; i++)
    {
        map[numOfRows-1][i] = getImageForPath(tiles[TileType.BOTTOM_HORIZONTAL]);
    }

    //setup left vertical tiles
    for ( j = 1 ; j < numOfRows-1; j++)
    {
        map[j][0] = getImageForPath(tiles[TileType.LEFT_VERTICAL]);
    }

    //setup right vertical tiles
    for ( j = 1 ; j < numOfRows-1; j++)
    {
        map[j][numOfColumns-1] = getImageForPath(tiles[TileType.RIGHT_VERTICAL]);
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
        for(var i = 0; i < numOfRows ; i++)
        {
            for (var j = 0 ; j < numOfColumns ; j++)
            {
                if(map[i][j] !== "empty")
                {
                    surface.drawImage(map[i][j], j * 64, i * 64);
                }
            }
        }
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

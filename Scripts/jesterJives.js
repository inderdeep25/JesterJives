var _stage = document.getElementById("stage");
var _canvas = document.querySelector("canvas");
_canvas.width = 1024;
_canvas.height = 768;
var surface = _canvas.getContext("2d");
var tileSize = 128;
var numOfColumns = _canvas.width/tileSize;
var numOfRows = _canvas.height/tileSize;
var numOfMaxLandTilesInRow = 3;
var previousTileType = -1;
var screens = [new Image(), new Image()];

var player = new window.Player(this);
var traps = new window.Traps(this);
var assets = new window.Assets(this);
var stateMachine = new StateMachine(this);
var levelGenerator = new window.LevelGenerator(this);
var collisionHandler = new window.CollisionHandler(this);

var KeyCode = {
                    W : 87,
                    A : 65,
                    S : 83,
                    D : 68,
                    UP_ARROW : 38,
                    LEFT_ARROW : 37,
                    RIGHT_ARROW : 39,
                    DOWN_ARROW : 40,
                    R : 82
              };

//Background generation variables
var background = [];
var backRows = (_canvas.width - 128) / 32;
var backCols = (_canvas.height - 128) / 32;


var collidableTiles = [];
var indexForCollidableTiles = 0;
var tileMap = [];

// The activeBtns array is set in each enter function for each state and holds the buttons currently on screen.
var activeBtns = [];

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
var gravity = 1;

window.addEventListener("keydown", onKeyDown);
window.addEventListener("keyup", onKeyUp);
window.addEventListener("load",start);
_canvas.addEventListener("mousemove", updateMouse);
_canvas.addEventListener("click", actions.onMouseClick);


function start(event)
{
    for (var i = 0; i < assets.buttons.length; i++)
    {
        var tempBtn = new Image();
        tempBtn.src = assets.buttons[i].img;
        tempBtn.addEventListener("load", onStart);
        assets.buttons[i].img = tempBtn; // .img used to hold the path string, now it holds the actual image object.
        var tempBtnO = new Image();
        tempBtnO.src = assets.buttons[i].imgO;
        tempBtnO.addEventListener("load", onStart);
        assets.buttons[i].imgO = tempBtnO;
    }

    //Load screen images
    screens[0].src = "Resources/Images/titleScreen.png";
    screens[1].src = "Resources/Images/gameOverScreen.png";
}

function onStart(event)
{
    console.log("assetsLoaded : " + stateMachine.assetsLoaded);
    if (++stateMachine.assetsLoaded == stateMachine.numAssets)
        stateMachine.initGame();
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

        case KeyCode.R:
            if(stateMachine.currState == stateMachine.State.GAME_STATE)
            {
		        traps.trapsArray = [];
                collidableTiles = [];
                actions.onStartClick();
            }
            break;
    }
}

function checkInput()
{
    if(sPressed == false)
    {
        player.crouching = false;
        player.height = 60;
    }
    if (sPressed == true)
    {
        player.crouching = true;
        // player.height = 30;
        player.idle = false;
        player.running = false;
    }
    else if (aPressed == true) // left
    {
        player.dir = player.PlayerDirection.LEFT;
        player.idle = false;
        player.running = true;
        player.img = player.playerImages[player.PlayerImageType.PLAYER_LEFT];
        if (player.velX > -player.speed)
        {
            player.velX--;
        }
    }
    else if (dPressed == true) // Right
    {
        player.dir = player.PlayerDirection.RIGHT;
        player.idle = false;
        player.running = true;
        player.img = player.playerImages[player.PlayerImageType.PLAYER_RIGHT];
        if (player.velX < player.speed)
        {
            player.velX++;
        }
    }
    else if(player.jumping == false)
    {
        player.idle = true;
        player.running = false;
        if (player.dir == player.PlayerDirection.RIGHT)
            player.img = player.playerImages[player.PlayerImageType.PLAYER_RIGHT];
        else
            player.img = player.playerImages[player.PlayerImageType.PLAYER_LEFT];
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

    player.x += player.velX;
    player.y += player.velY;
    player.velX *= friction;
    player.velY += gravity;

    if (player.x >= _canvas.width - player.width - tileSize / 2)
    {
        player.x = _canvas.width - player.width - tileSize / 2;
    }
    else if (player.x <= tileSize / 2)
    {
        player.x = tileSize / 2;
    }

    if (player.y >= _canvas.height - 64 - tileSize / 2)
    {
        player.y = _canvas.height - 64 - 64;
        player.jumping = false;
    }
    else if(player.y <= 64)
    {
        player.y = 64;
    }

    collisionHandler.handleCollisionWithTiles();
}

// This function sets the mouse x and y position as it is on the canvas where 0,0 is top-left of canvas.
function updateMouse(event)
{
    var rect = _canvas.getBoundingClientRect();
    mouse.x = event.clientX - rect.left;
    mouse.y = event.clientY - rect.top;
}
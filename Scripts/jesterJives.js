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
var screens = [new Image(), new Image()];

var playerSpriteWidth = 64; //These are used for height and width of sprite on the spritesheet
var playerSpriteHeight = 64;//Only change if sprite sheet is changed
/* states is an array of objects where each object is a state with an enter, update and exit function. These
 functions get called in the changeState function. */

var State = {
                MENU_STATE : 0,
                GAME_STATE : 1,
                HELP_STATE : 2,
                GAME_OVER_STATE : 3
            };

var buttonType = {
                    START : 0,
                    HELP : 1,
                    EXIT : 2,
					TRY_AGAIN: 3
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
                    LAND_TILE_L: 22,
                    LAND_TILE_L_OPP: 23,
                    TRAP_TILE : 19,
                    BACK_TILE_1: 25,
                    BACK_TILE_2: 26,
                    BACK_TILE_3: 27,
                    BACK_TILE_4: 28,
                };

var LandTile = {
                    WITH_2_SUB_TILES:0,
                    WITH_4_SUB_TILES:1,
                    WITH_3_SUB_TILES:2,
                    WITH_3_SUB_TILES_OPP:3
               };

var SubTileType = {
                    TOP_COLLIDABLE:0,
                    BOTTOM_COLLIDABLE:1,
                    LEFT_COLLIDABLE:2,
                    RIGHT_COLLIDABLE:3
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
                    DOWN_ARROW : 40,
                    R : 82
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
                        },
						{
							enter: enterGameOver,//Game over state
							update: updateGameOver,
							exit: exitGameOver
						}
                    ];


// These two variables should be indices for the states array.
var lastState = -1;
var currState = -1;

// The buttons array stores information about all buttons for my simple UI that just changes states.
var buttons = [
                {   img:"Resources/Images/btnStart.png",// Start button
                    imgO:"Resources/Images/btnStartO.png",
                    x:273,
                    y:512,
                    w:478,
                    h:141,
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
                },
				{
					img: "Resources/Images/btnTryAgain.png",//Try again button
					imgO: "Resources/Images/btnTryAgainO.png",
					x: 273,
					y: 412,
					w: 478,
					h: 141,
					over: false,
					click: onTryAgainClick
				}
            ];

// Player Characteristics
var player = {
                x: 64,
                y: 640, //y:canvas.height/2,
                width: 28, // To ensure not to touch the outside of the canvas or wall, etc
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
                crouching: false,
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

var SubTileCoordinates = [
                            {
                                x:0,
                                y:0,
                                height:64,
                                width:64
                            },
                            {
                                x:64,
                                y:0,
                                height:64,
                                width:64
                            },
                            {
                                x:0,
                                y:64,
                                height:64,
                                width:64
                            },
                            {
                                x:64,
                                y:64,
                                height:64,
                                width:64
                            }
                         ];

var TileDetails = [
                            {
                                numOfSubTiles:4,
                                emptyTilePosition:[0]
                            },
                            {
                                numOfSubTiles:2,
                                emptyTilePosition:[3,4]
                            },
                            {
                                numOfSubTiles:3,
                                emptyTilePosition:[2]
                            },
                            {
                                numOfSubTiles:3,
                                emptyTilePosition:[3]
                            }
                         ];

//Background generation variables
var background = [];
var backRows = (_canvas.width - 128) / 32;
var backCols = (_canvas.height - 128) / 32;

var traps = [];
var tiles = [];
var numOfTotalTiles = 29;
for(var i = 1 ; i <= numOfTotalTiles ; i++){
    tiles[i-1] = "Resources/Images/Tiles/Tile (" + i + ").png";
}

var fire =
{
	isTrap: true,
	img:getImageForPath(tiles[TileType.TRAP_TILE]),
	x: 0,//used for finding collision
	y: 0,
	
	//Animation properties/methods
	frameIndex: 0,
    currentFrame: 0,
    framesPerSprite: 4, //the number of frames the individual sprite will be drawn for
	
	animate: function()
	{
		
        this.currentFrame++;
        if(this.currentFrame == this.framesPerSprite)
        {
            this.frameIndex++;
            this.currentFrame = 0;
            if(this.frameIndex == 3)
            {
                this.frameIndex = 0;
            }
        }		
	},
	
	activate: function()
	{
		if
		(player.y < this.y+64 
		&& player.y+64 > this.y 
		&& player.x < this.x+64 
		&& player.x+64 > this.x)
		{
			setTimeout(
			function(){
			    changeState(State.GAME_OVER_STATE);
                player.x = 64;
                player.y = 640;
                player.velX = 0;
                player.velY = 0;}, 250
			)
		}
	}
};


var collidableTiles = [];
var indexForCollidableTiles = 0;
var tileMap = [];

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
var gravity = 0.3;

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
    playerImages[1].src = "Resources/Images/Player/playerRight2.png";
	
	//Load screen images
	screens[0].src = "Resources/Images/titleScreen.png";
	screens[1].src = "Resources/Images/gameOverScreen.png";
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

        case KeyCode.R:
            if(currState == State.GAME_STATE)
            {
		        traps = [];
                collidableTiles = [];
                onStartClick();
            }
            break;
    }
}

function checkInput()
{
    if(sPressed == false)
    {
        player.crouching = false;
        player.height = 64;
    }
    if (sPressed == true)
    {
        player.crouching = true;
        player.height = 32;
        player.idle = false;
        player.running = false;
    }
    else if (aPressed == true) // left
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

    player.x += player.velX;
    player.y += player.velY;
    player.velX *= friction;
    player.velY += gravity;

    if (player.x >= _canvas.width - player.width - tileSize / 2) {
        player.x = _canvas.width - player.width - tileSize / 2;
    }
    else if (player.x <= tileSize / 2) {
        player.x = tileSize / 2;
    }

    if (player.y >= _canvas.height - 64 - tileSize / 2) {
        player.y = _canvas.height - 64 - tileSize / 2;
        player.jumping = false;
    }

    handleCollisionWithTiles();
}

function handleCollisionWithTiles()
{


    for(var i = 0; i < collidableTiles.length ; i++)
    {
        var firstChk = (player.y + 2 > collidableTiles[i].y + collidableTiles[i].height);
        var secondChk = (player.y + player.height - 2 < collidableTiles[i].y);
        var thirdChk = (player.x + 2 > collidableTiles[i].x + collidableTiles[i].width);
        var fourthChk = (player.x + player.width - 2 < collidableTiles[i].x);

        if (!firstChk && !secondChk && !thirdChk && ! fourthChk)
        {
            var tileTypes = collidableTiles[i].tileType;
            for(var j = 0 ; j < tileTypes.length;j++)
            {

                if (tileTypes[j] == SubTileType.TOP_COLLIDABLE
                    && player.y + player.height >= collidableTiles[i].y
                    && player.y + player.height < collidableTiles[i].y + collidableTiles[i].height)

                {
                    player.y = collidableTiles[i].y - collidableTiles[i].height;
                    player.jumping = false;
                }
                if(tileTypes[j] == SubTileType.BOTTOM_COLLIDABLE
                    && player.y <= collidableTiles[i].y +collidableTiles[i].height
                    && player.y + player.height > collidableTiles[i].y)

                {
                    player.y = collidableTiles[i].y + collidableTiles[i].height;
                }
                // if(tileTypes[j] == SubTileType.RIGHT_COLLIDABLE
                //     && player.x + player.width <= collidableTiles[i].x
                //     && player.x < collidableTiles[i].x+collidableTiles[i].width)
                //
                // {
                //     player.x = collidableTiles[i].x + collidableTiles[i].width;
                // }
                // if(tileTypes[j] == SubTileType.RIGHT_COLLIDABLE
                //     && player.x >= collidableTiles[i].x + collidableTiles[i].width
                //     && player.x < collidableTiles[i].x+collidableTiles[i].width)
                //
                // {
                //     player.x = collidableTiles[i].x - player.width;
                // }

            }

        }
    }
}

function generateBackground()
{
    for(var i = 0; i < backRows; i++)
    {
        background[i] = [];
        for(var j = 0; j < backCols; j++)
        {
            var randNum = Math.floor(Math.random()*8);//Random number to decide back tile
            var tempTile =
                {
                    x: i * 32 + 64,
                    y: j * 32 + 64,
                    img: undefined
                }

            switch(randNum)//Decides background tile based on randNum
            {
                case 0:
                    tempTile.img = getImageForPath(tiles[TileType.BACK_TILE_1]);
                    break;
                case 1:
                    tempTile.img = getImageForPath(tiles[TileType.BACK_TILE_1]);
                    break;
                case 2:
                    tempTile.img = getImageForPath(tiles[TileType.BACK_TILE_2]);
                    break;
                case 3:
                    tempTile.img = getImageForPath(tiles[TileType.BACK_TILE_2]);
                    break;
                case 4:
                    tempTile.img = getImageForPath(tiles[TileType.BACK_TILE_3]);
                    break;
                case 5:
                    tempTile.img = getImageForPath(tiles[TileType.BACK_TILE_3]);
                    break;
                case 6:
                    tempTile.img = getImageForPath(tiles[TileType.BACK_TILE_4]);
                    break;
                case 7:
                    tempTile.img = getImageForPath(tiles[TileType.BACK_TILE_4]);
                    break;
            }

            background[i][j] = tempTile;
        }
    }
}

function updateAnimation()//called from updateGame
{
    player.animate();
	animateTraps();
}

function animateTraps()//called from updateAnimation
{
	fire.animate();
}

function activateTraps()//called from updateGame
{
	for(var i = 0; i < traps.length; i++)
	{
		traps[i].activate();
	}
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

function enterGameOver()
{
	console.log("Entering game over state.");
	_stage.style.backgroundColor = "darkRed";
	activeBtns = [ buttons[buttonType.TRY_AGAIN] ];
}

function updateGameOver()
{
	console.log("In game over state");
	checkButtons();
	render();
}

function exitGameOver()
{
	console.log("Exiting game over state");
}

function enterMenu()
{
    console.log("Entering menu state.");
    _stage.style.backgroundColor = "darkRed";
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
    _stage.style.backgroundColor = "black";
    activeBtns = [ buttons[buttonType.HELP], buttons[buttonType.EXIT] ];
    generateMap();
}

function generateMap()
{
    setupEmptyMapArray();
    generateRandomLandTiles();
    generateBackground();
}

function generateRandomLandTiles()
{
    var numOfLandTilesInCurrentRow = 0;
    var numOfTrapsInCurrentRow = 0;

    for(var i = 1 ; i < numOfRows - 1; i++)
    {
        for ( var j = 1 ; j < (numOfColumns - 1); j++)
        {
            var rand = Math.round(Math.random() * 13);
            var data = "empty";

            if(previousTileType != TileType.LAND_TILE_4 && rand > 0 && rand < 3 && numOfLandTilesInCurrentRow <= numOfMaxLandTilesInRow)
            {
                data = {
                            img:getImageForPath(tiles[TileType.LAND_TILE_4]),
                            tileDetails:TileDetails[LandTile.WITH_4_SUB_TILES]
                       };

                numOfLandTilesInCurrentRow++;
                previousTileType = TileType.LAND_TILE_4;
            }
            else if(previousTileType != TileType.LAND_TILE_2 && rand > 3 && rand < 6 && numOfLandTilesInCurrentRow <= numOfMaxLandTilesInRow)
            {
                data = {
                            img:getImageForPath(tiles[TileType.LAND_TILE_2]),
                            tileDetails:TileDetails[LandTile.WITH_2_SUB_TILES]
                        };

                numOfLandTilesInCurrentRow++;
                previousTileType = TileType.LAND_TILE_2;
            }
            else if(previousTileType != TileType.LAND_TILE_L && rand > 6 && rand < 9 && numOfLandTilesInCurrentRow <= numOfMaxLandTilesInRow)
            {
                data = {
                            img:getImageForPath(tiles[TileType.LAND_TILE_L]),
                            tileDetails:TileDetails[LandTile.WITH_3_SUB_TILES]
                       };

                numOfLandTilesInCurrentRow++;
                previousTileType = TileType.LAND_TILE_L;
            }
            else if(previousTileType != TileType.LAND_TILE_L_OPP && rand > 9 && rand < 12 && numOfLandTilesInCurrentRow <= numOfMaxLandTilesInRow)
            {
                data = {
                            img:getImageForPath(tiles[TileType.LAND_TILE_L_OPP]),
                            tileDetails:TileDetails[LandTile.WITH_3_SUB_TILES_OPP]
                        };

                numOfLandTilesInCurrentRow++;
                previousTileType = TileType.LAND_TILE_L_OPP;
            }
            else if(rand % 2 == 0 && rand > 2 && rand < 8)//Traps
            {
                data = Object.create(fire);
				data.x = j*tileSize;
				data.y = i*tileSize;
				traps.push(data);

                numOfTrapsInCurrentRow++;
                previousTileType = TileType.TRAP_TILE;
            }

            if(data != "empty")
            {
                setCollisionTilesDataFor(previousTileType,j,i);
            }

            tileMap[i][j] = data;

        }
        numOfLandTilesInCurrentRow = 0;
    }
}

function setCollisionTilesDataFor(tileType,posInRow,posInCol)
{
    indexForCollidableTiles++;
    if(tileType==TileType.LAND_TILE_4)
    {
        var tile1 = {x:posInRow*tileSize,
                     y:posInCol*tileSize,
                     width:64,
                     height:64,
                     tileType:[SubTileType.TOP_COLLIDABLE,SubTileType.LEFT_COLLIDABLE]
                    };

        var tile2 = {x:posInRow*tileSize+64,
                     y:posInCol*tileSize,
                     width:64,
                     height:64,
                     tileType:[SubTileType.TOP_COLLIDABLE,SubTileType.RIGHT_COLLIDABLE]
                    };

        var tile3 = {x:posInRow*tileSize,
                     y:posInCol*tileSize+64,
                     width:64,
                     height:64,
                     tileType:[SubTileType.BOTTOM_COLLIDABLE,SubTileType.LEFT_COLLIDABLE]
                    };

        var tile4 = {x:posInRow*tileSize+64,
                     y:posInCol*tileSize+64,
                     width:64,
                     height:64,
                     tileType:[SubTileType.BOTTOM_COLLIDABLE,SubTileType.RIGHT_COLLIDABLE]
                    };

        collidableTiles.push(tile1);
        collidableTiles.push(tile2);
        collidableTiles.push(tile3);
        collidableTiles.push(tile4);


    }
    else if (tileType==TileType.LAND_TILE_2)
    {
        var tile1 = {x:posInRow*tileSize,
            y:posInCol*tileSize,
            width:64,
            height:64,
            tileType:[SubTileType.TOP_COLLIDABLE,SubTileType.BOTTOM_COLLIDABLE,SubTileType.LEFT_COLLIDABLE]
        };

        var tile2 = {x:posInRow*tileSize+64,
            y:posInCol*tileSize,
            width:64,
            height:64,
            tileType:[SubTileType.TOP_COLLIDABLE,SubTileType.BOTTOM_COLLIDABLE,SubTileType.RIGHT_COLLIDABLE]
        };

        collidableTiles.push(tile1);
        collidableTiles.push(tile2);
    }
    else if (tileType==TileType.LAND_TILE_L)
    {
        var tile1 = {
            x:posInRow*tileSize,
            y:posInCol*tileSize,
            width:64,
            height:64,
            tileType:[SubTileType.TOP_COLLIDABLE,SubTileType.LEFT_COLLIDABLE,SubTileType.RIGHT_COLLIDABLEs]
        };

        var tile3 = {
            x:posInRow*tileSize,
            y:posInCol*tileSize+64,
            width:64,
            height:64,
            tileType:[SubTileType.BOTTOM_COLLIDABLE,SubTileType.LEFT_COLLIDABLE]
        };

        var tile4 = {
            x:posInRow*tileSize+64,
            y:posInCol*tileSize+64,
            width:64,
            height:64,
            tileType:[SubTileType.TOP_COLLIDABLE,SubTileType.RIGHT_COLLIDABLE,SubTileType.BOTTOM_COLLIDABLE]
        };

        collidableTiles.push(tile1);
        collidableTiles.push(tile3);
        collidableTiles.push(tile4);
    }
    else if (tileType==TileType.LAND_TILE_L_OPP)
    {
        var tile1 = {
            x:posInRow*tileSize,
            y:posInCol*tileSize,
            width:64,
            height:64,
            tileType:[SubTileType.TOP_COLLIDABLE,SubTileType.LEFT_COLLIDABLE,SubTileType.BOTTOM_COLLIDABLE]
        };

        var tile2 = {x:posInRow*tileSize+64,
            y:posInCol*tileSize,
            width:64,
            height:64,
            tileType:[SubTileType.TOP_COLLIDABLE,SubTileType.RIGHT_COLLIDABLE]
        };

        var tile4 = {x:posInRow*tileSize+64,
            y:posInCol*tileSize+64,
            width:64,
            height:64,
            tileType:[SubTileType.BOTTOM_COLLIDABLE,SubTileType.LEFT_COLLIDABLE,SubTileType.RIGHT_COLLIDABLE]
        };

        collidableTiles.push(tile1);
        collidableTiles.push(tile2);
        collidableTiles.push(tile4);
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
        tileMap[i] = [];
        for(j = 0 ; j < numOfColumns; j++)
        {
            tileMap[i][j] = "empty";
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
	activateTraps();
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
	if(currState == State.MENU_STATE)
	{
		surface.drawImage(screens[0], 0, 0, 1024, 768);
	}
	if(currState == State.GAME_OVER_STATE)
	{
		surface.drawImage(screens[1], 0, 0, 1024, 768);
	}
    if(currState == State.GAME_STATE)
    {
        //DRAW BACKGROUND TILES
        for(var i = 0; i < backRows; i++)
        {
            for(var j = 0; j < backCols; j++)
            {
                surface.drawImage(background[i][j].img, background[i][j].x, background[i][j].y);
            }
        }

        renderBorderTiles();

        for(var i = 0; i < numOfRows ; i++)
        {
            for (var j = 0 ; j < numOfColumns ; j++)
            {
                if(tileMap[i][j].isTrap == true)
				{
					surface.drawImage(tileMap[i][j].img, tileMap[i][j].frameIndex*64, 0, 64, 64, j * tileSize, i * tileSize, 64, 64);
				}
                else if(tileMap[i][j] !== "empty" && tileMap[i][j].isTrap !== true)
                {
                    surface.drawImage(tileMap[i][j].img, j * tileSize, i * tileSize);
                }
            }
        }


        //DRAW PLAYER
        if (player.idle == true)
        {
            surface.drawImage(player.img,
                0, 0, playerSpriteWidth, playerSpriteHeight,
                player.x-18, player.y, playerSpriteWidth, playerSpriteHeight);
        }
        else if(player.crouching == true)
            surface.drawImage(player.img,
                player.dir ? playerSpriteWidth*7 : playerSpriteWidth*2, 256, playerSpriteWidth, playerSpriteHeight,
                player.x-18, player.y, playerSpriteWidth, playerSpriteHeight);
        else if(player.jumping == true)
            surface.drawImage(player.img,
                player.dir ? playerSpriteWidth*2 : playerSpriteWidth*7 , 256, playerSpriteWidth, playerSpriteHeight,
                player.x-18, player.y, playerSpriteWidth, playerSpriteHeight);
        else if(player.running == true)
            surface.drawImage(player.img,
                player.frameIndex*playerSpriteWidth, 128, playerSpriteWidth, playerSpriteHeight,
                player.x-18, player.y, playerSpriteWidth, playerSpriteHeight);


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

function onTryAgainClick()
{
    traps = [];
    collidableTiles = [];
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
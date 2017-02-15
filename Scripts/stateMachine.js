var StateMachine = function(parentClass){

    // These two variables should be indices for the states array.
    this.lastState = -1;
    this.currState = -1;
    this.numAssets = 6;
    this.assetsLoaded = 0;

    this.State = {
        MENU_STATE : 0,
        GAME_STATE : 1,
        HELP_STATE : 2,
        GAME_OVER_STATE : 3
    };

    this.stateContainer = [
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

    this.initGame = function()
    {
        console.log("game initialized");
        this.changeState(this.State.MENU_STATE); // Change to menu state.
    }

    this.changeState = function(stateToRun)
    {
        if (stateToRun >= 0 && stateToRun < this.stateContainer.length) // Just a check to see if the state to run is valid.
        {
            if (this.currState >= 0) // The only time this doesn't run is the very first state change.
            {
                clearInterval(updateIval); // Stops the current setInterval method, which is the update function for the current state.
                this.stateContainer[this.currState].exit(); // Will call the appropriate exit function of the current state.
            }
            this.lastState = this.currState;
            this.currState = stateToRun;
            this.stateContainer[this.currState].enter(); // Will call the appropriate enter function of the current state. For initialization, etc.
            updateIval = setInterval(this.stateContainer[this.currState].update, fpsMS);
        }
        else
            console.log("Invalid stateToRun!");
    }


};

function enterGameOver()
{
    _stage.style.backgroundColor = "darkRed";
    activeBtns = [ assets.buttons[assets.buttonType.TRY_AGAIN] ];
}

function updateGameOver()
{
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
    activeBtns = [ assets.buttons[assets.buttonType.START] ];
}

function updateMenu()
{
    checkButtons();
    render();

}

function exitMenu()
{
    console.log("Exiting menu state.");
}

function enterGame()
{
    _stage.style.backgroundColor = "black";
    activeBtns = [ assets.buttons[assets.buttonType.HELP], assets.buttons[assets.buttonType.EXIT] ];
    levelGenerator.generateMap();
}

function updateGame()
{
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
    _stage.style.backgroundColor = "green";
    activeBtns = [ assets.buttons[assets.buttonType.EXIT] ];
}

function updateHelp()
{
    checkButtons();
    render();
}

function exitHelp()
{
    console.log("Exiting help state.");
}

function updateAnimation()//called from updateGame
{
    player.animate();
    animateTraps();
}

function animateTraps()//called from updateAnimation
{
    traps.fire.animate();
}

function activateTraps()//called from updateGame
{
    for(var i = 0; i < traps.trapsArray.length; i++)
    {
        traps.trapsArray[i].activate();
    }
}

// This checkButtons function is basically a box-collision-based test with the mouse location and each active button.
function checkButtons()
{
    console.log("checking buttons " + mouse);
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

// Basically being used just for each button. Draws the button image based on its over property.
function render()
{
    surface.clearRect(0, 0, _canvas.width, _canvas.height);
    document.body.style.cursor = "default";
    if(stateMachine.currState == stateMachine.State.MENU_STATE)
    {
        surface.drawImage(screens[0], 0, 0, 1024, 768);
    }
    if(stateMachine.currState == stateMachine.State.GAME_OVER_STATE)
    {
        surface.drawImage(screens[1], 0, 0, 1024, 768);
    }
    if(stateMachine.currState == stateMachine.State.GAME_STATE)
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
                0, 0, player.playerSpriteWidth, player.playerSpriteHeight,
                player.x-18, player.y, player.playerSpriteWidth, player.playerSpriteHeight);
        }
        else if(player.crouching == true)
            surface.drawImage(player.img,
                player.dir ? player.playerSpriteWidth*7 : player.playerSpriteWidth*2, 256, player.playerSpriteWidth, player.playerSpriteHeight,
                player.x-18, player.y, player.playerSpriteWidth, player.playerSpriteHeight);
        else if(player.jumping == true)
            surface.drawImage(player.img,
                player.dir ? player.playerSpriteWidth*2 : player.playerSpriteWidth*7 , 256, player.playerSpriteWidth, player.playerSpriteHeight,
                player.x-18, player.y, player.playerSpriteWidth, player.playerSpriteHeight);
        else if(player.running == true)
            surface.drawImage(player.img,
                player.frameIndex*player.playerSpriteWidth, 128, player.playerSpriteWidth, player.playerSpriteHeight,
                player.x-18, player.y, player.playerSpriteWidth, player.playerSpriteHeight);


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

function renderBorderTiles()
{
    var i, j;

    //setup corner images
    surface.drawImage(utilities.getImageForPath(assets.tiles[assets.TileType.TOP_LEFT]), 0, 0);
    surface.drawImage(utilities.getImageForPath(assets.tiles[assets.TileType.TOP_RIGHT]), 7.5*tileSize, 0);
    surface.drawImage(utilities.getImageForPath(assets.tiles[assets.TileType.BOTTOM_LEFT]), 0, 5.5*tileSize);
    surface.drawImage(utilities.getImageForPath(assets.tiles[assets.TileType.BOTTOM_RIGHT]), 7.5*tileSize, 5.5*tileSize);

    //setup top horizontal assets.tiles
    for ( i = 1 ; i < 15 ; i++)
    {
        surface.drawImage(utilities.getImageForPath(assets.tiles[assets.TileType.TOP_HORIZONTAL]) , i * tileSize/2, 0);
    }

    //setup bottom horizontal tiles
    for ( i = 1 ; i < 15; i++)
    {
        surface.drawImage(utilities.getImageForPath(assets.tiles[assets.TileType.BOTTOM_HORIZONTAL]) , i * tileSize/2, 5.5*tileSize);
    }

    //setup left vertical tiles
    for ( j = 1 ; j < 11; j++)
    {
        surface.drawImage(utilities.getImageForPath(assets.tiles[assets.TileType.LEFT_VERTICAL]),0,j*tileSize/2);
    }

    //setup right vertical tiles
    for ( j = 1 ; j < 11; j++)
    {
        surface.drawImage(utilities.getImageForPath(assets.tiles[assets.TileType.RIGHT_VERTICAL]) , 7.5*tileSize, j*tileSize/2 );
    }
}
//********************************//
//********* JESTER JIVES *********//
//***** CREATED BY SECTION C *****//
//********************************//

//********************************//
//********** SECTION C ***********//
//********************************//
//****** DAVID LAFANTAISIE *******//
//**** INDERDEEP SINGH KHANNA ****//
//******* SHERALD LINQUICO *******//
//********* MAC MAUNDER **********//
//********** ANDY TSE ************//
//********* MALVIK RAVAL *********//
//******** JEAN BORBERLY *********//
//********************************//

//********************************//
//********* LAST UPDATE **********//
//******* MARCH 13th 2017 ********//
//********************************//

//LEGEND
// Main section of code === //*****HEADING*****//
// Sub section of code === //-----Sub Heading-----//

//Variables that are directly related to a section of code
//are placed underneath the main heading

//General order of events
/*
 - Assets are loaded
 - Splash screen displayed, then game initialized
 - Event listeners are initialized
 - Menu state is entered via state machine
 - Next state is entered based on button player clicks
 - When game state is entered, generate functions are called
 - When player enters a door, traps array is cleared and new room generated, repositions player
 - If player dies, die function is called, state is changed to game over state
*/

//IIFE
(function (){

//*****GLOBAL VARIABLES*****//

//-----Constants-----//

var FPS = 16.67;//30 FPS = 33.34, 60 FPS = 16.67
var SIZE = 32;
var ROWS = 16;
var COLS = 16;
var BROWS = 18;
var BCOLS = 18;
var numOfLevelsPassed = 0;

var friction = 0.7;
var gravity = 0.26;

var dir =
{
	NORTH: 1,
	EAST: 2,
	SOUTH: 3,
	WEST: 4
};

var levelTheme =
	{
		DARK_STONE : 1,
		WHITE_STONE : 2
	};
var currentLevelTheme = levelTheme.DARK_STONE;

//-----Canvas Setup-----//

var canvas = document.getElementById("canvas");
canvas.width = 640;
canvas.height = 640;
var surface = canvas.getContext("2d");

//*****TRAPS*****//

/*Each trap should have the following properties

var trap =
{
	isTrap: true,
	x: 0,
	y: 0,
	collidable: false, //If this is true, trap will collide like normal platforms
	width: SIZE,
	height: SIZE,

	img: undefined,
	spriteWidth: SIZE,
	spriteHeight: SIZE,
	frameIndex: 0,
    currentFrame: 0,
    framesPerSprite: 6, //Number of frames each individual sprite will be rendered for
	animate:
	function()
	{
		this.currentFrame++;
        if(this.currentFrame === this.framesPerSprite)
        {
            this.frameIndex++;
            this.currentFrame = 0;
            if(this.frameIndex == changeThisVariable)
            {
                this.frameIndex = 0;
            }
        }
	},

	activate:
	function()
	{
		blah;
		blahBlah;
	}
};

*/

var fire =
{
	isTrap: true,
	x: 0,
	y: 0,
	collidable: false,
	width: SIZE,
	height: SIZE,

	img: undefined,
	spriteWidth: SIZE,
	spriteHeight: SIZE,
	frameIndex: 0,
    currentFrame: 0,
    framesPerSprite: 3,
	animate:
	function()
    {
        this.currentFrame++;
        if(this.currentFrame === this.framesPerSprite)
        {
            this.frameIndex++;
            this.currentFrame = 0;
            if(this.frameIndex == 8)
            {
                this.frameIndex = 0;
            }
        }
    },

	activate:
	function()
	{
		if(player.x < this.x+this.width-10 &&
			player.x+player.width > this.x+10 &&
			player.y < this.y+this.height-10 &&
			player.y+player.height > this.y+10)
		{
			window.setTimeout(die, 100);
		}
	}
};

var spikes =
{
	isTrap: true,
	x: 0,
	y: 0,
	collidable: false, //If this is true, trap will collide like normal platforms
	width: SIZE,
	height: SIZE,

	img: undefined,
	spriteWidth: SIZE,
	spriteHeight: SIZE,
	frameIndex: 0,
    currentFrame: 0,
    framesPerSprite: 8, //Number of frames each individual sprite will be rendered for
	animate:
	function()
	{
		this.currentFrame++;
        if(this.currentFrame === this.framesPerSprite)
        {
            this.frameIndex++;
            this.currentFrame = 0;
            if(this.frameIndex == 3)
            {
                this.frameIndex = 0;
            }
        }
	},

	activate:
	function()
	{
		if(player.y < this.y
			&& player.y+SIZE > this.y-10
			&& player.x < this.x + SIZE
			&& player.x > this.x)
		{
			window.setTimeout(die, 100);
		}
	}
};

var teleporter =
{
	isTrap: true,
	x: 0,
	y: 0,
	collidable: false, //If this is true, trap will collide like normal platforms
	width: SIZE,
	height: SIZE,

	img: undefined,
	spriteWidth: SIZE,
	spriteHeight: SIZE,
	frameIndex: 0,
    currentFrame: 0,
    framesPerSprite: 8, //Number of frames each individual sprite will be rendered for
	animate:
	function()
	{
		this.currentFrame++;
        if(this.currentFrame === this.framesPerSprite)
        {
            this.frameIndex++;
            this.currentFrame = 0;
            if(this.frameIndex == 2)
            {
                this.frameIndex = 0;
            }
        }
	},

	activate:
	function()
	{
		if(player.y < this.y+16 &&
			player.y+16 > this.y &&
			player.x < this.x+16 &&
			player.x+16 > this.x)
		{
			var randX = Math.floor((Math.random()*canvas.width-SIZE)+SIZE/2);
			var randY = Math.floor((Math.random()*canvas.height-SIZE)+SIZE/2);
			
			while(findTile(randX+1, randY+1).img != "empty")
			{
				randX = Math.floor((Math.random()*canvas.width-SIZE)+SIZE/2);
				randY = Math.floor((Math.random()*canvas.height-SIZE)+SIZE/2);
			}
			player.x = randX;
			player.y = randY;
			player.velX = 0;
			player.velY = 0;
		}
	}
};

var arrowSpawn =
{
	isTrap: true,
	isArrowTrap: true,
	x: 0,
	y: 0,
	collidable: false, //If this is true, trap will collide like normal platforms
	width: SIZE,
	height: SIZE,
	dir: dir.WEST,

	img: undefined,
	spriteWidth: SIZE,
	spriteHeight: SIZE,
	frameIndex: 0,
    currentFrame: 0,
    framesPerSprite: 6, //Number of frames each individual sprite will be rendered for
	animate:
	function()
	{
		/*this.currentFrame++;
        if(this.currentFrame === this.framesPerSprite)
        {
            this.frameIndex++;
            this.currentFrame = 0;
            if(this.frameIndex == changeThisVariable)
            {
                this.frameIndex = 0;
            }
        }*/
	},

	counter: 0,
	arrows: [],
	activate:
	function()
	{
		this.counter++;
		if(this.counter % 100 === 0)
		{
			this.shoot();
			this.counter = 0;
		}
		for(var i = 0; i < this.arrows.length; i++)
		{
			if(this.arrows[i].dir === dir.WEST)
				this.arrows[i].x -= this.arrows[i].speed;
			if(this.arrows[i].dir === dir.NORTH)
				this.arrows[i].y -= this.arrows[i].speed;
			if(this.arrows[i].dir === dir.EAST)
				this.arrows[i].x += this.arrows[i].speed;
			if(this.arrows[i].dir === dir.SOUTH)
				this.arrows[i].y += this.arrows[i].speed;

			if(player.x < this.arrows[i].x+this.arrows[i].width &&
				player.x+player.width > this.arrows[i].x &&
				player.y < this.arrows[i].y+this.arrows[i].height &&
				player.y+player.height > this.arrows[i].y+SIZE-SIZE/4)
			{
				die();
			}
			if(this.arrows[i] !== "undefined" && this.arrows[i].x < SIZE)
				this.arrows.splice(i, 1);

			if(this.arrows[i] !== "undefined" && this.arrows[i].y < SIZE)
				this.arrows.splice(i, 1);

			if(this.arrows[i] !== "undefined" && this.arrows[i].x+this.arrows[i].width > canvas.width-SIZE)
				this.arrows.splice(i, 1);

			if(this.arrows[i] !== "undefined" && this.arrows[i].y+this.arrows[i].height > canvas.height-SIZE)
				this.arrows.splice(i, 1);
			
			for(var j = 0; j < ROWS; j++)
			{
				for(var k = 0; k < COLS; k++)
				{
					if(this.arrows[i].x < platforms[j][k].x+platforms[j][k].width && 
						this.arrows[i].x+this.arrows[i].width > platforms[j][k].x &&
						this.arrows[i].y < platforms[j][k].y+platforms[j][k].height &&
						this.arrows[i].y+this.arrows[i].height > platforms[j][k].y &&
						platforms[j][k].isTrap === false &&
						platforms[j][k].img != "empty")
					{
						this.arrows.splice(i, 1);
					}
				}
			}
		}
	},

	shoot:
	function()
	{	var arrow = "undefined";
		if(this.dir === dir.WEST)
		{
			arrow =
			{
				isTrap: true,
				x: this.x,
				y: this.y+13,
				dir: dir.WEST,
				speed: 1,
				collidable: false, //If this is true, trap will collide like normal platforms
				width: 22,
				height: 6,
				img: images[20]
			};
		}
		if(this.dir === dir.NORTH)
		{
			arrow =
			{
				isTrap: true,
				x: this.x+13,
				y: this.y,
				dir: dir.NORTH,
				speed: 1,
				collidable: false, //If this is true, trap will collide like normal platforms
				width: 6,
				height: 16,
				img: images[22]
			};
		}
		if(this.dir === dir.EAST)
		{
			arrow =
			{
				isTrap: true,
				x: this.x,
				y: this.y+13,
				dir: dir.EAST,
				speed: 1,
				collidable: false, //If this is true, trap will collide like normal platforms
				width: 22,
				height: 6,
				img: images[23]
			};
		}
		if(this.dir === dir.SOUTH)
		{
			arrow =
			{
				isTrap: true,
				x: this.x+13,
				y: this.y,
				dir: dir.SOUTH,
				speed: 1,
				collidable: false, //If this is true, trap will collide like normal platforms
				width: 6,
				height: 16,
				img: images[24]
			};
		}
		this.arrows.push(arrow);
		playSound("shoot");
	}
};

//-----Trap Activation-----//

function activateTraps()
{
	for(var i = 0; i < traps.length; i++)
	{
		traps[i].activate();
	}
}

//*****LEVEL GENERATION****//

var background = [];//array for background tile objects
var platforms = [];//array for platform images
var traps = [];//array to hold traps
var coll = [];//array for collidable platforms

var maxTilesInRow = 0;

function generateBackground()
{
	for(var i = 0; i < BROWS; i++)
	{
		background[i] = [];
		for(var j = 0; j < BCOLS; j++)
		{
			var randNum;
			if(currentLevelTheme === levelTheme.DARK_STONE)
				randNum = Math.floor(Math.random()*4+1);
			else
                randNum = Math.floor(Math.random()*4+32);

			var temp =
			{
				x: j*SIZE+32,
				y: i*SIZE+32,
				img: images[randNum]
			}

			background[i][j] = temp;
		}
	}
}

function generateRoom()
{

	for(var i = 0; i < ROWS; i++)
	{
		platforms[i] = [];
		for(var j = 0; j < COLS; j++)
		{
			var temp =
			{
				isTrap: false,
				x: i*SIZE+SIZE*2,
				y: j*SIZE+SIZE*2,
				width: SIZE,
				height: SIZE,
				img: "empty",
				collidable: false
			}

			var tileChance = Math.floor(Math.random()*100);
			if( (i === 7 && j === 0) || (i === 8 && j === 0) )
			{
				if(currentLevelTheme === levelTheme.DARK_STONE)
					temp.img = images[6];
				else if (currentLevelTheme === levelTheme.WHITE_STONE)
					temp.img = images[28];
				temp.collidable = true;
			}
			else if(tileChance <= 24)
			{
				var randNum = Math.floor(Math.random()*4);
				switch(randNum)
				{
					case 0:
                        if(currentLevelTheme === levelTheme.DARK_STONE)
                            temp.img = images[6];
                        else if (currentLevelTheme === levelTheme.WHITE_STONE)
                            temp.img = images[28];
						break;
					case 1:
                        if(currentLevelTheme === levelTheme.DARK_STONE)
                            temp.img = images[7];
                        else if (currentLevelTheme === levelTheme.WHITE_STONE)
                            temp.img = images[29];
						break;
					case 2:
                        if(currentLevelTheme === levelTheme.DARK_STONE)
                            temp.img = images[8];
                        else if (currentLevelTheme === levelTheme.WHITE_STONE)
                            temp.img = images[30];
						break;
					case 3:
                        if(currentLevelTheme === levelTheme.DARK_STONE)
                            temp.img = images[9];
                        else if (currentLevelTheme === levelTheme.WHITE_STONE)
                            temp.img = images[31];
						break;
				}

				temp.collidable = true;
			}
			else if(tileChance > 24 && tileChance <= 28)
			{
				var randTrap = Math.floor(Math.random()*4);
				switch(randTrap)
				{
					case 0:
						temp = Object.create(fire);
						temp.img = images[12];
						break;
					case 1:
						temp = Object.create(spikes);
						temp.img = images[18];
						break;
					case 2:
						temp = Object.create(teleporter);
						temp.img = images[19];
						break;
					case 3:
						temp = Object.create(arrowSpawn);
						var randDir = Math.floor(Math.random()*4);
						switch(randDir)
						{
							case 0:
								temp.dir = dir.WEST;
								temp.img = images[21];
								break;
							case 1:
								temp.dir = dir.NORTH;
								temp.img = images[25];
								break;
							case 2:
								temp.img = images[26];
								temp.dir = dir.EAST;
								break;
							case 3:
								temp.img = images[27];
								temp.dir = dir.SOUTH;
								break;
						}
						break;
				}
				temp.x = i*SIZE+SIZE*2;
				temp.y = j*SIZE+SIZE*2;

				traps.push(temp);
			}
			else
			{
				temp.img = "empty";
			}
			platforms[i][j] = temp;
		}
	}
}

//*****PLAYER*****//

var player =
{
	//Size/movement properties
	x: 576,
	y: 576,
	width: 14,
	height: 28,
	spriteWidth: 32,
	spriteHeight: 32,
	velX: 0,
	velY: 0,
	jumpSpeed: 3,
	speed: 1.5,
	coll: false, //if collided

	//Animation methods/properties
	img: undefined,
	dir: dir.EAST,
	idle: true,
	jumping: false,
	running: false,
	crouching: false,
	frameIndex: 0,
    currentFrame: 0,
    framesPerSprite: 6, //the number of frames the individual sprite will be drawn for

	animate:
	function() //animates the player, gets called from updateAnimation function
    {
        this.currentFrame++;
        if(this.currentFrame === this.framesPerSprite)
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

function die()
{
	traps = [];
	platforms = [];
	background = [];
    arrowSpawn.arrows=[];
	player.x = 576;
	player.y = 576;
	player.velY = 0;
	player.velX = 0;
	changeState(3);
}

//*****PLAYER INPUT*****//

//Event listener holders
var click = -1;
var mouseDown = -1;
var mouseUp = -1;
var mouseMove = -1;
var keyUp = -1;
var keyDown = -1;

//Input variables
var jumpPressed = false;
var rightPressed = false;
var crouchPressed = false;
var leftPressed = false;

var key =
{
	W: 87,
	A: 65,
	S: 83,
	D: 68,
	SPACE: 32,
	UP_ARROW: 38,
	LEFT_ARROW: 37,
	DOWN_ARROW: 40,
	RIGHT_ARROW: 39,
	C:67,
	ESC: 27
}

var mouse = { x: 0, y:0 };

function updateMouse(e)
{
	var rect = canvas.getBoundingClientRect();
	mouse.x = e.clientX - rect.left;
    mouse.y = e.clientY - rect.top;

	if (mouseDown == true
		&& (mouse.x >= minSliderX && mouse.x <= maxSliderX))
	{
		images[43].x = mouse.x - SIZE/2;
	}
}

function clickHandler()
{
	//Determines whether button is clicked or not
	for(var i = 0; i < activeButtons.length; i++)
	{
		if(activeButtons[i].over === true)
		{
			switch(activeButtons[i])
			{
				case buttons[0]: //Start
                    console.log("Check1");
                    changeState(1);
					break;
				case buttons[1]: //Help
                    console.log("Check2");
                    changeState(2);
					break;
				case buttons[2]: //Settings
                    console.log("Check4");
                    changeState(4);
					break;
				case buttons[3]: //Exit
                    console.log("Check5");
                    changeState(5);
					break;
				case buttons[4]: //Main Menu
					console.log("Check4");
                    changeState(0);
					break;
				case buttons[5]: //New
                    console.log("Check5");
                    changeState(1);
                    break;
				case buttons[6]: //Return
                    console.log("Check6");
                    changeState(1);
                    break;
			}
		}
	}

	console.log(findTile(mouse.x, mouse.y));
}

function keyDownHandler(e)
{
	e.preventDefault();
	switch(e.keyCode)
	{
		case key.W:
		case key.UP_ARROW:
		case key.SPACE:
				jumpPressed = true;
			break;
		case key.D:
		case key.RIGHT_ARROW:
			if(rightPressed === false)
				rightPressed = true;
			break;
		case key.S:
		case key.DOWN_ARROW:
			if(crouchPressed === false)
				crouchPressed = true;
			break;
		case key.A:
		case key.LEFT_ARROW:
			if(leftPressed === false)
				leftPressed = true;
			break;
		case key.ESC:
			paused = !paused;
	}
}

function changeTheme()
{
    if(currentLevelTheme === levelTheme.DARK_STONE)
        currentLevelTheme = levelTheme.WHITE_STONE;
    else if (currentLevelTheme === levelTheme.WHITE_STONE)
        currentLevelTheme = levelTheme.DARK_STONE;
    traps = [];
    platforms = [];
    background = [];
    arrowSpawn.arrows=[];
    generateRoom();
    generateBackground();
    player.velY = 0;
}

function keyUpHandler(e)
{
	e.preventDefault();
	switch(e.keyCode)
	{
		case key.W:
		case key.UP_ARROW:
		case key.SPACE:
			jumpPressed = false;
			break;
		case key.D:
		case key.RIGHT_ARROW:
			rightPressed = false;
			break;
		case key.S:
		case key.DOWN_ARROW:
			crouchPressed = false;
			break;
		case key.A:
		case key.LEFT_ARROW:
			leftPressed = false;
			break;
	}
}

function movePlayer()
{
	if(crouchPressed == false)
    {
        player.crouching = false;
        player.height = 60;
    }
    if (crouchPressed == true)
    {
        player.crouching = true;
        player.idle = false;
        player.running = false;
    }
    else if (leftPressed == true) // left
    {
        player.dir = dir.WEST;
        player.idle = false;
        player.running = true;
        player.img = images[11];
        if (player.velX > -player.speed)
        {
            player.velX--;
        }
    }
    else if (rightPressed == true) // Right
    {
        player.dir = dir.EAST;
        player.idle = false;
        player.running = true;
        player.img = images[10];
        if (player.velX < player.speed)
        {
            player.velX++;
        }
    }
    else if(player.jumping == false)
    {
        player.idle = true;
        player.running = false;
        if (player.dir == dir.EAST)
            player.img = images[10];
        else
            player.img = images[11];
    }
    if (jumpPressed == true) // Jump
    {
        player.idle = false;
        if(!player.jumping)
        {
            player.jumping = true;
            player.velY = -player.jumpSpeed*2;
        }
    }

    player.x += player.velX;
    player.y += player.velY;
    player.velX *= friction;
    player.velY += gravity;
}

//****COLLISION*****//

function playerCollision()
{
	//Walls, floor, and roof collision
	if(player.y > canvas.height-SIZE*2 && player.x+player.width > 352)//Floor right side
	{
		player.jumping = false;
		player.y = canvas.height-SIZE*2;
	}
	if(player.y > canvas.height-SIZE*2 && player.x < 288)//Floor left side
	{
		player.jumping = false;
		player.y = canvas.height-SIZE*2;
	}
	if(player.y < SIZE && player.x+player.width > 352)//Roof right side
	{
		player.velY = 0;
		player.y = SIZE;
	}
	if(player.y < SIZE && player.x < 288)//Roof right side
	{
		player.velY = 0;
		player.y = SIZE;
	}
	if(player.x < SIZE)//Left wall top
	{
		if (player.jumping == true)
		{
			jumpFromLeftWall();

		}
		else
			player.x = SIZE;
	}
	if(player.x+player.width > canvas.width-SIZE)//Right wall
	{
        if (player.jumping == true)
        {
            jumpFromRightWall();

		}
		else
			player.x = canvas.width - SIZE - player.width;
	}

	for(var i = 0; i < ROWS; i++)
	{
		for(var j = 0; j < COLS; j++)
		{
			//Top
			if(platforms[i][j].collidable === true &&
				player.x < platforms[i][j].x+SIZE &&
				player.x+player.width > platforms[i][j].x &&
				player.y+player.height > platforms[i][j].y+SIZE-4 &&
				player.y+player.height < platforms[i][j].y+SIZE/4+SIZE)
			{
				player.y = platforms[i][j].y-player.height+SIZE-4;
				player.jumping = false;
				player.velY = 0;
			}
			//Bottom
			else if(platforms[i][j].collidable === true &&
				player.x < platforms[i][j].x+SIZE-4 &&
				player.x+player.width > platforms[i][j].x+4 &&
				player.y < platforms[i][j].y+SIZE &&
				player.y > platforms[i][j].y+SIZE-SIZE/4)
			{
				player.y = platforms[i][j].y+SIZE;
				player.velY = 0;
			}
			//Right
			else if(platforms[i][j].collidable === true &&
				player.x < platforms[i][j].x+SIZE &&
				player.x > platforms[i][j].x+SIZE-SIZE/4 &&
				player.y < platforms[i][j].y+SIZE-SIZE/4 &&
				player.y+player.height > platforms[i][j].y+SIZE/4+SIZE)
			{
                if (player.jumping == true)
                {
                    jumpFromLeftWall();

                }
                else
				player.x = platforms[i][j].x+SIZE;
			}
			//Left
			else if(platforms[i][j].collidable === true &&
				player.x+player.width > platforms[i][j].x &&
				player.x+player.width < platforms[i][j].x+SIZE/4 &&
				player.y < platforms[i][j].y+SIZE-SIZE/4 &&
				player.y+player.height > platforms[i][j].y+SIZE/4+SIZE)
			{
				if (player.jumping == true)
				{
					jumpFromRightWall();
				}
				else
					player.x = platforms[i][j].x-player.width;
			}
		}
	}
}

function jumpFromRightWall()
{
    player.dir = dir.WEST;
    player.idle = false;
    player.running = true;
    player.img = images[11];
    if (player.velX > -player.speed)
    {
        player.velX = -5;
    }
    player.velY = -player.jumpSpeed * 2;
    rightPressed = false;
	playSound("jump");
}

function jumpFromLeftWall()
{
    player.dir = dir.EAST;
    player.idle = false;
    player.running = true;
    player.img = images[11];
    if (player.velX > -player.speed)
    {
        player.velX = 5;
    }
    player.velY = -player.jumpSpeed * 2;
    rightPressed = false;
	playSound("jump");
}

//*****ROOM SWITCHING*****//

var doors =
[
	{ x: 0, y: 288, width: 32, height: 64, img: undefined },//Left
	{ x: 288, y: 0, width: 64, height: 32, img: undefined },//Top
	{ x: 608, y: 288, width: 32, height: 64, img: undefined },//Right
	{ x: 288, y: 608, width: 64, height: 32, img: undefined }//Bottom
];

function switchRoom()
{
	if(player.x+player.width < doors[3].x+doors[3].width && player.x > doors[3].x && player.y+player.height > canvas.height-SIZE/2)//Bottom door
	{
        traps = [];
        platforms = [];
        background = [];
        arrowSpawn.arrows=[];
		generateRoom();
		generateBackground();
		player.velY = 0;
		player.y = SIZE+1;
		numOfLevelsPassed++;
		if(numOfLevelsPassed === 3){
            changeTheme();
		}
	}
	if(player.x+player.width < doors[1].x+doors[1].width && player.x > doors[1].x && player.y < SIZE/2)//Top door
	{
        traps = [];
        platforms = [];
        background = [];
        arrowSpawn.arrows=[];
		generateRoom();
		generateBackground();
		player.velY = 0;
		player.y = canvas.height-SIZE-player.height;
		player.x = doors[3].x-player.width;
        numOfLevelsPassed++;
        if(numOfLevelsPassed === 3){
            changeTheme();
        }
	}
	if(player.x < SIZE && player.y > doors[0].y && player.y+player.height < doors[0].y+doors[0].height && player.y > doors[0].y)//Left door
	{
        traps = [];
        platforms = [];
        background = [];
        arrowSpawn.arrows=[];
		generateRoom();
		generateBackground();
		player.x = canvas.width-SIZE-player.width-1;
		player.velX = 0;
        numOfLevelsPassed++;
        if(numOfLevelsPassed === 3){
            changeTheme();
        }
	}
	if(player.x+player.width > doors[2].x && player.y+player.height < doors[2].y+doors[2].height && player.y > doors[2].y)//Right door
	{
        traps = [];
        platforms = [];
        background = [];
        arrowSpawn.arrows=[];
		generateRoom();
		generateBackground();
		player.x = 0+SIZE+1;
        numOfLevelsPassed++;
        if(numOfLevelsPassed === 3){
            changeTheme();
        }
	}
}

//*****USER INTERFACE*****//

var activeButtons = -1;

var buttons =
[
	/*0*/{ x:230, y:220, width:180, height:53, over:false, img:"images/ui/startButton.png", imgO: "images/ui/startButtonO.png" },//Start
	/*1*/{ x:230, y:500,  width:180, height:53, over:false, img:"images/ui/helpButton.png", imgO: "images/ui/helpButtonO.png"},//Sample Help, 2
    /*2*/{ x:230, y:400,  width:180, height:53, over:false, img:"images/ui/settingsButton.png", imgO: "images/ui/settingsButtonO.png"},//Sample Settings, 3
    /*3*/{ x:230, y:200,  width:180, height:53, over:false, img:"images/ui/exitButton.png", imgO: "images/ui/exitButtonO.png"}, //Sample Exit, 4
    /*4*/{ x:230, y:100,  width:180, height:53, over:false, img:"images/ui/mainmenuButton.png", imgO: "images/ui/mainmenuButtonO.png"}, //Main Menu Button, 5
    /*5*/{ x:230, y:200,  width:180, height:53, over:false, img:"images/ui/newButton.png", imgO: "images/ui/newButtonO.png"},// New Game button, 6
    /*6*/{ x:230, y:200, width:180, height:53, over:false, img:"images/ui/returnButton.png", imgO: "images/ui/returnButtonO.png"}//Return, 7
]

function checkButtonOverlap()
{
	for(var i = 0; i < activeButtons.length; i++)
	{
		if(mouse.x < activeButtons[i].x+activeButtons[i].width && mouse.x > activeButtons[i].x && mouse.y < activeButtons[i].y+activeButtons[i].height && mouse.y > activeButtons[i].y )
		{
			activeButtons[i].over = true;
		}
		if(!(mouse.x < activeButtons[i].x+activeButtons[i].width && mouse.x > activeButtons[i].x && mouse.y < activeButtons[i].y+activeButtons[i].height && mouse.y > activeButtons[i].y ))
		{
			activeButtons[i].over = false;
		}
	}
}


/*
var logo =
[
]

var mouseDown = false;
var slider = { x:270, y:500, width:100, height:3, img:"images/ui/slider.png"}//Slider
var sliderPlaceholder = { x:230, y:450, width:180, height:53, img:"images/ui/sliderPlaceholder.png"}//Placeholder
var slidable = { x:270, y:500,  width:32, height:32, img:"images/ui/jSlider.png"}//Slidable

var minSliderX = slider.x;
var maxSliderX = slider.x + 100;

function onMouseDown()
{
	if (mouseDown == false
		&& (mouse.x >= minSliderX && mouse.x <= maxSliderX))
	{
		mouseDown = true;
		images[43].x = mouse.x - SIZE/2;
	}
}

function onMouseUp()
{
	mouseDown = false;
}
*/

//*****EIGHT HEADS*****//

var activeHeads = -1;

var heads =
[
    /*0*/ { x:30, y:610, width:34, height:30,  own:false, img:"images/heads/one.png", imgO: "images/heads/oneD.png"},
    /*1*/ { x:60, y:610, width:34, height:30,  own:false, img:"images/heads/two.png", imgO: "images/heads/twoD.png"},
    /*2*/ { x:90, y:610, width:34, height:30, own:false, img:"images/heads/three.png", imgO: "images/heads/threeD.png"},
    /*3*/ { x:120, y:610, width:34, height:30, own:false, img:"images/heads/four.png", imgO: "images/heads/fourD.png"},
    /*4*/ { x:150, y:610, width:34, height:30, own:false, img:"images/heads/five.png", imgO: "images/heads/fiveD.png"},
    /*5*/ { x:180, y:610, width:34, height:30, own:false, img:"images/heads/six.png", imgO: "images/heads/sixD.png"},
    /*6*/ { x:210, y:610, width:34, height:30, own:false, img:"images/heads/seven.png", imgO: "images/heads/sevenD.png"},
    /*7*/ { x:240, y:610, width:34, height:30, own:false, img:"images/heads/eight.png", imgO: "images/heads/eightD.png"}
]


function headOwned()
{
    // Temp over func, for checking ui
    for (var i = 0; i < activeHeads.length; i++)
    {
        if(mouse.x < activeHeads[i].x+activeHeads[i].width && mouse.x > activeHeads[i].x && mouse.y < activeHeads[i].y+activeHeads[i].height && mouse.y > activeHeads[i].y )
        {
            activeHeads[i].over = true;
        }
        if(!(mouse.x < activeHeads[i].x+activeHeads[i].width && mouse.x > activeHeads[i].x && mouse.y < activeHeads[i].y+activeHeads[i].height && mouse.y > activeHeads[i].y ))
        {
            activeHeads[i].over = false;
        }
    }
}

//*****UTILITIES*****//


	var bgAudio;
function playBackgroundSound(nameOfSound,shouldLoop)
{
	bgAudio = new Audio("sounds/"+nameOfSound+".mp3");

	if(shouldLoop)
	{
		bgAudio.loop = true;
	}

	bgAudio.play();
}

function toggleBackgroundMusic()
{
	if(bgAudio.paused)
	{
		bgAudio.play();
	}
	else
	{
		bgAudio.pause();
	}
}

function resetBackgroundMusicTo(time)
{
	bgAudio.currentTime = time;
}

function playSound(nameOfSound)
{
	var audio = new Audio("sounds/"+nameOfSound+".mp3");
	audio.play();
}

//Finds the tile that the x and y overlap
function findTile(x, y)
{
	if(x > SIZE*2 && x < canvas.width-SIZE*2 && y > SIZE*2 && y < canvas.height-SIZE*2)
	{
		for(var i = 0; i < ROWS; i++)
		{
			for(var j = 0; j < COLS; j++)
			{
				if(platforms.length !== 0 && x < platforms[i][j].x+SIZE && x > platforms[i][j].x && y < platforms[i][j].y+SIZE && y > platforms[i][j].y)
				{
					var temp = platforms[i][j];
					return temp;
				}
			}
		}
	}
	else
	{
		return "Invalid tile to find";
	}
}

//*****MENU GENERATION*****//
var menuBackground = [];

function generateBackgroundMenu()
{
	for(var i = 0; i < 22; i++)
	{
		menuBackground[i] = [];
		for(var j = 0; j < 22; j++)
		{
			var mRandNum = Math.floor(Math.random()*4+36);
			var menuTemp =
			{
				x: j*SIZE,
				y: i*SIZE,
				img: images[mRandNum]
			}
			menuBackground[i][j] = menuTemp;
		}
	}
}



//*****PAUSE BOOL*****//

var paused = false;


//*****STATE MACHINE*****//

var gameLoop = -1; //Variable to hold the update interval
var currState = -1;
var lastState = -1;

var states =
[
	{ enter: enterMenu, update: updateMenu },//Main menu state, 0
	{ enter: enterGame, update: updateGame },//Game state, 1
	{ enter: enterHelp, update: updateHelp },//Help state, 2
	{ enter: enterGameOver, update: updateGameOver},//Game over state, 3
	{ enter: enterSettings, update: updateSettings}, //Settings State, 4
	{ enter: enterExitMenu, update: updateExitMenu },//Exit, 5
	{ enter: enterWin, update: updateWin} //Win State, 6
];

function changeState(newState)
{
	console.log("Game state changed");
	if(newState >= 0 && newState <= states.length)
	{
		activeButtons = -1;
        activeHeads = -1;
		window.clearInterval(gameLoop);
		lastState = currState;
		currState = newState;
		window.setTimeout(function(){states[currState].enter();}, 10);
	}
	else
		console.log("Invalid state");
}

function enterMenu() //0
{
	generateBackgroundMenu();
	gameLoop = window.setInterval(updateMenu, FPS);
	canvas.style.backgroundColor = "#000000";
	activeButtons = [ buttons[0], buttons [1], buttons[2] ];//New Game, Continue/Start Game, Help, Settings, Exit

	buttons[2].y = 280;
    buttons[1].y = 340;
    //////////////////////////////////////
}

function updateMenu() //0
{
	console.log("In Main Menu");
	checkButtonOverlap();
	render();
}

function enterGame() //1
{

	canvas.style.backgroundColor = "#36454f";
	gameLoop = window.setInterval(updateGame, FPS);
	activeButtons = [];
    activeHeads = [];
	generateBackground();
	generateRoom();
}


function updateGame() //1
{
    if(paused)
    {
        console.log("in IGM");
        checkButtonOverlap();
        menuBackground = [];
        activeButtons = [buttons[4], buttons[1], buttons[2], buttons[3] ]; // Main Menu, Help, Settings, Exit

        buttons[4].x = 230;
        buttons[4].y = 185;
        buttons[1].y = 250;
        buttons[2].y = 315;
        buttons[3].y = 380;
        render();
    }
    else
    {

        activeButtons = [];
        activeHeads = [heads[0], heads[1], heads[2], heads[3], heads[4], heads[5], heads[6],heads[7]];
        headOwned();
        animate();
        render();
        movePlayer();
        switchRoom();
        activateTraps();
        playerCollision();
    }
}



function enterHelp() //2
{
	canvas.style.backgroundColor = "green"; //TEMP
	activeButtons = [buttons [6], buttons[4]]; // Main Menu, Return
	gameLoop = window.setInterval(updateHelp, FPS);

   generateBackgroundMenu();

    surface.drawImage(images[40], 200, 300);

    buttons[4].y = 100;
    buttons[4].x = 80;
    buttons[6].y = 160;
    buttons[6].x = 80;
}

function updateHelp() //2
{

	console.log("in help");
	checkButtonOverlap();
	render();

}

function enterGameOver() //3
{
	generateBackgroundMenu();
	canvas.style.backgroundColor = "#000000";
	activeButtons = [ buttons[4]];
	gameLoop = window.setInterval(updateGameOver, FPS);


    ////////////////////////////////////////////////////
    //make a logo
    buttons[4].x = 230;
    buttons[4].y = 300;
}

function updateGameOver() //3
{
	render();
    checkButtonOverlap();
	console.log("game over");
}

function enterSettings() // State 4
{

	canvas.style.backgroundColor = "red"; //TEMP
	gameLoop = window.setInterval(updateSettings, FPS);
    activeButtons = [buttons [6], buttons[4]]; // Main Menu, Return


   generateBackgroundMenu();

    buttons[4].y = 100;
    buttons[4].x = 80;
    buttons[6].y = 160;
    buttons[6].x = 80;
}

function updateSettings() // 4
{
	console.log("in settings");
	checkButtonOverlap();
	render();
}

function enterExitMenu() // 6
{
	gameLoop = window.setInterval(updateExitMenu, FPS);
	generateBackgroundMenu();
	activeButtons = [ buttons[4]];

    buttons[4].x = 230;
    buttons[4].y = 300;
}

function updateExitMenu()// 6
{
	console.log("in Exit");
	checkButtonOverlap();

	render();
}

function enterWin() // State 7
{
	activeButtons = [ buttons[5], buttons[4] ]; //to go back to main menu
	gameLoop = window.setInterval(updateWin, FPS);

    buttons[5].x = 230;
    buttons[5].y = 240;
    buttons[4].x = 230;
    buttons[4].y = 300;
}

function updateWin() // 7
{
	render();
	checkButtonOverlap();
	console.log("victory!");
}

//*****RENDERING*****//

function animate()
{
	player.animate();
	for(var i = 0; i < traps.length; i++)
	{
		traps[i].animate();
	}
}


function render()
{
	surface.clearRect(0, 0, canvas.width, canvas.height);






	// MENU BACKGROUND //
	if(currState !== 1)
	{
		for(var m = 0; m < 22; m++)
		{
			for(var b = 0; b < 22; b++)
			{
				if(menuBackground.length !== 0)
					surface.drawImage(menuBackground[m][b].img, menuBackground[m][b].x, menuBackground[m][b].y);
			}
		}

		surface.drawImage(images[43], 570, 570);
	}



	//~~~MENU STATE~~~//
	if(currState === 0)
	{
		surface.drawImage(images[13], 140, 0);

	}





	//~~~GAME STATE~~~//
	else if(currState === 1)
	{
		//DRAW BACKGROUND//
		for(var i = 0; i < BROWS; i++)
		{
			for(var j = 0; j < BCOLS; j++)
			{
				if(background.length !== 0)
					surface.drawImage(background[i][j].img, background[i][j].x, background[i][j].y);
			}
		}


		//DRAW PLATFORMS//
		for(var i = 0; i < ROWS; i++)
		{
			for(var j = 0; j < COLS; j++)
			{
				if(platforms.length !== 0 && platforms[i][j].img != "empty" && platforms[i][j].isTrap === false)
					surface.drawImage(platforms[i][j].img, platforms[i][j].x, platforms[i][j].y);
			}
		}


		//DRAW BORDER//
		surface.drawImage(images[5], 0, 0);

		//DRAW DOORS//
		for(var i = 0; i < doors.length; i++)
		{
			surface.drawImage(doors[i].img, doors[i].x, doors[i].y);
		}

		//DRAW HEAD HOLDER//
		surface.drawImage(images[42], 15, 605);

		for(var i = 0; i < activeHeads.length; i++)
		{
			// still need an owned function. if not yet owned, draw dark, if, highlight with original
			if(activeHeads[i].over === true)
			{
				//surface.drawImage(activeHeads[i].imgO, activeHeads[i].x, activeHeads[i].y);
				surface.drawImage(activeHeads[i].img, activeHeads[i].x, activeHeads[i].y);
			}
			else if(activeHeads[i].over === false)
			{
			// surface.drawImage(activeHeads[i].img, activeHeads[i].x, activeHeads[i].y);
				surface.drawImage(activeHeads[i].imgO, activeHeads[i].x, activeHeads[i].y);
			}
		}


		//DRAW TRAPS

		for(var i = 0; i < traps.length; i++)
		{
			surface.drawImage(traps[i].img,
				traps[i].frameIndex*traps[i].spriteWidth, 0, traps[i].spriteWidth, traps[i].spriteHeight,
				traps[i].x, traps[i].y, traps[i].spriteWidth, traps[i].spriteHeight);
			if(traps[i].isArrowTrap === true)
			{
				for(var j = 0; j <  traps[i].arrows.length; j++)
				{
					surface.drawImage(traps[i].arrows[j].img, traps[i].arrows[j].x, traps[i].arrows[j].y);
				}
			}
		}

		//DRAW PLAYER//
        if (player.idle == true)
        {
            surface.drawImage(player.img,
                0, 0, player.spriteWidth, player.spriteHeight,
                player.x-9, player.y, player.spriteWidth, player.spriteHeight);
        }
        else if(player.crouching == true)
            surface.drawImage(player.img,
                player.dir===dir.EAST ? player.spriteWidth*7 : player.spriteWidth*2, 128, player.spriteWidth, player.spriteHeight,
                player.x-9,player.y, player.spriteWidth, player.spriteHeight);
        else if(player.jumping == true)
            surface.drawImage(player.img,
                player.dir===dir.EAST ? player.spriteWidth*2 : player.spriteWidth*7 , 128, player.spriteWidth, player.spriteHeight,
                player.x-9, player.y, player.spriteWidth, player.spriteHeight);
        else if(player.running == true)
            surface.drawImage(player.img,
                player.frameIndex*player.spriteWidth, 64, player.spriteWidth, player.spriteHeight,
                player.x-9, player.y, player.spriteWidth, player.spriteHeight);
	}


	if (currState === 2)
    {
        surface.drawImage(images[40], 200, 300);
    }

	if (currState === 4) // Slider!
	{
		//surface.drawImage(slider.img, slider.x, slider.y)
		surface.drawImage(images[44], 230, 400);
		surface.drawImage(images[45], 305, 408);

	}

    // if currstate 7 win, logo



	//~~~ALL STATES~~~//
	if(paused && currState === 1) //Dimmer
	{
		surface.drawImage(images[41],0 ,0);
	}

	//DRAW BUTTONS//
	for(var i = 0; i < activeButtons.length; i++)
		{
			if(activeButtons[i].over === true)
			{
			surface.drawImage(activeButtons[i].imgO, activeButtons[i].x, activeButtons[i].y);
		}
		else if(activeButtons[i].over === false)
		{
			surface.drawImage(activeButtons[i].img, activeButtons[i].x, activeButtons[i].y);
		}
	}

}

//*****GAME INTIALIZATION*****//

function eListeners()
{
	mouseMove = window.addEventListener("mousemove", updateMouse, false);
	//mouseDown = window.addEventListener("mousedown", onMouseDown, false);
	//mouseUp = window.addEventListener("mouseup", onMouseUp, false);
	click = window.addEventListener("click", clickHandler, false);
	keyDown = window.addEventListener("keydown", keyDownHandler, false);
	keyUp = window.addEventListener("keyup", keyUpHandler, false);
}

function initSplash()//Draws the splash screen and clears it, then changes to the menu state
{
	surface.drawImage(images[0], 0, 0);
	window.setTimeout(function(){surface.clearRect(0,0,canvas.width, canvas.height); changeState(0);}, 1500);
}

function initGame()
{
	window.setTimeout(initSplash, 25);
	console.log("Initializing game...");
	eListeners();
}

//----Asset Loading-----//

var imgNames =
[
	/*0*/"images/ui/splashScreen.png", /*1*/"images/1.png", /*2*/"images/2.png",
	/*3*/"images/3.png", /*4*/"images/4.png", /*5*/"images/5.png",
	/*6*/"images/6.png", /*7*/"images/7.png", /*8*/"images/8.png",
	/*9*/"images/9.png", /*10*/"images/10.png", /*11*/"images/11.png",
	/*12*/"images/12.png", /*13*/"images/ui/logo.png", /*14*/"images/14.png",
	/*15*/"images/15.png", /*16*/"images/16.png", /*17*/"images/17.png",
	/*18*/"images/18.png", /*19*/"images/19.png", /*20*/"images/20.png",
	/*21*/"images/21.png", /*22*/"images/22.png", /*23*/"images/23.png",
	/*24*/"images/24.png", /*25*/"images/25.png", /*26*/"images/26.png",
	/*27*/"images/27.png",/*28*/"images/28.png",/*29*/"images/29.png",
	/*30*/"images/30.png",/*31*/"images/31.png",/*32*/"images/32.png",
	/*33*/"images/33.png",/*34*/"images/34.png",/*35*/"images/35.png",

    /*36*/"images/36.png", /*37*/"images/37.png", /*38*/"images/38.png",
    /*39*/"images/39.png", /*40*/"images/ui/help.png", /*41*/"images/ui/dimScreen.png",
	/*42*/"images/ui/headHolder.png", /*43*/"images/logo/logo1.png",

	"images/ui/sliderfull.png", "images/ui/jSlider.png"
];

var images = [];
var assetsLoaded = 0;

function loadAssets()
{
	for(var i = 0; i < imgNames.length; i++)
	{
		var temp = new Image();
		temp.src = imgNames[i];
		temp.addEventListener("load", onAssetLoad, false);
		images.push(temp);
	}

	for(var j = 0; j < buttons.length; j++)
	{
		var b = new Image();
		b.src = buttons[j].img;
		b.addEventListener("load", onAssetLoad, false);
		buttons[j].img = b;
		var c = new Image();
		c.src = buttons[j].imgO;
		c.addEventListener("load", onAssetLoad, false);
		buttons[j].imgO = c;
	}

	/*for(var z = 0; z < logo.length; z++)
	{
		var y = new Image();
		y.src = logo[z].img;
		y.addEventListener("load", onAssetLoad, false);
		logo[z].img = y;
	}
	//adsfgh
*/
    for(var k = 0; k < heads.length; k++)
    {
        var h = new Image();
        h.src = heads[k].img;
        h.addEventListener("load", onAssetLoad, false);
        heads[k].img = h;
        var d = new Image();
        d.src = heads[k].imgO;
        d.addEventListener("load", onAssetLoad, false);
        heads[k].imgO = d;
    }
}

function onAssetLoad(e)
{
	console.log("Asset loaded");
	assetsLoaded++;
	if(assetsLoaded === imgNames.length + (buttons.length*2) + (heads.length*2))
	{
		//Defines some images for objects
		player.img = images[10];
		doors[0].img = images[14];
		doors[1].img = images[15];
		doors[2].img = images[16];
		doors[3].img = images[17];

		//Initializes game after all assets are loaded
		initGame();
	}
	//TODO:playBackgroundSound("backgroundMusic",true);
}

//Initial Function Call
loadAssets();

})();//IIFE END

//Code End
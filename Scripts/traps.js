var utilities = new window.Utilities(this);
var assets = new window.Assets(this);
var Traps = function(parentClass){

    this.trapsArray = [];

    this.TrapTileType = {

        FIRE_TILE : 19,
        SPIKE_TILE : 29,
        TELEPORT_TILE : 30
    };

    this.fire =
        {
            isTrap: true,
            trapType:this.TrapTileType.FIRE_TILE,
            img:utilities.getImageForPath(assets.tiles[this.TrapTileType.FIRE_TILE]),
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
                    setTimeout(die, 250);
                }
            }
        };

    this.spike =
        {
            isTrap: true,
            trapType:this.TrapTileType.SPIKE_TILE,
            img:utilities.getImageForPath(assets.tiles[this.TrapTileType.SPIKE_TILE]),
            x: 0,//used for finding collision
            y: 0,
            activate:function()
            {
                if(player.y < this.y
                    && player.y + 64 > this.y - 10
                    && player.x < this.x + 64
                    && player.x > this.x)
                {
                    setTimeout(die, 250);
                }

            }
        }

    this.spikeBall =
        {
            isTrap:true,
            img:utilities.getImageForPath(),
            x:10, //Change
            y:10,
            width: 80, //Change
            height: 80,
            radius: 40, //Change
            velX: 5, //Change
            velY: 5,

            animate:function()
            {
                //Possible
            },

            activate:function()
            {
                if (!(player.y < this.y+64
                && player.y+64 > this.y
                && player.x < this.x+64
                && player.x+64 > this.x)) // IF NOT
                {
                    if (this.x < 0 || this.x > _canvas.width - this.width)
                        this.velX = -this.velX;

                    if (this.y < 0 || this.y > _canvas.height - this.height)
                        this.velY = -this.velY;

                    this.x += this.velX;
                    this.y += this.velY;
                }
                else
                {
                    setTimeout(die, 250);
                }
            }
        }

    this.teleport =
        {
            isTrap: true,
            trapType:this.TrapTileType.TELEPORT_TILE,
            img:utilities.getImageForPath(assets.tiles[this.TrapTileType.TELEPORT_TILE]),
            x: 0,//used for finding collision
            y: 0,
            activate: function()
            {
                if
                (player.y < this.y+24
                    && player.y+34 > this.y
                    && player.x < this.x+34
                    && player.x+10 > this.x)
                {
                    player.x = Math.floor((Math.random() * 960) + 32);
                    player.y = Math.floor((Math.random() * 704) + 32);
                    player.velX = 0;
                    player.velY = 0;
                }
            }
        }

};

function die()
{
        stateMachine.changeState(stateMachine.State.GAME_OVER_STATE);
        player.x = 64;
        player.y = 640;
        player.velX = 0;
        player.velY = 0;
}
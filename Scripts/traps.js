var utilities = new window.Utilities(this);
var assets = new window.Assets(this);
var Traps = function(parentClass){

    this.trapsArray = [];

    this.TrapTileType = {

        FIRE_TILE : 19
    };

    this.fire =
        {
            isTrap: true,
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
                    setTimeout(
                        function(){
                            stateMachine.changeState(stateMachine.State.GAME_OVER_STATE);
                            player.x = 64;
                            player.y = 640;
                            player.velX = 0;
                            player.velY = 0;}, 250
                    )
                }
            }
        };

};
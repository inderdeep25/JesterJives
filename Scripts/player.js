var Player = function(parentClass){

    this.PlayerImageType = {
        PLAYER_LEFT : 0,
        PLAYER_RIGHT : 1
    };

    this.PlayerDirection = {
        LEFT : 0,
        RIGHT : 1
    };

    this.playerImages = [new Image(), new Image()];
    this.playerSpriteWidth = 64;
    this.playerSpriteHeight = 64;


    //Load player images
    this.playerImages[0].src = "Resources/Images/Player/playerLeft2.png";
    this.playerImages[1].src = "Resources/Images/Player/playerRight2.png";

    // Player Characteristics
    this.x = 64;
    this.y = 640;
    this.width = 28;
    this.height= 64; // TODO: MAKE SURE TO CHANGE THIS FOR DIFFERENT SPRITE!!!!
    this.speed= 6;
    this.velX= 0;
    this.velY= 0;
    this.img= this.playerImages[this.PlayerImageType.PLAYER_RIGHT];

    this.dir = 1; //1 is facing right, 0 is facing left
    this.idle= true; //true by default
    this.running= false; //false by default
    this.jumping= false; //false by default
    this.crouching= false;
    this.frameIndex= 0;
    this.currentFrame= 0;
    this.framesPerSprite= 3; //the number of frames the individual sprite will be drawn for
    this.animate = function()//animates the player, gets called from updateAnimation function
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

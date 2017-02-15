var actions = new window.Actions(this);
var Assets = function (parentClass){

    this.tiles = [];
    this.numOfTotalTiles = 29;

    this.TileType = {
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
        BACK_TILE_1: 25,
        BACK_TILE_2: 26,
        BACK_TILE_3: 27,
        BACK_TILE_4: 28,
    };

    this.SubTileType = {
        TOP_COLLIDABLE:0,
        BOTTOM_COLLIDABLE:1,
        LEFT_COLLIDABLE:2,
        RIGHT_COLLIDABLE:3
    };

    this.buttonType = {
        START : 0,
        HELP : 1,
        EXIT : 2,
        TRY_AGAIN: 3
    };

    this.LandTile = {
        WITH_2_SUB_TILES:0,
        WITH_4_SUB_TILES:1,
        WITH_3_SUB_TILES:2,
        WITH_3_SUB_TILES_OPP:3
    };

    // The buttons array stores information about all buttons for my simple UI that just changes states.
    this.buttons = [
        {   img:"Resources/Images/btnStart.png",// Start button
            imgO:"Resources/Images/btnStartO.png",
            x:273,
            y:512,
            w:478,
            h:141,
            over:false,
            click:actions.onStartClick
        },
        {    img:"Resources/Images/btnHelp.png", // Help button
            imgO:"Resources/Images/btnHelpO.png",
            x:64,
            y:704,
            w:128,
            h:32,
            over:false,
            click:actions.onHelpClick
        },
        {    img:"Resources/Images/btnExit.png", // Exit button
            imgO:"Resources/Images/btnExitO.png",
            x:832,
            y:704,
            w:128,
            h:32,
            over:false,
            click:actions.onExitClick
        },
        {
            img: "Resources/Images/btnTryAgain.png",//Try again button
            imgO: "Resources/Images/btnTryAgainO.png",
            x: 273,
            y: 412,
            w: 478,
            h: 141,
            over: false,
            click: actions.onTryAgainClick
        }
    ];



    this.SubTileCoordinates = [
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

    this.TileDetails = [
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

    for(var i = 1 ; i <= this.numOfTotalTiles ; i++){
        this.tiles[i-1] = "Resources/Images/Tiles/Tile (" + i + ").png";
    }

};
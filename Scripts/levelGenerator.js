var LevelGenerator = function(parentClass){

    this.generateMap = function()
    {
        setupEmptyMapArray();
        generateRandomLandTiles();
        generateBackground();
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

                if(previousTileType != assets.TileType.LAND_TILE_4 && rand > 0 && rand < 3 && numOfLandTilesInCurrentRow <= numOfMaxLandTilesInRow)
                {
                    data = {
                        img:utilities.getImageForPath(assets.tiles[assets.TileType.LAND_TILE_4]),
                        tileDetails:assets.TileDetails[assets.LandTile.WITH_4_SUB_TILES]
                    };

                    numOfLandTilesInCurrentRow++;
                    previousTileType = assets.TileType.LAND_TILE_4;
                }
                else if(previousTileType != assets.TileType.LAND_TILE_2 && rand > 3 && rand < 6 && numOfLandTilesInCurrentRow <= numOfMaxLandTilesInRow)
                {
                    data = {
                        img:utilities.getImageForPath(assets.tiles[assets.TileType.LAND_TILE_2]),
                        tileDetails:assets.TileDetails[assets.LandTile.WITH_2_SUB_TILES]
                    };

                    numOfLandTilesInCurrentRow++;
                    previousTileType = assets.TileType.LAND_TILE_2;
                }
                else if(previousTileType != assets.TileType.LAND_TILE_L && rand > 6 && rand < 9 && numOfLandTilesInCurrentRow <= numOfMaxLandTilesInRow)
                {
                    data = {
                        img:utilities.getImageForPath(assets.tiles[assets.TileType.LAND_TILE_L]),
                        tileDetails:assets.TileDetails[assets.LandTile.WITH_3_SUB_TILES]
                    };

                    numOfLandTilesInCurrentRow++;
                    previousTileType = assets.TileType.LAND_TILE_L;
                }
                else if(previousTileType != assets.TileType.LAND_TILE_L_OPP && rand > 9 && rand < 12 && numOfLandTilesInCurrentRow <= numOfMaxLandTilesInRow)
                {
                    data = {
                        img:utilities.getImageForPath(assets.tiles[assets.TileType.LAND_TILE_L_OPP]),
                        tileDetails:assets.TileDetails[assets.LandTile.WITH_3_SUB_TILES_OPP]
                    };

                    numOfLandTilesInCurrentRow++;
                    previousTileType = assets.TileType.LAND_TILE_L_OPP;
                }
                else if(rand % 2 == 0 && rand > 2 && rand < 8)//Traps
                {
                    data = Object.create(traps.fire);
                    data.x = j*tileSize;
                    data.y = i*tileSize;
                    traps.trapsArray.push(data);

                    numOfTrapsInCurrentRow++;
                    previousTileType = traps.TrapTileType.FIRE_TILE;
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
                        tempTile.img = utilities.getImageForPath(assets.tiles[assets.TileType.BACK_TILE_1]);
                        break;
                    case 1:
                        tempTile.img = utilities.getImageForPath(assets.tiles[assets.TileType.BACK_TILE_1]);
                        break;
                    case 2:
                        tempTile.img = utilities.getImageForPath(assets.tiles[assets.TileType.BACK_TILE_2]);
                        break;
                    case 3:
                        tempTile.img = utilities.getImageForPath(assets.tiles[assets.TileType.BACK_TILE_2]);
                        break;
                    case 4:
                        tempTile.img = utilities.getImageForPath(assets.tiles[assets.TileType.BACK_TILE_3]);
                        break;
                    case 5:
                        tempTile.img = utilities.getImageForPath(assets.tiles[assets.TileType.BACK_TILE_3]);
                        break;
                    case 6:
                        tempTile.img = utilities.getImageForPath(assets.tiles[assets.TileType.BACK_TILE_4]);
                        break;
                    case 7:
                        tempTile.img = utilities.getImageForPath(assets.tiles[assets.TileType.BACK_TILE_4]);
                        break;
                }

                background[i][j] = tempTile;
            }
        }
    }

    function setCollisionTilesDataFor(tileType,posInRow,posInCol)
    {
        indexForCollidableTiles++;
        if(tileType==assets.TileType.LAND_TILE_4)
        {
            var tile1 = {x:posInRow*tileSize,
                y:posInCol*tileSize,
                width:64,
                height:64,
                tileType:[assets.SubTileType.TOP_COLLIDABLE,assets.SubTileType.LEFT_COLLIDABLE]
            };

            var tile2 = {x:posInRow*tileSize+64,
                y:posInCol*tileSize,
                width:64,
                height:64,
                tileType:[assets.SubTileType.TOP_COLLIDABLE,assets.SubTileType.RIGHT_COLLIDABLE]
            };

            var tile3 = {x:posInRow*tileSize,
                y:posInCol*tileSize+64,
                width:64,
                height:64,
                tileType:[assets.SubTileType.BOTTOM_COLLIDABLE,assets.SubTileType.LEFT_COLLIDABLE]
            };

            var tile4 = {x:posInRow*tileSize+64,
                y:posInCol*tileSize+64,
                width:64,
                height:64,
                tileType:[assets.SubTileType.BOTTOM_COLLIDABLE,assets.SubTileType.RIGHT_COLLIDABLE]
            };

            collidableTiles.push(tile1);
            collidableTiles.push(tile2);
            collidableTiles.push(tile3);
            collidableTiles.push(tile4);


        }
        else if (tileType==assets.TileType.LAND_TILE_2)
        {
            var tile1 = {x:posInRow*tileSize,
                y:posInCol*tileSize,
                width:64,
                height:64,
                tileType:[assets.SubTileType.TOP_COLLIDABLE,assets.SubTileType.BOTTOM_COLLIDABLE,assets.SubTileType.LEFT_COLLIDABLE]
            };

            var tile2 = {x:posInRow*tileSize+64,
                y:posInCol*tileSize,
                width:64,
                height:64,
                tileType:[assets.SubTileType.TOP_COLLIDABLE,assets.SubTileType.BOTTOM_COLLIDABLE,assets.SubTileType.RIGHT_COLLIDABLE]
            };

            collidableTiles.push(tile1);
            collidableTiles.push(tile2);
        }
        else if (tileType==assets.TileType.LAND_TILE_L)
        {
            var tile1 = {
                x:posInRow*tileSize,
                y:posInCol*tileSize,
                width:64,
                height:64,
                tileType:[assets.SubTileType.TOP_COLLIDABLE,assets.SubTileType.LEFT_COLLIDABLE,assets.SubTileType.RIGHT_COLLIDABLEs]
            };

            var tile3 = {
                x:posInRow*tileSize,
                y:posInCol*tileSize+64,
                width:64,
                height:64,
                tileType:[assets.SubTileType.BOTTOM_COLLIDABLE,assets.SubTileType.LEFT_COLLIDABLE]
            };

            var tile4 = {
                x:posInRow*tileSize+64,
                y:posInCol*tileSize+64,
                width:64,
                height:64,
                tileType:[assets.SubTileType.TOP_COLLIDABLE,assets.SubTileType.RIGHT_COLLIDABLE,assets.SubTileType.BOTTOM_COLLIDABLE]
            };

            collidableTiles.push(tile1);
            collidableTiles.push(tile3);
            collidableTiles.push(tile4);
        }
        else if (tileType==assets.TileType.LAND_TILE_L_OPP)
        {
            var tile1 = {
                x:posInRow*tileSize,
                y:posInCol*tileSize,
                width:64,
                height:64,
                tileType:[assets.SubTileType.TOP_COLLIDABLE,assets.SubTileType.LEFT_COLLIDABLE,assets.SubTileType.BOTTOM_COLLIDABLE]
            };

            var tile2 = {x:posInRow*tileSize+64,
                y:posInCol*tileSize,
                width:64,
                height:64,
                tileType:[assets.SubTileType.TOP_COLLIDABLE,assets.SubTileType.RIGHT_COLLIDABLE]
            };

            var tile4 = {x:posInRow*tileSize+64,
                y:posInCol*tileSize+64,
                width:64,
                height:64,
                tileType:[assets.SubTileType.BOTTOM_COLLIDABLE,assets.SubTileType.LEFT_COLLIDABLE,assets.SubTileType.RIGHT_COLLIDABLE]
            };

            collidableTiles.push(tile1);
            collidableTiles.push(tile2);
            collidableTiles.push(tile4);
        }
    }

}
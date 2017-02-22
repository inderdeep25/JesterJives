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
                        tileDetails:assets.TileDetails[assets.LandTile.WITH_4_SUB_TILES],
                        isTrap:false
                    };

                    numOfLandTilesInCurrentRow++;
                    previousTileType = assets.TileType.LAND_TILE_4;
                }
                else if(previousTileType != assets.TileType.LAND_TILE_2 && rand > 3 && rand < 6 && numOfLandTilesInCurrentRow <= numOfMaxLandTilesInRow)
                {
                    data = {
                        img:utilities.getImageForPath(assets.tiles[assets.TileType.LAND_TILE_2]),
                        tileDetails:assets.TileDetails[assets.LandTile.WITH_2_SUB_TILES],
                        isTrap:false
                    };

                    numOfLandTilesInCurrentRow++;
                    previousTileType = assets.TileType.LAND_TILE_2;
                }
                else if(previousTileType != assets.TileType.LAND_TILE_L && rand > 6 && rand < 9 && numOfLandTilesInCurrentRow <= numOfMaxLandTilesInRow)
                {
                    data = {
                        img:utilities.getImageForPath(assets.tiles[assets.TileType.LAND_TILE_L]),
                        tileDetails:assets.TileDetails[assets.LandTile.WITH_3_SUB_TILES],
                        isTrap:false
                    };

                    numOfLandTilesInCurrentRow++;
                    previousTileType = assets.TileType.LAND_TILE_L;
                }
                else if(previousTileType != assets.TileType.LAND_TILE_L_OPP && rand > 9 && rand < 12 && numOfLandTilesInCurrentRow <= numOfMaxLandTilesInRow)
                {
                    data = {
                        img:utilities.getImageForPath(assets.tiles[assets.TileType.LAND_TILE_L_OPP]),
                        tileDetails:assets.TileDetails[assets.LandTile.WITH_3_SUB_TILES_OPP],
                        isTrap:false
                    };

                    numOfLandTilesInCurrentRow++;
                    previousTileType = assets.TileType.LAND_TILE_L_OPP;
                }
                else if(rand % 2 == 0 && rand > 2 && rand < 8)//To Generate Traps
                {
                    data = getRandomTrap(i,j);
                    numOfTrapsInCurrentRow++;
                    if(data!="empty")
                        traps.trapsArray.push(data);
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

    function getRandomTrap(i,j)
    {
        var rand = Math.round(Math.random() * 10);
        var result = "empty";
        if (previousTileType != traps.TrapTileType.FIRE_TILE && rand > 0 && rand < 5)
        {
            result = Object.create(traps.fire);
            result.x = j*tileSize;
            result.y = i*tileSize;
            previousTileType = traps.TrapTileType.FIRE_TILE;
        }
        else if (previousTileType != traps.TrapTileType.SPIKE_TILE && rand >= 5 && rand < 10)
        {
            result = Object.create(traps.spike);
            result.x = j*tileSize;
            result.y = i*tileSize;
            previousTileType = traps.TrapTileType.SPIKE_TILE;
        }
        return result;
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
        var subTileWidth = 64;
        var subTileHeight = 64;
        if(tileType==assets.TileType.LAND_TILE_4)
        {
            var tile1 = {x:posInRow*tileSize,
                y:posInCol*tileSize,
                width:subTileWidth,
                height:subTileHeight,
                tileType:[assets.SubTileType.TOP_COLLIDABLE,assets.SubTileType.LEFT_COLLIDABLE],
                tileTopCollisionBox:{l:posInRow*tileSize+10,r:posInRow*tileSize+subTileWidth,t:posInCol*tileSize,b:posInCol*tileSize+8},
                tileBottomCollisionBox:null,
                tileLeftCollisionBox:{l:posInRow*tileSize,r:posInRow*tileSize+10,t:posInCol*tileSize+8,b:posInCol*tileSize+subTileHeight-8},
                tileRightCollisionBox:null
            };

            var tile2 = {x:posInRow*tileSize+subTileWidth,
                y:posInCol*tileSize,
                width:subTileWidth,
                height:subTileHeight,
                tileType:[assets.SubTileType.TOP_COLLIDABLE,assets.SubTileType.RIGHT_COLLIDABLE],
                tileTopCollisionBox:{l:posInRow*tileSize+subTileWidth,r:posInRow*tileSize+2*subTileWidth-10,t:posInCol*tileSize,b:posInCol*tileSize+8},
                tileBottomCollisionBox:null,
                tileLeftCollisionBox:null,
                tileRightCollisionBox:{l:posInRow*tileSize+tileSize-10,r:posInRow*tileSize+tileSize,t:posInCol*tileSize+8,b:posInCol*tileSize+64-8}
            };

            var tile3 = {x:posInRow*tileSize,
                y:posInCol*tileSize+subTileHeight,
                width:subTileWidth,
                height:subTileHeight,
                tileType:[assets.SubTileType.BOTTOM_COLLIDABLE,assets.SubTileType.LEFT_COLLIDABLE],
                tileTopCollisionBox:null,
                tileBottomCollisionBox:{l:posInRow*tileSize+10,r:posInRow*tileSize+subTileWidth,t:posInCol*tileSize+2*subTileHeight-10,b:posInCol*tileSize+2*subTileHeight},
                tileLeftCollisionBox:{l:posInRow*tileSize,r:posInRow*tileSize+6,t:posInCol*tileSize+64+8,b:posInCol*tileSize+subTileHeight+64-8},
                tileRightCollisionBox:null
            };

            var tile4 = {x:posInRow*tileSize+subTileWidth,
                y:posInCol*tileSize+subTileHeight,
                width:subTileWidth,
                height:subTileHeight,
                tileType:[assets.SubTileType.BOTTOM_COLLIDABLE,assets.SubTileType.RIGHT_COLLIDABLE],
                tileTopCollisionBox:null,
                tileBottomCollisionBox:{l:posInRow*tileSize+subTileWidth,r:posInRow*tileSize+2*subTileWidth-10,t:posInCol*tileSize+2*subTileHeight-10,b:posInCol*tileSize+2*subTileHeight},
                tileLeftCollisionBox:null,
                tileRightCollisionBox:{l:posInRow*tileSize+tileSize-10,r:posInRow*tileSize+tileSize,t:posInCol*tileSize+64+8,b:posInCol*tileSize+tileSize-8}
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
                width:subTileWidth,
                height:subTileHeight,
                tileType:[assets.SubTileType.TOP_COLLIDABLE,assets.SubTileType.BOTTOM_COLLIDABLE,assets.SubTileType.LEFT_COLLIDABLE],
                tileTopCollisionBox:{l:posInRow*tileSize+10,r:posInRow*tileSize+subTileWidth,t:posInCol*tileSize,b:posInCol*tileSize+8},
                tileBottomCollisionBox:{l:posInRow*tileSize+10,r:posInRow*tileSize+subTileWidth,t:posInCol*tileSize+subTileHeight-10,b:posInCol*tileSize+subTileHeight},
                tileLeftCollisionBox:{l:posInRow*tileSize,r:posInRow*tileSize+10,t:posInCol*tileSize+8,b:posInCol*tileSize+subTileHeight-8},
                tileRightCollisionBox:null
            };

            var tile2 = {x:posInRow*tileSize+64,
                y:posInCol*tileSize,
                width:64,
                height:64,
                tileType:[assets.SubTileType.TOP_COLLIDABLE,assets.SubTileType.BOTTOM_COLLIDABLE,assets.SubTileType.RIGHT_COLLIDABLE],
                tileTopCollisionBox:{l:posInRow*tileSize+subTileWidth,r:posInRow*tileSize+2*subTileWidth-10,t:posInCol*tileSize,b:posInCol*tileSize+8},
                tileBottomCollisionBox:{l:posInRow*tileSize+subTileWidth,r:posInRow*tileSize+2*subTileWidth-10,t:posInCol*tileSize+subTileHeight-10,b:posInCol*tileSize+subTileHeight},
                tileLeftCollisionBox:null,
                tileRightCollisionBox:{l:posInRow*tileSize+tileSize-10,r:posInRow*tileSize+tileSize,t:posInCol*tileSize+8,b:posInCol*tileSize+64-8}
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
                tileType:[assets.SubTileType.TOP_COLLIDABLE,assets.SubTileType.LEFT_COLLIDABLE,assets.SubTileType.RIGHT_COLLIDABLE],
                tileTopCollisionBox:{l:posInRow*tileSize+10,r:posInRow*tileSize+subTileWidth-10,t:posInCol*tileSize,b:posInCol*tileSize+8},
                tileBottomCollisionBox:null,
                tileLeftCollisionBox:{l:posInRow*tileSize,r:posInRow*tileSize+10,t:posInCol*tileSize+8,b:posInCol*tileSize+subTileHeight-8},
                tileRightCollisionBox:{l:posInRow*tileSize+subTileWidth-10,r:posInRow*tileSize+subTileWidth,t:posInCol*tileSize+8,b:posInCol*tileSize+subTileHeight-8}
            };

            var tile3 = {
                x:posInRow*tileSize,
                y:posInCol*tileSize+64,
                width:64,
                height:64,
                tileType:[assets.SubTileType.BOTTOM_COLLIDABLE,assets.SubTileType.LEFT_COLLIDABLE],
                tileTopCollisionBox:null,
                tileBottomCollisionBox:{l:posInRow*tileSize+10,r:posInRow*tileSize+subTileWidth,t:posInCol*tileSize+2*subTileHeight-10,b:posInCol*tileSize+2*subTileHeight},
                tileLeftCollisionBox:{l:posInRow*tileSize,r:posInRow*tileSize+10,t:posInCol*tileSize+64+8,b:posInCol*tileSize+tileSize-8},
                tileRightCollisionBox:null
            };

            var tile4 = {
                x:posInRow*tileSize+64,
                y:posInCol*tileSize+64,
                width:64,
                height:64,
                tileType:[assets.SubTileType.TOP_COLLIDABLE,assets.SubTileType.RIGHT_COLLIDABLE,assets.SubTileType.BOTTOM_COLLIDABLE],
                tileTopCollisionBox:{l:posInRow*tileSize+subTileWidth+10,r:posInRow*tileSize+2*subTileWidth-10,t:posInCol*tileSize+subTileHeight,b:posInCol*tileSize+subTileHeight+10},
                tileBottomCollisionBox:{l:posInRow*tileSize+subTileWidth,r:posInRow*tileSize+2*subTileWidth-10,t:posInCol*tileSize+2*subTileHeight-10,b:posInCol*tileSize+2*subTileHeight},
                tileLeftCollisionBox:null,
                tileRightCollisionBox:{l:posInRow*tileSize+tileSize-10,r:posInRow*tileSize+tileSize,t:posInCol*tileSize+64+8,b:posInCol*tileSize+tileSize-8}
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
                tileType:[assets.SubTileType.TOP_COLLIDABLE,assets.SubTileType.LEFT_COLLIDABLE,assets.SubTileType.BOTTOM_COLLIDABLE],
                tileTopCollisionBox:{l:posInRow*tileSize+10,r:posInRow*tileSize+subTileWidth,t:posInCol*tileSize,b:posInCol*tileSize+8},
                tileBottomCollisionBox:{l:posInRow*tileSize+10,r:posInRow*tileSize+subTileWidth-10,t:posInCol*tileSize+subTileHeight-10,b:posInCol*tileSize+subTileHeight},
                tileLeftCollisionBox:{l:posInRow*tileSize,r:posInRow*tileSize+10,t:posInCol*tileSize+8,b:posInCol*tileSize+subTileHeight-8},
                tileRightCollisionBox:null
            };

            var tile2 = {x:posInRow*tileSize+64,
                y:posInCol*tileSize,
                width:64,
                height:64,
                tileType:[assets.SubTileType.TOP_COLLIDABLE,assets.SubTileType.RIGHT_COLLIDABLE],
                tileTopCollisionBox:{l:posInRow*tileSize+subTileWidth,r:posInRow*tileSize+2*subTileWidth-10,t:posInCol*tileSize,b:posInCol*tileSize+8},
                tileBottomCollisionBox:null,
                tileLeftCollisionBox:null,
                tileRightCollisionBox:{l:posInRow*tileSize+tileSize-10,r:posInRow*tileSize+tileSize,t:posInCol*tileSize+8,b:posInCol*tileSize+64-8}
            };

            var tile4 = {x:posInRow*tileSize+subTileWidth,
                y:posInCol*tileSize+subTileHeight,
                width:subTileWidth,
                height:subTileHeight,
                tileType:[assets.SubTileType.BOTTOM_COLLIDABLE,assets.SubTileType.LEFT_COLLIDABLE,assets.SubTileType.RIGHT_COLLIDABLE],
                tileTopCollisionBox:null,
                tileBottomCollisionBox:{l:posInRow*tileSize+subTileWidth+10,r:posInRow*tileSize+2*subTileWidth-10,t:posInCol*tileSize+2*subTileHeight-10,b:posInCol*tileSize+2*subTileHeight},
                tileLeftCollisionBox:{l:posInRow*tileSize+subTileWidth,r:posInRow*tileSize+subTileWidth+10,t:posInCol*tileSize+64+8,b:posInCol*tileSize+tileSize-8},
                tileRightCollisionBox:{l:posInRow*tileSize+tileSize-10,r:posInRow*tileSize+tileSize,t:posInCol*tileSize+64+8,b:posInCol*tileSize+tileSize-8}
            };

            collidableTiles.push(tile1);
            collidableTiles.push(tile2);
            collidableTiles.push(tile4);
        }
    }

};
var CollisionHandler = function(parentClass){


    this.handleCollisionWithTiles = function()
    {
        for(var i = 0; i < collidableTiles.length ; i++)
        {
            var tile = collidableTiles[i];
            for(var j = 0 ; j < tile.tileType.length; j++)
            {
                if(tile.tileType[j] == assets.SubTileType.TOP_COLLIDABLE)
                {
                    checkCollisionForTopBoundOf(tile);
                }
                if(tile.tileType[j] == assets.SubTileType.LEFT_COLLIDABLE)
                {
                    checkCollisionForLeftBoundOf(tile);
                }
                if(tile.tileType[j] == assets.SubTileType.RIGHT_COLLIDABLE)
                {
                    checkCollisionForRightBoundOf(tile);
                }
                if(tile.tileType[j] == assets.SubTileType.BOTTOM_COLLIDABLE)
                {
                    checkCollisionForBottomBoundOf(tile);
                }
            }
        }
    }

    function checkCollisionForLeftBoundOf(tile)
    {
        if(tile.tileLeftCollisionBox != null)
        {
            var firstCheck = player.y > tile.tileLeftCollisionBox.b;
            var secondCheck = player.y + player.height < tile.tileLeftCollisionBox.t;
            var thirdCheck = player.x > tile.tileLeftCollisionBox.r;
            var fourthCheck = player.x + player.width < tile.tileLeftCollisionBox.l;

            if(!firstCheck && !secondCheck && !thirdCheck && !fourthCheck)
            {
                player.x = tile.x - player.width;
            }
        }

    }

    function checkCollisionForRightBoundOf(tile)
    {
        if(tile.tileRightCollisionBox != null)
        {
            var firstCheck = player.y > tile.tileRightCollisionBox.b;
            var secondCheck = player.y + player.height < tile.tileRightCollisionBox.t;
            var thirdCheck = player.x > tile.tileRightCollisionBox.r;
            var fourthCheck = player.x + player.width < tile.tileRightCollisionBox.l;

            if(!firstCheck && !secondCheck && !thirdCheck && !fourthCheck)
            {
                player.x = tile.x + tile.width;
            }
        }
    }

    function checkCollisionForBottomBoundOf(tile)
    {
        if(tile.tileBottomCollisionBox != null)
        {
            var firstCheck = player.y > tile.tileBottomCollisionBox.b;
            var secondCheck = player.y + player.height < tile.tileBottomCollisionBox.t;
            var thirdCheck = player.x > tile.tileBottomCollisionBox.r;
            var fourthCheck = player.x + player.width < tile.tileBottomCollisionBox.l;

            if(!firstCheck && !secondCheck && !thirdCheck && !fourthCheck)
            {
                player.y = tile.y + tile.height;
                if(player.velY < 0)
                {
                    player.velY = 0;
                }
            }
        }
    }

    function checkCollisionForTopBoundOf(tile)
    {
        if(tile.tileTopCollisionBox != null)
        {
            var firstCheck = player.y > tile.tileTopCollisionBox.b;
            var secondCheck = player.y + player.height < tile.tileTopCollisionBox.t;
            var thirdCheck = player.x > tile.tileTopCollisionBox.r;
            var fourthCheck = player.x + player.width < tile.tileTopCollisionBox.l;

            if(!firstCheck && !secondCheck && !thirdCheck && !fourthCheck)
            {
                player.y = tile.y - player.height;
                player.jumping = false;
                player.velY = 0;
            }
        }
    }

};
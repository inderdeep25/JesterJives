var CollisionHandler = function(parentClass){


    this.handleCollisionWithTiles = function()
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

                    if (tileTypes[j] == assets.SubTileType.TOP_COLLIDABLE
                        && player.y + player.height-10 >= collidableTiles[i].y
                        && player.y + player.height -10 < collidableTiles[i].y + collidableTiles[i].height
                        && player.x != collidableTiles[i].x + collidableTiles[i].width
                        && player.x != collidableTiles[i].x - player.width)

                    {
                        player.y = collidableTiles[i].y - collidableTiles[i].height;
                        player.jumping = false;
                    }
                    if(tileTypes[j] == assets.SubTileType.BOTTOM_COLLIDABLE
                        && player.y -10 <= collidableTiles[i].y +collidableTiles[i].height
                        && player.y + player.height - 10 > collidableTiles[i].y
                        && player.x != collidableTiles[i].x + collidableTiles[i].width
                        && player.x != collidableTiles[i].x - player.width)

                    {
                        player.y = collidableTiles[i].y + collidableTiles[i].height;
                    }
                    if(tileTypes[j] == assets.SubTileType.LEFT_COLLIDABLE
                        && player.x + player.width -10 <= collidableTiles[i].x
                        && player.x - 10 < collidableTiles[i].x+collidableTiles[i].width)

                    {
                        player.x = collidableTiles[i].x - player.width;
                    }
                    if(tileTypes[j] == assets.SubTileType.RIGHT_COLLIDABLE
                        && player.x - 10>= collidableTiles[i].x + collidableTiles[i].width
                        && player.x + player.width - 10 < collidableTiles[i].x+collidableTiles[i].width)

                    {
                        player.x = collidableTiles[i].x + collidableTiles[i].width;
                    }

                }

            }
        }
    }

}
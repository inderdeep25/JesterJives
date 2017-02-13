var Utilities = function(parentClass){

    this.getImageForPath = function(path){
        var img = new Image();
        img.src = path;
        return img;
    }

}
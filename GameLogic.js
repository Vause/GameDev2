var stage;
var backgroundImage = new Image();

function load() 
{			
    init();
}

function init()
{
    stage = new createjs.Stage('myCanvas');
    backgroundImage.src = 'img/bg.png';
    backgroundImage.onload = loadBg;
}

function loadBg() 
	{
        backgroundBitmap = new createjs.Bitmap(backgroundImage);
        stage.addChild(backgroundBitmap);
        stage.update();
    }
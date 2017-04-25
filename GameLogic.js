//Initialize Game and start it
var game = new Game();
var percentFireCon = 0;
var rightHit = false
var leftHit = false;
var midHit = false;

function init()
{
	if(game.init())
		game.start();
}

function setEasy() {
    alert("easy");
    percentFireCon = .5;
}

function setMed() {
    alert("med");
    percentFireCon = 1;
}

function setHard() {
    alert("hard");
    percentFireCon = 3;
}

 //Object to hold all of our images. This ensures all objects are only created once.
var imageRepository = new function()
{
	// Define images
	this.background = new Image();
	this.spaceship = new Image();
	this.bullet = new Image();
	this.enemy = new Image();
	this.enemyBullet = new Image();
	this.fullgreendisplay = new Image();
    this.fullreddisplay = new Image();
    this.leftmidreddisplay = new Image();
    this.leftreddisplay = new Image();
    this.leftrightreddisplay = new Image();
    this.midreddisplay = new Image();
    this.rightmidreddisplay = new Image();
    this.rightreddisplay = new Image();

	// Ensure all images have loaded before starting the game
	var numImages = 6;
	var numLoaded = 0;
	function imageLoaded()
	{
		numLoaded++;
		if (numLoaded === numImages)
		{
			window.init();
		}
	}
	this.background.onload = function()
	{
		imageLoaded();
	}
	this.spaceship.onload = function()
	{
		imageLoaded();
	}
	this.bullet.onload = function()
	{
		imageLoaded();
	}
	this.enemy.onload = function()
	{
		imageLoaded();
	}
	this.enemyBullet.onload = function()
	{
		imageLoaded();
	}
    this.fullgreendisplay.onload = function()
    {
        imageLoaded();
    }

	// Set images source
	this.background.src = "img/bg.png";
	this.spaceship.src = "img/xWing1.png";
	this.bullet.src = "img/enemyBullet.png";
	this.enemy.src = "img/enemyShip1.png";
	this.enemyBullet.src = "img/greenBullet.png";
	this.fullgreendisplay.src = "img/HPDisp/FullGreen.png";
    this.fullreddisplay.src = "img/HPDisp/FullRed.png";
    this.leftmidreddisplay.src = "img/HPDisp/LeftMidRed.png";
    this.leftreddisplay.src = "img/HPDisp/LeftRed.png";
    this.leftrightreddisplay.src = "img/HPDisp/LeftRightRed.png";
    this.midreddisplay.src = "img/HPDisp/MidRed.png";
    this.rightmidreddisplay.src = "img/HPDisp/RightMidRed.png";
    this.rightreddisplay.src = "img/HPDisp/RightRed.png";


}

  //Drawable object. A child object will inherit this is it can be drawable
function Drawable()
{
	this.init = function(x, y, width, height)
	{

		this.x = x;
		this.y = y;
		this.width = width;
		this.height = height;
	}

	this.speed = 0;
	this.canvasWidth = 0;
	this.canvasHeight = 0;

	// Define abstract function to be implemented in child objects
	this.draw = function()
	{
	};
	this.move = function()
	{
	};
}


 //Game object. Will hold all objects & data for game
function Game()
{
	 //Sets up game objects. Gets canvas information and context.
	 //Returns true if canvas is supported.
	this.init = function()
	{
		this.bgCanvas = document.getElementById('background');
		this.shipCanvas = document.getElementById('ship');
		this.mainCanvas = document.getElementById('main');
		this.hpCanvas = document.getElementById('hpdisp');

		// Test to see if canvas is supported. Only need to check one canvas
		if (this.bgCanvas.getContext)
		{
			this.bgContext = this.bgCanvas.getContext('2d');
			this.shipContext = this.shipCanvas.getContext('2d');
			this.mainContext = this.mainCanvas.getContext('2d');
            this.hpContext = this.mainCanvas.getContext('2d');

			// Initialize objects to contain their context and canvas information
			Background.prototype.context = this.bgContext;
			Background.prototype.canvasWidth = this.bgCanvas.width;
			Background.prototype.canvasHeight = this.bgCanvas.height;

			Ship.prototype.context = this.shipContext;
			Ship.prototype.canvasWidth = this.shipCanvas.width;
			Ship.prototype.canvasHeight = this.shipCanvas.height;

			Bullet.prototype.context = this.mainContext;
			Bullet.prototype.canvasWidth = this.mainCanvas.width;
			Bullet.prototype.canvasHeight = this.mainCanvas.height;

			Enemy.prototype.context = this.mainContext;
            Enemy.prototype.canvasWidth = this.mainCanvas.width;
            Enemy.prototype.canvasHeight = this.mainCanvas.height

            HealthDisplay.prototype.context = this.hpContext;
            HealthDisplay.prototype.canvasWidth = this.hpCanvas.width;
            HealthDisplay.prototype.canvasHeight = this.hpCanvas.height;

			// Initialize the background object
			this.background = new Background();
			this.background.init(0,0); // Set draw point to 0,0

            this.healthDispVar = new HealthDisplay();
            this.healthDispVar.drawFirst();


			// Initialize the ship object
			this.ship = new Ship();


			// Set the ship to start near the bottom middle of the canvas
			var shipStartX = this.shipCanvas.width - 300 - imageRepository.spaceship.width;
			var shipStartY = this.shipCanvas.height/4*3 + imageRepository.spaceship.height;
			this.ship.init(shipStartX, shipStartY, imageRepository.spaceship.width,
			               imageRepository.spaceship.height);

			// Initialize the enemy pool object
			this.enemyPool = new Pool(10);
			this.enemyPool.init("enemy");
			this.health = 10;
			var height = imageRepository.enemy.height;
			var width = imageRepository.enemy.width;
			var x = 100;
			var y = -250;
			var spacer = y * 5.5;
			for (var i = 1; i <= 10; i++)
			{
				this.enemyPool.get(x,y,1);
				x += width + 10;
				y += height + 45;
			}

			this.enemyBulletPool = new Pool(200);
			this.enemyBulletPool.init("enemyBullet");

			return true;
		} else
		{
			return false;
		}
	};

	// Start the animation loop
	this.start = function()
	{
		this.ship.draw();
		animate();
	};
}


 //Animation loop. Calls RequestAnimFrame to optimize game loop.
function animate()
{
	if(game.ship.isAlive == true){
        requestAnimFrame( animate );
        game.background.draw();
        game.ship.move();
        game.ship.bulletPool.animate();
        game.enemyPool.animate();
        game.enemyBulletPool.animate();
	}
	else if(game.ship.isAlive == false){
		alert("Game Over");
	}
}


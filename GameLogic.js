//Initialize Game and start it
var game = new Game();

function init()
{
	if(game.init())
		game.start();
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

	// Ensure all images have loaded before starting the game
	var numImages = 5;
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

	// Set images source
	this.background.src = "img/bg.png";
	this.spaceship.src = "img/xWing1.png";
	this.bullet.src = "img/enemyBullet.png";
	this.enemy.src = "img/enemyShip1.png";
	this.enemyBullet.src = "img/greenBullet.png";


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

		// Test to see if canvas is supported. Only need to check one canvas
		if (this.bgCanvas.getContext)
		{
			this.bgContext = this.bgCanvas.getContext('2d');
			this.shipContext = this.shipCanvas.getContext('2d');
			this.mainContext = this.mainCanvas.getContext('2d');

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
			Enemy.prototype.canvasHeight = this.mainCanvas.height;

			// Initialize the background object
			this.background = new Background();
			this.background.init(0,0); // Set draw point to 0,0

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

			this.enemyBulletPool = new Pool(50);
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
	requestAnimFrame( animate );
	game.background.draw();
	game.ship.move();
	game.ship.bulletPool.animate();
	game.enemyPool.animate();
	game.enemyBulletPool.animate();
}


//Initialize Game and start it
var game = new Game();
var percentFireCon = .1;
var rightHit = false
var leftHit = false;
var midHit = false;
var playerScore = 0;
var bossIsAlive = false;
var countdown = 3600;
var escapeSequence = false;
var forceSoundBool = false;

function init()
{
	if(game.init())
		game.start();
}

function setEasy() {
	if(!game.ship.isAlive == false)
	{
	document.getElementById('medium-mode').style.display = "block";
	setTimeout(function(){
             document.getElementById('medium-mode').style.display = "none";
             },1500);
    percentFireCon = .25;
	}
}

function setMed() {
	if(!game.ship.isAlive == false)
	{
	document.getElementById('hard-mode').style.display = "block";
	setTimeout(function(){
             document.getElementById('hard-mode').style.display = "none";
             },1500);
    percentFireCon = 1;
	}
}

function setHard() {
	if(!game.ship.isAlive == false)
	{
	document.getElementById('jedi-mode').style.display = "block";
	setTimeout(function(){
             document.getElementById('jedi-mode').style.display = "none";
             },1500);
    percentFireCon = 3;
	}
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
    this.enemyBoss = new Image();
    this.background2 = new Image();

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
    this.enemyBoss.onload = function()
    {
        imageLoaded();
    }
	this.background2.onload = function()
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
    this.enemyBoss.src = "img/StarDestroyer.png";
    this.background2.src = "img/bg2.png";

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
	this.collidableWith = "";
	this.isColliding = false;
	this.type = "";

	// Define abstract function to be implemented in child objects
	this.draw = function()
	{
	};
	this.move = function()
	{
	};

	//Test to see if object can collide with the provided object
	this.isCollidableWith = function(object)
	{
		return (this.collidableWith === object.type);
	};
}

 //Game object. Will hold all objects & data for game
function Game()
{
	 //Sets up game objects. Gets canvas information and context.
	 //Returns true if canvas is supported.
	this.init = function()
	{
		this.musicSound = document.getElementById("bgmusic");
		this.enemyLaserSound = document.getElementById("enemyLaser");
		this.lightspeedSound = document.getElementById("lightspeed");
		this.enemyBossLaserSound = document.getElementById("enemyBossLaser");
		this.shipLaserSound = document.getElementById("shipLaser");
		this.intensifySound = document.getElementById("intensify");
		this.ihaveyounowSound = document.getElementById("ihaveyounow");
		this.targetsSound = document.getElementById("targets");
		this.theForceSound = document.getElementById("theForce");
		this.explosionSound = document.getElementById("explosion");
		this.explosionSound2 = document.getElementById("explosion");
		this.explosionSound3 = document.getElementById("explosion");
		this.musicSound.play();
		this.musicSound.volume = .6;
		this.shipLaserSound.volume = .6;
		this.targetsSound.volume = 1;
		this.ihaveyounowSound.volume = 1;
		this.intensifySound.volume = 1;
		this.lightspeedSound.volume = 1;
		this.enemyLaserSound.volume = .4;
		this.enemyBossLaserSound.volume = .8;
		this.theForceSound.volume = 1;
		this.targetsSound.play();
		this.bgCanvas = document.getElementById('background');
		this.shipCanvas = document.getElementById('ship');
		this.enemyBossCanvas = document.getElementById('enemyboss');
		this.mainCanvas = document.getElementById('main');
		this.hpCanvas = document.getElementById('hpdisp');


		// Test to see if canvas is supported. Only need to check one canvas
		if (this.bgCanvas.getContext)
		{
			this.bgContext = this.bgCanvas.getContext('2d');
			this.shipContext = this.shipCanvas.getContext('2d');
			this.mainContext = this.mainCanvas.getContext('2d');
			this.hpContext = this.mainCanvas.getContext('2d');
			this.enemyBossContext = this.enemyBossCanvas.getContext('2d');
			this.mainContext.drawImage(imageRepository.background2, 810, 0);

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

            EnemyBoss.prototype.context = this.enemyBossContext;
            EnemyBoss.prototype.canvasWidth = this.mainCanvas.width;
            EnemyBoss.prototype.canvasHeight = this.mainCanvas.height;

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
			var shipStartX = this.shipCanvas.width/2 - imageRepository.spaceship.width;
			var shipStartY = this.shipCanvas.height/4*3 + imageRepository.spaceship.height;
			this.ship.init(shipStartX, shipStartY, imageRepository.spaceship.width,
			               imageRepository.spaceship.height);

			// Initialize the enemy pool object
			this.enemyPool = new Pool(30);
			this.enemyPool.init("enemy");
			this.enemyBossPool = new Pool(1);
			this.enemyBossPool.init("enemyBoss");
			this.health = 10;
			var height = imageRepository.enemy.height;
			var width = imageRepository.enemy.width;
			var randomSpawn = Math.floor((Math.random() * 650) + 100);
			var randomSpeed = (Math.random() * 2) + 1.5;
			var x = randomSpawn;
			var speed = randomSpeed;
			var y = -height;
			var spacer = y * 3;
			for (var i = 1; i <= 30; i++)
			{
				if (i % 1 == 0)
				{
				this.enemyPool.get(x, y, speed);
				y += spacer;
				x = Math.floor((Math.random() * 650) + 10);
				y += spacer;
				}
			}

			height = imageRepository.enemyBoss.height;
			width = imageRepository.enemyBoss.width;
			x = 100;
			speed = 1;
			y = 530;
			this.enemyBossPool.get(x, y, speed);
			this.enemyBulletPool = new Pool(200);
			this.enemyBulletPool.init("enemyBullet");

			//New Quadtree
			this.quadTree = new QuadTree({ x: 0, y: 0, width: this.mainCanvas.width, height: this.mainCanvas.height });

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
	game.quadTree.clear();
	game.quadTree.insert(game.ship);
	game.quadTree.insert(game.ship.bulletPool.getPool());
	game.quadTree.insert(game.enemyPool.getPool());
	game.quadTree.insert(game.enemyBossPool.getPool());
	detectCollision();

	if (game.ship.isAlive == true && countdown > 0) {
	    countdown -= 1;
        requestAnimFrame( animate );
        game.background.draw();
        game.ship.move();
        game.ship.bulletPool.animate();
        game.enemyBulletPool.animate();
        document.getElementById('score').innerHTML = playerScore;
        document.getElementById('seconds').innerHTML = Math.floor(countdown / 60);
        game.enemyPool.animate();
        if (countdown == 2000) {
            var height = imageRepository.enemy.height;
            var width = imageRepository.enemy.width;
            var randomSpawn = Math.floor((Math.random() * 650) + 100);
            var randomSpeed = (Math.random() * 2) + 1.5;
            var x = randomSpawn;
            var speed = randomSpeed;
            var y = -height;
            var spacer = y * 3;
            for (var i = 1; i <= 30; i++) {
                if (i % 1 == 0) {
                    game.enemyPool.get(x, y, speed);
                    y += spacer;
                    x = Math.floor((Math.random() * 650) + 10);
                    y += spacer;
                }
            }
            game.intensifySound.play();
            bossIsAlive = true;
        }
        if (bossIsAlive == true) {
	        game.enemyBossPool.animate();
        }
        if (playerScore == 20 && forceSoundBool == false) {
            forceSoundBool = true;
            game.theForceSound.play();
        }
        if (countdown == 360) {
            game.lightspeedSound.play();
        }
        if (countdown <= 60) {
            game.ship.drawEscape();
            game.ship.counter = 16;
            game.ship.leftHit = false;
            game.ship.rightHit = false;
            game.ship.midHit = false;
            game.musicSound.volume -= .02;
        }

	}
	else if (countdown == 0 && game.ship.isAlive == true) {
	    document.getElementById('you-win').style.display = "block";
	    game.musicSound.pause();
	}

	else if (game.ship.isAlive == false) {
	    game.musicSound.pause();
	    document.getElementById('game-over').style.display = "block";
	}
}
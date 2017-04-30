//Initialize Game and start it
var game = new Game();
var percentFireCon = .1;
var rightHit = false
var leftHit = false;
var midHit = false;
var playerScore = 0;
var bossIsAlive = false;
var countdown = 7200;

function init()
{
	if(game.init())
		game.start();
}

function setEasy() {
    alert("easy");
    percentFireCon = .25;
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
    this.enemyBoss = new Image();

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
    this.enemyBoss.src = "img/StarDestroyer.png";

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

//Quadtree. Had to look into this logic for quite a bit of time. Used resources such as html5rocks to get algorithm.
function QuadTree(boundBox, lvl) 
{
	var maxObjects = 10;
	this.bounds = boundBox || 
	{
		x: 0,
		y: 0,
		width: 0,
		height: 0
	};
	var objects = [];
	this.nodes = [];
	var level = lvl || 0;
	var maxLevels = 5;

	//Clears the Quadtree and all nodes of objects
	this.clear = function() 
	{
		objects = [];
		for (var i = 0; i < this.nodes.length; i++) 
		{
		    this.nodes[i].clear();		    
		}
		this.nodes = [];
	};
	
	
	 //Get all objects in Quadtree
	this.getAllObjects = function(returnedObjects) 
	{
		for (var i = 0; i < this.nodes.length; i++) 
		{
			this.nodes[i].getAllObjects(returnedObjects);
		}
		for (var i = 0, len = objects.length; i < len; i++) 
		{
			returnedObjects.push(objects[i]);
		}
		return returnedObjects;
	};
	/*
	 * Return all objects that the object could collide with
	 */
	 
	 //Return all objects that the particular object COULD collide with. This will be enemy - > player ship bullet
	this.findObjects = function(returnedObjects, obj) 
	{
		if (typeof obj === "undefined") 
		{
			console.log("UNDEFINED OBJECT");
			return;
		}
		var index = this.getIndex(obj);
		if (index != -1 && this.nodes.length) 
		{
			this.nodes[index].findObjects(returnedObjects, obj);
		}
		for (var i = 0, len = objects.length; i < len; i++) 
		{
			returnedObjects.push(objects[i]);
		}
		return returnedObjects;
	};
	 
	 //Insert object into Quadtree. If exceeds capacity, it will split the tree and objects into their corresponding nodes.
	this.insert = function(obj) 
	{
		if (typeof obj === "undefined") 
		{
			return;
		}
		if (obj instanceof Array) 
		{
			for (var i = 0, len = obj.length; i < len; i++) 
			{
				this.insert(obj[i]);
			}
			return;
		}
		if (this.nodes.length) 
		{
			var index = this.getIndex(obj);
			//Add object to a subnode only if it can fit within one
			if (index != -1) 
			{
				this.nodes[index].insert(obj);
				return;
			}
		}
		objects.push(obj);
		
		//Cannot split infinitely
		if (objects.length > maxObjects && level < maxLevels) 
		{
			if (this.nodes[0] == null) 
			{
				this.split();
			}
			var i = 0;
			while (i < objects.length) 
			{
				var index = this.getIndex(objects[i]);
				if (index != -1) 
				{
					this.nodes[index].insert((objects.splice(i,1))[0]);
				}
				else {
					i++;
				}
			}
		}
	};
	 
	 //Determine which node particular object belongs to. 
	 //*** NOTE: -1 means it cannot completely fit within a node, thus it is part of the current node.
	this.getIndex = function(obj) 
	{
		var index = -1;
		var verticalMidpoint = this.bounds.x + this.bounds.width / 2;
		var horizontalMidpoint = this.bounds.y + this.bounds.height / 2;
		
		// Object can fit completely within the top quadrant
		var topQuadrant = (obj.y < horizontalMidpoint && obj.y + obj.height < horizontalMidpoint);
		
		// Object can fit completely within the bottom quandrant
		var bottomQuadrant = (obj.y > horizontalMidpoint);
		
		// Object can fit completely within the left quadrants
		if (obj.x < verticalMidpoint && obj.x + obj.width < verticalMidpoint) 
		{
			if (topQuadrant) 
			{
				index = 1;
			}
			else if (bottomQuadrant) 
			{
				index = 2;
			}
		}
		
		// Object can fix completely within the right quandrants
		else if (obj.x > verticalMidpoint) 
		{
			if (topQuadrant) 
			{
				index = 0;
			}
			else if (bottomQuadrant) 
			{
				index = 3;
			}
		}
		return index;
	};
	/*
	 * Splits the node into 4 subnodes
	 */
	 
	 //Splits node into 4 subnodes
	this.split = function() 
	{
		// Bitwise or [html5rocks]
		var subWidth = (this.bounds.width / 2) | 0;
		var subHeight = (this.bounds.height / 2) | 0;
		this.nodes[0] = new QuadTree({
			x: this.bounds.x + subWidth,
			y: this.bounds.y,
			width: subWidth,
			height: subHeight
		}, level+1);
		this.nodes[1] = new QuadTree({
			x: this.bounds.x,
			y: this.bounds.y,
			width: subWidth,
			height: subHeight
		}, level+1);
		this.nodes[2] = new QuadTree({
			x: this.bounds.x,
			y: this.bounds.y + subHeight,
			width: subWidth,
			height: subHeight
		}, level+1);
		this.nodes[3] = new QuadTree({
			x: this.bounds.x + subWidth,
			y: this.bounds.y + subHeight,
			width: subWidth,
			height: subHeight
		}, level+1);
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
	
	if (game.ship.isAlive == true) {
	    countdown -= 1;
        requestAnimFrame( animate );
        game.background.draw();
        game.ship.move();
        game.ship.bulletPool.animate();
        game.enemyBulletPool.animate();
        document.getElementById('score').innerHTML = playerScore;
        document.getElementById('seconds').innerHTML = Math.floor(countdown / 60);
        game.enemyPool.animate();
        if (countdown == 5000) {
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
            bossIsAlive = true;
        }
	if (bossIsAlive == true) {
	    game.enemyBossPool.animate();
                    
        }
	}
	else if(game.ship.isAlive == false){
		alert("Game Over");
	}
}

function detectCollision()
{
	var objects = [];
	game.quadTree.getAllObjects(objects);
	
	for(var x = 0, len = objects.length; x < len; x++)
	{
		game.quadTree.findObjects(obj = [], objects[x]);
		
		for(y = 0, length = obj.length; y < length; y++)
		{
			if (objects[x].collidableWith === obj[y].type &&
				(objects[x].x < obj[y].x + obj[y].width &&
			     objects[x].x + objects[x].width > obj[y].x &&
				 objects[x].y < obj[y].y + obj[y].height &&
				 objects[x].y + objects[x].height > obj[y].y) && objects[x].type!="enemyBoss") 
				 {
				objects[x].isColliding = true;
				obj[y].isColliding = true;
				 }
		}
	}
};


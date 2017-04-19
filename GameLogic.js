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


  //This is the Background object. It will give the illusion of the bg image moving
function Background() 
{
	this.speed = 1;
	
	// Implement abstract function defined above
	this.draw = function() 
	{
		// Pan background
		this.y += this.speed;
		this.context.drawImage(imageRepository.background, this.x, this.y);
		
		// Draw another image at the top edge of the first image
		this.context.drawImage(imageRepository.background, this.x, this.y - this.canvasHeight);

		// If the image scrolled off the screen, reset
		if (this.y >= this.canvasHeight)
			this.y = 0;
	};
}
// Set Background to inherit properties from Drawable
Background.prototype = new Drawable();

 
  //Bullet object. This is what the ship fires. Drawn on main canvas
function Bullet(object) 
{	
	this.alive = false; // Set to true if the bullet is currently in use
	var self = object;
	
	//Sets the bullet values
	this.spawn = function(x, y, speed) 
	{
		this.x = x;
		this.y = y;
		this.speed = speed;
		this.alive = true;
	};

	 
	 //Draws the bullet. This returns true if the bullet is moved off the screen.
	this.draw = function() 
	{
		this.context.clearRect(this.x-1, this.y-1, this.width+1, this.height+1); //Dirty Rectangle
		this.y -= this.speed;
		if (self === "bullet" && this.y <= 0 - this.height) 
		{
			return true;
		}
		else if (self === "enemyBullet" && this.y >= this.canvasHeight) 
		{
			return true;
		}
		else 
		{
			if (self === "bullet") 
			{
				this.context.drawImage(imageRepository.bullet, this.x, this.y);
			}
			else if (self === "enemyBullet") 
			{
				this.context.drawImage(imageRepository.enemyBullet, this.x, this.y);
			}
			
			return false;
		}
	};
	
	//resets the bullet value
	this.clear = function() {
		this.x = 0;
		this.y = 0;
		this.speed = 0;
		this.alive = false;
	};
}
Bullet.prototype = new Drawable();

 
 //Pool object. 
function Pool(maxSize) 
{
	var size = maxSize; // Max bullets allowed in the pool
	var pool = [];

	//Populates the pool array with the given object
	this.init = function(object) 
	{
		if (object == "bullet") 
		{
			for (var i = 0; i < size; i++) 
			{
				// Initalize the object
				var bullet = new Bullet("bullet");
				bullet.init(0,0, imageRepository.bullet.width, imageRepository.bullet.height);
				pool[i] = bullet;
			}
		}
		else if (object == "enemy") 
		{
			for (var i = 0; i < size; i++) 
			{
				var enemy = new Enemy();
				enemy.init(0,0, imageRepository.enemy.width, imageRepository.enemy.height);
				pool[i] = enemy;
			}
		}
		else if (object == "enemyBullet") 
		{
			for (var i = 0; i < size; i++) 
			{
				var bullet = new Bullet("enemyBullet");
				bullet.init(0,0, imageRepository.enemyBullet.width, imageRepository.enemyBullet.height);
				pool[i] = bullet;
			}
		}
	};
	
	
	//Grabs the last item in the list and initializes it and pushes it to the front of the array.
	this.get = function(x, y, speed) 
	{
		if(!pool[size - 1].alive) 
		{
			pool[size - 1].spawn(x, y, speed);
			pool.unshift(pool.pop());
		}
	};
	
	
	//Used for the ship to be able to get two bullets at once.
	this.getTwo = function(x1, y1, speed1, x2, y2, speed2) 
	{
		if(!pool[size - 1].alive && !pool[size - 2].alive) 
		{
			this.get(x1, y1, speed1);
			this.get(x2, y2, speed2);
		}
	};
	
	
	//Draws Bullets that are in use. If a bullet goes off the screen, clears it and pushes it to the front of the array.
	this.animate = function() 
	{
		for (var i = 0; i < size; i++) 
		{
			// Only draw until we find bullet that is not alive
			if (pool[i].alive) 
			{
				if (pool[i].draw()) 
				{
					pool[i].clear();
					pool.push((pool.splice(i,1))[0]);
				}
			}
			else
				break;
		}
	};
}


 
 //Ship object that player controls. Drawn on ship canvas.
function Ship() 
{
	this.speed = 3;
	this.bulletPool = new Pool(30);
	this.bulletPool.init("bullet");
	var fireRate = 15;
	var counter = 0;
	
	this.draw = function() 
	{
		this.context.drawImage(imageRepository.spaceship, this.x, this.y); //Dirty Rectangle
	};
	this.move = function() 
	{	
		counter++;
		
		// Determine if the action is move action
		if (KEY_STATUS.left || KEY_STATUS.right ||
				KEY_STATUS.down || KEY_STATUS.up) 
				{
			// The ship moved, so erase it's current image so it can be redrawn in it's new location
			this.context.clearRect(this.x, this.y, this.width, this.height);
			
			// Update x and y according to the direction to move and redraw the ship.
			
			//Possible TODO: Change the else if's to if statements to have diagonal movement.
			if (KEY_STATUS.left) 
			{
				this.x -= this.speed
				if (this.x <= 0) // Keep player within the screen
					this.x = 0;
			} if (KEY_STATUS.right) 
			{
				this.x += this.speed
				if (this.x >= this.canvasWidth - this.width)
					this.x = this.canvasWidth - this.width;
			} if (KEY_STATUS.up) 
			{
				this.y -= this.speed
				if (this.y <= this.canvasHeight/4*3)
					this.y = this.canvasHeight/4*3;
			} if (KEY_STATUS.down) 
			{
				this.y += this.speed
				if (this.y >= this.canvasHeight - this.height)
					this.y = this.canvasHeight - this.height;
			}
			
			// Finish by redrawing the ship
			this.draw();
		}

		if (KEY_STATUS.space && counter >= fireRate) 
		{
			this.fire();
			counter = 0;
		}
	};
	
	
//Fires two bullets
	//Possible TODO: Only shoot one bullet at first, create power-up for additional bullets
	//Possible TODO: Increase speed of bullet via another power-up
	this.fire = function() 
	{
		this.bulletPool.getTwo(this.x+1, this.y, 3,
		                       this.x+47, this.y, 3);
	};
}
Ship.prototype = new Drawable();

 
 //Enemy ship object
function Enemy() 
{
	var percentFire = .01;
	var chance = 0;
	this.alive = false;
	
	
	this.spawn = function(x, y, speed) 
	{
		this.x = x;
		this.y = y;
		this.speed = speed;
		this.speedX = 0;
		this.speedY = speed;
		this.alive = true;
		this.leftEdge = this.x - 150;
		this.rightEdge = this.x + 420;
		this.bottomEdge = 525;
	};

	 
	 //Move enemy
	this.draw = function() 
	{
		this.context.clearRect(this.x-1, this.y, this.width+1, this.height); //Dirty Rectangle
		this.x += this.speedX;
		this.y += this.speedY;
		if (this.x <= this.leftEdge) {
			this.speedX = this.speed;
		}
		else if (this.x >= this.rightEdge + this.width) 
		{
			this.speedX = -this.speed;
	
		}
		else if (this.y >= this.bottomEdge) 
		{
			this.speed = 1;
			this.speedX = 1;
			this.y = 0;
			this.speedY = 0.5;
		}
		
		this.context.drawImage(imageRepository.enemy, this.x, this.y);
	
		// Enemy has a chance to shoot every movement
		//Possible TODO: Change percentages based on difficulty
		chance = Math.floor(Math.random()*101);
		if (chance/100 < percentFire) 
		{
			this.fire();
		}
	};
	
	 
	 //Fire the bullet
	this.fire = function() 
	{
		game.enemyBulletPool.get(this.x+this.width/2, this.y+this.height, -2.5);
	}
	
	 
	 //Reset enemy values
	this.clear = function()
	{
		this.x = 0;
		this.y = 0;
		this.speed = 0;
		this.speedX = 0;
		this.speedY = 0;
		this.alive = false;
	};
}
Enemy.prototype = new Drawable();


 
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


// The keycodes that will be mapped when a user presses a button.
KEY_CODES = 
{ 32: 'space', 37: 'left', 38: 'up', 39: 'right', 40: 'down', }

//Store KEY_CODES in an array, and setting all of their values to false
KEY_STATUS = {};
for (code in KEY_CODES) 
{
  KEY_STATUS[KEY_CODES[code]] = false;
}

 //Document will listen for onkeydown events. Appropriate keyCode is set to true when a key is pressed
document.onkeydown = function(e) 
{
	var keyCode = (e.keyCode) ? e.keyCode : e.charCode;
  if (KEY_CODES[keyCode]) 
  {
		e.preventDefault();
    KEY_STATUS[KEY_CODES[keyCode]] = true;
  }
}

 //Document will listen for onkeyup events. Appropriate keyCode is set to false when key is released
document.onkeyup = function(e) 
{
  var keyCode = (e.keyCode) ? e.keyCode : e.charCode;
  if (KEY_CODES[keyCode]) 
  {
    e.preventDefault();
    KEY_STATUS[KEY_CODES[keyCode]] = false;
  }
}


 //Optimizing the animation loop based on platform and or browser
window.requestAnimFrame = (function()
{
	return  window.requestAnimationFrame       || 
			window.webkitRequestAnimationFrame || 
			window.mozRequestAnimationFrame    || 
			window.oRequestAnimationFrame      || 
			window.msRequestAnimationFrame     || 
			function(/* function */ callback, /* DOMElement */ element)
			{
				window.setTimeout(callback, 1000 / 60);
			};
})();
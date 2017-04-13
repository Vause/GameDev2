/**
 * Initialize the Game and start it.
 */
var game = new Game();

function init() {
	if(game.init())
		game.start();
}

 //Object to hold all of our images. This ensures the images are only created once.
var imageRepository = new function() {
	// Define images
	this.background = new Image();
	this.spaceship = new Image();
	this.bullet = new Image();

	// Ensure all images have loaded before starting the game
	var numImages = 3;
	var numLoaded = 0;
	function imageLoaded() {
		numLoaded++;
		if (numLoaded === numImages) {
			window.init();
		}
	}
	this.background.onload = function() {
		imageLoaded();
	}
	this.spaceship.onload = function() {
		imageLoaded();
	}
	this.bullet.onload = function() {
		imageLoaded();
	}
	
	// Set images source
	this.background.src = "img/bg.png";
	this.spaceship.src = "img/xWing1.png";
	this.bullet.src = "img/heroBullet.png";
}

 
 //Drawable object. A child object will inherit this is it can be drawable
function Drawable() {
	this.init = function(x, y, width, height) {
		// Default variables
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
function Background() {
	this.speed = 1; // Speed of the background for panning
	
	// Implement abstract function
	this.draw = function() 
	{
		// Pan background
		this.y += this.speed;
		this.context.drawImage(imageRepository.background, this.x, this.y);
		
		// Draw another image at the top edge of the first image
		this.context.drawImage(imageRepository.background, this.x, this.y - this.canvasHeight);

		// If the image scrolled off the screen, reset image
		if (this.y >= this.canvasHeight)
			this.y = 0;
	};
}
// Set Background to inherit properties from Drawable
Background.prototype = new Drawable();


 //Bullet object. This is what the ship fires. Drawn on main canvas
function Bullet() {	
	this.alive = false; // Is true if the bullet is currently in use
	
	 //Set the bullet values
	this.spawn = function(x, y, speed) {
		this.x = x;
		this.y = y;
		this.speed = speed;
		this.alive = true;
	};
	 
	 //Draws the bullet. This returns true if the bullet is moved off the screen.
	this.draw = function() {
		this.context.clearRect(this.x, this.y, this.width, this.height); //Dirty rectangle
		this.y -= this.speed;
		if (this.y <= 0 - this.height) {
			return true;
		}
		else {
			this.context.drawImage(imageRepository.bullet, this.x, this.y);
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

//Make bullet have properties of Drawable
Bullet.prototype = new Drawable();


function Pool(maxSize) {
	var size = maxSize; // Max bullets allowed in the pool
	var pool = [];
	
	
//Populates the pool array with Bullet objects
	this.init = function() {
		for (var i = 0; i < size; i++) {
			
			// Initalize the bullet object
			var bullet = new Bullet();
			bullet.init(0,0, imageRepository.bullet.width,
			            imageRepository.bullet.height);
			pool[i] = bullet;
		}
	};
	
	 
	 //Grabs last item in list and initializes it. Pushes it to front of array
	this.get = function(x, y, speed) {
		if(!pool[size - 1].alive) {
			pool[size - 1].spawn(x, y, speed);
			pool.unshift(pool.pop());
		}
	};
	 
	 //Used for the ship to be able to shoot two bullets at once. 
	this.getTwo = function(x1, y1, speed1, x2, y2, speed2) {
		if(!pool[size - 1].alive && 
		   !pool[size - 2].alive) {
				this.get(x1, y1, speed1);
				this.get(x2, y2, speed2);
			 }
	};
	 
	 //Draw any Bullets in use. If bullet goes off screen, clear and push to front of array
	this.animate = function() {
		for (var i = 0; i < size; i++) {
			
			// Draw until we find a bullet that is not alive
			if (pool[i].alive) {
				if (pool[i].draw()) {
					pool[i].clear();
					pool.push((pool.splice(i,1))[0]);
				}
			}
			else
				break;
		}
	};
}

 
 //Ship object. Drawn on the ship canvas.
function Ship() {
	this.speed = 3;
	this.bulletPool = new Pool(30);
	this.bulletPool.init();

	var fireRate = 15;
	var counter = 0;
	
	this.draw = function() {
		this.context.drawImage(imageRepository.spaceship, this.x, this.y);
	};
	this.move = function() {	
		counter++;
		
		// Determine if the action is move action
		if (KEY_STATUS.left || KEY_STATUS.right ||
			KEY_STATUS.down || KEY_STATUS.up) 
			{
			// The ship moved, so erase it's current image so it can be redrawn in it's new location
			this.context.clearRect(this.x, this.y, this.width, this.height); //Dirty rectangle
			
			// Update x and y according to the direction to move and
			// redraw the ship.
			//POSSIBLE TODO: Change "else if's" to "if statements" to have diagonal movement.
			if (KEY_STATUS.left) {
				this.x -= this.speed
				if (this.x <= 0) // Keep player within the screen
					this.x = 0;
			} else if (KEY_STATUS.right) {
				this.x += this.speed
				if (this.x >= this.canvasWidth - this.width)
					this.x = this.canvasWidth - this.width;
			} else if (KEY_STATUS.up) {
				this.y -= this.speed
				if (this.y <= this.canvasHeight/4*3)
					this.y = this.canvasHeight/4*3;
			} else if (KEY_STATUS.down) {
				this.y += this.speed
				if (this.y >= this.canvasHeight - this.height)
					this.y = this.canvasHeight - this.height;
			}
			
			// Finish by redrawing the ship
			this.draw();
		}
		
		if (KEY_STATUS.space && counter >= fireRate) {
			this.fire();
			counter = 0;
		}
	};
	
	//Fires two bullets
	//Possible TODO: Only shoot one bullet at first, create power-up for additional bullets
	//Possible TODO: Increase speed of bullet via another power-up
	this.fire = function() {
		this.bulletPool.getTwo(this.x+2, this.y, 3,
		                       this.x+67, this.y, 3);
	};
}

//Make ship have Drawable properties
Ship.prototype = new Drawable();

 //Game object. Holds objects and data for the game.
function Game() {
	 
	 //Sets up game objects. Gets canvas information and context. 
	 //Returns true if canvas is supported.
	this.init = function() 
	{
		
		// Get canvas elements
		this.bgCanvas = document.getElementById('background');
		this.shipCanvas = document.getElementById('ship');
		this.mainCanvas = document.getElementById('main');
		
		// Test to see if canvas is supported. Only need to check one canvas.
		if (this.bgCanvas.getContext) {
			this.bgContext = this.bgCanvas.getContext('2d');
			this.shipContext = this.shipCanvas.getContext('2d');
			this.mainContext = this.mainCanvas.getContext('2d');
		
			// Initialize objects to contain their context and canvas info
			Background.prototype.context = this.bgContext;
			Background.prototype.canvasWidth = this.bgCanvas.width;
			Background.prototype.canvasHeight = this.bgCanvas.height;
			
			Ship.prototype.context = this.shipContext;
			Ship.prototype.canvasWidth = this.shipCanvas.width;
			Ship.prototype.canvasHeight = this.shipCanvas.height;
			
			Bullet.prototype.context = this.mainContext;
			Bullet.prototype.canvasWidth = this.mainCanvas.width;
			Bullet.prototype.canvasHeight = this.mainCanvas.height;
			
			// Initialize background object
			this.background = new Background();
			this.background.init(0,0); // Set draw point to 0,0
			
			// Initialize ship object
			this.ship = new Ship();
			
			// Set the ship to start near the bottom middle of the canvas
			var shipStartX = this.shipCanvas.width/2 - imageRepository.spaceship.width;
			var shipStartY = this.shipCanvas.height/4*3 + imageRepository.spaceship.height;
			this.ship.init(shipStartX, shipStartY, imageRepository.spaceship.width,
			               imageRepository.spaceship.height);

			return true;
		} else {
			return false;
		}
	};
	
	// Start animation loop
	this.start = function() {
		this.ship.draw();
		animate();
	};
}

 
 //Animation loop. Calls requestAnimFrame to optimize game loop and draws all game objects. 
function animate() {
	requestAnimFrame( animate );
	game.background.draw();
	game.ship.move();
	game.ship.bulletPool.animate(); 
}


// The keycodes that are mapped when a user presses a button.
KEY_CODES = { 32: 'space', 37: 'left', 38: 'up', 39: 'right', 40: 'down', }

//Store KEY_CODES in an array, and setting all of their values to false
KEY_STATUS = {};
for (code in KEY_CODES) {
  KEY_STATUS[KEY_CODES[code]] = false;
}
 
 //Document will listen for onkeydown events. Appropriate keyCode is set to true when a key is pressed
document.onkeydown = function(e) {
	
  var keyCode = (e.keyCode) ? e.keyCode : e.charCode; //charCode is used on Firefox and Opera. Not sure if we have to include this?
  if (KEY_CODES[keyCode]) {
	e.preventDefault();
	KEY_STATUS[KEY_CODES[keyCode]] = true;
  }
}
 
 //Document will listen for onkeyup events. Appropriate keyCode is set to false when key is released
document.onkeyup = function(e) {
  var keyCode = (e.keyCode) ? e.keyCode : e.charCode;
  if (KEY_CODES[keyCode]) {
    e.preventDefault();
    KEY_STATUS[KEY_CODES[keyCode]] = false;
  }
}

 
 //Optimizing the animation loop based on platform.browser
window.requestAnimFrame = (function(){
	return  window.requestAnimationFrame       || 
			window.webkitRequestAnimationFrame || 
			window.mozRequestAnimationFrame    || 
			window.oRequestAnimationFrame      || 
			window.msRequestAnimationFrame     || 
			function(/* function */ callback, /* DOMElement */ element){
				window.setTimeout(callback, 1000 / 60);
			};
})();

 //Ship object that player controls. Drawn on ship canvas.
function Ship()
{
	this.speed = 3;
	this.bulletPool = new Pool(30);
	this.bulletPool.init("bullet");
	var fireRate = 15;
    var counter = 0;

    this.isAlive = true;

	this.draw = function()
	{
		this.context.drawImage(imageRepository.spaceship, this.x, this.y); //Dirty Rectangle
	};

	this.drawEscape = function () {	    
	    this.context.clearRect(this.x, this.y, this.width, this.height);
	    this.y -= 20;
	    this.context.drawImage(imageRepository.spaceship, this.x, this.y);
	}


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
			}
			if (KEY_STATUS.right)
			{
				this.x += this.speed
				if (this.x >= this.canvasWidth - this.width)
					this.x = this.canvasWidth - this.width;
			}
			if (KEY_STATUS.up)
			{
				this.y -= this.speed
				if (this.y <= 0)
				    this.y = 0;
			}
			if (KEY_STATUS.down)
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

	this.leftHit = function () {
        if (leftHit == false) {
            leftHit = true;
            game.healthDispVar.leftHit();
        }
        else if (leftHit == true) {
            this.isAlive = false;
        }
    };

	this.rightHit = function () {
         if (rightHit == false){
             rightHit = true;
             game.healthDispVar.rightHit();
             game.ihaveyounowSound.play();
         }
         else if(rightHit == true){
             this.isAlive = false;
         }
     };

	this.midHit = function () {
		if (midHit == false){
            midHit = true;
            game.healthDispVar.midHit();
        }
        else if(midHit == true){
            this.isAlive = false;
        }
    };


//Fires two bullets
	//Possible TODO: Only shoot one bullet at first, create power-up for additional bullets
	//Possible TODO: Increase speed of bullet via another power-up
	this.fire = function()
	{
		this.bulletPool.getTwo(this.x+1, this.y, 10, this.x+47, this.y, 10);
		game.shipLaserSound.play();
	};
}
Ship.prototype = new Drawable();
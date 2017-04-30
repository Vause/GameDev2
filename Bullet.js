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
		
		if(this.isColliding)
		{
			return true;
		}
		if (self === "bullet" && this.y <= 0 - this.height)
		{
			return true;
		}
		else if (self === "enemyBullet" && this.y >= 1044)
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
                if(this.x > game.ship.x && this.x <= game.ship.x+15 && this.y < game.ship.y+30 && this.y > game.ship.y){
                	game.ship.leftHit();
                    return true;
                }
                if(this.x > game.ship.x+16 && this.x <= game.ship.x+31 && this.y < game.ship.y+30 && this.y > game.ship.y){
                    game.ship.midHit();
                    return true;
                }
                if(this.x > game.ship.x+32 && this.x < game.ship.x+47 && this.y < game.ship.y+30 && this.y > game.ship.y){
                    game.ship.rightHit();
                    return true;
                }
				else
				{
                    this.context.drawImage(imageRepository.enemyBullet, this.x, this.y);
                }
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
		this.isColliding = false;
	};
}

Bullet.prototype = new Drawable();

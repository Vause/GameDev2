
 //Enemy ship object
function Enemy()
{
	var chance = 0;
	this.alive = false;
	var percentFire;
	this.collidableWith = "bullet";
	this.type = "enemy";

	this.spawn = function(x, y, speed)
	{
		this.x = x;
		this.y = y;
		this.speed = 1;
		this.speedX = 0;
		this.speedY = checkSpeed();
		this.alive = true;
		this.leftEdge = this.x - 500;
		this.rightEdge = this.x + 500;
		this.bottomEdge = 525;
	};

	function checkSpeed() {
	    var speedVar = (Math.floor(Math.random() * 6));
	    if (Math.abs(speedVar - 1) <= 1)
	        return 3;
	    else {
	        return speedVar;
	    }
	};

	 //Move enemy
	this.draw = function()
	{
	    percentFire = percentFireCon;
		this.context.clearRect(this.x-1, this.y, this.width+1, this.height); //Dirty Rectangle
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
			this.speed = 2;
			this.y = 0;
			this.x = Math.floor((Math.random() * 650) + 100);
		}
		
		if(!this.isColliding)
		{
		this.context.drawImage(imageRepository.enemy, this.x, this.y);

		// Enemy has a chance to shoot every movement
		
		if(this.y > -5 && this.y < 525) //If enemy ship is within canvas
		{
			if (Math.floor(Math.random()*100) < percentFire)
			{
				this.fire();
			}
			return false;
		}
			
		}
		else
			{
				return true;
			}
	};


	 //Fire the bullet
	this.fire = function()
	{
		game.enemyBulletPool.get(this.x+this.width/2, this.y+this.height, -10);
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
		this.isColliding = false;
	};
}
Enemy.prototype = new Drawable();

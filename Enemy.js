
 //Enemy ship object
function Enemy()
{	
	var chance = 0;
	this.alive = false;
	var percentFire;

	this.spawn = function(x, y, speed)
	{
		this.x = x;
		this.y = y;
		this.speed = speed;
		this.speedX = 0;
		this.speedY = speed;
		this.alive = true;
		this.leftEdge = this.x - 150;
		this.rightEdge = this.x + 525;
		this.bottomEdge = 525;
	};


	 //Move enemy
	this.draw = function()
	{
	    percentFire = percentFireCon;
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
		if (Math.floor(Math.random()*100) < percentFire)
		{
			this.fire();
		}
	};


	 //Fire the bullet
	this.fire = function()
	{
		game.enemyBulletPool.get(this.x+this.width/2, this.y+this.height, -5);
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

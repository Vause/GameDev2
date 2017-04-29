
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
				bullet.collidableWith = "enemy";
				bullet.type = "bullet";
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

		else if (object == "enemyBoss") {
		    for (var i = 0; i < size; i++) {
		        var enemyBoss = new EnemyBoss();
		        enemyBoss.init(0, 0, imageRepository.enemyBoss.width, imageRepository.enemyBoss.height);
		        pool[i] = enemyBoss;
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
	
	//Returns all alive objects in pool as an array. Used to insert into Quadtree.
	this.getPool = function()
	{
		var obj = [];
		for(var i = 0; i< size; i++)
		{
			if(pool[i].alive)
			{
				obj.push(pool[i]);
			}
		}
		return obj;
	}


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
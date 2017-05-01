
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
		this.context.clearRect(this.x, this.y, this.width, this.height); //Dirty Rectangle
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
		game.enemyLaserSound.play();
	}


	 //Reset enemy values
	this.clear = function()
	{
	    playerScore++;
	    game.explosionSound.play();
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

function EnemyBoss() {
    var chance = 0;
    this.alive = false;
    var percentFire = 20;
    this.collidableWith = null;
    this.type = "enemyBoss";
    var health = 30;

    this.spawn = function (x, y, speed) {
        this.x = x;
        this.y = y;
        this.speed = -.5;
        this.speedX = .5;
        this.speedY = -.5;
        this.alive = true;
        this.leftEdge = 0;
        this.rightEdge = 810;
        this.bottomEdge = 540;
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
    this.draw = function () {
        percentFire = 10;
        this.context.clearRect(this.x - 1, this.y, this.width + 1, this.height); //Dirty Rectangle
        this.y += this.speedY;
        this.x += this.speedX;
        if (this.x <= -100) {
            this.speedX = .5;
        }
        else if (this.x >= 810 - this.width) {
            this.speedX = -.5;

        }
        else if (this.y <= 0) {
            this.speedY = .5;
        }
        else if (this.y >= 400 && this.y >= 540) {
            this.speedY = -.5;
        }

        if (!this.isColliding) {
            this.context.drawImage(imageRepository.enemyBoss, this.x, this.y);


            // Enemy has a chance to shoot every movement

            if (this.y > -540 && this.y < 1044) //If enemy ship is within canvas
            {
                if (Math.floor(Math.random() * 100) < percentFire) {
                    this.fire();
                }
                return false;
            }

        }
        else {
            return true;
        }



    };


    //Fire the bullet
    this.fire = function () {
        game.enemyBulletPool.get(this.x + 70 + Math.random()*this.width/2 , this.y+this.height-100, 10);
        game.enemyBossLaserSound.play();
    }


    //Reset enemy values
    this.clear = function () {
        if (health <= 0) {
            playerScore++;
            this.x = 0;
            this.y = 0;
            this.speed = 0;
            this.speedX = 0;
            this.speedY = 0;
            this.alive = false;
            this.isColliding = false;
        }
    };
}
EnemyBoss.prototype = new Drawable();

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
// Detects collision for each object by determining if it is collidable with the object being passed
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
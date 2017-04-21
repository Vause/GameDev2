
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
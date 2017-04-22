
function HealthDisplay()
{
    this.speed = 0;

    this.drawFirst = function () {
        this.context.drawImage(imageRepository.fullgreendisplay, 810, 420);
    }
    // Implement abstract function defined above
    this.rightHit = function() {
        this.context.drawImage(imageRepository.fullreddisplay, 810, 420);
    };

    this.leftHit = function () {

    };

    this.midHit = function () {

    };
}
// Set Background to inherit properties from Drawable
HealthDisplay.prototype = new Drawable();
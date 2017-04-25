
function HealthDisplay()
{
    this.speed = 0;

    this.drawFirst = function () {
        this.context.drawImage(imageRepository.fullgreendisplay, 810, 420);
    }
    // Implement abstract function defined above
    this.rightHit = function() {
        if(leftHit == true && midHit == true) {this.context.drawImage(imageRepository.fullreddisplay, 810, 420);}
        else if(leftHit == true && midHit == false) {this.context.drawImage(imageRepository.leftrightreddisplay, 810, 420);}
        else if(leftHit == false && midHit == true) {this.context.drawImage(imageRepository.rightmidreddisplay, 810, 420);}
        else if(leftHit == false && midHit == false) {this.context.drawImage(imageRepository.rightreddisplay, 810, 420);}
    };

    this.leftHit = function () {
        if(rightHit == true && midHit == true) {this.context.drawImage(imageRepository.fullreddisplay, 810, 420);}
        else if(rightHit == true && midHit == false) {this.context.drawImage(imageRepository.leftrightreddisplay, 810, 420);}
        else if(rightHit == false && midHit == true) {this.context.drawImage(imageRepository.leftmidreddisplay, 810, 420);}
        else if(rightHit == false && midHit == false) {this.context.drawImage(imageRepository.leftreddisplay, 810, 420);}
    };

    this.midHit = function () {
        if(rightHit == true && leftHit == true) {this.context.drawImage(imageRepository.fullreddisplay, 810, 420);}
        else if(rightHit == true && leftHit == false) {this.context.drawImage(imageRepository.rightmidreddisplay, 810, 420);}
        else if(rightHit == false && leftHit == true) {this.context.drawImage(imageRepository.leftmidreddisplay, 810, 420);}
        else if(leftHit == false && rightHit == false) {this.context.drawImage(imageRepository.midreddisplay, 810, 420);}
    };
}
// Set Background to inherit properties from Drawable
HealthDisplay.prototype = new Drawable();
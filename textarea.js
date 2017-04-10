/**
 * Spritesheet-based text rendering, for in-game character dialog boxes, etc.
 * resources/monofont.png -- is used by default
 *
 */

class TextArea {
    constructor(x, y, string) {
        this.x = x;
        this.y = y;
        this.text = string;
        this.draw = (atx, aty) => {
            console.log("drawing " + string);
            if (!game.resourcesLoaded) return;
            var length = this.text.length;
            for (var i = 0; i < length; i++) {
                //var character = this.text.charAt(i);
                var posx = this.x + i * 16;
                var posy = this.y;
                var ascii = this.text.charAt(i).charCodeAt(0);
                //monofont.rotAnim(posx, posy, [5], 7, 16, 16, 0);
                monofont.draw(posx,posy);
            }
        };
    }
}
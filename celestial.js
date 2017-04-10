class CelestialManager {
    constructor(centerx,centery) {
        this.x = centerx;
        this.y = centery;
        this.sun_x = 0; // relative to center
        this.sun_y = 0;
        this.sun_x2 = 0; // relative to center
        this.sun_y2 = 0;
        this.angle = 0;
        this.active = false;
        this.place = (px, py) => {
            this.x = px;
            this.y = py;
            this.sun_x = -900;
            this.active = true;
        };
        this.process = () => {
            if (!this.active)
                return;
            this.sun_x2 = this.sun_x * Math.cos(this.angle) - this.sun_y * Math.sin(this.angle);
            this.sun_y2 = this.sun_y * Math.cos(this.angle) + this.sun_x * Math.sin(this.angle);
            this.angle += 0.002;
        };
        this.draw = () => {
            if (!this.active)
                return;
            window.sun.draw(this.x + this.sun_x2, this.y + this.sun_y2);
        };
    }
}


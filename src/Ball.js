import constants from './constants';
import * as utils from './utils';
import Vector from './Vector';

export default class Ball {
    constructor({ game, x, y, r, v, vx, vy, color, ignoreOverlap }) {
        this.game     = game;
        this.canvas   = game.canvas;
        this.ctx      = game.ctx;
        this.color    = color  || utils.randomColor([ constants.COLOR.BLACK ]);        
        
        this.ignoreOverlap = ignoreOverlap != null ? ignoreOverlap : false; // <- Only used in the question mark button

        // Radius is needed to compute random X and Y
        this.r = r != null ? r : this.randomR();        
        this.x = x != null ? x : this.randomX();
        this.y = y != null ? y : this.randomY();        
        this.v = v != null ? v : this.randomV();		

        if(vx != null) this.v.x = vx;
        if(vy != null) this.v.y = vy;

        this.mass = Math.PI * Math.pow(this.r, 2);
    }

    /**
     * Checks if this ball collides with the given other ball
     * @param {Ball} otherBall
     */
    collidesWith(otherBall) {
        const distance = this.distanceTo(otherBall);
        return distance < this.r + otherBall.r;
    }

    /**
     * Returns the overlap between this ball and another ball
     * @param {Ball} otherBall 
     */
    overlapWith(otherBall) {
        const distance = this.distanceTo(otherBall);
        return (this.r + otherBall.r) - distance;
    }

    distanceTo(otherBall) {
        const dx = this.x - otherBall.x;
        const dy = this.y - otherBall.y;
        return Math.sqrt(dx * dx + dy * dy);
    }

    updatePosition() {
        let dx = 0;
        let dy = 0;

        if(this.game.dt) {
            const dts = this.game.dt / 1000;

            const dxFloat = this.v.x * dts;
            const dyFloat = this.v.y * dts;

            // Prefer whole pixels, but go with floats
            // in case of 0 movement
            dx = Math.round(dxFloat) || dxFloat;
            dy = Math.round(dyFloat) || dyFloat;
        }

        const newX = this.x + dx;
        const newY = this.y + dy;

        const outOfBoundsHorizontally = this.isOutOfBoundsHorizontally(newX);
        const outOfBoundsVertically = this.isOutOfBoundsVertically(newY);

        if(outOfBoundsHorizontally || outOfBoundsVertically) {
            if(outOfBoundsHorizontally) {
                // Move into bounds and invert velocity direction
                this.x = utils.clamp(newX, this.r, this.canvas.width - this.r);
                this.v.x *= -1;
            }

            if(outOfBoundsVertically) {
                // Move into bounds and invert velocity direction
                this.y = utils.clamp(newY, this.r, this.canvas.height - this.r);
                this.v.y *= -1;
            }
        } else {
            this.x = newX;
            this.y = newY;
        }
    }

    draw() {     
        this.updatePosition();

        this.ctx.fillStyle = this.color;
        this.ctx.beginPath();
        this.ctx.arc(this.x, this.y, this.r, 0, Math.PI * 2);
        this.ctx.fill();    

        // if(this.game.lines.length > 0) {
        //     this.drawLineToLine(this.game.lines[0]);
        // }             
    }

    drawLineToLine(line) {
        this.ctx.moveTo(this.x, this.y);        
    }

    isOutOfBounds(x = this.x, y = this.y) {
		return this.isOutOfBoundsHorizontally(x) || this.isOutOfBoundsVertically(y);
	}

	isOutOfBoundsHorizontally(x = this.x) {
		return x - this.r < 0 || x + this.r > this.canvas.width;
	}

	isOutOfBoundsVertically(y = this.y) {
		return y - this.r < 0 || y + this.r > this.canvas.height
	}

    /**
     * Generates a random vector
     * @param {number} min Minimum velocity
     * @param {number} max Maximum velocity
     */
    randomV(min = 60, max = 600) {
        const randomVelocity = () => Math.floor((min + Math.random() * (max - min)) * (Math.random() > 0.5 ? 1 : -1));
        return new Vector(randomVelocity(), randomVelocity());
    }

    randomX() {
        return Math.floor(this.r + (Math.random() * (this.canvas.width - 2 * this.r)));
    }

    randomY() {
        return Math.floor(this.r + (Math.random() * (this.canvas.height - 2 * this.r)));
    }

    randomR(min = 10, max = 30) {
        return Math.floor(min + Math.random() * (max - min));
    }
}
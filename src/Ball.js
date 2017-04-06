import constants from './constants';
import * as utils from './utils';

export default class Ball {
    constructor({ game, x, y, radius, color, vx, vy }) {
        this.game     = game;
        this.canvas   = game.canvas;
        this.ctx      = game.ctx;
        this.color    = color  || utils.randomColor([ constants.COLOR.BLACK ]);        

        this.radius = radius != null ? radius : this.randomRadius();
        this.x      = x      != null ? x      : this.randomX();
        this.y      = y      != null ? y      : this.randomY();
        this.vx     = vx     != null ? vx     : this.randomVelocity();
		this.vy     = vy     != null ? vy     : this.randomVelocity();

        this.mass = Math.PI * Math.pow(this.radius, 2);

        // TMP
        this.prevAngle = null;
    }

    /**
     * Checks if this ball collides with the given other ball
     * @param {Ball} otherBall
     */
    collidesWith(otherBall) {
        const distance = this.distanceTo(otherBall);
        return distance < this.radius + otherBall.radius;
    }

    distanceTo(otherBall) {
        const dx = this.x - otherBall.x;
        const dy = this.y - otherBall.y;
        return Math.sqrt(dx * dx + dy * dy);
    }

    angleTo(otherBall) {
        const dx = this.x - otherBall.x;
        const dy = this.y - otherBall.y;
        if(dx === 0) {
            if(dy === 0) return 0;
            return Math.PI / 2;
        }
        if(dy === 0) return 0;        
        return Math.abs(Math.atan(dy / dx));
    }

    angle() {                
        if(this.vx === 0) {
            if(this.vy === 0) return 0;
            return (Math.PI / 2) * (this.vy < 0 ? -1 : 1);
        }        

        if(this.vy === 0) return this.vx < 0 ? Math.PI : 0;        
        
        let angle = Math.abs(Math.atan(this.vy / this.vx));                
        
        if(this.vx < 0) angle += Math.PI / 2;        
        if(this.vy < 0) angle *= -1;

        return angle;
    }

    vectorSize() {
        return Math.sqrt(this.vx * this.vx + this.vy * this.vy);
    }

    /* 99% working, angles between [-Math.PI/2, Math.PI/2]

    angleTo(otherBall) {
        const dx = this.x - otherBall.x;
        const dy = this.y - otherBall.y;

        if(dx === 0) return 0;
        return Math.atan(dy / dx);
    }

    angle() {
        if(this.vx === 0) {
            if(this.vy === 0) return 0;
            return this.vy < 0 ? -Math.PI / 2 : Math.PI / 2;
        }

        return Math.atan(this.vy / this.vx);
    }

    vectorSize() {
        return Math.sqrt(this.vx * this.vx + this.vy * this.vy) * (this.vx < 0 ? -1 : 1);
    }
    */

    setAngle(angle) {
        const length = this.vectorSize();
        this.vx = Math.cos(angle) * length;
        this.vy = Math.sin(angle) * length;
    }

    draw() {
        let dx = 0;
        let dy = 0;

        if(this.game.dt) {
            const dts = this.game.dt / 1000;

            const dxFloat = this.vx * dts;
            const dyFloat = this.vy * dts;

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
                this.x = utils.clamp(newX, this.radius, this.canvas.width - this.radius);
                this.vx *= -1;
            }

            if(outOfBoundsVertically) {
                // Move into bounds and invert velocity direction
                this.y = utils.clamp(newY, this.radius, this.canvas.height - this.radius);
                this.vy *= -1;
            }
        } else {
            this.x = newX;
            this.y = newY;
        }

        this.ctx.fillStyle = this.color;
        this.ctx.beginPath();
        this.ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
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
		return x - this.radius < 0 || x + this.radius > this.canvas.width;
	}

	isOutOfBoundsVertically(y = this.y) {
		return y - this.radius < 0 || y + this.radius > this.canvas.height
	}

    /**
     * Generates a random velocity
     * @param {number} min Minimum velocity
     * @param {number} max Maximum velocity
     */
    randomVelocity(min = 60, max = 1000) {
        return (min + Math.random() * (max - min)) * (Math.random() > 0.5 ? 1 : -1);
    }

    randomX() {
        return this.radius + (Math.random() * (this.canvas.width - 2 * this.radius));
    }

    randomY() {
        return this.radius + (Math.random() * (this.canvas.height - 2 * this.radius));
    }

    randomRadius(min = 10, max = 30) {
        return min + Math.random() * (max - min);
    }
}
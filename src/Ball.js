import constants from './constants';
import * as utils from './utils';
import Vector from './Vector';

export default class Ball {
    constructor({ game, x, y, r, v, vx, vy, color, ignoreOverlap, isStatic }) {
        this.game = game;
        this.canvas = game.canvas;
        this.ctx = game.ctx;
        this.color = color || utils.randomColor([constants.COLOR.BLACK]);

        this.ignoreOverlap = ignoreOverlap != null ? ignoreOverlap : false; // <- Only used in the question mark button

        // If true, this object will not change velocity in any way
        // after collision
        this.isStatic = isStatic != null ? isStatic : false;

        // Radius is needed to compute random X and Y
        this.r = r != null ? r : this.randomR();
        this.x = x != null ? x : this.randomX();
        this.y = y != null ? y : this.randomY();
        this.v = v != null ? v : this.randomV();

        if (vx != null) this.v.x = vx;
        if (vy != null) this.v.y = vy;

        if (this.isStatic) {
            // We emulate a static ball by setting its mass to the maximum possible value
            this.mass = Number.MAX_SAFE_INTEGER;
        } else {
            // Regular case
            this.mass = this.getArea();
        }
    }

    getArea() {
        return Math.PI * Math.pow(this.r, 2);
    }

    /**
     * Checks if this ball collides with the given other ball
     * @param {Ball} otherBall
     */
    collidesWithBall(otherBall) {
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
        if (this.isStatic) return;

        let dx = 0;
        let dy = 0;

        if (this.game.dt) {
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

        if (outOfBoundsHorizontally || outOfBoundsVertically) {
            if (outOfBoundsHorizontally) {
                // Move into bounds and invert velocity direction
                this.x = utils.clamp(newX, this.r, this.canvas.width - this.r);
                this.v.x *= -1;
            }

            if (outOfBoundsVertically) {
                // Move into bounds and invert velocity direction
                this.y = utils.clamp(newY, this.r, this.canvas.height - this.r);
                this.v.y *= -1;
            }
        } else {
            this.x = newX;
            this.y = newY;
        }
    }

    resolveCollisionWithBall(otherBall) {
        // From: http://vobarian.com/collisions/
        // Document saved in /docs

        // Masses
        const m1 = this.mass;
        const m2 = otherBall.mass;

        // Normal vector
        const n = new Vector(this.x - otherBall.x, this.y - otherBall.y);

        // Unit vector
        const un = n.normalize();

        // Unit tangent vector
        const ut = un.tangent();

        // Velocity vectors
        const v1 = this.v;
        const v2 = otherBall.v;

        // Scalar velocities in normal direction
        const v1n = un.dot(v1);
        const v2n = un.dot(v2);

        // Scalar velocities in tangent direction
        const v1t = ut.dot(v1);
        const v2t = ut.dot(v2);

        // Tangent velocities after collision (remain unchanged)
        const v1t_ = v1t;
        const v2t_ = v2t;

        // Normal velocities after collision
        const v1n_ = (v1n * (m1 - m2) + 2 * m2 * v2n) / (m1 + m2);
        const v2n_ = (v2n * (m2 - m1) + 2 * m1 * v1n) / (m2 + m1);

        // Velocities to vectors
        const v1n_v = un.multiply(v1n_);
        const v1t_v = ut.multiply(v1t_);
        const v2n_v = un.multiply(v2n_);
        const v2t_v = ut.multiply(v2t_);

        // Final velocity vectors
        const v1_ = v1n_v.add(v1t_v);
        const v2_ = v2n_v.add(v2t_v);

        // Set new velocities
        this.v.x = Math.round(v1_.x);
        this.v.y = Math.round(v1_.y);
        otherBall.v.x = Math.round(v2_.x);
        otherBall.v.y = Math.round(v2_.y);

        // Move balls to not overlap anymore,
        // but not when both balls are configured
        // to ignore overlap
        if (this.ignoreOverlap && otherBall.ignoreOverlap) {
            return;
        }

        const overlap = this.overlapWith(otherBall);

        // Movement is relative to inverse of mass * magnitude.
        // If either magnitude is 0, however, we will look at mass alone
        const v1m = v1.magnitude();
        const v2m = v2.magnitude();
        const onlyMass = v1m === 0 || v2m === 0;
        const fA = m1 * (onlyMass ? 1 : v1m);
        const fB = m2 * (onlyMass ? 1 : v2m);
        const fOverlap = overlap / (fA + fB);

        const ovA = un.multiply(fOverlap * fB);
        this.x = Math.round(this.x + ovA.x);
        this.y = Math.round(this.y + ovA.y);

        const ovB = un.reverse().multiply(fOverlap * fA);
        otherBall.x = Math.round(otherBall.x + ovB.x);
        otherBall.y = Math.round(otherBall.y + ovB.y);
    }

    draw() {
        this.updatePosition();

        this.ctx.fillStyle = this.color;
        this.ctx.beginPath();
        this.ctx.arc(this.x, this.y, this.r, 0, Math.PI * 2);
        this.ctx.fill();
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
    randomV(min = 50, max = 500) {
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
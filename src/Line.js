import constants from "./constants";
import * as utils from "./utils";
import Vector from "./Vector";
import Ball from "./Ball";

export default class Line {
    constructor({ game, x, y, v, color, width }) {
        this.game = game;
        this.canvas = game.canvas;
        this.ctx = game.ctx;

        this.x = x;
        this.y = y;
        this.v = v;

        this.width = width == null ? 8 : width;
        this.color = color || utils.randomColor(constants.COLOR.BLACK);

        // End-points e1 and e2 are represented by circles for bounce calculations
        this.e1 = this.createE1();
        this.e2 = this.createE2();
    }

    createEndpoint() {
        return new Ball({
            game: this.game,
            r: Math.floor(this.width / 2),
            v: new Vector(0, 0),
            isStatic: true
        });
    }

    createE1() {
        const endpoint = this.createEndpoint();
        this.positionE1(endpoint);
        return endpoint;
    }

    positionE1(c = this.e1) {
        c.x = this.x;
        c.y = this.y;
    }

    createE2() {
        const endpoint = this.createEndpoint();
        this.positionE2(endpoint);
        return endpoint;
    }

    positionE2(c = this.e2) {
        c.x = this.x + this.v.x;
        c.y = this.y + this.v.y;
    }

    draw() {
        this.ctx.beginPath();
        this.ctx.moveTo(this.x, this.y);
        this.ctx.lineTo(this.x + this.v.x, this.y + this.v.y);
        this.ctx.lineWidth = this.width;
        this.ctx.lineCap = "round";
        this.ctx.strokeStyle = this.color;
        this.ctx.stroke();
    }

    reverse() {
        this.v = this.v.reverse();
    }

    length() {
        return Math.sqrt(this.v.dot(this.v));
    }

    /**
    * Sets the start of this line to be at the given coordinate (x,y)
    * @param {number} x 
    * @param {number} y 
    */
    setStart(x, y) {
        this.x = x;
        this.y = y;
        this.positionE1();
    }

    /**
     * Sets the end of this line to be at the given coordinate (x,y)
     * @param {number} x 
     * @param {number} y 
     */
    setEnd(x, y) {
        this.v.x = x - this.x;
        this.v.y = y - this.y;
        this.positionE2();
    }

    collidesWithBall(ball) {
        // First check endpoints
        if (this.endpointsCollideWithBall(ball)) return true;

        const m = new Vector(this.x - ball.x, this.y - ball.y);
        const c = m.dot(m) - ball.r * ball.r;

        if (c <= 0) return true;

        const b = m.dot(this.v.normalize());
        if (b > 0) return false;

        const discr = b * b - c;
        if (discr < 0) return false;

        const t = -b - Math.sqrt(discr);
        if (t > this.v.magnitude()) return false;

        return true;
    }

    endpointsCollideWithBall(ball) {
        return this.e1.collidesWithBall(ball) || this.e2.collidesWithBall(ball);
    }

    resolveCollisionWithBall(ball) {
        // End-point collision will turn this into a ball-ball collision
        if (this.e1.collidesWithBall(ball)) {
            this.e1.resolveCollisionWithBall(ball);
            return;
        }

        if (this.e2.collidesWithBall(ball)) {
            this.e2.resolveCollisionWithBall(ball);
            return;
        }

        // Tangent and unit tangent vector
        const t = this.v;
        const ut = t.normalize();

        // Unit vector (== tangent of line)
        const un = ut.tangent();

        // Scalar velocities in normal and tangent direction
        const bvn = un.dot(ball.v);
        const bvt = ut.dot(ball.v);

        // After collision.
        // Invert normal velocity, tangent velocity remains the same
        const bvn_ = -bvn;
        const bvt_ = bvt;

        // Convert to vectors
        const vn = un.multiply(bvn_);
        const vt = ut.multiply(bvt_);

        // Create final vector
        const fv = vn.add(vt);

        // Change ball direction
        ball.v = fv;
    }
}

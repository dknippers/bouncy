import constants from './constants';
import * as utils from './utils';
import Vector from './Vector';

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
    }

    draw() {
        this.ctx.beginPath();				
        this.ctx.moveTo(this.x, this.y);
		this.ctx.lineTo(this.x + this.v.x, this.y + this.v.y);
        this.ctx.lineWidth = this.width;		
        this.ctx.lineCap = 'round';
		this.ctx.strokeStyle = this.color;
        this.ctx.stroke();
    }

    reverse() {
        this.v = this.v.reverse();
    }
 
    length() {        
        return Math.sqrt(this.v.dot(this.v));
    }

    collidesWithBall(ball) {
        const m = new Vector(this.x - ball.x, this.y - ball.y);        
        const c = m.dot(m) - ball.r * ball.r;
        if(c <= 0) return true;
        
        const b = m.dot(this.v.normalize());        
        if(b > 0) return false;
        
        const discr = b * b - c;
        if(discr < 0) return false;

        const t = -b - Math.sqrt(discr);
        if(t > this.v.magnitude()) return false;
        
        return true;
    }
}
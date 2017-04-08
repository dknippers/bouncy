import constants from './constants';
import * as utils from './utils';
import Vector from './Vector';

export default class Line {
    constructor({ game, x1, y1, x2, y2, color, width }) {
        this.game = game;
        this.canvas = game.canvas;
        this.ctx = game.ctx;

        this.x1 = x1;
        this.y1 = y1;
        this.x2 = x2;
        this.y2 = y2;    

        this.width = width == null ? 4 : width;
        this.color = color || utils.randomColor(constants.COLOR.BLACK);
    }

    draw() {
        this.ctx.beginPath();				
        this.ctx.moveTo(this.x1, this.y1);
		this.ctx.lineTo(this.x2, this.y2);
        this.ctx.lineWidth = this.width;		
        this.ctx.lineCap = 'round';
		this.ctx.strokeStyle = this.color;
        this.ctx.stroke();

        // const d = utils.rad2deg(this.angle());
        // console.log(d);
    }

    toVector() {
        return new Vector(this.x2 - this.x1, this.y2 - this.y1);
    }

    setAngle(angle) {        
        const length = this.length();        

        // Normalize, left to right
        if(this.x1 > this.x2) {
            this.reverse();
        }

        const dx = Math.cos(angle) * length;
        const dy = Math.sin(angle) * length;

        this.x2 = this.x1 + dx;
        this.y2 = this.y1 + dy;
    }

    reverse() {
        const x1 = this.x1;
        const y1 = this.y1;

        this.x1 = this.x2;
        this.y1 = this.y2;

        this.x2 = x1;
        this.y2 = y1;
    }

    dx() {
        return this.x2 - this.x1;
    }

    dy() {
        return this.y2 - this.y1;
    }

    containsPoint(x, y, margin = 0) {
        const minx = Math.min(this.x1, this.x2);
        const maxx = Math.max(this.x1, this.x2);
        const miny = Math.min(this.y1, this.y2);
        const maxy = Math.max(this.y1, this.y2);

        if(x < (minx - margin) || x > (maxx + margin)) return false;
        if(y < (miny - margin) || y > (maxy + margin)) return false;

        // Normalize from left to right
        let tdx;
        let tdy;
        if(this.x2 >= this.x1) {
            tdx = this.x2 - this.x1;
            tdy = this.y2 - this.y1;
        } else {
             tdx = this.x1 - this.x2;
             tdy = this.y1 - this.y2;
        }

        if(tdx === 0) {
            return Math.abs(this.x1 - x) <= margin && y >= (miny - margin) && y <= (maxy + margin);
        }

        const dx = x - this.x1;
        const dy = dx * (tdy / tdx);        
        const targetY = this.y1 + dy;
        return Math.abs(targetY - y) <= margin;
    }

    length() {
        const dx = this.x2 - this.x1;
        const dy = this.y2 - this.y1;

        return Math.sqrt(dx * dx + dy * dy);
    }

    collidesWithBall(ball) {
        return false;
    }

    changeAngle(deltaAngle) {
        this.setAngle(this.angle() + deltaAngle);
    }

    angle() {
        const dx = this.x2 - this.x1;
        const dy = this.y2 - this.y1;

        if(dx === 0) return Math.PI * 0.5;                
        if(dy === 0) return 0;

        return Math.atan(dy / dx);
    }
}
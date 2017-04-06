import constants from './constants';
import * as utils from './utils';

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
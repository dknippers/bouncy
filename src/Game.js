import Ball from './Ball';
import Line from './Line';
import Vector from './Vector';
import constants from './constants';
import * as utils from './utils';

export default class Game {
	constructor(canvasId) {
		this.canvas = document.getElementById(canvasId);
		this.ctx = this.canvas.getContext('2d');            

		this.prevT = null;
		this.dt = null;

		this.isAnimating = false;
		this.animationId = null;
		this.balls = [];
		this.lines = [];

		this.line = null; // Line being drawn at the moment
		this.isDrawing = false;		

		this.setupInputEvents();
		this.testCollisions();
		
		// this.testCollisions();	
		// this.addBall(new Ball({ game: this, x: 0, y: 0, vx: 20, vy: 10, radius: 15 }));

		this.startAnimation();				
		this.canvas.focus();
  	}

	lockedBalls() {		
		const ballA = new Ball({ game: this, vx: 5, radius: 40 });

		const ballBColor = utils.randomColor([ ballA.color, constants.COLOR.BLACK ]);
		const ballB = new Ball({ game: this, x: ballA.x - 20, y: ballA.y, vx: -10, vy: -10, radius: 20, color: ballBColor });

		this.addBall(ballA);
		this.addBall(ballB);
	}

	testCollisions() {
		// +- 40 degree angle from left
		// this.addBall(new Ball({ game: this, x: 40, y: this.canvas.height / 2 - 50, radius: 40, vx: 300, vy: 0 }));		

		// +- 40 degree angle from right above
		// this.addBall(new Ball({ game: this, x: this.canvas.width - 40, y: this.canvas.height / 2 - 50, radius: 40, vx: -300, vy: 0 }));		

		// +- 40 degree angle from right below
		// this.addBall(new Ball({ game: this, x: this.canvas.width - 40, y: this.canvas.height / 2 + 105, radius: 30, vx: -200, vy: 0 }));		

		// +- 40 degree angle from bottom
		// this.addBall(new Ball({ game: this, x: this.canvas.width / 2 - 50, y: this.canvas.height - 40, radius: 40, vx: 0, vy: -300 }));		

		// +- 40 degree angle from top
		// this.addBall(new Ball({ game: this, x: this.canvas.width / 2 - 50, y: 40, radius: 40, vx: 10, vy: 300 }));		

		// 0 degree angle from left
		// this.addBall(new Ball({ game: this, x: 40, y: this.canvas.height / 2, radius: 40, vx: 5000, vy: 0 }));				

		// 0 degree angle from right		
		// this.addBall(new Ball({ game: this, x: this.canvas.width - 40, y: this.canvas.height / 2, radius: 40, vx: -300, vy: 0 }));	

		// 0 degree angle from top
		// this.addBall(new Ball({ game: this, x: this.canvas.width / 2, y: 40, radius: 40, vx: 0, vy: 100 }));	

		// 0 degree angle from bottom
		// this.addBall(new Ball({ game: this, x: this.canvas.width / 2, y: this.canvas.height - 40, radius: 40, vx: 0, vy: 100 }));	

		// Centered
		// this.addBall(new Ball({ game: this, x: this.canvas.width / 2, y: this.canvas.height / 2, radius: 4, vx: 0, vy: 0 }));				
	}

	setupInputEvents() {
		this.canvas.addEventListener('keydown', e => this.onKeydown(e));   

		if(utils.isTouchDevice()) {
			this.canvas.addEventListener('touchstart', e => this.onTouchstart(e));
			this.canvas.addEventListener('touchend', e => this.onTouchend(e));
			this.canvas.addEventListener('touchmove', e => this.onTouchmove(e));
			
		} else {			
			this.canvas.addEventListener('mousedown', e => this.onMousedown(e));		
			this.canvas.addEventListener('mouseup', e => this.onMouseup(e));		
			this.canvas.addEventListener('mousemove', e => this.onMousemove(e));		
		}
	}

	/**
	 * Adds ball to the game.
	 * If a ball is not supplied, adds a random ball.
	 * @param {Ball} [ball] Ball to add to this game
	 */
	addBall(ball) {
		this.balls.push(ball || new Ball({ game: this }));
	}

	removeBall({ ball = null, index = null } = {}) {
		let indexToRemove = index;
		
		if(indexToRemove == null) {
			if(ball) {
				indexToRemove = this.balls.indexOf(ball);
			} else {
				// Random index
				indexToRemove = Math.floor(Math.random() * this.balls.length);
			}
		}

		if(indexToRemove === -1 || indexToRemove >= this.balls.length) {
			return;
		}

		this.balls.splice(indexToRemove, 1);
	}

	startAnimation() {		
		this.isAnimating = true;
		this.animationId = requestAnimationFrame(this.animationLoop.bind(this));    
	}
	
	stopAnimation() {
		if(this.animationId) {
			cancelAnimationFrame(this.animationId);
		}

		this.isAnimating = false;
		this.prevT = null;    
		this.dt = null;
	}

	toggleAnimation() {
		if(this.isAnimating) {
			this.stopAnimation();
		} else {
			this.startAnimation();
		}
	}

	animationLoop(t) {
		this.processTime(t);		
		this.draw();		

		if(this.isAnimating) {
			this.animationId = requestAnimationFrame(this.animationLoop.bind(this));
		}
	}

	/**
	 * Calculates the time delta and stores the given timestamp for future time delta calculations
	 * @param {number} t Timestamp
	 */
	processTime(t) {
		this.dt = this.prevT ? t - this.prevT : 0;    
		this.prevT = t;
	}

	draw() {
		this.clear();				
		this.drawBalls();		
		this.resolveCollisions();		

		this.drawLines();
	}	

	drawBalls() {
		this.balls.forEach(ball => ball.draw());
	}

	drawLines() {
		this.lines.forEach(line => line.draw());		
	}

	reset() {
		this.clear();
		this.balls.length = 0;
		this.lines.length = 0;
	}

	resolveCollisions() {
		this.resolveBallToBallCollisions();
		this.resolveLineToBallCollisions();
	}

	resolveBallToBallCollisions() {
		for(let a = 0; a < this.balls.length; a++) {
			const ballA = this.balls[a];			

			for(let b = a+1; b < this.balls.length; b++) {
				const ballB = this.balls[b];								
				
				// No collision
				if(!ballA.collidesWith(ballB)) {
					continue;
				}		

				this.resolveBallToBallCollision(ballA, ballB);
			}
		}
	}

	// From: http://vobarian.com/collisions/
	// Document saved in /docs
	resolveBallToBallCollision(ballA, ballB) {
		// Masses
		const m1 = ballA.mass;
		const m2 = ballB.mass;

		// Normal vector
		const n = new Vector(ballA.x - ballB.x, ballA.y - ballB.y);

		// Unit vector
		const un = n.unitVector();

		// Unit tangent vector
		const ut = un.tangentVector();

		// Velocity vectors
		const v1 = new Vector(ballA.vx, ballA.vy);
		const v2 = new Vector(ballB.vx, ballB.vy);

		// Scalar velocities in normal direction
		const v1n = un.dotProduct(v1);
		const v2n = un.dotProduct(v2);

		// Scalar velocities in tangent direction
		const v1t = ut.dotProduct(v1);
		const v2t = ut.dotProduct(v2);

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
		ballA.vx = Math.round(v1_.x);
		ballA.vy = Math.round(v1_.y);

		ballB.vx = Math.round(v2_.x);
		ballB.vy = Math.round(v2_.y);

		// Move balls to not overlap anymore
		const overlap = ballA.overlapWith(ballB);

		// Movement is relative to inverse of mass * magnitude
		const fA = m1 * v1.magnitude();
		const fB = m2 * v2.magnitude();		
		const fOverlap = overlap / (fA + fB);

		const ovA = un.multiply(fOverlap * fB);
		ballA.x = Math.round(ballA.x + ovA.x);
		ballA.y = Math.round(ballA.y + ovA.y);

		const ovB = un.reverse().multiply(fOverlap * fA);
		ballB.x = Math.round(ballB.x + ovB.x);
		ballB.y = Math.round(ballB.y + ovB.y);
	}
	
	resolveLineToBallCollisions() {
		return; // TODO
		for(let i = 0; i < this.lines.length; i++) {
			const line = this.lines[i];

			// Adjust angle to 0 to make calculations much easier
			const lineAngle = line.angle();						
			line.setAngle(0);
			const deltaAngle = 0 - lineAngle;

			for(let j = 0; j < this.balls.length; j++) {
				const ball = this.balls[j];

				// Adjust angle to match line rotation
				const ballAngle = ball.angle();
				ball.changeAngle(deltaAngle);

				// Handle collision
				if(line.collidesWithBall(ball)) {
					ball.vy *= -1;
				}				

				// Restore angle
				ball.setAngle(ballAngle);
			}

			// Restore angle
			line.setAngle(lineAngle);
		}
	}

	onKeydown(e) {
		switch(e.keyCode) {      
		case constants.KEYCODE.SPACE:
		case constants.KEYCODE.ESC:        
			this.toggleAnimation();
			break;

		case constants.KEYCODE.LEFT:
		case constants.KEYCODE.RIGHT:           
		case constants.KEYCODE.UP:           
		case constants.KEYCODE.DOWN:       
			break;                            

		case constants.KEYCODE.F:
			if(!this.isAnimating) {
				this.startAnimation();
			}
			requestAnimationFrame(() => requestAnimationFrame(() => this.stopAnimation()));			
			return;
		
		default: break;
		}
	}

	startDrawingLine(x, y) {
		this.line = new Line({ game: this, x1: x, y1: y, x2: x, y2: y });
		this.lines.push(this.line);
		this.isDrawing = true;
	}

	updateDrawLine(x, y) {
		this.line.x2 = x;
		this.line.y2 = y;	
	}

	stopDrawingLine() {
		this.isDrawing = false;
	}

	onMousedown(e) {						
		const { x, y } = this.normalizedMouseCoordinates(e);
		this.startDrawingLine(x, y);		
	}

	onMouseup(e) {
		this.stopDrawingLine();
	}

	onMousemove(e) {
		if(!this.isDrawing) return;		

		const { x, y } = this.normalizedMouseCoordinates(e);
		this.updateDrawLine(x, y);			
	}

	onTouchstart(e) {						
		e.preventDefault();
		const { x, y } = this.normalizedTouchCoordinates(e);

		this.startDrawingLine(x, y);
	}

	onTouchend(e) {
		e.preventDefault();
		this.stopDrawingLine();		
	}

	onTouchmove(e) {
		e.preventDefault();
		if(!this.isDrawing) return;				

		const { x, y } = this.normalizedTouchCoordinates(e);
		this.updateDrawLine(x, y);
	}

	/**
	 * Returns the coordinates for the given mouse event normalized to the canvas' width and height,
	 * i.e. the returned coordinates are between (0,0) and (canvas.width, canvas.height), regardless
	 * of the client's current viewport.
	 * @param {MouseEvent} e 
	 */
	normalizedMouseCoordinates(e) {
		if(!e.target.tagName.toLowerCase() === 'canvas') return;

		const { offsetX, offsetY } = e;
		const { clientWidth, clientHeight, width, height } = e.target;

		const x = Math.floor(offsetX * (width / clientWidth));
		const y = Math.floor(offsetY * (height / clientHeight));

		return { x, y };
	}

	/**
	 * Returns the coordinates for the given touch event normalized to the canvas' width and height,
	 * i.e. the returned coordinates are between (0,0) and (canvas.width, canvas.height), regardless
	 * of the client's current viewport.
	 * @param {TouchEvent} e 
	 */
	normalizedTouchCoordinates(e) {
		if(!e.target.tagName.toLowerCase() === 'canvas' || e.touches.length === 0) return;

		const lastTouch = e.touches[e.touches.length-1];
		const { clientX, clientY, target } = lastTouch;
		
		const { offsetLeft, offsetTop, clientWidth, clientHeight, width, height } = target;

		const offsetX = clientX - offsetLeft;
		const offsetY = clientY - offsetTop;

		const x = Math.floor(offsetX * (width / clientWidth));
		const y = Math.floor(offsetY * (height / clientHeight));

		return { x, y };
	}

	clear() {
		utils.clearCanvas(this.canvas, this.ctx);    
	} 
}
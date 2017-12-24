(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
"use strict";function _interopRequireWildcard(t){if(t&&t.__esModule)return t;var i={};if(null!=t)for(var e in t)Object.prototype.hasOwnProperty.call(t,e)&&(i[e]=t[e]);return i.default=t,i}function _interopRequireDefault(t){return t&&t.__esModule?t:{default:t}}function _classCallCheck(t,i){if(!(t instanceof i))throw new TypeError("Cannot call a class as a function")}Object.defineProperty(exports,"__esModule",{value:!0});var _createClass=function(){function t(t,i){for(var e=0;e<i.length;e++){var r=i[e];r.enumerable=r.enumerable||!1,r.configurable=!0,"value"in r&&(r.writable=!0),Object.defineProperty(t,r.key,r)}}return function(i,e,r){return e&&t(i.prototype,e),r&&t(i,r),i}}(),_constants=require("./constants"),_constants2=_interopRequireDefault(_constants),_utils=require("./utils"),utils=_interopRequireWildcard(_utils),_Vector=require("./Vector"),_Vector2=_interopRequireDefault(_Vector),Ball=function(){function t(i){var e=i.game,r=i.x,n=i.y,a=i.r,s=i.v,o=i.vx,h=i.vy,l=i.color,u=i.ignoreOverlap,c=i.isStatic;_classCallCheck(this,t),this.game=e,this.canvas=e.canvas,this.ctx=e.ctx,this.color=l||utils.randomColor([_constants2.default.COLOR.BLACK]),this.ignoreOverlap=null!=u&&u,this.isStatic=null!=c&&c,this.r=null!=a?a:this.randomR(),this.x=null!=r?r:this.randomX(),this.y=null!=n?n:this.randomY(),this.v=null!=s?s:this.randomV(),null!=o&&(this.v.x=o),null!=h&&(this.v.y=h),this.isStatic?this.mass=Number.MAX_SAFE_INTEGER:this.mass=this.getArea()}return _createClass(t,[{key:"getArea",value:function(){return Math.PI*Math.pow(this.r,2)}},{key:"collidesWithBall",value:function(t){return this.distanceTo(t)<this.r+t.r}},{key:"overlapWith",value:function(t){var i=this.distanceTo(t);return this.r+t.r-i}},{key:"distanceTo",value:function(t){var i=this.x-t.x,e=this.y-t.y;return Math.sqrt(i*i+e*e)}},{key:"updatePosition",value:function(){if(!this.isStatic){var t=0,i=0;if(this.game.dt){var e=this.game.dt/1e3,r=this.v.x*e,n=this.v.y*e;t=Math.round(r)||r,i=Math.round(n)||n}var a=this.x+t,s=this.y+i,o=this.isOutOfBoundsHorizontally(a),h=this.isOutOfBoundsVertically(s);o||h?(o&&(this.x=utils.clamp(a,this.r,this.canvas.width-this.r),this.v.x*=-1),h&&(this.y=utils.clamp(s,this.r,this.canvas.height-this.r),this.v.y*=-1)):(this.x=a,this.y=s)}}},{key:"resolveCollisionWithBall",value:function(t){var i=this.mass,e=t.mass,r=new _Vector2.default(this.x-t.x,this.y-t.y),n=r.normalize(),a=n.tangent(),s=this.v,o=t.v,h=n.dot(s),l=n.dot(o),u=a.dot(s),c=a.dot(o),d=u,v=c,y=(h*(i-e)+2*e*l)/(i+e),f=(l*(e-i)+2*i*h)/(e+i),m=n.multiply(y),x=a.multiply(d),p=n.multiply(f),_=a.multiply(v),g=m.add(x),M=p.add(_);if(this.v.x=Math.round(g.x),this.v.y=Math.round(g.y),t.v.x=Math.round(M.x),t.v.y=Math.round(M.y),!this.ignoreOverlap||!t.ignoreOverlap){var O=this.overlapWith(t),k=s.magnitude(),w=o.magnitude(),B=0===k||0===w,C=i*(B?1:k),V=e*(B?1:w),b=O/(C+V),q=n.multiply(b*V);this.x=Math.round(this.x+q.x),this.y=Math.round(this.y+q.y);var R=n.reverse().multiply(b*C);t.x=Math.round(t.x+R.x),t.y=Math.round(t.y+R.y)}}},{key:"draw",value:function(){this.updatePosition(),this.ctx.fillStyle=this.color,this.ctx.beginPath(),this.ctx.arc(this.x,this.y,this.r,0,2*Math.PI),this.ctx.fill()}},{key:"drawLineToLine",value:function(t){this.ctx.moveTo(this.x,this.y)}},{key:"isOutOfBounds",value:function(){var t=arguments.length>0&&void 0!==arguments[0]?arguments[0]:this.x,i=arguments.length>1&&void 0!==arguments[1]?arguments[1]:this.y;return this.isOutOfBoundsHorizontally(t)||this.isOutOfBoundsVertically(i)}},{key:"isOutOfBoundsHorizontally",value:function(){var t=arguments.length>0&&void 0!==arguments[0]?arguments[0]:this.x;return t-this.r<0||t+this.r>this.canvas.width}},{key:"isOutOfBoundsVertically",value:function(){var t=arguments.length>0&&void 0!==arguments[0]?arguments[0]:this.y;return t-this.r<0||t+this.r>this.canvas.height}},{key:"randomV",value:function(){var t=arguments.length>0&&void 0!==arguments[0]?arguments[0]:50,i=arguments.length>1&&void 0!==arguments[1]?arguments[1]:500,e=function(){return Math.floor((t+Math.random()*(i-t))*(Math.random()>.5?1:-1))};return new _Vector2.default(e(),e())}},{key:"randomX",value:function(){return Math.floor(this.r+Math.random()*(this.canvas.width-2*this.r))}},{key:"randomY",value:function(){return Math.floor(this.r+Math.random()*(this.canvas.height-2*this.r))}},{key:"randomR",value:function(){var t=arguments.length>0&&void 0!==arguments[0]?arguments[0]:10,i=arguments.length>1&&void 0!==arguments[1]?arguments[1]:30;return Math.floor(t+Math.random()*(i-t))}}]),t}();exports.default=Ball;
},{"./Vector":4,"./constants":5,"./utils":9}],2:[function(require,module,exports){
"use strict";function _interopRequireWildcard(t){if(t&&t.__esModule)return t;var e={};if(null!=t)for(var n in t)Object.prototype.hasOwnProperty.call(t,n)&&(e[n]=t[n]);return e.default=t,e}function _interopRequireDefault(t){return t&&t.__esModule?t:{default:t}}function _classCallCheck(t,e){if(!(t instanceof e))throw new TypeError("Cannot call a class as a function")}Object.defineProperty(exports,"__esModule",{value:!0});var _createClass=function(){function t(t,e){for(var n=0;n<e.length;n++){var i=e[n];i.enumerable=i.enumerable||!1,i.configurable=!0,"value"in i&&(i.writable=!0),Object.defineProperty(t,i.key,i)}}return function(e,n,i){return n&&t(e.prototype,n),i&&t(e,i),e}}(),_Ball=require("./Ball"),_Ball2=_interopRequireDefault(_Ball),_Line=require("./Line"),_Line2=_interopRequireDefault(_Line),_Vector=require("./Vector"),_Vector2=_interopRequireDefault(_Vector),_constants=require("./constants"),_constants2=_interopRequireDefault(_constants),_utils=require("./utils"),utils=_interopRequireWildcard(_utils),Game=function(){function t(e){_classCallCheck(this,t),this.canvas=document.getElementById(e),this.ctx=this.canvas.getContext("2d"),this.prevT=null,this.dt=null,this.isAnimating=!1,this.animationId=null,this.balls=[],this.lines=[],this.line=null,this.maxConcurrentLines=5,this.isDrawing=!1,this.canvas.focus(),this.setupInputEvents(),this.startAnimation()}return _createClass(t,[{key:"lockedBalls",value:function(){var t=new _Ball2.default({game:this,vx:5,vy:400,r:40,ignoreOverlap:!0}),e=utils.randomColor([t.color,_constants2.default.COLOR.BLACK]),n=new _Ball2.default({game:this,x:t.x-20,y:t.y,vx:10,vy:10,r:20,color:e,ignoreOverlap:!0});this.addBall(t),this.addBall(n)}},{key:"testCollisions",value:function(){this.addBall(new _Ball2.default({game:this,x:this.canvas.width/2,y:40,r:20,vx:0,vy:200})),this.lines.push(new _Line2.default({game:this,x:this.canvas.width/2,y:this.canvas.height-100,v:new _Vector2.default(0,-100)}))}},{key:"setupInputEvents",value:function(){var t=this;this.canvas.addEventListener("keydown",function(e){return t.onKeydown(e)}),utils.isTouchDevice()?(this.canvas.addEventListener("touchstart",function(e){return t.onTouchstart(e)}),this.canvas.addEventListener("touchend",function(e){return t.onTouchend(e)}),this.canvas.addEventListener("touchmove",function(e){return t.onTouchmove(e)})):(this.canvas.addEventListener("mousedown",function(e){return t.onMousedown(e)}),this.canvas.addEventListener("mouseup",function(e){return t.onMouseup(e)}),this.canvas.addEventListener("mousemove",function(e){return t.onMousemove(e)}))}},{key:"addBall",value:function(t){this.balls.push(t||new _Ball2.default({game:this}))}},{key:"removeBall",value:function(){var t=arguments.length>0&&void 0!==arguments[0]?arguments[0]:{},e=t.ball,n=void 0===e?null:e,i=t.index,a=void 0===i?null:i,s=a;null==s&&(s=n?this.balls.indexOf(n):Math.floor(Math.random()*this.balls.length)),s===-1||s>=this.balls.length||this.balls.splice(s,1)}},{key:"startAnimation",value:function(){this.isAnimating||(this.isAnimating=!0,this.animationId=requestAnimationFrame(this.animationLoop.bind(this)))}},{key:"stopAnimation",value:function(){this.animationId&&cancelAnimationFrame(this.animationId),this.isAnimating=!1,this.prevT=null,this.dt=null}},{key:"toggleAnimation",value:function(){this.isAnimating?this.stopAnimation():this.startAnimation()}},{key:"animationLoop",value:function(t){this.processTime(t),this.draw(),this.isAnimating&&(this.animationId=requestAnimationFrame(this.animationLoop.bind(this)))}},{key:"processTime",value:function(t){this.dt=this.prevT?t-this.prevT:0,this.prevT=t}},{key:"draw",value:function(){this.clear(),this.drawBalls(),this.resolveCollisions(),this.drawLines()}},{key:"drawBalls",value:function(){this.balls.forEach(function(t){return t.draw()})}},{key:"drawLines",value:function(){this.lines.forEach(function(t){return t.draw()})}},{key:"reset",value:function(){this.clear(),this.balls.length=0,this.lines.length=0}},{key:"resolveCollisions",value:function(){this.resolveBallToBallCollisions(),this.resolveLineToBallCollisions()}},{key:"resolveBallToBallCollisions",value:function(){for(var t=0;t<this.balls.length;t++)for(var e=this.balls[t],n=t+1;n<this.balls.length;n++){var i=this.balls[n];e.collidesWithBall(i)&&e.resolveCollisionWithBall(i)}}},{key:"resolveLineToBallCollisions",value:function(){for(var t=0;t<this.lines.length;t++)for(var e=this.lines[t],n=0;n<this.balls.length;n++){var i=this.balls[n];i.ignoreOverlap||e.collidesWithBall(i)&&e.resolveCollisionWithBall(i)}}},{key:"onKeydown",value:function(t){var e=this;switch(t.keyCode){case _constants2.default.KEYCODE.SPACE:case _constants2.default.KEYCODE.ESC:this.toggleAnimation();break;case _constants2.default.KEYCODE.LEFT:case _constants2.default.KEYCODE.RIGHT:case _constants2.default.KEYCODE.UP:case _constants2.default.KEYCODE.DOWN:break;case _constants2.default.KEYCODE.F:return this.isAnimating||this.startAnimation(),void requestAnimationFrame(function(){return requestAnimationFrame(function(){return e.stopAnimation()})})}}},{key:"startDrawingLine",value:function(t,e){this.line=new _Line2.default({game:this,x:t,y:e,v:new _Vector2.default(0,0)}),this.lines.push(this.line),this.isDrawing=!0,this.lines.length>this.maxConcurrentLines&&this.lines.splice(0,this.lines.length-this.maxConcurrentLines)}},{key:"updateDrawLine",value:function(t,e){this.line.setEnd(t,e)}},{key:"stopDrawingLine",value:function(){this.isDrawing=!1}},{key:"onMousedown",value:function(t){var e=this.normalizedMouseCoordinates(t),n=e.x,i=e.y;this.startDrawingLine(n,i)}},{key:"onMouseup",value:function(t){this.stopDrawingLine()}},{key:"onMousemove",value:function(t){if(this.isDrawing){var e=this.normalizedMouseCoordinates(t),n=e.x,i=e.y;this.updateDrawLine(n,i)}}},{key:"onTouchstart",value:function(t){t.preventDefault();var e=this.normalizedTouchCoordinates(t),n=e.x,i=e.y;this.startDrawingLine(n,i)}},{key:"onTouchend",value:function(t){t.preventDefault(),this.stopDrawingLine()}},{key:"onTouchmove",value:function(t){if(t.preventDefault(),this.isDrawing){var e=this.normalizedTouchCoordinates(t),n=e.x,i=e.y;this.updateDrawLine(n,i)}}},{key:"normalizedMouseCoordinates",value:function(t){if("canvas"!==!t.target.tagName.toLowerCase()){var e=t.offsetX,n=t.offsetY,i=t.target,a=i.clientWidth,s=i.clientHeight,o=i.width,l=i.height;return{x:Math.floor(e*(o/a)),y:Math.floor(n*(l/s))}}}},{key:"normalizedTouchCoordinates",value:function(t){if("canvas"!==!t.target.tagName.toLowerCase()&&0!==t.touches.length){var e=t.touches[t.touches.length-1],n=e.clientX,i=e.clientY,a=e.target,s=a.offsetLeft,o=a.offsetTop,l=a.clientWidth,r=a.clientHeight,u=a.width,h=a.height,c=n-s,v=i-o;return{x:Math.floor(c*(u/l)),y:Math.floor(v*(h/r))}}}},{key:"clear",value:function(){utils.clearCanvas(this.canvas,this.ctx)}}]),t}();exports.default=Game;
},{"./Ball":1,"./Line":3,"./Vector":4,"./constants":5,"./utils":9}],3:[function(require,module,exports){
"use strict";function _interopRequireWildcard(t){if(t&&t.__esModule)return t;var e={};if(null!=t)for(var i in t)Object.prototype.hasOwnProperty.call(t,i)&&(e[i]=t[i]);return e.default=t,e}function _interopRequireDefault(t){return t&&t.__esModule?t:{default:t}}function _classCallCheck(t,e){if(!(t instanceof e))throw new TypeError("Cannot call a class as a function")}Object.defineProperty(exports,"__esModule",{value:!0});var _createClass=function(){function t(t,e){for(var i=0;i<e.length;i++){var n=e[i];n.enumerable=n.enumerable||!1,n.configurable=!0,"value"in n&&(n.writable=!0),Object.defineProperty(t,n.key,n)}}return function(e,i,n){return i&&t(e.prototype,i),n&&t(e,n),e}}(),_constants=require("./constants"),_constants2=_interopRequireDefault(_constants),_utils=require("./utils"),utils=_interopRequireWildcard(_utils),_Vector=require("./Vector"),_Vector2=_interopRequireDefault(_Vector),_Ball=require("./Ball"),_Ball2=_interopRequireDefault(_Ball),Line=function(){function t(e){var i=e.game,n=e.x,r=e.y,s=e.v,l=e.color,o=e.width;_classCallCheck(this,t),this.game=i,this.canvas=i.canvas,this.ctx=i.ctx,this.x=n,this.y=r,this.v=s,this.width=null==o?8:o,this.color=l||utils.randomColor(_constants2.default.COLOR.BLACK),this.e1=this.createE1(),this.e2=this.createE2()}return _createClass(t,[{key:"createEndpoint",value:function(){return new _Ball2.default({game:this.game,r:Math.floor(this.width/2),v:new _Vector2.default(0,0),isStatic:!0})}},{key:"createE1",value:function(){var t=this.createEndpoint();return this.positionE1(t),t}},{key:"positionE1",value:function(){var t=arguments.length>0&&void 0!==arguments[0]?arguments[0]:this.e1;t.x=this.x,t.y=this.y}},{key:"createE2",value:function(){var t=this.createEndpoint();return this.positionE2(t),t}},{key:"positionE2",value:function(){var t=arguments.length>0&&void 0!==arguments[0]?arguments[0]:this.e2;t.x=this.x+this.v.x,t.y=this.y+this.v.y}},{key:"draw",value:function(){this.ctx.beginPath(),this.ctx.moveTo(this.x,this.y),this.ctx.lineTo(this.x+this.v.x,this.y+this.v.y),this.ctx.lineWidth=this.width,this.ctx.lineCap="round",this.ctx.strokeStyle=this.color,this.ctx.stroke()}},{key:"reverse",value:function(){this.v=this.v.reverse()}},{key:"length",value:function(){return Math.sqrt(this.v.dot(this.v))}},{key:"setStart",value:function(t,e){this.x=t,this.y=e,this.positionE1()}},{key:"setEnd",value:function(t,e){this.v.x=t-this.x,this.v.y=e-this.y,this.positionE2()}},{key:"collidesWithBall",value:function(t){if(this.endpointsCollideWithBall(t))return!0;var e=new _Vector2.default(this.x-t.x,this.y-t.y),i=e.dot(e)-t.r*t.r;if(i<=0)return!0;var n=e.dot(this.v.normalize());if(n>0)return!1;var r=n*n-i;return!(r<0)&&!(-n-Math.sqrt(r)>this.v.magnitude())}},{key:"endpointsCollideWithBall",value:function(t){return this.e1.collidesWithBall(t)||this.e2.collidesWithBall(t)}},{key:"resolveCollisionWithBall",value:function(t){if(this.e1.collidesWithBall(t))return void this.e1.resolveCollisionWithBall(t);if(this.e2.collidesWithBall(t))return void this.e2.resolveCollisionWithBall(t);var e=this.v,i=e.normalize(),n=i.tangent(),r=n.dot(t.v),s=i.dot(t.v),l=-r,o=s,a=n.multiply(l),h=i.multiply(o),u=a.add(h);t.v=u}}]),t}();exports.default=Line;
},{"./Ball":1,"./Vector":4,"./constants":5,"./utils":9}],4:[function(require,module,exports){
"use strict";function _classCallCheck(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}Object.defineProperty(exports,"__esModule",{value:!0});var _createClass=function(){function e(e,t){for(var n=0;n<t.length;n++){var r=t[n];r.enumerable=r.enumerable||!1,r.configurable=!0,"value"in r&&(r.writable=!0),Object.defineProperty(e,r.key,r)}}return function(t,n,r){return n&&e(t.prototype,n),r&&e(t,r),t}}(),Vector=function(){function e(t,n){_classCallCheck(this,e),this.x=t,this.y=n}return _createClass(e,[{key:"magnitude",value:function(){return Math.sqrt(this.x*this.x+this.y*this.y)}},{key:"dot",value:function(e){return this.x*e.x+this.y*e.y}},{key:"normalize",value:function(){var t=this.magnitude();return 0===t?new e(0,0):new e(this.x/t,this.y/t)}},{key:"tangent",value:function(){return new e(-this.y,this.x)}},{key:"reverse",value:function(){return new e(-this.x,-this.y)}},{key:"multiply",value:function(t){return new e(this.x*t,this.y*t)}},{key:"add",value:function(t){return new e(this.x+t.x,this.y+t.y)}}]),e}();exports.default=Vector;
},{}],5:[function(require,module,exports){
"use strict";Object.defineProperty(exports,"__esModule",{value:!0}),exports.default={DIRECTION:{LEFT:"LEFT",UP:"UP",RIGHT:"RIGHT",DOWN:"DOWN"},KEYCODE:{LEFT:37,UP:38,RIGHT:39,DOWN:40,CTRL:17,SPACE:32,ESC:27,D:68,F:70,R:82},COLOR:{WHITE:"#eeeeec",GREEN:"#5E0",BLUE:"#10ADED",CYAN:"#1ADDE2",ORANGE:"#F30",YELLOW:"#FE0",GREENBLUE:"#10CA7E",BLACK:"#2e3436",PINK:"#DE1E7E"}};
},{}],6:[function(require,module,exports){
(function (global){
"use strict";function _interopRequireDefault(e){return e&&e.__esModule?e:{default:e}}require("./polyfills/index");var _Game=require("./Game"),_Game2=_interopRequireDefault(_Game);global.Game=new _Game2.default("canvas");
}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{"./Game":2,"./polyfills/index":7}],7:[function(require,module,exports){
"use strict";require("./object.assign");
},{"./object.assign":8}],8:[function(require,module,exports){
"use strict";"function"!=typeof Object.assign&&(Object.assign=function(n,t){if(null==n)throw new TypeError("Cannot convert undefined or null to object");for(var r=Object(n),e=1;e<arguments.length;e++){var o=arguments[e];if(null!=o)for(var c in o)Object.prototype.hasOwnProperty.call(o,c)&&(r[c]=o[c])}return r});
},{}],9:[function(require,module,exports){
"use strict";function _interopRequireDefault(t){return t&&t.__esModule?t:{default:t}}function keyToDirection(t){switch(t){case Constants.KEYCODES.LEFT:return Constants.DIRECTION.LEFT;case Constants.KEYCODES.UP:return Constants.DIRECTION.UP;case Constants.KEYCODES.RIGHT:return Constants.DIRECTION.RIGHT;case Constants.KEYCODES.DOWN:return Constants.DIRECTION.DOWN;default:return null}}function clearCanvas(t,n){n.clearRect(0,0,t.width,t.height)}function clamp(t,n,e){return t<n?n:t>e?e:t}function randomColor(){var t=arguments.length>0&&void 0!==arguments[0]?arguments[0]:[];return randomElement(Object.keys(_constants2.default.COLOR).map(function(t){return _constants2.default.COLOR[t]}).filter(function(n){return t.indexOf(n)===-1}))}function randomElement(t){return t[Math.floor(Math.random()*t.length)]}function ifNull(t,n){return null!=t?t:"function"==typeof n?n():n}function rad2deg(t){return t*(180/Math.PI)}function deg2rad(t){return t/(180/Math.PI)}function isTouchDevice(){return"ontouchstart"in window||navigator.maxTouchPoints}function round(t,n){return Math.round(t*Math.pow(10,n))/Math.pow(10,n)}Object.defineProperty(exports,"__esModule",{value:!0}),exports.keyToDirection=keyToDirection,exports.clearCanvas=clearCanvas,exports.clamp=clamp,exports.randomColor=randomColor,exports.randomElement=randomElement,exports.ifNull=ifNull,exports.rad2deg=rad2deg,exports.deg2rad=deg2rad,exports.isTouchDevice=isTouchDevice,exports.round=round;var _constants=require("./constants"),_constants2=_interopRequireDefault(_constants);
},{"./constants":5}]},{},[6]);
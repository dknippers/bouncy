import constants from './constants';

export function keyToDirection(key) {
    switch(key) {
        case Constants.KEYCODES.LEFT: return Constants.DIRECTION.LEFT;            
        case Constants.KEYCODES.UP: return Constants.DIRECTION.UP;
        case Constants.KEYCODES.RIGHT: return Constants.DIRECTION.RIGHT;
        case Constants.KEYCODES.DOWN: return Constants.DIRECTION.DOWN;

        default: return null;
    }
}    

export function clearCanvas(canvas, ctx) {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
}

/**
 * Returns the input value clamped between min and max.
 * If value is less than min, will return min. 
 * If value is greater than max, will return max.
 * Otherwise will return value.
 * @param {number} value Value to clamp
 * @param {number} min Minimum value to return
 * @param {number} max Maximum value to return
 */
export function clamp(value, min, max) {
    if(value < min) return min;
    if(value > max) return max;
    return value;
}

/**
 * Generates a random color, optionally excluding 
 * the given hex colors.
 * @param {string[]} exclude Colors to exclude
 */
export function randomColor(exclude = []) {
   const colors = Object.keys(constants.COLOR)
   	.map(k => constants.COLOR[k])
	.filter(c => exclude.indexOf(c) === -1);   

   return randomElement(colors);
}

/**
 * Returns a random element from the given Array
 * @param {[]} array Array to randomly pick an element from
 */
export function randomElement(array) {
	return array[Math.floor(Math.random() * array.length)];
}

/**
 * @callback lambdaYieldingValue
 */

/**
 * Returns value if value is not null. Otherwise, returns the value of ifNull, which can be supplied as a function
 * to be evaluated only when value is indeed null.
 * @param {*} value 
 * @param {*} ifNull 
 * @returns {*} value if value != null, otherwise ifNull
 */
export function ifNull(value, ifNull) {
    if(value != null) return value;
    if(typeof ifNull === 'function') return ifNull();
    return ifNull;
}

export function rad2deg(rad) {    
    return rad * (180 / Math.PI);
}

export function deg2rad(deg) {
    return deg / (180 / Math.PI);
}

export function isTouchDevice() {  
    return 'ontouchstart' in window || navigator.maxTouchPoints;
}

export function round(value, decimals) {
    return Math.round(value * Math.pow(10, decimals)) / Math.pow(10, decimals);
}
export default class Vector {
    constructor(x, y) {
        this.x = x;
        this.y = y;
    }

    magnitude() {
        return Math.sqrt(this.x * this.x + this.y * this.y);
    }

    dot(v2) {
        return this.x * v2.x + this.y * v2.y;
    }

    /**
     * Normalize this Vector, yielding the Unit Vector.
     * If and only if `this` is the Null Vector, yields the Null Vector.
     */
    normalize() {
        const magnitude = this.magnitude();

        if (magnitude === 0) return new Vector(0, 0);

        return new Vector(this.x / magnitude, this.y / magnitude);
    }

    tangent() {
        return new Vector(-this.y, this.x);
    }

    reverse() {
        return new Vector(-this.x, -this.y);
    }

    multiply(n) {
        return new Vector(this.x * n, this.y * n);
    }

    add(v2) {
        return new Vector(this.x + v2.x, this.y + v2.y);
    }
}

export default class Vector {
    constructor(x, y) {
        this.x = x;
        this.y = y;
    }

    magnitude() {
        return Math.sqrt(this.x * this.x + this.y * this.y);
    }

    dotProduct(v2) {
        return this.x * v2.x + this.y * v2.y;
    }

    unitVector() {
        const magnitude = this.magnitude();

        if(magnitude === 0) return new Vector(0, 0);

        return new Vector(this.x / magnitude, this.y / magnitude);
    }

    tangentVector() {
        return new Vector(-this.y, this.x);
    }

    multiply(n) {
        return new Vector(this.x * n, this.y * n);
    }

    add(v2) {
        return new Vector(this.x + v2.x, this.y + v2.y);
    }
}
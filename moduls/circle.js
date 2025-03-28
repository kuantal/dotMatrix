/**
 * The Circle class creates a circle object.
 */
export default class Circle {
    /**
     * Constructor function of the Circle class.
     * @param {number} x - X coordinate of the circle.
     * @param {number} y - Y coordinate of the circle.
     * @param {number} radius - Radius of the circle.
     * @param {string} color - Color of the circle.
     */
    constructor (x, y, radius, color) {
        this.x = x;
        this.y = y;
        this.radius = radius;
        this.fill = color;
    }
}
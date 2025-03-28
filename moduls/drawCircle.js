/**
 * The drawCircles class draws a circle.
 */
export default class drawCircles {
    /**
     * Constructor function of the drawCircles class.
     * @param {Object} opts - Configuration options.
     * @param {Object} opts.o - Drawing context.
     * @param {CanvasRenderingContext2D} opts.o.ctx - Canvas drawing context.
     * @param {number} opts.x - X coordinate of the circle.
     * @param {number} opts.y - Y coordinate of the circle.
     * @param {number} opts.radius - Radius of the circle.
     * @param {string} opts.color - Color of the circle.
     */
    constructor (opts) {
        opts.o.ctx.beginPath();
        opts.o.ctx.fill();
        opts.o.ctx.fillStyle = opts.color;
        opts.o.ctx.arc(opts.x, opts.y, opts.radius / 2, 0, Math.PI * 2, false);
        opts.o.ctx.scale(1, 1);
        opts.o.ctx.fill();
        opts.o.ctx.closePath();
    }
}
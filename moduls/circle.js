/**
 * Create circle object
 * @param opts
 */
class Circle {
    constructor (opts) {
            this.x = opts.x;
            this.y = opts.y;
            this.radius = opts.circleRadius;
            this.fill = opts.colors.active;
    }
}
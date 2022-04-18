/**
 * Draw Circle
 */
export default class drawCircles {
    constructor (opts) {
        var circlesArray = opts.circlesArray;
        for (let i = 0; i < circlesArray.length; i++) {
            let circle = circlesArray[i];

            opts.ctx.beginPath();
            opts.ctx.fill();
            opts.ctx.fillStyle = opts.colors.active ;
            opts.ctx.arc(circle.x, circle.y, circle.size, 0, Math.PI * 2, false);
            opts.ctx.scale(1, 1)
            opts.ctx.fill();
            opts.ctx.closePath();
        }
    }
}
/**
 * Draw Circle
 */
export default class drawCircles {
    constructor (opts) {
   
        opts.o.ctx.beginPath();
        opts.o.ctx.fill();
        opts.o.ctx.fillStyle = opts.color;
        opts.o.ctx.arc(opts.x, opts.y, opts.radius/2, 0, Math.PI * 2, false);
        opts.o.ctx.scale(1, 1)
        opts.o.ctx.fill();
        opts.o.ctx.closePath();
       
    }
} 
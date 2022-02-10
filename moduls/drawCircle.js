/**
 * Draw Circle
 */
class drawCircles {
    constructor (opts, circlesArray) {
        for (let i = 0; i < circlesArray.length; i++) {
            let rnd = Math.floor((Math.random() * 10) % 2);
            let circle = circlesArray[i];
            opts.ctx.beginPath();
            opts.ctx.fill();
            opts.ctx.arc(circle.x, circle.y, circle.radius, 0, Math.PI * 2, false);
            opts.ctx.fillStyle = rnd % 2 ? opts.color.active : opts.color.passive;
            opts.ctx.scale(1, 1)
            opts.ctx.fill();
            opts.ctx.closePath();
        }
    }
}
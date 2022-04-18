import drawCircle from './drawCircle.js';
/**
 * Draw Circle
 */
export default class drawLetter{
    constructor (opts) {

        var circleSize = opts.size / Math.max(opts.letterDots.x, opts.letterDots.y);
        console.log(circleSize);

        opts.circlesArray.forEach(function(letter, index){

            console.log(letter);

            //
                // var x = opts.x + i * circleSize;
                // var y = opts.y + j * circleSize;
                // var color = opts.color;
                // var radius = circleSize / 2;
                // opts.circlesArray.push( new drawCircle({
                //     x: x,
                //     y: y,
                //     radius: radius,
                //     color: color
                // }));


        });

    }
}
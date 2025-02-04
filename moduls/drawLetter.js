import drawCircle from './drawCircle.js';

/**
 * Draw Circle
 */
export default class drawLetter {
    constructor(opts) {
        var circleSize = opts.size / Math.max(opts.letterDots.x, opts.letterDots.y);
        opts.circlesArray.forEach(function (letter, i) {

            var x = letter.x  ;
            var y = letter.y + circleSize; // letter.y + i * circleSize
            var active = opts.colors.active;
            var passive = opts.colors.passive;

            letter.letterMap && letter.letterMap.forEach(function (row, ii) {
                row.split('').forEach(function (column, j) {
                     new drawCircle({
                            o: opts,
                            x: x + j * circleSize,
                            y: y + ii * circleSize,
                            radius: circleSize - 1.5,
                            color: column === '.' ? active : passive
                        });

                });
            });
        });
    }
}
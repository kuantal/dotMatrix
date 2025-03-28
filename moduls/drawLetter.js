import drawCircle from './drawCircle.js';

/**
 * The drawLetter class draws a letter on a dot matrix screen using circles.
 */
export default class drawLetter {
    /**
     * Constructor function of the drawLetter class.
     * @param {Object} opts - Configuration options.
     * @param {number} opts.size - Size of the letter.
     * @param {Object} opts.letterDots - Dimensions of the letter in the dot matrix.
     * @param {Array} opts.circlesArray - Array containing information about the circles to be drawn.
     * @param {Object} opts.colors - Color information of the circles.
     * @param {string} opts.colors.active - Color of the active circle.
     * @param {string} opts.colors.passive - Color of the passive circle.
     */
    constructor(opts) {
        var circleSize = opts.size / Math.max(opts.letterDots.x, opts.letterDots.y);
        opts.circlesArray.forEach(function (letter, i) {

            var x = letter.x;
            var y = letter.y + circleSize; // letter.y + i * circleSize
            var active = opts.colors.active;
            var passive = opts.colors.passive;

            // Draws the dot matrix of the letter
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
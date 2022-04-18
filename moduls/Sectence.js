
import drawLetter from './drawLetter.js';
import charset from './charset.js';

/**
 * Sectense Class
 */
export default class Sectence {
    constructor (options) {
        this.options = options;
        this.x = options.x || 1;
        this.y = options.y || 10;
        this.size = options.size;
        this.color = options.config.colors;
        this.char = options.message.split('');
        this.write();
    }

    write () {
        for (let i = 0; i < this.char.length; i++) {
            this.options.circlesArray.push({
                char: this.char[i],
                x: this.x + i * this.size,
                y: this.y,
                size: this.size,
                color: this.color,
                letterMap: charset[this.char[i]]
            });
        }
        new drawLetter(this.options);
    }
}

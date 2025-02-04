import drawLetter from './drawLetter.js';
import charset from './charset.js';

/**
 * Sectense Class
 */
export default class Sectence {
    constructor(options) {
        this.options = options;
        this.x = options.x || 1;
        this.y = options.y || 10;
        this.size = options.size;
        this.index =  options.config.index ;
        this.color = options.config.colors;
        this.charLines = this.splitMessage(options.message, options.lineLetterCount);
        this.write();
    }

    splitMessage(message, lineLetterCount) {
        if(Object.prototype.toString.call(message) === '[object Array]') {
            console.log(this.index);
            message = message[this.index];
        }

        if (this.options.crlf) {
            return message.split('\n');
        } else {
            const chunks = [];
            for (let i = 0; i < message.length; i += lineLetterCount) {
                chunks.push(message.substring(i, i + lineLetterCount));
            }
            return chunks;
        }
    }

    write() {

        console.log(this.options.message);
        let rt = 0;

        for (let ch = 0; ch < this.charLines.length; ch++) {
            this.x = 0; // Reset x value for each main loop
            const line = this.charLines[ch].trim().split('');

            for (let i = 0; i < line.length; i++) {
                const crlf = this.options.crlf && line[i] === '\n';
                if (crlf) rt++;

                const xpos = crlf ? 10 : ((this.x + i) / 1.5) * this.size;

                this.options.circlesArray.push({
                    char: line[i],
                    x: xpos,
                    y: (this.size + 10) * (ch + rt),
                    size: this.size,
                    color: this.color,
                    letterMap: charset[line[i]]
                });
            }
        }

        new drawLetter(this.options);
    }
}
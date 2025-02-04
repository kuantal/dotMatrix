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
        this.color = options.config.colors;
        this.charLines = this.splitMessage(options.message, options.lineLetterCount);
        this.write();
    }

    splitMessage(message, lineLetterCount) {
        const chunks = [];
        for (let i = 0; i < message.length; i += lineLetterCount) {
            chunks.push(message.substring(i, i + lineLetterCount));
        }
        return chunks;
    }

    write() {
        let rt = 0;
        var line='';
        xpos = 0;

        for (let ch = 0; ch < this.charLines.length; ch++) {

             line = this.charLines[ch].trim().split('');


            for (var i = 0; i <  this.options.lineLetterCount; i++) {
                const crlf = this.options.crlf && line[i] === '\n';

                if (crlf)
                    rt++;

                var xpos =  (((crlf ? 10 :this.x) + i) / 1.5) * this.size;

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
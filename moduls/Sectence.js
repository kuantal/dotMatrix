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
        this.char = options.message;
        this.write();
    }

    write() {
        console.log(this.char.length);

        this.char.forEach((char, ch) => {
           var newLine = true;
            var line = this.char[ch].trim().split('');

            for (let i = 0; i < line.length; i++) {

                console.log(newLine , ch);
                this.options.circlesArray.push({
                    char: line[i],
                    x: newLine ? this.x = 10 : (this.x + i / 1.5 * this.size) ,
                    y: (this.options.lineLetterCount/2) * ch,
                    size: this.size,
                    color: this.color,
                    letterMap: charset[line[i]]
                });
                newLine = false;

              //  console.log(this.options.circlesArray[i]);
            }

        })

        new drawLetter(this.options);
        console.log(this.options);
    }
}

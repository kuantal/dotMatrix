import drawLetter from './drawLetter.js';
import charset from './charset.js';
import drawCircles from "./drawCircle.js";

/**
 * The Sectence class is used to display messages on a dot matrix screen.
 */
export default class Sectence {
    /**
     * Constructor function of the Sectence class.
     * @param {Object} options - Configuration options.
     */
    constructor(options) {
        this.options = options;
        this.x = options.x || 1;
        this.y = options.y || 10;
        this.size = options.size;
        this.index = options.config.index || 0;
        this.fill = options.config.fill;
        this.color = options.config.colors;
        this.charLines = this.splitMessage(options.message, options.lineLetterCount);
        this.clearCanvas();
        this.write();
    }

    /**
     * Splits the message into lines of a specified length.
     * @param {string|string[]} message - The message to be displayed.
     * @param {number} lineLetterCount - Number of letters per line.
     * @returns {string[]} - Split message lines.
     */
    splitMessage(message, lineLetterCount) {
        if (Array.isArray(message)) {
            message = message[this.options.index];
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

    /**
     * Clears the canvas and fills the background.
     */
    clearCanvas() {
        const { ctx, canvas, colors } = this.options;

        this.options.circlesArray = [];
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.fillStyle = colors.canvasBg;
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        // Fill the canvas with dots
        if (this.options.fill) {
            for (let x = 0; x < canvas.width; x += this.size / 7) {
                for (let y = 0; y < canvas.height; y += this.size / 7) {
                    new drawCircles({
                        o: this.options,
                        x: x,
                        y: y,
                        radius: this.size / 7,
                        color: colors.bg
                    });
                }
            }
        }
    }

    /**
     * Writes the message to the canvas.
     */
    write() {
        let rt = 0;
        this.charLines = this.splitMessage(this.options.message, this.options.lineLetterCount);
        for (let ch = 0; ch < this.charLines.length; ch++) {
            this.x = 0;
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
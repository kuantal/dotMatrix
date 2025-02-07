'use strict';
import Sectence from './Sectence.js';

class dotMatrix {
    constructor(config) {
        const defaults = {
            fps: 1,
            message: 'Hello World',
            padding: 20,
            circlesArray: [],
            colors: {
                active: '#ffcc03',
                passive: '#383838',
                bg: '#333333',
                canvasBg: "#000000"
            },
            letterDots: {
                x: 5,
                y: 8
            },
            crlf: false,
            index: 0,
            lineLetterCount: window.innerWidth / 26.6,
            fill: false
        };

        this.options = { ...defaults, ...config };
        this.options.config = this.options;
        this.options.ctx = this.options.canvas.getContext('2d');
        this.options.size = this.options.canvas.width / 7;

        this.init();
    }

    setupCanvas() {
        const { canvas, padding, colors, ctx } = this.options;
        canvas.width = window.innerWidth - padding;
        canvas.height = window.innerHeight - padding;
        ctx.fillStyle = colors.canvasBg;
        ctx.fillRect(0, 0, canvas.width - padding, canvas.height - padding);
        ctx.fill();

        this.options.circlesArray = [];



    }

    draw() {
        if (!this.s) {
            this.s = new Sectence(this.options);
        }
        this.s.clearCanvas();
        this.s.write();
    }

    animate() {
        this.draw();

        if (Array.isArray(this.options.message) && this.options.message.length > 1) {
            setTimeout(() => {
                requestAnimationFrame(this.animate.bind(this));
                this.s.options.index = (this.s.options.index + 1) % this.s.options.message.length;
            }, 1000 / this.options.fps);
        }
    }

    init() {
        this.setupCanvas();
        this.animate();
    }
}

export default dotMatrix;
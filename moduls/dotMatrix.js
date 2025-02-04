'use strict';
import Sectence from './Sectence.js';


class dotMatrix {
    constructor (config) {
        // Default Optionst
        this.options = {};
        const defaults = {
            fps: 1,
            padding:20,
            circlesArray: [],
            colors:{
                active: '#ffcc03',
                passive: '#383838',
                canvasBg:  "#000000"
            },
            letterDots: {
                x: 5,
                y: 8
            },
            crlf :false,
            lineLetterCount :  window.innerWidth / 26.6,
            fill: false //TODO::: LİNE FİLL WİTH EMPTY CHAR
        };

        // Merge  Options with defaults
        const populated = Object.assign(defaults, config);
        for (const key in populated) {
            if (populated.hasOwnProperty(key)) {
                this["options"][key] = populated[key];
            }
        }
        this.options.config = populated;
        this.options.ctx = this.options.canvas.getContext('2d');
        this.options.size = this.options.canvas.width /7;

        this.init();
    }
    // Setup Canvas
    setupCanvas (){
        let canvas =  this.options.canvas;
        canvas.width = window.innerWidth - this.options.padding;
        canvas.height = window.innerHeight - this.options.padding;
        this.options.ctx.fillStyle = this.options.colors.canvasBg;
        this.options.ctx.fillRect(0, 0, canvas.width - this.options.padding, canvas.height-this.options.padding);
        this.options.ctx.fill();
    }

    // Draw Canvas
    draw(){
       //  (char,posX,posY,size,color)
        console.log('4:56 PM');
        
        new Sectence(this.options);
    }

    // perform some animation task here
    animate(){
        this.draw();
        // setTimeout(() => {
        //     requestAnimationFrame(this.animate.bind(this));
        //
        // }, 1000 / this.fps);

    }


    // Init Dot Matrix
    init () {
        this.setupCanvas();
        this.animate();
    }


}
export default dotMatrix;

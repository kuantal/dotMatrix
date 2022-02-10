'use strict';
import Sectence from './sectence.js';


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
                canvasBg: '#000000'
            },
            letterDots: {
                x: 5,
                y: 7
            },
            lineLetterCount : 50
        };

        // Merge  Options with defaults
        const populated = Object.assign(defaults, config);
        for (const key in populated) {
            if (populated.hasOwnProperty(key)) {
                console.log(this);
                this["options"][key] = populated[key];
            }
        }

        console.log(this);

        this.ctx = this.options.canvas.getContext('2d');
        this.options.circleRadius = this.options.canvas.width / 20;

        this.init();
    }
    // Setup Canvas
    setupCanvas (){
        let canvas =  this.options.canvas;
        canvas.width = window.innerWidth - this.options.padding;
        canvas.height = window.innerHeight - this.options.padding;
        this.ctx.fillStyle = this.options.colors.canvasBg;
        this.ctx.fillRect(0, 0, canvas.width - this.options.padding, canvas.height-this.options.padding);
        this.ctx.fill();
        this.ctx.save(); // save state
    }

    // Draw Canvas
    draw(){
       // console.log( new Circle(10, 10, 10, this.colors.active));
        new Sectence(this.options.message);
    }

    // perform some animation task here
    animate(){
        this.draw();
        setTimeout(() => {
            requestAnimationFrame(this.animate.bind(this));

        }, 1000 / this.fps);

    }


    // Init Dot Matrix
    init () {
        this.setupCanvas();
        this.animate();
    }


}
export default dotMatrix;

'use strict';

class dotMatrix {
    constructor (config) {
        const defaults = {
            fps: 1,
            circlesArray: [],
            colors:{
                active: '#ffcc03',
                passive: '#383838',
                canvasBg: '#000000'
            },
            letterDots: {
                x: 5,
                y: 7
            }
        };

        const populated = Object.assign(defaults, config);
        for (const key in populated) {
            if (populated.hasOwnProperty(key)) {
                this[key] = populated[key];
            }
        }

        this.ctx = this.canvas.getContext('2d');
        this.circleRadius = this.canvas.width / 20;

        this.init();
    }

    setupCanvas (){
        let canvas =  this.canvas;
        canvas.width = window.innerWidth - 10;
        canvas.height = window.innerHeight - 10;
        this.ctx.fillStyle = this.colors.canvasBg;
        this.ctx.fillRect(0, 0, canvas.width, canvas.height);
        this.ctx.fill();
        this.ctx.save(); // save state
    }

    // Init Ma
    init () {
        this.setupCanvas();
        console.log(this);
    }

    // perform some animation task here
    animate () {
        draw();
        setTimeout(() => {
            requestAnimationFrame(animate);
        }, 1000 / fps);
    }

}
export default dotMatrix;

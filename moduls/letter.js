//import drawCircles from './drawCircles.js';
export default class  Sectence {
    constructor (char,posX,posY,size,color) {
            this.x = posX;
            this.y = posY;
            this.char = char.split("");
            this.write ();
    }

    write (){

        console.log(this.char);

    }

}
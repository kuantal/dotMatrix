import create from './moduls/create.js';

var opts ={
    el  : document.getElementById("dotMatrix"),
    x : 50,
    y:50,
    size:10,
    color: '#dddddd',
    border:true,
    position: "absolute",
    borderRadius : true,
    margin: 10,
    message : "Hello World",
    speed : 10
};


!function dotMAtrix(opts) {
    create(opts);
}(opts);





    
    
import dotMatrix from './moduls/dotMatrix.js';


var letterCount = 70;
var str = `Tatile gitmek, gezmek, dinlenmek ve yeni yerler keşfetmek her zaman için yapılması en keyifli aktiviteler arasında yer alıyor. Tatile gitmek denilince ise akla, yaşadığınız yerden daha farklı bir lokasyona gitmek, tatil ve bütçe planları yapmak gibi süreçler geliyor. Her ne kadar bu süreçler oldukça keyifli olsa da her zaman ayrıntılı tatil planları ve uzaklara giderek tatil yapmak için zamanımız ve enerjimiz olmuyor. 

2024 yılında ise tatil yapmaya ve planlamaya vakti olmayan, çalışan veya okuyanların yoğun zamanlarında pratik ve keyifli bir şekilde bu tatili yapmalarını sağlayacak bir tatil türü popülerleşti. StayCation denilen bu tatil trendi insanlara yorulmadan tatil yapma sürecine girebilme ve yaşadıkları şehri daha yakından tanıyabilme fırsatı veriyor. 

Siz de son zamanlarda böyle bir tatil yapma ihtiyacı duyuyor ve bu tatil trendi merak ediyorsanız işte StayCation tatilinin ayrıntıları:`;
var chunks = [];

for (var i = 0, charsLength = str.length; i < charsLength; i += letterCount) {
    chunks.push(str.substring(i, i + letterCount));
}


var opts ={
    canvas  : document.getElementById("dotMatrix"),
    message :chunks,
    fps : 20,
    colors:{
        active: '#ffcc03',
        passive: '#383838',
        canvasBg:  "#000000"
    },
    letterDots: {
        x: 5,
        y: 8
    },
    lineLetterCount : letterCount
};



var matrix = new dotMatrix(opts);







    
    
import dotMatrix from './moduls/dotMatrix.js';

var str = `Tatile gitmek, gezmek, dinlenmek ve yeni yerler keşfetmek her zaman için yapılması en keyifli aktiviteler arasında yer alıyor. Tatile gitmek denilince ise akla, yaşadığınız yerden daha farklı bir lokasyona gitmek, tatil ve bütçe planları yapmak gibi süreçler geliyor. Her ne kadar bu süreçler oldukça keyifli olsa da her zaman ayrıntılı tatil planları ve uzaklara giderek tatil yapmak için zamanımız ve enerjimiz olmuyor. 2024 yılında ise tatil yapmaya ve planlamaya vakti olmayan, çalışan veya okuyanların yoğun zamanlarında pratik ve keyifli bir şekilde bu tatili yapmalarını sağlayacak bir tatil türü popülerleşti. StayCation denilen bu tatil trendi insanlara yorulmadan tatil yapma sürecine girebilme ve yaşadıkları şehri daha yakından tanıyabilme fırsatı veriyor. Siz de son zamanlarda böyle bir tatil yapma ihtiyacı duyuyor ve bu tatil trendi merak ediyorsanız işte StayCation tatilinin ayrıntıları:`;

var str2 = 'StayCation ÜüŞşİiÖö   Nedir?';
var str3 = 'Lorewm İpsum';
// Crete random 10 letter string with 1000 characters
 var str4 = Array.from({length: 1000}, () => String.fromCharCode(Math.floor(Math.random() * 26) + 97)).join('');



var opts ={
    canvas  : document.getElementById("dotMatrix"),
    message :[str,str2,str3],
    fps : .5,
    colors:{
        active: '#ffcc03',
        passive: '#292929',
        bg: '#161616',
        canvasBg:  "#121212"
    },

    crlf :false,
    index: 0,
    lineLetterCount : 60, //40
    fill: true
};



var matrix = new dotMatrix(opts);
window.matrix = matrix;







    
    
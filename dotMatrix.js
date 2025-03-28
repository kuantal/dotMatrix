import dotMatrix from './moduls/dotMatrix.js';

// Long text content
var str = `Lorem ipsum dolor sit amet, consectetur adipiscing elit.
Sunt velit, iure qui suscipit blandit quis cupiditat labore imperdiet
eros vel laoreet vel sanctus veniam nibh augue laborum ea luptatum
 consectetur fugiat exerci cum veniam. Luptatum incidunt invidunt,
 aute ipsum ea non ut nisl voluptate nihil in erat amet gubergren
  velit zzril eiusmod enim. Justo wisi invidunt. Dolor minim facer.
  Tincidunt nostrud commodo tempor nisi dignissim possim consectetuer
  augue delenit. At stet nobis aliquyam pariatur deserunt eiusmod
  officia nonummy. Tincidunt te feugait.`;

// Short title
var str2 = 'Special Chars ÜüŞşİiÖö ?';

// Short text
var str3 = 'Cupiditat volutpat ex suscipit.';

// Create an array of 1000 characters long with 10 letters randomly
var str4 = Array.from({length: 1000}, () => String.fromCharCode(Math.floor(Math.random() * 26) + 97)).join('');

// Options for DotMatrix screen
var opts = {
    canvas  : document.getElementById("dotMatrix"), // Canvas element for DotMatrix screen
    message : [str, str2, str3], // Messages to be displayed
    fps : .5, // Frames per second
    colors: {
        active: '#ffcc03', // Active pixel color const colors = ['#ffcc03', '#ff9900', '#ff6600', '#ccff00', '#ff3300'];
        passive: '#292929', // Passive pixel color +
        bg: '#161616', // Background color
        canvasBg:  "#121212" // Canvas background color
    },
    crlf : false, // Use of carriage return line feed
    index: 0, // Starting index
    lineLetterCount : 60, // Number of letters per line
    fill: true // Use fill
};

// Create DotMatrix object
var matrix = new dotMatrix(opts);
window.matrix = matrix;
var bg = document.querySelector('.home');
var text = document.querySelector('.shadow');
var zohologo = document.querySelector('.zohologo');
function change(){
    bg.style.backgroundImage="url('https://github.com/kabirajk/portfolio/blob/main/ZohoTower-min.jpg?raw=true')";
    zohologo.style.visibility='visible';
    text.style.color='white';
}
function out(){
    bg.style.backgroundImage="linear-gradient(90deg,rgb(56, 137, 137),rgb(246,170,255))";
    zohologo.style.visibility='hidden';
    text.style.color='black';
}
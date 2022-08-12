var bg = document.querySelector('.home');
var text = document.querySelector('.shadow');
var zohologo = document.querySelector('.zohologo');
function change(){
    bg.style.backgroundImage="url('https://github.com/kabirajk/portfolio/blob/main/ZohoTower-min.jpg?raw=true')";
    bg.style.MozAnimationName='none';
    bg.style.MozAnimationPlayState="paused";
    zohologo.style.visibility='visible';
    text.style.color='white';
}
function out(){
    bg.style.backgroundImage="linear-gradient(var(--angle),rgb(56, 137, 137),rgb(246,170,255))";
    zohologo.style.visibility='hidden';
    bg.style.MozAnimationName='homepageall';
    bg.style.MozAnimationPlayState="running";
    text.style.color='black';
}
function rotate(){
    i=0
    while(true){
            if(i==360){i=0}
            bg.style.backgroundImage=`linear-gradient(var(--{}deg),rgb(56, 137, 137),rgb(246,170,255))`;
            i+=1;
    }
}
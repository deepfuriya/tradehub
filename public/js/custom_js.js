$(document).ready( function() {
    var pathName = window.location.pathname;
    if(pathName == "/"){
        document.body.style.backgroundImage = "url('/images/bg_img.jpeg')";
    }
});

$("#tradeButton-nav").click(function(){
    window.location.href = "newTrade";
});

// const loader = document.querySelector('.loading-div');

// window.addEventListener('load',function(){
//     loader.classList.add('fade-out-animation');
// })


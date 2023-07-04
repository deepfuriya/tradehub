$(document).ready(function(){

    var pathName = window.location.pathname;
    if(pathName == "/"){
        $(".home").addClass('font-weight-bold');
        $("footer").addClass('fixed-bottom');
    }else if(pathName == "/trades"){
        $(".trades").addClass('font-weight-bold');
    }else if(pathName == '/trades/new'){
        $(".newTrade").addClass('font-weight-bold');
    }
});
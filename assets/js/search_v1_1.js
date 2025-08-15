doSearch= function() {
    const val= $("#search-bar").val().trim().replace(/ /g, "-");
    const val2= $("#search-bar-m").val().trim().replace(/ /g, "-");
    if (val!= "") {
        // alert(val);
        window.location= "/search.html?q="+ val;
    } else if (val2!= "") {
        // alert(val);
        window.location= "/search.html?q="+ val2;
    }
}

$("#search-bar").on('keyup', function (e) {
    if (e.key === 'Enter' || e.keyCode === 13) {        
        doSearch();
    }
});

$("#search-bar-m").on('keyup', function (e) {
    if (e.key === 'Enter' || e.keyCode === 13) {        
        doSearch();
    }
});

$( "#search-button" ).on( "click", function() {  
    doSearch();
});

$( "#search-button-m" ).on( "click", function() {  
    doSearch();
});

$( document ).ready(function() {
    $("#search-bar").focus();
});

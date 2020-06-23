const PAGE_SIZE = 1;
let isCollpase =  false;
let currentPage = 1;
let listWords = []


$(document).ready(function () {
    aha.showListSavedWords()

    $(".list-words__collpase-all").click(function (e) {
        console.log("isCollpase: ", !isCollpase)
        $('.collapse').collapse(isCollpase ? 'hide' : 'show')
        isCollpase = !isCollpase
    });


});

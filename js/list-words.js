const PAGE_SIZE = 10;
const PAGE_NUMBER_DISPLAY = 10;
const PREV_PAGE = -1;
const NEXT_PAGE = -2;

let isCollpase =  false;
let currentPage = 1;
let listWords = [];
let listWordsChecked = []



$(document).ready(function () {
    aha.showListSavedWords()

    $(".list-words__collpase-all").click(function (e) {
        console.log("isCollpase: ", !isCollpase)
        $('.collapse').collapse(isCollpase ? 'hide' : 'show')
        
        // $('#list-words__collpase-all').bootstrapToggle(isCollpase ? 'off' : 'on')
    

        isCollpase = !isCollpase
    });

    $(".list-words__delete-all").click(function (e) {
        aha.deleteMultipleWord()
    });


});
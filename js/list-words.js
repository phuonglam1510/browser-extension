const PAGE_SIZE = 2;
const PAGE_NUMBER_DISPLAY = 10;
const PREV_PAGE = -1;
const NEXT_PAGE = -2;

let isCollpase =  false;
let currentPage = 1;
let listWords = []
let listWordsDisplay = null


$(document).ready(function () {
    aha.showListSavedWords()

    $(".list-words__collpase-all").click(function (e) {
        console.log("isCollpase: ", !isCollpase)
        $('.collapse').collapse(isCollpase ? 'hide' : 'show')

        // $('#list-words__collpase-all').bootstrapToggle(isCollpase ? 'off' : 'on')


        isCollpase = !isCollpase
    });

    $(".list-words__search-btn").click(function (e) {
            const keyword = $("#keyword-search").val();
            if (keyword) {
                const regExp = new RegExp(`${keyword}`, "i") 
                listWordsDisplay = listWords.filter(item => !!item.word.match(regExp))
                aha.onPaginationListWord(1, listWordsDisplay)
            } else if (listWordsDisplay!== null) {
                listWordsDisplay = null
                aha.onPaginationListWord(1)
            }
    });


});

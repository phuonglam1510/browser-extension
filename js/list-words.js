const PAGE_SIZE = 5;
const PAGE_NUMBER_DISPLAY = 10;
const PREV_PAGE = -1;
const NEXT_PAGE = -2;

let currentPage = 1;
let listWords = []
let listWordsDisplay = null
let listWordsChecked = []


$(document).ready(function () {
    aha.showListSavedWords()
    $(".list-words__search-btn").click(function (e) {
            let keyword = $("#keyword-search").val();
            keyword = keyword.trim()
            if (keyword) {
                const regExp = new RegExp(`${keyword}`, "i") 
                listWordsDisplay = listWords.filter(item => !!item.word.match(regExp))
                aha.onPaginationListWord(1, listWordsDisplay)
            } else if (listWordsDisplay!== null) {
                listWordsDisplay = null
                aha.onPaginationListWord(1)
            }
    });
    
    $(".list-words__delete-all").click(function (e) {
        aha.deleteMultipleWord()
    });
});

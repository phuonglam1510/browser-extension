const PAGE_SIZE = 9;
const PAGE_NUMBER_DISPLAY = 10;
const PREV_PAGE = -1;
const NEXT_PAGE = -2;

let currentPage = 1;
let listWords = []
let listWordsDisplay = null
let listWordsChecked = []
let currentEditedWord = null // Object: {word, id, ...}


$(document).ready(function () {
    let current_url = window.location;
    $('.dropdown-menu a').filter(function () {
        return this.href == current_url;
    }).last().addClass('active');

    aha.showListSavedWords()
    $("#keyword-search").keyup(function (e) {
        let keyword = $("#keyword-search").val();
        keyword = keyword.trim()
        if (keyword) {
            const regExp = new RegExp(`${keyword}`, "i")
            listWordsDisplay = listWords.filter(item => !!item.word.match(regExp))
            aha.onPaginationListWord(1, listWordsDisplay)
        } else if (listWordsDisplay !== null) {
            listWordsDisplay = null
            aha.onPaginationListWord(1)
        }
    });

    $(".m-delete").click(function(e){
        aha.deleteMultipleWord()
        $('.checkbox-check-all').prop('checked', false)
    });

    $(".list-words__delete-all").click(function () {
        aha.openModalDeleteAskAgain()
        
    });

    $(".handle-save-word").click(async function (e) {
        checkWordInModal()
        let newWord = $("#modal-edit-word__input-word").val().trim()
        let definition = $("#modal-edit-word-definition").val().trim()
        definition = aha.formatDefinitionIntoRawString(definition)

        await aha.updateWord(currentEditedWord.word, newWord, definition)
        // close modal
        $(".handle-close-modal-edit").click()
    });

    $(".checkbox-check-all").click(function (e) {
        if (e.currentTarget.checked) {
            aha.checkAllWords();
            aha.onPaginationListWord(currentPage); // re-render
        }
        else {
            aha.unCheckAllWords();
            aha.onPaginationListWord(currentPage); // re-render
        }
    });

    // $(".list-words__un-check-all__content").click(function (e) {
    //     aha.unCheckAllWords();
    //     aha.onPaginationListWord(currentPage); // re-render
    // })

    $(".btn-logout").click(aha.onClickLogout)
    $(".modal-edit-word__word").click(function (e) {
        e.stopPropagation()
        $(".word-wrap").hide()
        $("#modal-edit-word__input-word").show()
        $("#modal-edit-word__input-word").focus()
    })
    
    // reset UI modal edit word: word in input word
    $(".handle-close-modal-edit").click(function () {
        $(".word-wrap").show()
        $("#modal-edit-word__input-word").hide()
    })

    $(".close").click(function (e) {
        $(".word-wrap").show()
        $("#modal-edit-word__input-word").hide()
    })

    $(".modal-content").click(async function (e) {
        const originalWord = $(".modal-edit-word__word").text();
        checkWordInModal()
        const newWord = $("#modal-edit-word__input-word").val()
        $(".modal-edit-word__word").text(newWord)
        

        //update definitions
        if ($("#modal-edit-word__input-word").is(":visible") && originalWord != newWord) {
            $(".list-definition").html('<div class="loader"></div>')
            await aha.showListSuggestDefinition(newWord)
        }
        $(".word-wrap").show()
        $("#modal-edit-word__input-word").hide()
    })
});

function validateWord(word) {
    if (!word) {
        return "Word cannot be empty"
    }
    if (!isOnlyString(word)) {
        return "Word should be string only"
    }
}

function isOnlyString(word) {
    const regExp = /^[a-z ]+$/i
    return regExp.test(word)
}

function clearMessageModalEdit() {
    $(".modal-edit-word-msg").removeClass("alert alert-danger")
    $(".modal-edit-word-msg").text("")
}

function checkWordInModal() {
    let newWord = $("#modal-edit-word__input-word").val().trim()
    let message = validateWord(newWord)
    clearMessageModalEdit()

    if (message) {
        $(".modal-edit-word-msg").addClass("alert alert-danger")
        $(".modal-edit-word-msg").text(message)
        $("#modal-edit-word__input-word").focus()

        return
    }

}

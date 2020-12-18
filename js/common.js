let aha = {};
let isAddOrEditWord;
var termObj;

(function ($) {
    const baseUrl = "https://appword.kie.io";
    function buildUrl(path, paramsObj) {
        let recursiveEncodedParams = "";
        if (paramsObj) {
            recursiveEncodedParams += $.param(paramsObj);
        }
        return baseUrl + path + (recursiveEncodedParams ? "?" + recursiveEncodedParams : "");
    };

    const baseUrlSecond = "https://wordsmine-py-svc.kie.io"
    function createURL(path, paramsObj) {
        let recursiveEncodedParams = "";
        if (paramsObj) {
            recursiveEncodedParams += $.param(paramsObj);
        }
        return baseUrlSecond + path + (recursiveEncodedParams ? "?" + recursiveEncodedParams : "");
    }

    const baseUrlThird = "http://tratu.soha.vn/dict/en_vn/"
    function createTraTuURL(path, paramsObj) {
        let recursiveEncodedParams = "";
        if (paramsObj) {
            recursiveEncodedParams += $.param(paramsObj);
        }
        return baseUrlThird + path + (recursiveEncodedParams ? "?" + recursiveEncodedParams : "");
    }

    aha.util = {
        firstLine: firstLine,
        getClipboardText: getClipboardText,
        listSelectedTexts: listSelectedTexts,
        listActiveTabs: listActiveTabs,
        splitWords: splitWords,
        distinctWords: distinctWords,
        // sortWords: sortWords,
        formatWord: formatWord
    };
    aha.baseUrl = baseUrl;
    aha.buildUrl = buildUrl;
    aha.createURL = createURL;
    aha.apiGetUserProfile = apiGetUserProfile;
    aha.apiRegister = apiRegister;
    aha.apiLogin = apiLogin;
    aha.apiLogout = apiLogout;
    aha.onClickLogout = onClickLogout;
    aha.apiSaveWord = apiSaveWord;
    aha.apiDeleteWord = apiDeleteWord;
    aha.apiListSavedWords = apiListSavedWords;
    aha.apiListSuggestDefintion = apiListSuggestDefintion;
    aha.apiListSuggestDefintionVietnamese = apiListSuggestDefintionVietnamese;
    aha.apiShowPronunciation = apiShowPronunciation
    aha.apiShowPronunciationSpelling = apiShowPronunciationSpelling
    aha.apiUpdateWord = apiUpdateWord;
    aha.formatDayMonthYear = formatDayMonthYear;
    aha.addNewWord = addNewWord

    aha.checkLogin = checkLogin;
    aha.showListSavedWords = showListSavedWords;
    aha.showListSuggestDefinition = showListSuggestDefinition;
    aha.showPronunciation = showPronunciation
    aha.deleteWord = deleteWord;
    aha.deleteMultipleWord = deleteMultipleWord;
    aha.updateWord = updateWord
    aha.checkAllWords = checkAllWords
    aha.unCheckAllWords = unCheckAllWords
    aha.onPaginationListWord = onPagination
    aha.formatDefinitionIntoRawString = formatDefinitionIntoRawString
    aha.openModalDeleteAskAgain = openModalDeleteAskAgain
    aha.updateTotalWord = updateTotalWord
    aha.openModal = openModal

    // $("#editWordModal").on('shown.bs.modal', function(){
    //     debugger;
    //     var inputCnt = $("#modal-edit-word__input-word").val().trim();
    //     return inputCnt === "" ? isAddOrEditWord = true : isAddOrEditWord = false;
    // });

    function firstLine(str) {
        var breakIndex = str.indexOf("\n");

        // consider that there can be line without a break
        if (breakIndex === -1) {
            return str;
        }

        return str.substr(0, breakIndex);
    }

    function apiGetUserProfile() {
        return $.when($.ajax(buildUrl("/api/user/profile")));
    }

    function apiRegister(params) {
        return $.when($.ajax({
            url: buildUrl("/register"),
            type: "POST",
            data: params,
        }))
    }

    function apiLogin(params) {
        return $.when($.ajax({
            url: buildUrl("/login"),
            type: "POST",
            data: params
        }))
    }

    function apiLogout() {
        return $.when($.ajax({
            url: buildUrl("/api/logout"),
            type: "POST"
        }))
    }

    function onClickLogout() {
        aha.apiLogout().
            done(function () {
                window.location.href = "/page/home.html";
            }).
            fail(function (err) {
                // console.log(err)
            })
    }

    function apiSaveWord(params) {
        return $.when($.ajax({
            url: buildUrl("/api/word"),
            type: "POST",
            data: params,
        }))
    }

    function apiListSavedWords() {
        // return $.when($.ajax(buildUrl("/api/word/list?orderBy=updatedAt")));
        return $.when($.ajax(buildUrl("/api/word/list")));
    }

    function apiListSuggestDefintion(word) {
        return $.when($.ajax(buildUrl(`/api/word/lookup?word=${word}`)));
    }

    function apiListSuggestDefintionVietnamese(word) {
        // return $.when($.ajax(createURL(`/api/word/lookup_vn?word=${word}`)));
        // http://tratu.soha.vn/dict/en_vn/Laugh
        return $.when($.ajax(createTraTuURL(word)));
    }

    function apiShowPronunciation(word) {
        return $.when($.ajax(createURL(`/api/word?field=pronunciation&word=${word}`)));
    }

    function apiShowPronunciationSpelling(word) {
        return $.when($.ajax(createURL(`/api/word/spelling?field=pronunciation&word=${word}`)));
    }

    function apiDeleteWord(word) {
        return $.when($.ajax({
            url: buildUrl(`/api/word?word=${word}`),
            type: "DELETE"
        }))
    }

    function apiUpdateWord(word, newWord, definition) {
        return $.when($.ajax({
            url: buildUrl(`/api/word?word=${word}&newWord=${newWord || word}&definition=${definition}`),
            type: "PUT"
        }))
    }

    // function apiAddNewWord(newWord, definition) {
    //     return $.when($.ajax({
    //         url: buildUrl(`/api/word?word=${newWord}&definition=${definition}&groupKey=transportation&subGroupKey=non-motor`),
    //         type: "POST"
    //     }))
    // }

    function ajaxDelete(word) {
        return $.ajax({
            url: buildUrl(`/api/word?word=${word}`),
            type: "DELETE"
        });
    }

    function updateWord(word, newWord, definition) {
        // compare before call api
        console.log("in the first updateWord",definition)
        if (newWord !== currentEditedWord.word || definition !== currentEditedWord.definition) {
            aha.apiUpdateWord(word, newWord, definition).
                done(function (result) {
                    updateListWordAfterUpdate(word, result)
                    onPagination(1)
                    console.log("in updateWord",result)
                    return true
                    
                }).
                fail(function (jqXHR) {
                    return false
                });
        }
    }

    function addNewWord(newWord, definition) {
        //TO DO
        console.log("list words are :",listWords)
        let duplicate = listWords.includes(newWord);
        if (!duplicate) {
            aha.apiSaveWord({
                word: newWord,
                definition: definition
            }).
                always(function () {
                }).
                done(function (result) {
                    // console.log("",result)
                    updateListWordAfterAddNewWord(result)
                    updateTotalWord()
                    updateUIAfterAddNewWord(result)
                    onPagination(1)
                    
                    // console.log(result)
                    return true
                    
                }).
                fail(function (jqXHR) {
                    return false
                });
        }
    }

    function updateListWordAfterUpdate(word, newItem) {
        listWords = listWords.map(item => {
            if (item.word === word) {
                return newItem
            }
            return item
        })
    }

    function updateListWordAfterAddNewWord(wordObject) {
        listWords.push(wordObject);
    }

    function updateUIAfterAddNewWord(wordObject) {
        let newCard = createElementCard(wordObject)
        $(".list-words").append(newCard)
    }

    function updateTotalWord() {
        $(".list-words__total").text(`Total: ${listWords.length}`)

    }

    function updateListWordAfterDelete(words) {
        console.log("friday", words)
        listWords = listWords.filter(item => !words.includes(item.word))
        // update delete count
        console.log("aaaa",listWords)
        $(".list-words__delete-count").text('Delete selected words')
        updateTotalWord()
    }

    function deleteWord(word) {
        aha.apiDeleteWord(word).
            done(function (result) {
                updateListWordAfterDelete([word])
                onPagination(1)

            }).
            fail(function (jqXHR) {
                // TODO
            });
    }

    function deleteMultipleWord() {
        const listWordsCheckedBeforeDelete = [...listWordsChecked]
        const ajaxArr = listWordsChecked.map(item => ajaxDelete(item))
        $.when(...ajaxArr).done(function () {
            updateListWordAfterDelete(listWordsCheckedBeforeDelete)
            onPagination(1)
            listWordsChecked = []
        }).fail(function (err) {
            // TODO
            console.log("cannot delete multiple words")
        });
    }

    function formatDayMonthYear(time) {
        const d = new Date(time);
        const day = d.getDate();
        const month = d.getMonth() + 1;
        const year = d.getFullYear();

        return [day, month, year].join('/');
    }

    function createElementCard(item) {
        const { word, updatedAt, definition, id, isCheck } = item
        // let date = new Date(updatedAt)
        // date = date.toLocaleDateString()

        return `<div class="flip-card col-xs-12 col-sm-6 col-md-4">
        <div class="flip-card-div ">
            <div class="flip-card-inner">
            <div class="flip-card-front">
                <h1 class="word">${word}</h1>
            </div>
            <div class="flip-card-back">
                <div class="definition">${formatDefinitionFromRawString(definition) || ''}</div>  
            </div>
            </div>
        </div>
        <div class="detail-wrap">
            <div class="detail-content">
                <p class="date">${formatDayMonthYear(updatedAt)}</p>
                ${
            isCheck ?
                `<input class="word-item-checkbox" type="checkbox" id="${word}" checked>` :
                `<input class="word-item-checkbox" type="checkbox" id="${word}">`
            }
                <div class="delete"><p class="lnr lnr-trash btn-delete" data-toggle="modal" data-target="#askDeleteModal" id="${word}"></p></div>
                <span class="lnr lnr-pencil word-item-edit" id="${word}" data-toggle="modal" data-target="#editWordModal"></span>
                <span class="lnr lnr-volume-high lnr-volume-high-front-card" id="${word}"></span>
            </div>
        </div>
      </div>`
    }

    function createPageElement(number) {
        const pageElement = `<li class="page-item list-words__page-item"><a class="page-link ${number === currentPage ? 'current-page' : ''}" href="#" id="${number}">${number}</a></li>`
        return pageElement
    }

    function createElementPagination(total) {
        const numberPage = Math.ceil(total / PAGE_SIZE)
        let element = `<nav aria-label="Page navigation example">
                        <ul class="pagination list-words__pagination-content">
                        `
        if (numberPage > PAGE_NUMBER_DISPLAY) {
            if (currentPage > PAGE_NUMBER_DISPLAY) {
                element += `<li class="page-item list-words__page-item"><a class="page-link" href="#" id="1">First</a></li>`
            }
            if (currentPage > 1) {
                element += `<li class="page-item list-words__page-item"><a class="page-link" href="#" id="${PREV_PAGE}">Previous</a></li>`
            }
        }

        const start = currentPage + 10 <= numberPage ? currentPage : Math.max(numberPage - 10, 1)
        for (let i = start; i <= currentPage + 10 && i <= numberPage; i++) {
            element += createPageElement(i)
        }

        if (numberPage > PAGE_NUMBER_DISPLAY) {
            if (currentPage < numberPage - 1) {
                element += `<li class="page-item list-words__page-item"><a class="page-link" href="#" id="${NEXT_PAGE}">Next</a></li>`
            }
            if (currentPage < numberPage) {
                element += `<li class="page-item list-words__page-item"><a class="page-link" href="#" id="${numberPage}">Last</a></li>`
            }
        }

        element += ` </ul>
                </nav>`

        return element
    }

    function updateListWordsChecked(word, isCheck) {
        // update listWordsChecked
        if (isCheck) {
            listWordsChecked = [...listWordsChecked, word]
        } else {
            listWordsChecked = listWordsChecked.filter(item => item !== word)
        }
        // update listWord
        listWords = listWords.map(item => {
            if (item.word === word) {
                return { ...item, isCheck }
            }
            return item
        })

        $(".list-words__delete-count").text(`Delete ${listWordsChecked.length} selected words`)
    }

    function checkAllWords() {
        let listData = (listWordsDisplay || listWords).slice(PAGE_SIZE * (currentPage - 1), PAGE_SIZE * currentPage);

        for (let i = 0; i < listData.length; i++) {
            if (!listData[i].isCheck) {
                updateListWordsChecked(listData[i].word, true)
            }
        }
    }

    function unCheckAllWords() {
        let listData = (listWordsDisplay || listWords).slice(PAGE_SIZE * (currentPage - 1), PAGE_SIZE * currentPage);

        for (let i = 0; i < listData.length; i++) {
            if (listData[i].isCheck) {
                updateListWordsChecked(listData[i].word, false)
            }
        }
    }


    // change "\n" to new line character
    function formatDefinitionFromRawString(value) {
        return (value || "").replace(/\\n/g, String.fromCharCode(13, 10))
    }

    // replace "\n" in new line character
    function formatDefinitionIntoRawString(value) {
        return (value || "").replace(/(?:\r\n|\r|\n)/g, '\\n');
    }


    // onPagination(currentPage)
    function openModal(word) {
        // word === "" ? isAddOrEditWord = true : isAddOrEditWord = false;
        if (word === undefined) {
            isAddOrEditWord = true;
        }
        else {
            isAddOrEditWord = false;
        }

        $("#editWordModal").on('shown.bs.modal', function(){
            if (word != undefined) {
                $(".modal-edit-word-msg").removeClass("alert alert-danger")
                $(".modal-edit-word-msg").text("")
                $("#modal-edit-word__input-word").hide();
                $("#modal-edit-word__input-word").val(word)
                $(".modal-edit-word__word").text(word)
            } else {
                $(".modal-edit-word__word").text('');
                $("#modal-edit-word__input-word").show();
                $("#modal-edit-word__input-word").focus();
                $("#modal-edit-word__input-word").val('');
            }
        });

        if (word != undefined) {

            // $(".handle-save-action").removeClass("handle-save-add-new-word").addClass("handle-save-word")
            const wordItem = listWords.find(item => item.word === word)
            if (wordItem) {
                const { definition } = wordItem
                const s = formatDefinitionFromRawString(definition)
                $(`#${DEFINITION_ELE_CLASSNAME_IN_MODAL_EDIT_WORD}`).val(s)
                currentEditedWord = wordItem
            }

        } else {
            // currentEditedWord = listWords[0];
            // $(".handle-save-action").removeClass("handle-save-word").addClass("handle-save-add-new-word")
            $(".modal-edit-word-msg").removeClass("alert alert-danger")
            $(".modal-edit-word-msg").text("")
            $("#editWordModal").modal('show')
            $(".word-wrap").hide()
            $(".lnr-volume-high-wrap").hide()
            $(".list-definition").html('<div class="empty">(Empty)</div>')
            $(`#${DEFINITION_ELE_CLASSNAME_IN_MODAL_EDIT_WORD}`).val('')
        }
        
    }

    // function openModalNewWord () {
    //     // $(".modal-edit-word__word").text('')
    //     // $(`#${DEFINITION_ELE_CLASSNAME_IN_MODAL_EDIT_WORD}`).val('')
    //     // alert("before focus")
    //     // console.log(listWords)
    //     currentEditedWord = listWords[0];
    //     $(".handle-save-action").removeClass("handle-save-word").addClass("handle-save-add-new-word")
    //     $(".modal-edit-word-msg").removeClass("alert alert-danger")
    //     $(".modal-edit-word-msg").text("")
    //     $("#editWordModal").on('shown.bs.modal', function(){
    //         $(".modal-edit-word__word").text('');
    //         $("#modal-edit-word__input-word").show();
    //         $("#modal-edit-word__input-word").focus();
    //         $("#modal-edit-word__input-word").val('');
    //     });
    //     $("#editWordModal").modal('show');
    //     $(".word-wrap").hide()
    //     $(".lnr-volume-high-wrap").hide()
    //     $(".list-definition").html('<div class="empty">(Empty)</div>')
    //     $(`#${DEFINITION_ELE_CLASSNAME_IN_MODAL_EDIT_WORD}`).val('')

        
    // }

    function openModalDeleteAskAgain(word) {
        $('#askDeleteModal').modal('show');
        if (word !== undefined) {
            $(".delete-msg").text(`Delete "${word}"?`)
        }
        else {
            $(".delete-msg").text('Delete selected word(s)?')
        }
    }

    function onPagination(page) {
        currentPage = page
        const list = (listWordsDisplay || listWords).slice(PAGE_SIZE * (currentPage - 1), PAGE_SIZE * currentPage).map(item => createElementCard(item))
        let word;
        $(".list-words").html(list)

        // update pagination UI
        const length = (listWordsDisplay || listWords).length
        if (length > PAGE_SIZE) {
            $(".list-words__pagination").html(createElementPagination(length))
        } else {
            $(".list-words__pagination").html("")
        }

        $(".list-words__current-page").text(currentPage)

        $(".page-item").click(function (e) {
            e.stopPropagation()
            const page = parseInt(e.target.id)
            if (page === PREV_PAGE) {
                onPagination(currentPage - 1) // prev page
            } else if (page === NEXT_PAGE) {
                onPagination(currentPage + 1) // next page
            } else {
                onPagination(page)
            }
        });

        $(".m-delete").click(function(e){
            deleteWord(word);
            $(".m-cancel").click()
        });

        $(".btn-delete").click(function (e) {
            e.stopPropagation()
            word = e.target.id
            openModalDeleteAskAgain(word)
        });

        $(".word-item-checkbox").click(function (e) {
            e.stopPropagation()
            word = e.target.id
            updateListWordsChecked(word, e.target.checked)
        });

        $(".word-item-edit").click(async function (e) {
            // e.stopPropagation()
            word = e.target.id
            openModal(word)
            $(".list-definition").html('<div class="loader"></div>')
            $(".lnr-volume-high-wrap").html('')
            await showListSuggestDefinition(word)
            await showPronunciation(word)
        });
        
        $(".lnr-volume-high-front-card").click(function(e) {
            let word = $(this).attr("id");
            aha.apiShowPronunciation(word).
                done(function(resultSpeak) {
                    var audio = new Audio(resultSpeak);
                    audio.play();
                })
        });
    }

    function showListSavedWords() {
        aha.apiListSavedWords().
            done(function (result) {
                //console.log("result: ", result)
                listWords = result
                updateTotalWord()
                onPagination(1)
            }).
            fail(function (jqXHR) {
                // TODO
            });
    }

    /**
     * 
     * @param {string} title in [transitive verb, noun, adj]
     * @param {Array} data array string
     */
    function createSectionSuggestDefintionHTML(title, data) {
        let html = `<div class="suggest-group">
                                <div class="subtitle">${title}</div>
                                <ul class="list-group">`
        data.map(item => {
            console.log("the current is :",currentEditedWord)
            const example = (item.examples && item.examples[0]) || null
            html += `<li class="list-group-item">
                                        <div class="definition">${item.definition}</div>
                                        ${
                example ?
                    `<div class="example">${example}</div>` :
                    ''
                }
                                        <div class="add-btn list-group-item-add-btn">
                                        ${
                                            currentEditedWord != null ?
                                                currentEditedWord.definition.includes(item.definition) ? 
                                                    `<span class="icon btn-remove">&#8211;</span> <span class="status btn-remove">${BTN_ADD_DEFINITION.ADDED}</span>` : 
                                                    `<span class="icon">&#43;</span> <span class="status">${BTN_ADD_DEFINITION.NOT_ADDED}</span>`
                                                :
                                                `<span class="icon">&#43;</span> <span class="status">${BTN_ADD_DEFINITION.NOT_ADDED}</span>`

                                        }
                                            
                                    
                                        </div>
                    </li>`
        })
        html += `</ul>
            </div>`

        return html
    }

    function createSectionSuggestDefintionHTMLVietnamese(definition_vn_array) {
        let html = '';

        definition_vn_array.map(item => {
            // console.log(item.definition[0])
            // console.log(currentEditedWord)
            html += `<div class="suggest-group">
                        <div class="subtitle">${item.typeName}</div>
                        <ul class="list-group">`

            html += `<li class="list-group-item">
                ${item.definition.length > 0 ?
                    `<div class="definition">${item.definition[0].def}</div>

                    
                    ${
                        item.definition[0].phrasalVerb.length > 0 ?
                            `<div class="example">${item.definition[0].phrasalVerb[0]}</div>  <span class="exampleSecond">${item.definition[0].phrasalVerb[1]}</span>` :
                            ''
                    }
                    <div class="add-btn list-group-item-add-btn">
                    ${
                        currentEditedWord != null && item.definition[0].def != '' ?
                            currentEditedWord.definition.includes(item.definition[0].def) ? 
                                `<span class="icon btn-remove">&#8211;</span> <span class="status btn-remove">${BTN_ADD_DEFINITION.ADDED}</span>` 
                                : 
                                `<span class="icon">&#43;</span> <span class="status">${BTN_ADD_DEFINITION.NOT_ADDED}</span>`
                            :
                            `<span class="icon">&#43;</span> <span class="status">${BTN_ADD_DEFINITION.NOT_ADDED}</span>`

                    }
                        
        
                    </div>`
                    :
                    ''
                }
            </li>`
        })
        


        html += '</ul></div>'
            

        return html
    }

    /**
     * @param {string} definitionToggle
     * Output: result:Object  {definition, isAdded}
     */
    function getUpdateDefinitionWord(definitionToggle) {
        const definition = $(`#${DEFINITION_ELE_CLASSNAME_IN_MODAL_EDIT_WORD}`).val()
        // repalce enter with string '\n'
        const rawDefinition = formatDefinitionIntoRawString(definition)

        let result = {}

        if (rawDefinition.includes(`\\n${definitionToggle}`)) {
            result.definition = rawDefinition.replace(`\\n${definitionToggle}`, "").trim() // delete
            result.isAdded = false

        } else if (rawDefinition.includes(definitionToggle)) {
            result.definition = rawDefinition.replace(definitionToggle, "").trim() // delete
            result.isAdded = false

        } else {
            if (!rawDefinition) { // do not add new line at the start of definition
                result.definition = (`${definitionToggle}`).trim()
            } else {
                result.definition = (`${rawDefinition}\\n${definitionToggle}`).trim()
            }
            result.isAdded = true
        }
        return result
    }

    function showListSuggestDefintionHTML(data) {
        // console.log("in the definition list show")
        const { meanings } = data
        let list = ""
        for (const [key, value] of Object.entries(meanings)) {
            list += createSectionSuggestDefintionHTML(key, value)
        }
        $(".list-definition").append('<p class="english-def-title">English</p>')
        $(".list-definition").append(list)
        $(".list-group-item-add-btn").click(async function (e) {
            e.stopPropagation()
            // const item = e.target
            const definition = this.parentElement.getElementsByClassName("definition")[0].textContent
            const btnAdd = this.querySelector(".status")
            const btnIcon = this.querySelector(".icon")

            // update in db 
            try {
                const result = getUpdateDefinitionWord(definition)
                // console.log("current", currentEditedWord.word)
                console.log("definition", result.definition)
                // await aha.updateWord(currentEditedWord.word, null, result.definition)
                // update currentEditedWord
                // currentEditedWord.definition = result.definition
                if (result.isAdded) {
                    btnAdd.textContent = "Added"
                    btnIcon.innerHTML = '&#8211;'
                    btnAdd.classList.add("btn-remove")
                    btnIcon.classList.add("btn-remove")
                } else {
                    btnAdd.textContent = "Add to my definition"
                    btnIcon.innerHTML = '&#43;'
                    btnAdd.classList.remove("btn-remove")
                    btnIcon.classList.remove("btn-remove")
                }
                // update UI
                const s = formatDefinitionFromRawString(result.definition)
                $(`#${DEFINITION_ELE_CLASSNAME_IN_MODAL_EDIT_WORD}`).val(s)
            } catch (err) {
                console.debug(err)
            }
        })
    }

    async function showListSuggestDefinition(word) {
        await aha.apiListSuggestDefintionVietnamese(word).
            done(function (resultVi) {
                aha.apiListSuggestDefintion(word).
                    done(async function (resultEn) {
                        // console.log("def: ", result)
                        // console.log(definition_vn)
                        // let definition_vn = createSectionSuggestDefintionHTMLVietnamese(resultVi);
                        // $(".list-definition").html(definition_vn)

                        await createVietnameseDefinitionObject(resultVi, word);
                        let definition_vn = createSectionSuggestDefintionHTMLVietnamese(termObj.wordType);
                        $(".list-definition").html('<p class="vietnamese-def-title">Vietnamese</p>')
                        // console.log(definition_vn)
                        if (definition_vn != '</ul></div>') {
                            $(".list-definition").append(definition_vn)
                        }
                        else {
                            $(".list-definition").append('<p class="no-result">(No result)</p>')
                        }
                        //create English definition
                        showListSuggestDefintionHTML(resultEn);
                    }).
                    fail(function (jqXHR) {
                        $(".list-definition").html('<div class="empty">(Empty)</div>')
                    })
                })
        // aha.apiListSuggestDefintion(word).
        //     done(function (result) {
        //          console.log("def: ", result)
                
        //         // $(".modal-edit-word-pronunciation").html(result.pronunciation || `<i>(Pronunciation is empty)</i>`)
        //     }).
        //     fail(function (jqXHR) {
        //         $(".list-definition").html('<div class="empty">(Empty)</div>')
        //     });
    }

    function createVietnameseDefinitionObject (resultVi, word) {
        termObj = {
            term: "",
            wordType: []
        };

        //create Vietnames definition
        var stringHTML = resultVi;
        // console.log(stringHTML)
        var dom = new DOMParser()
        var elm = dom.parseFromString(stringHTML, "text/html")
        // console.log(elm)
        // var titles = elm.querySelector("#show-alter > #content-3 > h3 > span")
        // // console.log(title)
        // var definitions = elm.querySelectorAll("div#show-alter > div > div:nth-of-type(1) > h5")
        // var examples = elm.querySelectorAll("div#show-alter > div > div:nth-of-type(1) > dl> dd>dl>dd:nth-of-type(1)")
        // console.log(definition[0].innerText)



        var wordTypeArr = elm.querySelectorAll("#show-alter > div");

        // We don't need to get "Hinh Thai Tu", just need use loop for n-1
        for (var i = 0; i < wordTypeArr.length-1; i++) {

            var wordTypeObj = {
                typeName: "",
                definition: []
              }

              

              var wordTypeStr = wordTypeArr[i].querySelector("h3").innerText;
              wordTypeObj.typeName = wordTypeStr;

              var definitionArr = wordTypeArr[i].querySelectorAll("div");
              for (var j = 0; j < definitionArr.length; j++) {
                var definitionObj = {
                  def: "",
                  phrasalVerb : []
                }
                var phrasalVerbObj = {
                  phrVerb: [],
                  phrVernInVn: ""
                };

                // isDefAvailable: To handle "Cau Truc Tu" case
                var isDefAvailable = definitionArr[j].querySelector("h5>span>a");
                if (isDefAvailable !== null) {
                    definitionObj.def = "";

                    var phrVerbInEng = definitionArr[j].querySelectorAll("h5");
                    var phrVerbInVN = definitionArr[j].querySelectorAll("dl>dd>dl>dd");

                    phrVerbInEng = phrVerbInEng[0] !== undefined ? phrVerbInEng[0].innerText : "";
                    phrVerbInVN = phrVerbInVN[0] !== undefined ? phrVerbInVN[0].innerText : "";
                    
                    phrasalVerbObj.phrVerb.push(phrVerbInEng);
                    phrasalVerbObj.phrVerb.push(phrVerbInVN);
                } else {
                    var def = definitionArr[j].querySelector("h5").innerText;
                    console.log(def);
                    definitionObj.def = def;

                    var phrVerbArr = definitionArr[j].querySelectorAll("dd>dl>dd");
                    if (phrVerbArr !== null) {
                        for (var z = 0; z < phrVerbArr.length; z++) {
                            console.log(phrVerbArr[z].innerText);
                            phrasalVerbObj.phrVerb.push(phrVerbArr[z].innerText);
                        }
                    }
                }
                definitionObj.phrasalVerb = phrasalVerbObj.phrVerb;
                wordTypeObj.definition.push(definitionObj);
              }
              
              
              
              termObj.wordType.push(wordTypeObj);
            }
            termObj.term = word;
            console.log(termObj);

        // elm.querySelectorAll("#show-alter > div:nth-of-type(1) > h3")[0].innerText
        // " Danh từ"

        // elm.querySelectorAll("#show-alter > div:nth-of-type(1) > div:nth-of-type(1) > h5")[0].innerText
        // " Tiếng cười"
        
        // elm.querySelectorAll("#show-alter > div:nth-of-type(1) > div:nth-of-type(1) > dl > dd > dl > dd")[0].innerText
        // to burst into a laugh
        
        // elm.querySelectorAll("#show-alter > div:nth-of-type(1) > div:nth-of-type(1) > dl > dd > dl > dd")[1].innerText
        // cười phá lên
    }

    async function showPronunciation(word) {
        await aha.apiShowPronunciationSpelling(word).
            done(function(resultSpell) {
                aha.apiShowPronunciation(word).
                    done(function(resultSpeak) {
                        if (resultSpeak != "Error" && resultSpell != "Error") {
                            // $(".modal-edit-word-pronunciation").html(result)
                            $(".lnr-volume-high-wrap").html(`<span class="pronun-spelling">/${resultSpell}/</span> <span class="lnr lnr-volume-high lnr-volume-high-back-card"></span>`)
                            $(".lnr-volume-high-back-card").click(function(e) {
                                e.stopPropagation()
                                var audio = new Audio(resultSpeak);
                                audio.play();
                            })
                        }
                        else {
                            $(".lnr-volume-high-wrap").html(`<div class="modal-edit-word-pronunciation">(Pronunciation is empty)</div>`)
                        }
                    })
            })
            // fail(function () {
            //     // console.log("error:", JSON.stringify(jqXHR))
            //     // $(".modal-edit-word-pronunciation").html(`<i>(Pronunciation is empty)</i>`)
            // });

        
    }

    function checkLogin() {
        aha.apiGetUserProfile().
            done(function (profile) {
                $(".login-nav").toggleClass("d-none", true);
                $(".user-profile-nav").toggleClass("d-none", false);
                if (!profile.lastName) {
                    $(".user-profile").text('Hello Wordsminer!')
                } else {
                    $(".user-profile").text('Hello ' + profile.authName.toUpperCase() + '!')
                }
            }).
            fail(function (jqXHR) {
                $(".user-profile-nav").toggleClass("d-none", true);
                $(".login-nav").toggleClass("d-none", false);
                window.location.href = "/page/login.html";
            });
    }

    function getClipboardText() {
        let jBody = $("body");
        let jInput = $("<input>").
            css({ // move offscreen, instead of hide(), otherwise focus() won't work
                position: 'absolute',
                top: '-100px'
            }).
            appendTo(jBody).
            focus();
        document.execCommand("paste");
        let clipboard = jInput.val();
        jInput.remove();
        return clipboard;
    }

    function listSelectedTexts(cb, tabId) {
        try {
            if (tabId !== undefined) {
                chrome.tabs.executeScript(
                    tabId,
                    {
                        code: "window.getSelection().toString();",
                        allFrames: true
                    },
                    function (selections) {
                        cb(selections);
                    });
            } else {
                aha.util.listActiveTabs(function (tabs) {
                    if (!tabs || !tabs.length) {
                        cb(null);
                        return
                    }

                    chrome.tabs.executeScript(
                        tabs[0].id,
                        {
                            code: "window.getSelection().toString();",
                            allFrames: true
                        },
                        function (selections) {
                            cb(selections);
                        });
                });
            }
        } catch (err) {
            cb(null, err);
        }
    }

    function listActiveTabs(cb) {
        chrome.tabs.query({
            active: true,
            currentWindow: true
        }, function (tabs) {
            cb(tabs);
        })
    }

    function removeFaulty(arr) {
        const result = []
        _.map(arr, function (e) {
            const formatedWord = formatWord(e)
            if (formatedWord) {
                result.push(formatedWord)
            }
        })
        return result
    }
    function formatWord(value) {
        const regExp = /[a-z ]+/i
        const result = regExp.exec(value)
        if (result) {
            return regExp.exec(value)[0]
        } else
            return ""
    }

    function splitWords(sentences) {
        if (_.isString(sentences)) {
            return removeFaulty(_.split(sentences, /\s+/));
        }

        if (!_.isArray(sentences)) {
            return [];
        }

        let results = [];
        sentences.forEach(function (e, i) {
            let txt = "" + e;
            results = results.concat(removeFaulty(_.split(txt, /\s+/)));
        });

        return results;
    }

    function distinctWords(arr) {
        return _.uniq(arr);
    }

    // function sortWords(arr) {
    //     return arr.sort();
    // }

    
})($ || jQuery);
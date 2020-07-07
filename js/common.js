let aha = {};

(function ($) {
    const baseUrl = "https://appword.kie.io";
    function buildUrl(path, paramsObj) {
        let recursiveEncodedParams = "";
        if (paramsObj) {
            recursiveEncodedParams += $.param(paramsObj);
        }
        return baseUrl + path + (recursiveEncodedParams ? "?" + recursiveEncodedParams : "");
    };

    aha.util = {
        firstLine: firstLine,
        getClipboardText: getClipboardText,
        listSelectedTexts: listSelectedTexts,
        listActiveTabs: listActiveTabs,
        splitWords: splitWords,
        distinctWords: distinctWords,
        sortWords: sortWords,
        formatWord: formatWord
    };
    aha.baseUrl = baseUrl;
    aha.buildUrl = buildUrl;
    aha.apiGetUserProfile = apiGetUserProfile;
    aha.apiRegister = apiRegister;
    aha.apiLogin = apiLogin;
    aha.apiLogout = apiLogout;
    aha.apiSaveWord = apiSaveWord;
    aha.apiDeleteWord = apiDeleteWord;
    aha.apiListSavedWords = apiListSavedWords;
    aha.apiListSuggestDefintion = apiListSuggestDefintion;
    aha.apiUpdateWord = apiUpdateWord

    aha.checkLogin = checkLogin;
    aha.showListSavedWords = showListSavedWords;
    aha.showListSuggestDefinition = showListSuggestDefinition;
    aha.deleteWord = deleteWord;
    aha.deleteMultipleWord = deleteMultipleWord;
    aha.updateWord = updateWord
    aha.checkAllWords = checkAllWords
    aha.unCheckAllWords = unCheckAllWords
    aha.onPaginationListWord = onPagination
    aha.formatDefinitionIntoRawString = formatDefinitionIntoRawString

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

    function ajaxDelete(word) {
        return $.ajax({
            url: buildUrl(`/api/word?word=${word}`),
            type: "DELETE"
        });
    }

    function updateWord(word, newWord, definition) {
        // compare before call api
        if (newWord !== currentEditedWord.word || definition !== currentEditedWord.definition) {
            aha.apiUpdateWord(word, newWord, definition).
                done(function (result) {
                    updateListWordAfterUpdate(word, result)
                    onPagination(1)
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

    function updateTotalWord () {
        $(".list-words__total").text(`Total: ${listWords.length}`)

    }

    function updateListWordAfterDelete(words) {
        listWords = listWords.filter(item => !words.includes(item.word))
        // update delete count
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
        const ajaxArr = listWordsChecked.map(item => ajaxDelete(item))
        $.when(...ajaxArr).done(function () {
            updateListWordAfterDelete(listWordsChecked)
            onPagination(1)
            listWordsChecked = []
        }).fail(function (err) {
            // TODO
        });
    }

    function createElementCard(item) {
        const { word, updatedAt, definition, id, isCheck } = item
        let date = new Date(updatedAt)
        date = date.toLocaleDateString()

        return `<div class="flip-card col-xs-12 col-sm-6 col-md-4">
        <div class="flip-card-inner">
          <div class="flip-card-front">
            <h1 class="word">${word}</h1>
          </div>
          <div class="flip-card-back">
            <h1 class="definition">${formatDefinitionFromRawString(definition) || 'Definition is empty'}</h1>  
          </div>
        </div>
        <div class="detail-wrap">
            <div class="detail-content">
                <p class="date">${date}</p>
                ${
            isCheck ?
                `<input class="word-item-checkbox" type="checkbox" id="${word}" checked>` :
                `<input class="word-item-checkbox" type="checkbox" id="${word}">`
            }
                <div class="delete"><p class="lnr lnr-trash btn-delete" id="${word}"></p></div>
                <span class="lnr lnr-pencil word-item-edit" id="${word}" data-toggle="modal" data-target="#editWordModal"></span>
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
    function formatDefinitionFromRawString (value) {
        return  (value||"").replace(/\\n/g, String.fromCharCode(13, 10))
    }

    // replace "\n" in new line character
    function formatDefinitionIntoRawString(value) {
        return (value || "").replace(/(?:\r\n|\r|\n)/g, '\\n');
    }


    // onPagination(currentPage)
    function openModalEditWord(word) {
        const wordItem = listWords.find(item => item.word === word)
        if (wordItem) {
            $("#modal-edit-word-content").val(word)
            
            const { definition } = wordItem
            const s = formatDefinitionFromRawString(definition)
            $(`#${DEFINITION_ELE_CLASSNAME_IN_MODAL_EDIT_WORD}`).val(s)
            currentEditedWord = wordItem
        }
    }

    function onPagination(page) {
        currentPage = page
        const list = (listWordsDisplay || listWords).slice(PAGE_SIZE * (currentPage - 1), PAGE_SIZE * currentPage).map(item => createElementCard(item))

        $(".list-words").html(list)

        // update pagination UI
        $(".list-words__pagination").html(createElementPagination((listWordsDisplay || listWords).length))
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

        $(".btn-delete").click(function (e) {
            e.stopPropagation()
            const word = e.target.id
            deleteWord(word)
        });

        $(".word-item-checkbox").click(function (e) {
            e.stopPropagation()
            const word = e.target.id
            updateListWordsChecked(word, e.target.checked)
        });

        $(".word-item-edit").click(async function (e) {
            const word = e.target.id
            openModalEditWord(word)
            $(".list-definition").html('<div class="loader"></div>')
            await showListSuggestDefinition(word)
        });
    }

    function showListSavedWords() {
        aha.apiListSavedWords().
            done(function (result) {
                // console.log("result: ", result)
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
            const example = (item.examples && item.examples[0]) || null
            html += `<li class="list-group-item">
                                        <div class="definition">${item.definition}</div>
                                        ${
                example ?
                    `<div class="example">${example}</div>` :
                    ''
                }
                                        <div class="add-btn list-group-item-add-btn">
                                            <span class="icon">&#43;</span>
                                            <span class="status">
                                            ${currentEditedWord.definition.includes(item.definition) ? BTN_ADD_DEFINITION.ADDED : BTN_ADD_DEFINITION.NOT_ADDED}
                                            </span>
                                        </div>
                    </li>`
        })


        html += `</ul>
            </div>`

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
        const { meanings } = data
        let list = ""
        for (const [key, value] of Object.entries(meanings)) {
            list += createSectionSuggestDefintionHTML(key, value)
        }

        $(".list-definition").html(list)
        $(".list-group-item-add-btn").click(async function (e) {
            e.stopPropagation()
            const item = e.target.parentElement.parentElement
            const definition = item.getElementsByClassName("definition")[0].textContent
            const btnAdd = item.querySelector(".list-group-item-add-btn .status")
            // update in db 
            try {
                const result = getUpdateDefinitionWord(definition)

                await aha.updateWord(currentEditedWord.word, null, result.definition)
                // update currentEditedWord
                currentEditedWord.definition = result.definition
                if (result.isAdded) {
                    btnAdd.textContent = "Added"
                } else {
                    btnAdd.textContent = "Add to my definition"
                }
                // update UI
                const s = formatDefinitionFromRawString(result.definition)
                $(`#${DEFINITION_ELE_CLASSNAME_IN_MODAL_EDIT_WORD}`).val(s)
            } catch (err) {
                console.debug(err)
            }
        })
    }

    function showListSuggestDefinition(word) {
        aha.apiListSuggestDefintion(word).
            done(function (result) {
                showListSuggestDefintionHTML(result)
            }).
            fail(function (jqXHR) {
                $(".list-definition").html('<div class="empty">(Empty)</div>')
            });
    }

    function checkLogin() {
        aha.apiGetUserProfile().
            done(function (profile) {
                $(".login-nav").toggleClass("d-none", true);
                $(".user-profile-nav").toggleClass("d-none", false);
                $(".user-profile").text("Hi, " + profile.lastName);
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

    function sortWords(arr) {
        return arr.sort();
    }
})($ || jQuery);

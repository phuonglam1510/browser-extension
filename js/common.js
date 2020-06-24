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
        sortWords: sortWords
    };
    aha.baseUrl = baseUrl;
    aha.buildUrl = buildUrl;
    aha.apiGetUserProfile = apiGetUserProfile;
    aha.apiLogin = apiLogin;
    aha.apiLogout = apiLogout;
    aha.apiSaveWord = apiSaveWord;
    aha.checkLogin = checkLogin;
    aha.apiListSavedWords = apiListSavedWords;
    aha.showListSavedWords = showListSavedWords;
    aha.apiDeleteWord = apiDeleteWord;
    aha.deleteWord = deleteWord;
    aha.onPaginationListWord = onPagination
    aha.deleteMultipleWord = deleteMultipleWord

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
        return $.when($.ajax(buildUrl("/api/word/list")));
    }

    function apiDeleteWord(word) {
        return $.when($.ajax({
            url: buildUrl(`/api/word?word=${word}`),
            type: "DELETE"
        }))
    }

    function updateListWordAfterDelete(words) {
        // listWords = listWords.filter(item => item.word !== word)
        listWords = listWords.filter(item => !words.includes(item.word))
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


    function ajaxDelete(word) {
        return $.ajax({
            url: buildUrl(`/api/word?word=${word}`),
            type: "DELETE"
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
            <h1 class="definition">${definition || 'Definition is empty'}</h1>  
          </div>
        </div>
        <div class="detail-wrap">
            <div class="detail-content">
                <p>${date}</p>
                ${
                    isCheck ? 
                `<input class="word-item-checkbox" type="checkbox" id="${word}" checked>` :
                `<input class="word-item-checkbox" type="checkbox" id="${word}">` 
                }
                <div class="delete"><p class="lnr lnr-trash btn-delete" id="${word}"></p></div>
            </div>
        </div>
      </div>`
    }

    function createPageElement (number) {
        const pageElement = `<li class="page-item list-words__page-item"><a class="page-link ${number === currentPage ? 'current-page' : ''}" href="#" id="${number}">${number}</a></li>`
        return pageElement
    }

    function createElementPagination(total) {
        const numberPage = Math.floor( total / PAGE_SIZE)
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
        for (let i = start; i <= currentPage + 10 && i <= numberPage ; i++){
            element += createPageElement(i)
        }

        // if (currentPage + 10 < numberPage){
        //     element += `
        //     <li>...</li>
        //     `
        // }

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

    function updateListWordsChecked (word, isCheck) {
        // update listWordsChecked
        if (isCheck) {
            listWordsChecked = [...listWordsChecked, word]
        } else {
            listWordsChecked = listWordsChecked.filter(item => item !== word)
        }
        // update listWord
        listWords = listWords.map(item =>{
            if (item.word === word) {
                return {...item, isCheck}
            }
            return item
        })
        
        $(".list-words__delete-count").text(`Delete ${listWordsChecked.length} selected words`)
    }

    function onPagination(page) {
        currentPage  = page
        const list = ( listWordsDisplay || listWords).slice(PAGE_SIZE * (currentPage - 1), PAGE_SIZE * currentPage).map(item => createElementCard(item))
        
        $(".list-words").html(list)

        // update pagination UI
        $(".list-words__pagination").html(createElementPagination((listWordsDisplay || listWords).length))
        $(".list-words__current-page").text(currentPage)

        $(".page-item").click(function (e) {
            e.stopPropagation()
            const page = parseInt(e.target.id)
            if (page === PREV_PAGE)  {
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
    }

    function showListSavedWords() {
        aha.apiListSavedWords().
            done(function (result) {
                listWords = result
                onPagination(1)
            }).
            fail(function (jqXHR) {
                // TODO
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
        return _.filter(arr, function (e) {
            return !!e;
        })
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
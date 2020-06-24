let aha = {};

(function($) {
    const baseUrl = "https://appword.kie.io";
    function buildUrl(path, paramsObj) {
        let recursiveEncodedParams = "";
        if (paramsObj) {
            recursiveEncodedParams += $.param(paramsObj);
        }
        return baseUrl + path + (recursiveEncodedParams ? "?"+recursiveEncodedParams : "");
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

    function firstLine(str){
        var breakIndex = str.indexOf("\n");

        // consider that there can be line without a break
        if (breakIndex === -1){
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

    function updateListWordAfterDelete(word) {
        listWords = listWords.filter(item => item.word !== word)
    }

    function deleteWord(word) {
        aha.apiDeleteWord(word).
            done(function (result) {
                console.log("rs after delete: ", result)
                updateListWordAfterDelete(word)
                onPagination(1)

            }).
            fail(function (jqXHR) {
                console.log("get err")
                console.log(JSON.stringify(jqXHR))
                // TODO
            });
    }

    function deleteMultipleWord(words) {
        console.log("deleword: ", words)
        aha.apiDeleteWord(word).
            done(function (result) {
                console.log("rs after delete: ", result)
                updateListWordAfterDelete(word)
                onPagination(1)

            }).
            fail(function (jqXHR) {
                console.log("get err")
                console.log(JSON.stringify(jqXHR))
                // TODO
            });
    }

    function createElementCard(item) {
        const { word, updatedAt, definition, id, isCheck} = item
        let date = new Date(updatedAt)
        date = date.toLocaleDateString()

        const idCollapse = `collapseExample${id}`
        return `<div class='card-item'>
            <div data-toggle="collapse" href="#${idCollapse}" role="button" aria-expanded="false" aria-controls="collapseExample">
                <span>${word}</span>
                <span class="lnr lnr-trash btn-delete" id="${word}" ></span>
                <input class="word-item-checkbox" type="checkbox" id="${word}">
            </div>
            <div class="collapse" id="${idCollapse}">
                    <div class="card card-body">
                        <span>${definition || 'Definition is empty'}</span>
                        <span>${date}</span>
                    </div>
            </div>
        </div>`
    }

    function createPageElement (number) {
        const pageElement = `<li class="page-item list-words__page-item"><a class="page-link ${number === currentPage ? 'current-page' : ''}" href="#" id="${number}">${number}</a></li>`
        return pageElement
    }

    function createElementPagination() {
        console.log("** on create ")
        const numberPage = Math.floor(listWords.length / PAGE_SIZE)
        console.log("numberPage: ", numberPage)
        // let count = 0;
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
        if (isCheck) {
            listWordsChecked = [...listWordsChecked, word]
        } else {
            listWordsChecked = listWordsChecked.filter(item => item !== word)
        }
        console.log("list: ", listWordsChecked)
    }

    function deleteListWordsChecked(word){
        for (word in listWordsChecked){
           api
         }
        })
    }



    function onPagination(page) {
        console.log("** on create 1 ")

        currentPage  = page
        const list = listWords.slice(PAGE_SIZE * (currentPage - 1), PAGE_SIZE * currentPage).map(item => createElementCard(item))
        $(".list-words").html(list)

        // update pagination UI
        $(".list-words__pagination").html(createElementPagination())
        $(".list-words__current-page").text(currentPage)

        $(".page-item").click(function (e) {
            e.stopPropagation()
            const page = parseInt(e.target.id)
            console.log("page: ", page)
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
            console.log(" e.target.attributes: ", e.target.id)
            const word = e.target.id
            deleteWord(word)
        });

        $(".word-item-checkbox").click(function (e) {
            e.stopPropagation()
            // console.log(" e.target.attributes: ", e.target.id)
            // console.log(" e.target.attributes: ", e.target.checked)
            const word = e.target.id
            updateListWordsChecked(word, e.target.checked)
           
        });

// ////////////////////////////////////////////
//         $(...).click(function (e) {
//             e.stopPropagation()
//             const select = e.target.checked
//             });

    }

    function showListSavedWords() {
        aha.apiListSavedWords().
            done(function (result) {
                listWords = result
            
                console.log("result: ", listWords)

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
                    function(selections) {
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
                        function(selections) {
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
        }, function(tabs) {
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
        sentences.forEach(function(e, i) {
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
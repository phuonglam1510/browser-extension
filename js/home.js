$(document).ready(function () {

    let tmplTags = {
    };
    initTemplateTags();
    handleButtons();
    aha.checkLogin();
    showSelectedWords();
    showClipboardWords();
    showAllWords();
    chrome.browserAction.setBadgeText({ text: '' });

    function showSelectedWords() {
        aha.util.listSelectedTexts(function (selections) {
            // console.log("Selected texts: ", selections);
            let jUL = $(".words-selected").empty();
            let jCounter = $(".words-selected-count");

            let words = aha.util.sortWords(aha.util.distinctWords(aha.util.splitWords(selections)));
            if (!words || !words.length) {
                jCounter.
                    addClass("badge-secondary").
                    removeClass("badge-primary").
                    text("0");
                jUL.append(tmplTags.getEmptyWordsAlert());
                return;
            }

            jCounter.
                addClass("badge-primary").
                removeClass("badge-secondary").
                text("" + words.length);
            words.forEach(function (word, i) {
                let tag = tmplTags.getSingleWord();
                tag.children(".content").text(word);
                jUL.append(tag);
            });
        })
    }

    function showClipboardWords() {
        let clTxt = "" + aha.util.getClipboardText();
        clTxt.trim();
        // console.log("Clipboard text: ", clTxt);

        let jUL = $(".words-in-clipboard").empty();
        let jCounter = $(".words-in-clipboard-count");

        let words = aha.util.sortWords(aha.util.distinctWords(aha.util.splitWords(clTxt)));
        if (!words || !words.length) {
            jCounter.
                addClass("badge-secondary").
                removeClass("badge-primary").
                text("0");
            jUL.append(tmplTags.getEmptyWordsAlert());
            return;
        }

        jCounter.
            addClass("badge-primary").
            removeClass("badge-secondary").
            text("" + words.length);
        words.forEach(function (word, i) {
            let tag = tmplTags.getSingleWord();
            tag.children(".content").text(word);
            jUL.append(tag);
        });
    }

    function showAllWords() {
        let clTxt = aha.util.getClipboardText();
        aha.util.listSelectedTexts(function (selections) {
            let jUL = $(".words-detected").empty();
            let jCounter = $(".words-detected-count");

            let selectedWords = aha.util.splitWords(selections);
            let clipboardWords = aha.util.splitWords(clTxt);
            let words = aha.util.sortWords(aha.util.distinctWords(selectedWords.concat(clipboardWords)));

            
            
            if (!words || !words.length) {
                jCounter.
                addClass("badge-secondary").
                removeClass("badge-primary").
                text("0");
                jUL.append(tmplTags.getEmptyWordsAlert());

                // show total new words in welcome
                const totalWordsContent = `You don't have any words. Let's collect some then add to WordMine now!`
                $(".total-word-in-welcome").html(totalWordsContent)
                return;
            }

            // show total new words in welcome
            const totalWords = words.length
            const totalWordsContent = `You have <span class="total-number">${totalWords}</span> new word${totalWords > 1 ? 's':''}.`
            $(".total-word-in-welcome").html(totalWordsContent)

            jCounter.
                addClass("badge-primary").
                removeClass("badge-secondary").
                text("" + words.length);
            words.forEach(function (word, i) {
                let tag = tmplTags.getSingleWord();
                tag.children(".content").text(word);
                jUL.append(tag);
            });
        });
    }

    function handleButtons() {
        $(".logout").click(logoutClickHandler);
    }

    function logoutClickHandler() {
        $(".logout").off("click", logoutClickHandler);
        aha.apiLogout().
            done(function (nop) {
                window.location.reload();
            }).
            fail(function (jqXHR) {
                $(".logout").click(logoutClickHandler);
            });
    }

    function onAddWordClick(e) {
        let jSubmit = $(this);
        jSubmit.prop('disabled', true).text("Adding...");
        let content = jSubmit.siblings(".content").text();
        aha.apiSaveWord({
            word: content
        }).
            always(function () {
            }).
            fail(function (err) {
                jSubmit.prop('disabled', false).text("Add");
                alert("failed with error " + err.responseText);
            }).
            done(function () {
                jSubmit.text("Added!");
                jSubmit.addClass("btn-success").removeClass("btn-outline-success");
            });
    }

    function initTemplateTags() {
        function captureTag(selector, mod) {
            let tags = $(selector).detach();
            if (_.isFunction(mod)) {
                mod(tags);
            }
            return function () {
                return tags.first().clone(true, true);
            }
        }

        tmplTags.getSingleWord = captureTag(".single-word-template", function (tags) {
            tags.find('button[type="submit"]').click(onAddWordClick)
        });
        tmplTags.getEmptyWordsAlert = captureTag(".empty-words-alert");
    }
});
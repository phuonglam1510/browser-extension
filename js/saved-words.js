$(document).ready(function () {
    let tmplTags = {
    };

    initTemplateTags();
    aha.checkLogin();

    function initTemplateTags() {
        function captureTag(selector, mod) {
            let tags = $(selector).detach();
            if (_.isFunction(mod)) {
                mod(tags);
            }
            return function() {
                return tags.first().clone(true, true);
            }
        }

        tmplTags.getSingleWord = captureTag(".single-word-template");
        tmplTags.getEmptyWordsAlert = captureTag(".empty-words-alert");
    }
});
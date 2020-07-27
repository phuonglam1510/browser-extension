// Copyright (c) 2011 The Chromium Authors. All rights reserved.
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.

/**
 * Returns a handler which will open a new window when activated.
 */
function saveFirstSelectedWord() {
  return function (info, tab) {

    aha.util.listSelectedTexts(function (selections) {
      // console.log("Selected texts: ", selections);

      let words = aha.util.splitWords(selections);
      if (!words || !words.length) {
        alert("No word found!");
        return;
      }

      let content = aha.util.formatWord(words[0]);
      let yes = confirm("Are you sure you want to add this word: '" + content + "'?");
      if (!yes) {
        return;
      }

      aha.apiSaveWord({
        word: content
      }).
        always(function () {
        }).
        fail(function (err) {
          alert("failed to add word with error " + err.responseText);
        }).
        done(function () {
          // alert("SUCCESSFULLY added word: '" + content + "'")
        });
    });
    // // The srcUrl property is only available for image elements.
    // // var url = 'info.html#' + info.srcUrl;
    // var url="save-word.html#";
    // console.log("This is background page");
    // chrome.tabs.executeScript( {
    //   code: "window.getSelection().toString();",
    //   allFrames: true
    // }, function(selection) {
    //   console.log("selection: ", selection);
    //
    //   var words = selection[0].split(/\s+/);
    //   var fisrtWord = words[0];
    //   url += fisrtWord;
    //
    //   alert("Word to be saved: " + fisrtWord);
    //   chrome.browserAction.setBadgeText({text: 'SAVE'});
    //   chrome.browserAction.setBadgeBackgroundColor({color: '#4688F1'});
    //   chrome.browserAction.setPopup({popup: '/page/save-word.html'});
    //   // // Create a new window to the info page.
    //   // chrome.windows.create({ url: url, width: 520, height: 660, type: "popup" }, function() {
    //   // });
    // });
  };
};

function saveFirstWordFromClipboard() {
  return function (info, tab) {
    let clTxt = "" + aha.util.getClipboardText();
    clTxt.trim();
    // console.log("Clipboard text: ", clTxt);

    let words = aha.util.splitWords(clTxt);
    if (!words || !words.length) {
      alert("No word found!");
      return;
    }

    let content = aha.util.formatWord(words[0]);
    let yes = confirm("Are you sure you want to add this word: '" + content + "'?");
    if (!yes) {
      return;
    }

    aha.apiSaveWord({
      word: content
    }).
      always(function () {
      }).
      fail(function (err) {
        alert("failed to add word with error " + err.responseText);
      }).
      done(function () {
        // alert("SUCCESSFULLY added word: '" + content + "'")
      });
  }
}

(function () {
  var parentSaveWord = chrome.contextMenus.create({
    "title" : "Save Word...",
    "type" : "normal",
    "contexts" : ["selection"],
  });

  /**
   * Create a context menu which will only show up for selection.
   */
  chrome.contextMenus.create({
    "title": "Save Word From Selection",
    "type": "normal",
    "contexts": ["selection"],
    "onclick": saveFirstSelectedWord(),
    "parentId": parentSaveWord
  });

  /**
   * Create a context menu which will show up anywhere.
   */
  chrome.contextMenus.create({
    "title" : "Save Word From Clipboard",
    "type" : "normal",
    "contexts" : ["all"],
    "onclick" : saveFirstWordFromClipboard(),
    "parentId": parentSaveWord
  });

  /**
   * Create a context menu which will show up anywhere except selection.
   */
  chrome.contextMenus.create({
    "title": "Save Word From Clipboard",
    "type": "normal",
    "contexts": ["page", "frame", "link", "editable", "image", "video", "audio", "browser_action", "page_action"],
    "onclick": saveFirstWordFromClipboard()
  });
})()



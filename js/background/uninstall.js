function redirectToLogoutWhenUninstall () {
    chrome.runtime.setUninstallURL("https://wordsmine.netlify.app/logout")
}

(function () {
    redirectToLogoutWhenUninstall();
}) ()
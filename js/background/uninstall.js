function redirectToLogoutWhenUninstall () {
    const time = Date.now()
    const tokenTime = btoa(time)
    chrome.runtime.setUninstallURL(`http://wordsmine.com/logout/${tokenTime}`)
    // chrome.runtime.setUninstallURL(`http://localhost:3002/logout/${tokenTime}`)
}

(function () {
    redirectToLogoutWhenUninstall();
})()
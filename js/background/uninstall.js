function redirectToLogoutWhenUninstall () {
    const time = Date.now()
    const tokenTime = btoa(time)
    chrome.runtime.setUninstallURL(`http://www.wordsmine.com/logout/${tokenTime}`)
    // chrome.runtime.setUninstallURL(`http://localhost:3002/logout/${btoa('1594701703445')}`)
}

(function () {
    redirectToLogoutWhenUninstall();
}) ()
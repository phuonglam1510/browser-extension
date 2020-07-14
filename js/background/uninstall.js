function redirectToLogoutWhenUninstall() {
    
    chrome.runtime.setUninstallURL("http://localhost:3002/logout")
}

(function () {
    redirectToLogoutWhenUninstall();
})()
chrome.runtime.onInstalled.addListener(function (details) {
  if (details.reason == "install") {
    aha.apiLogout();
  }
});
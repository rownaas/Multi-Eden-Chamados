chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
    if (request.openPopup) {
      chrome.browserAction.openPopup();
    }
  });
  
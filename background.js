// background.js
chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
    // Verificar se a mensagem solicita a abertura do popup
    if (request.openPopup) {
      // Abrir o popup da extensão
      chrome.browserAction.openPopup();
    }
  });
  
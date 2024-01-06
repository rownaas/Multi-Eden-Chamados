// popup.js
document.addEventListener('DOMContentLoaded', function() {
  document.getElementById('salvarConfiguracoesBtn').addEventListener('click', salvarConfiguracoes);
});

function salvarConfiguracoes() {
  var usuario = document.getElementById('username').value;
  var senha = document.getElementById('password').value;

  // Salve as configurações usando a API de armazenamento local
  chrome.storage.local.set({ 'usuario': usuario, 'senha': senha }, function() {
    console.log('Configurações salvas');
  });
}

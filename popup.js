// popup.js
document.addEventListener('DOMContentLoaded', function() {
  document.getElementById('salvarConfiguracoesBtn').addEventListener('click', salvarConfiguracoes);
  document.getElementById('removerConfiguracoesBtn').addEventListener('click', removerConfiguracoes);
});

function salvarConfiguracoes() {
  var usuario = document.getElementById('username').value;
  var senha = document.getElementById('password').value;

  // Salve as configurações usando a API de armazenamento local
  chrome.storage.local.set({ 'usuario': usuario, 'senha': senha }, function() {
    alert('Configurações salvas');
    usuario.value = '';
    senha.value = '';
  });
}

function removerConfiguracoes() {
  var usuario = document.getElementById('username').value;
  var senha = document.getElementById('password').value;

  // Salve as configurações usando a API de armazenamento local
  chrome.storage.local.remove([ 'usuario', 'senha'], function() {
    alert('Configurações removidas');
    usuario.value = '';
    senha.value = '';
  });
}

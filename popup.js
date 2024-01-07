// popup.js
document.addEventListener('DOMContentLoaded', function () {
  document.getElementById('salvarConfiguracoesBtn').addEventListener('click', salvarConfiguracoes);
  document.getElementById('removerConfiguracoesBtn').addEventListener('click', removerConfiguracoes);
  document.getElementById('testarConexaoBtn').addEventListener('click', testarConexao);

  chrome.storage.local.get(['usuario', 'senha'], function (result) {
    var usuario = result.usuario;
    var senha = result.senha;

    // Verificar se usuário e senha são nulos ou indefinidos
    if (usuario === null || senha === null || typeof usuario === 'undefined' || typeof senha === 'undefined') {
      // Exibir mensagem pedindo para configurar usuário e senha
      var remover = document.getElementById("removerConfiguracoesBtn");
      remover.disabled = true;

      var testar = document.getElementById("testarConexaoBtn");
      testar.disabled = true;
    } else {
      var username = document.getElementById("username");
      username.disabled = true;
      username.value = usuario;

      var password = document.getElementById("password");
      password.disabled = true;
      password.value = senha;

      var salvar = document.getElementById("salvarConfiguracoesBtn");
      salvar.disabled = true;
    }
  });
});

function salvarConfiguracoes() {
  var usuario = document.getElementById('username').value;
  var senha = document.getElementById('password').value;

  // Salve as configurações usando a API de armazenamento local
  chrome.storage.local.set({ 'usuario': usuario, 'senha': senha }, function () {
    alert("Login e senha salvos");
    usuario.value = '';
    senha.value = '';
  });
}

function removerConfiguracoes() {
  var usuario = document.getElementById('username').value;
  var senha = document.getElementById('password').value;

  // Salve as configurações usando a API de armazenamento local
  chrome.storage.local.remove(['usuario', 'senha'], function () {
    alert('Configurações removidas');
    usuario.value = '';
    senha.value = '';
  });
}

function testarConexao() {
  chrome.storage.local.get(['usuario', 'senha'], function (result) {
    var login = result.usuario;
    var senha = result.senha;

    var myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");

    var raw = JSON.stringify({
      "login": login,
      "senha": senha
    });

    var requestOptions = {
      method: 'POST',
      headers: myHeaders,
      body: raw,
      redirect: 'follow'
    };

    fetch("https://portal.infowaycloud.com.br/api/auth.php", requestOptions)
      .then(response => response.text())
      .then(result => alert("Tudo certinho!"))
      .catch(error => console.log('error', error));
  });
}


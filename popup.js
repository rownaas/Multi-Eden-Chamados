// popup.js
document.addEventListener('DOMContentLoaded', function () {
  document.getElementById('salvarConfiguracoesBtn').addEventListener('click', salvarConfiguracoes);
  document.getElementById('removerConfiguracoesBtn').addEventListener('click', removerConfiguracoes);

  chrome.storage.local.get(['usuario', 'senha', 'usuario_multi', 'senha_multi'], function (result) {
    var usuario = result.usuario;
    var senha = result.senha;
    var usuario_multi = result.usuario_multi;
    var senha_multi = result.senha_multi;

    // Verificar se usuário e senha são nulos ou indefinidos
    if (usuario === null || senha === null || usuario_multi === null || senha_multi === null || typeof usuario === 'undefined' || typeof senha === 'undefined' || typeof usuario_multi === 'undefined' || typeof senha_multi === 'undefined') {
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

      var usuario_multi_ = document.getElementById("username-multi");
      usuario_multi_.disabled = true;
      usuario_multi_.value = usuario_multi;

      var senha_multi_ = document.getElementById("password-multi");
      senha_multi_.disabled = true;
      senha_multi_.value = senha_multi;

      var salvar = document.getElementById("salvarConfiguracoesBtn");
      salvar.disabled = true;
    }
  });
});

function salvarConfiguracoes() {
  var usuario = document.getElementById('username').value;
  var senha = document.getElementById('password').value;
  var usuario_multi = document.getElementById('username-multi').value;
  var senha_multi = document.getElementById('password-multi').value;

  // Salve as configurações usando a API de armazenamento local
  chrome.storage.local.set({ 'usuario': usuario, 'senha': senha, 'usuario_multi': usuario_multi, 'senha_multi': senha_multi }, function () {
    alert("Login e senha salvos");
    usuario.value = '';
    senha.value = '';
    usuario_multi.value = '';
    senha_multi.value = '';
  });
}

function removerConfiguracoes() {
  var usuario = document.getElementById('username').value;
  var senha = document.getElementById('password').value;
  var usuario_multi = document.getElementById('username-multi').value;
  var senha_multi = document.getElementById('password-multi').value;

  // Salve as configurações usando a API de armazenamento local
  chrome.storage.local.remove(['usuario', 'senha', 'naoMostrar'], function () {
    alert('Configurações removidas');
    usuario.value = '';
    senha.value = '';
    usuario_multi.value = '';
    senha_multi.value = '';
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


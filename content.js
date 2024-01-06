// Recuperar informações de login armazenadas localmente
var auth;
chrome.storage.local.get(['usuario', 'senha'], function (result) {
    var usuario = result.usuario;
    var senha = result.senha;

    // Verificar se usuário e senha são nulos ou indefinidos
    if (usuario === null || senha === null || typeof usuario === 'undefined' || typeof senha === 'undefined') {
        // Exibir mensagem pedindo para configurar usuário e senha
        alert('Por favor, configure seu usuário e senha dentro da extensão do eden');
        chrome.runtime.sendMessage({ openPopup: true });
    } else {
        // Usuário e senha estão presentes, faça algo com as informações recuperadas
        console.log('Usuário:', usuario);
        console.log('Senha:', senha);
        const url = "https://portal.infowaycloud.com.br/api/auth.php";
        const dados = {
            login: usuario,
            senha: senha
        };

        fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(dados),
        })
            .then(response => {
                if (!response.ok) {
                    throw new Error('Erro na requisição.');
                }
                return response.json();
            })
            .then(data => {
                // Aqui você verifica se a resposta contém o token de acesso
                if (data.accessToken) {
                    console.log(data.accessToken);
                    auth = data.accessToken;
                    alert("Parabéns, o seu eden está vinculado com a extensão");
                } else {
                    throw new Error('Erro: Não foi possível obter o token de acesso.');
                }
            })
            .catch(error => alert('Erro, usuario invalido\n', error));
    }
});




// Função para buscar e adicionar o botão
function buscarEAdicionarBotao() {
    // Procura pelo elemento com a classe 'contact-actions'
    var contactActions = document.querySelector('.contact-actions');

    // Verifica se o elemento foi encontrado e se a função não foi executada anteriormente
    if (contactActions && !buscarEAdicionarBotao.executado) {
        // Cria um novo botão
        var newButton = document.createElement('span');

        // Adiciona os atributos ao elemento
        newButton.title = "MANDAR CHAMADO (EDEN)";
        newButton.className = "icone no-mobile i-finalizar";
        newButton.style = ""; // Adicione o estilo desejado, se necessário

        // Adiciona o conteúdo HTML ao elemento
        newButton.innerHTML = '<i class="tm-icon zmdi zmdi-plus"></i>';

        // Adiciona o novo botão à quinta lista (índice 4)
        contactActions.appendChild(newButton);

        newButton.addEventListener('click', mostrarModal);

        // Marca a função como executada
        buscarEAdicionarBotao.executado = true;
    }
}

// Espera até que a página esteja completamente carregada
window.addEventListener('load', function () {
    console.log("carregou");

    // Busca e adiciona o botão inicialmente
    buscarEAdicionarBotao();

    // Adiciona um ouvinte de evento de clique à página
    document.addEventListener('click', function () {
        // Tenta buscar e adicionar o botão novamente quando o usuário clicar em algo na página
        buscarEAdicionarBotao();
    });
});



function mostrarModal() {
    // Adiciona o conteúdo HTML fornecido à modal
    var modalHTML = `
    <div modal-render="true" tabindex="-1" role="dialog" class="modal fade ng-isolate-scope in" uib-modal-animation-class="fade" modal-in-class="in" ng-style="{'z-index': 1050 + index*10, display: 'block'}" uib-modal-window="modal-window" index="0" animate="animate" modal-animation="true" style="z-index: 1050; display: block;">
    <div class="modal-dialog" ng-class="size ? 'modal-' + size : ''"><div class="modal-content" uib-modal-transclude=""><div class="modal-header ng-scope">
    <h3 class="ng-binding">Lançar Chamado</h3>
</div>
<div class="modal-body ng-scope">
    <div class="row">
        <div class="col-sm-12">
            <div class="form-group fg-float m-b-30">
                <div class="fg-line fg-toggled">
                        <select class="form-control input-lg select-simples" style="">
                            <option>Whatsapp</option>
                            <option>Atendimento Telefonico</option>
                            <option>Atendimento Presencial</option>
                            <option>Atendimento Balcão</option>
                        </select>
                    <label class="fg-label ng-binding">Origem</label>
                </div>
            </div>
        </div>
        <div class="col-sm-12">
            <div class="form-group fg-float m-b-30">
                <div class="fg-line fg-toggled">
                        <select class="form-control input-lg select-simples" style="">
                            <option>Fechado</option>
                            <option>Aberto</option>
                            <option>Pendente</option>
                            <option>Aguardando Peça</option>
                        </select>
                    <label class="fg-label ng-binding">Status</label>
                </div>
            </div>
        </div>
    <div class="col-sm-12">
            <div class="form-group fg-float m-b-30">
                <div class="fg-line fg-toggled">
                        <select class="form-control input-lg select-simples" style="">
                            <option>Atualização</option>
                            <option>Infodrive</option>
                            <option>Lentidão</option>
                            <option>Oscilação</option>
                            <option>Certificado</option>
                            <option>Programa do Governo</option>
                            <option>VPN</option>
                            <option>Acesso Cloud/Web/Drive</option>
                            <option>Instalação</option>
                            <option>Acesso Suporte</option>
                            <option>Backup</option>
                            <option>Duvida</option>
                            <option>Erro Sistema</option>
                            <option>Impressora</option>
                            <option>Zabbix</option>
                            <option>Outros</option>
                        </select>
                    <label class="fg-label ng-binding">Tipo Atendimento</label>
                </div>
            </div>
        </div><div class="col-sm-12">
            <div class="form-group fg-float m-b-30">
                <div class="fg-line fg-toggled">
                        <select class="form-control input-lg select-simples clientes-eden" style="">
                            <option>Clientes</option>
                        </select>
                    <label class="fg-label ng-binding">Cliente</label>
                </div>
            </div>
        </div><div class="col-sm-12">
            <div class="form-group fg-float m-b-30">
                <div class="fg-line fg-toggled">
                    <select class="form-control input-lg select-simples ng-pristine ng-untouched ng-valid" ng-model="departamentoSelecionado.atendenteId">
                        <option value="0"></option>
                        <!-- ngRepeat: atendente in departamentoSelecionado.atendentes -->
                    </select>
                    <label class="fg-label ng-binding">Protocolo</label>
                </div>
            </div>
        </div><div class="col-sm-12">
            <div class="form-group fg-float m-b-30">
                <div class="fg-line fg-toggled">
                    <select class="form-control input-lg select-simples ng-pristine ng-untouched ng-valid" ng-model="departamentoSelecionado.atendenteId">
                        <option value="0"></option>
                        <!-- ngRepeat: atendente in departamentoSelecionado.atendentes -->
                    </select>
                    <label class="fg-label ng-binding">Observações</label>
                </div>
            </div>
        </div></div>
</div>
<div class="modal-footer ng-scope">    
    <button class="btn btn-link ng-binding waves-effect" ng-click="onModalCancelar()">Fechar</button>
    <button class="btn btn-link ng-binding waves-effect" ng-click="onModalInserir()">Enviar</button>
</div></div></div>
</div>
    `;

    var outra = `
    <div uib-modal-animation-class="fade" modal-in-class="in" ng-style="{'z-index': 1040 + (index &amp;&amp; 1 || 0) + index*10}" uib-modal-backdrop="modal-backdrop" modal-animation="true" class="fade modal-backdrop in" style="z-index: 1040;"></div>
    
    `;

    // Adiciona a modal ao corpo do documento
    document.body.insertAdjacentHTML('beforeend', modalHTML);
    document.body.insertAdjacentHTML('beforeend', outra);

    var closeButton = document.querySelector('.modal-footer .btn-link');
    if (closeButton) {
        closeButton.addEventListener('click', fecharModal);
    }

    carregarClientes()
}

function fecharModal() {
    // Remove a modal e o backdrop do corpo do documento
    var modal = document.querySelector('.modal');
    var backdrop = document.querySelector('.modal-backdrop');

    if (modal) {
        modal.parentElement.removeChild(modal);
    }

    if (backdrop) {
        backdrop.parentElement.removeChild(backdrop);
    }
}

// Função para carregar o JSON e adicionar opções ao <select>
function carregarClientes() {
    url = "https://portal.infowaycloud.com.br/api/clientes.php";
    fetch(url, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ auth: auth }),
    })
        .then(response => {
            if (!response.ok) {
                throw new Error('Erro na requisição.');
            }
            return response.json();
        })
        .then(data => {
            // Verifica se a resposta contém a propriedade 'razoesSociais'
            if (data.razoesSociais) {
                console.log(data.razoesSociais);
                adicionarOpcoes(data.razoesSociais);
            } else {
                throw new Error('Erro: Não foi possível obter a lista de razões sociais.');
            }
        })
        .catch(error => alert('Erro, usuário inválido\n' + error));
}

// Função para adicionar as opções ao <select>
function adicionarOpcoes(razoesSociais) {
    var selectClientes = document.querySelector('.clientes-eden');

    // Limpa opções existentes, se houver
    selectClientes.innerHTML = '';

    // Adiciona a opção padrão
    var optionPadrao = document.createElement('option');
    optionPadrao.textContent = 'Clientes';
    selectClientes.appendChild(optionPadrao);

    // Adiciona as opções do array de razões sociais
    razoesSociais.forEach(function (razaoSocial) {
        var option = document.createElement('option');
        option.textContent = razaoSocial;
        selectClientes.appendChild(option);
    });
}




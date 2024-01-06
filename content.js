chrome.storage.local.get(['usuario', 'senha'], function(result) {
    var usuario = result.usuario;
    var senha = result.senha;
  
    // Faça algo com as informações recuperadas
    console.log('Usuário:', usuario);
    console.log('Senha:', senha);
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
    adicionarOpcoes(clientes);
    console.log(clientes);
}

// Função para adicionar as opções ao <select>
function adicionarOpcoes(clientes) {
    var selectClientes = document.querySelector('.clientes-eden');

    // Limpa opções existentes, se houver
    selectClientes.innerHTML = '';

    // Adiciona a opção padrão
    var optionPadrao = document.createElement('option');
    optionPadrao.textContent = 'Clientes';
    selectClientes.appendChild(optionPadrao);

    // Adiciona as opções do JSON
    clientes.forEach(function (cliente) {
        var option = document.createElement('option');
        option.textContent = cliente.razaoSocial;
        selectClientes.appendChild(option);
    });
}





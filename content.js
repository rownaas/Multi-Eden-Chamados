var auth;
var id_user;
var name_user;
var login_user;
var log = false;
var logado = false;

chrome.storage.local.get(['usuario', 'senha', 'naoMostrar'], function (result) {
    var usuario = result.usuario;
    var senha = result.senha;

    // Verificar se usuário e senha são nulos ou indefinidos
    if (usuario === null || senha === null || typeof usuario === 'undefined' || typeof senha === 'undefined') {
        // Exibir mensagem pedindo para configurar usuário e senha
        modalErro();
        chrome.runtime.sendMessage({ openPopup: true });
    } else {
        // Usuário e senha estão presentes, faça algo com as informações recuperadas
        if (log) {
            console.log('Usuário:', usuario);
            console.log('Senha:', senha);
        }

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
                    auth = data.accessToken;
                    name_user = data["data-user"]["userData"]["fullName"];
                    login_user = data["data-user"]["userData"]["userName"];
                    id_user = data["data-user"]["userData"]["userId"];

                    logado = true;

                    if (!result.naoMostrar) {
                        modalBenvindo()
                    }

                    //Configurações visuais
                    var elementoImg = document.evaluate('/html/body/data/section/aside/div/div[1]/img', document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
                    if (elementoImg) {
                        elementoImg.setAttribute('src', 'https://infowayti.com.br/assets/images/infowayico.ico');
                    } else {
                        console.error('Elemento não encontrado com o XPath fornecido.');
                    }

                    var elementoImg = document.evaluate('/html/body/data/section/section/div/div[2]/div[3]/div/img', document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
                    if (elementoImg) {
                        elementoImg.setAttribute('src', 'https://infowayti.com.br/assets/images/testimonial/logo.png');
                    } else {
                        console.error('Elemento não encontrado com o XPath fornecido.');
                    }

                    var elementoHeader = document.evaluate('/html/body/data/header', document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
                    if (elementoHeader) {
                        elementoHeader.style.backgroundColor = 'rgb(255, 118, 0)';
                    } else {
                        console.error('Elemento não encontrado com o XPath fornecido.');
                    }

                    var elementoHeader = document.evaluate('/html/body/data/div/div/div[1]', document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
                    if (elementoHeader) {
                        elementoHeader.style.backgroundColor = 'rgb(255, 118, 0)';
                    } else {
                        console.error('Elemento não encontrado com o XPath fornecido.');
                    }

                    var elementoHeader = document.evaluate('/html/body/data/header/div/div[1]/div[2]/a', document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
                    if (elementoHeader) {
                        elementoHeader.textContent = 'INFOWAY - CANAL DE SUPORTE';
                    } else {
                        console.error('Elemento não encontrado com o XPath fornecido.');
                    }
                } else {
                    throw new Error('Erro: Não foi possível obter o token de acesso.');
                }
            })
            .catch(error => {
                modalErro();
            });
    }
});




// Espera até que a página esteja completamente carregada
window.addEventListener('load', function () {
    console.log(".");
    // Busca e adiciona o botão inicialmente
    buscarEAdicionarBotao();

    // Adiciona um ouvinte de evento de clique à página
    document.addEventListener('click', function () {
        // Tenta buscar e adicionar o botão novamente quando o usuário clicar em algo na página
        buscarEAdicionarBotao();
    });
});


// Função para buscar e adicionar o botão
function buscarEAdicionarBotao() {
    // Procura pelo elemento com a classe 'contact-actions'
    var contactActions = document.querySelector('.contact-actions');

    // Verifica se o elemento foi encontrado e se a função não foi executada anteriormente
    if (contactActions && !buscarEAdicionarBotao.executado) {

        var lancarChamado = document.createElement('span');
        lancarChamado.title = "MANDAR CHAMADO (EDEN)";
        lancarChamado.className = "icone no-mobile i-finalizar";
        lancarChamado.style = "";
        lancarChamado.innerHTML = '<i class="tm-icon zmdi zmdi-plus"></i>';
        contactActions.appendChild(lancarChamado);
        lancarChamado.addEventListener('click', mostrarModal);

        var zabbixModalBtn = document.createElement('span');
        zabbixModalBtn.title = "VERIFICAR ZABBIX PELA PORTA";
        zabbixModalBtn.className = "icone no-mobile i-finalizar";
        zabbixModalBtn.style = "";
        zabbixModalBtn.innerHTML = '<i class="zmdi zmdi-memory"></i>';
        contactActions.appendChild(zabbixModalBtn);
        zabbixModalBtn.addEventListener('click', zabbixModal);

        // Marca a função como executada
        buscarEAdicionarBotao.executado = true;
    }
}


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
                            <select class="form-control input-lg select-simples" id="origem" style="">
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
                            <select class="form-control input-lg select-simples" id="status" style="">
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
                            <select class="form-control input-lg select-simples" id="tipoAtendimento" style="">
                                <option>Atualizacao</option>
                                <option>Infodrive</option>
                                <option>Lentidao</option>
                                <option>Oscilacao</option>
                                <option>Certificado</option>
                                <option>ProgramaDeGoverno</option>
                                <option>Vpn</option>
                                <option>AcessoCloud</option>
                                <option>Instalacao</option>
                                <option>AcessoSuporte</option>
                                <option>Backup</option>
                                <option>Duvida</option>
                                <option>ErroSistema</option>
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
                            <select class="form-control input-lg select-simples clientes-eden" id="cliente" style="">
                                <option id="clientePadrao">Clientes</option>
                            </select>
                        <label class="fg-label ng-binding">Cliente</label>
                    </div>
                </div>
            </div><div class="col-sm-12">
                <div class="form-group fg-float m-b-30">
                    <div class="fg-line fg-toggled">
                        <select class="form-control input-lg select-simples protocolo-chamado" id="protocolo">
                            <option value="0"></option>
                        </select>
                        <label class="fg-label ng-binding">Protocolo</label>
                    </div>
                </div>
            </div><div class="col-sm-12">
                <div class="form-group fg-float m-b-30">
                    <div class="form-group fg-float ng-scope" ng-if="campo.tipoDado == 'TEXTO'">
                        <div class="fg-line ng-scope" ng-if="!campo.alternativas &amp;&amp; !campo.integracaoLista">
                            <div class="fg-line fg-toggled">
                                <input type="text" class="form-control fg-input input-lg" id="observacao" style="">
                                <label class="fg-label ng-binding">Observação</label>
                            </div>
                        </div>
                    </div>
                </div>
            </div></div>
    </div>
    <div class="modal-footer ng-scope">
        <button class="btn btn-link ng-binding waves-effect" id="baixarPDFBtn">Baixar TXT (Em Testes)</button>
        <button class="btn btn-link ng-binding waves-effect" id="fecharModal" ng-click="onModalCancelar()">Fechar</button>
        <button class="btn btn-link ng-binding waves-effect" id="lancarModal" ng-click="onModalInserir()">Enviar</button>
    </div></div></div>
    </div>
        `;

    var outra = `
        <div uib-modal-animation-class="fade" modal-in-class="in" ng-style="{'z-index': 1040 + (index &amp;&amp; 1 || 0) + index*10}" uib-modal-backdrop="modal-backdrop" modal-animation="true" class="fade modal-backdrop in" style="z-index: 1040;"></div>
        
        `;

    // Adiciona a modal ao corpo do documento
    document.body.insertAdjacentHTML('beforeend', modalHTML);
    document.body.insertAdjacentHTML('beforeend', outra);

    var closeButton = document.querySelector('#fecharModal');
    if (closeButton) {
        closeButton.addEventListener('click', fecharModal);
    }

    var lancarButton = document.querySelector('#lancarModal');
    if (lancarButton) {
        lancarButton.addEventListener('click', lancarModal);
    }

    var baixarPDFBtn = document.querySelector('#baixarPDFBtn');
    if (baixarPDFBtn) {
        baixarPDFBtn.addEventListener('click', baixarPDF);
    }
    carregarClientes();

    const xpath = "/html/body/data/section/section/div/div[2]/div[5]/div[2]/div[3]/div/div[2]/div[1]";
    const xpathResult = document.evaluate(xpath, document, null, XPathResult.STRING_TYPE, null);
    const Protocolo = xpathResult.stringValue;
    protocoloModal(Protocolo);
}

function baixarPDF() {
    var mensagens = document.querySelectorAll('.content-center');
    var primeiroItemOuterText = mensagens[0].outerText;
    console.log(primeiroItemOuterText);

    const blob = new Blob([primeiroItemOuterText], { type: 'text/plain' });
    const urlBlob = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = urlBlob;
    link.download = "chat.txt";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}

function fecharModal() {
    var modal = document.querySelector('.modal');
    var backdrop = document.querySelector('.modal-backdrop');

    if (modal) {
        modal.parentElement.removeChild(modal);
    }

    if (backdrop) {
        backdrop.parentElement.removeChild(backdrop);
    }
}

function fecharAlerta() {
    var modal = document.getElementById('modal');
    modal.parentNode.removeChild(modal);
    var overlay = document.getElementById('modal-backdrop');
    overlay.parentNode.removeChild(overlay);
}


function naoMostrar() {
    var modal = document.getElementById('modal');
    modal.parentNode.removeChild(modal);
    var overlay = document.getElementById('modal-backdrop');
    overlay.parentNode.removeChild(overlay);

    chrome.storage.local.set({ 'naoMostrar': true }, function () {

    });
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
            // Verifica se a resposta contém a propriedade 'informacoes'
            if (data.informacoes) {
                if (log) {
                    console.log('Informações dos clientes:');
                    console.table(data.informacoes);
                }
                adicionarOpcoes(data.informacoes);
            } else {
                throw new Error('Erro: Não foi possível obter a lista de razões sociais.');
            }
        })
        .catch(error => alert('Erro, usuário inválido\n' + error));
}

// Função para adicionar as opções ao <select>
function adicionarOpcoes(razoesSociais) {
    var selectClientes = document.querySelector('.clientes-eden');
    var cnpjCliente = retornarCnpj();

    // Limpa opções existentes, se houver
    selectClientes.innerHTML = '';

    // Adiciona a opção padrão
    var optionPadrao = document.createElement('option');
    optionPadrao.textContent = 'Clientes';
    selectClientes.appendChild(optionPadrao);

    // Adiciona as opções do array de razões sociais
    razoesSociais.forEach(function (razaoSocial) {
        var option = document.createElement('option');
        option.textContent = razaoSocial.razaoSocial;

        option.setAttribute('id', razaoSocial.id);

        // Verifica se contatos existe e não é null
        if (razaoSocial.contatos && razaoSocial.contatos.length > 0) {
            option.setAttribute('nome', razaoSocial.contatos[0].nome);
            option.setAttribute('telefone', razaoSocial.contatos[0].telefone);
            option.setAttribute('cnpj', razaoSocial.cnpj);
        }

        selectClientes.appendChild(option);
    });

    // Define o valor do primeiro option com base no cnpjCliente
    if (cnpjCliente) {
        var primeiroOption = selectClientes.querySelector('option[cnpj="' + cnpjCliente + '"]');
        if (primeiroOption) {
            selectClientes.value = primeiroOption.value;
        }
    }
}




function protocoloModal(protocolo) {
    var selectClientes = document.querySelector('.protocolo-chamado');

    // Limpa opções existentes, se houver
    selectClientes.innerHTML = '';

    // Adiciona a opção padrão
    var optionPadrao = document.createElement('option');
    optionPadrao.textContent = protocolo;
    selectClientes.appendChild(optionPadrao);
}


function lancarModal() {
    var origem = document.querySelector('#origem').value;
    var status = document.querySelector('#status').value;
    var tipoAtendimento = document.querySelector('#tipoAtendimento').value;
    var cliente = document.querySelector('#cliente').value;
    var protocolo = document.querySelector('#protocolo').value;
    var observacao = document.querySelector('#observacao').value;
    var clienteSelect = document.querySelector('#cliente');
    var selectedOption = clienteSelect.options[clienteSelect.selectedIndex];
    var telefone = selectedOption.getAttribute('telefone');
    var nome = selectedOption.getAttribute('nome');
    var id = selectedOption.id;
    let dataAtual = new Date();
    let dia = dataAtual.getDate();
    let mes = dataAtual.getMonth() + 1;
    let ano = dataAtual.getFullYear();
    let dataCadastro = `${dia.toString().padStart(2, '0')}/${mes.toString().padStart(2, '0')}/${ano}`;
    let dataFechamento = dataCadastro;

    //Mensagens

    if (log) {
        console.log(origem);
        console.log(status);
        console.log(tipoAtendimento);
        console.log(cliente);
        console.log(protocolo);
        console.log(observacao);
        console.log(nome);
        console.log(telefone);
        console.log(id);
        console.log(dataCadastro);
        console.log(dataFechamento);
    }

    var json_de_novo_chamado = {
        "id": 0,
        "origem": origem,
        "status": status,
        "dataCadastro": dataCadastro,
        "dataFechamento": dataFechamento,
        "contato": nome,
        "fone": telefone,
        "protocolo": protocolo,
        "observacao": observacao,
        "documento": "",
        "nomeDocumento": "chat.txt",
        "tecnicoResponsavel": {
            "id": id_user,
            "nome": name_user,
            "login": login_user
        },
        "venda": {
            "produtos": [],
            "servico": "",
            "quantidadeServico": 0,
            "valorTotalServico": "R$ 0,00",
            "descontoServico": "0,00 %",
            "tecnicoServico": "",
            "observacaoServico": ""
        },
        "tipoAtendimento": tipoAtendimento,
        "cliente": {
            "razaoSocial": cliente,
            "id": id
        }
    };

    var jsonString = JSON.stringify(json_de_novo_chamado);

    var myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");

    var raw = JSON.stringify({
        "auth": auth,
        "json": jsonString
    });

    var requestOptions = {
        method: 'POST',
        headers: myHeaders,
        body: raw,
        redirect: 'follow'
    };

    fetch("https://portal.infowaycloud.com.br/api/chamado.php", requestOptions)
        .then(response => response.text())
        .then(result => modalChamado(result), fecharModal())
        .catch(error => alert('error', error));
}



//ZABBIX

function zabbixModal() {
    // Adiciona o conteúdo HTML fornecido à modal
    var modalHTML = `
        <div modal-render="true" tabindex="-1" role="dialog" class="modal fade ng-isolate-scope in" uib-modal-animation-class="fade" modal-in-class="in" ng-style="{'z-index': 1050 + index*10, display: 'block'}" uib-modal-window="modal-window" size="lg" index="0" animate="animate" modal-animation="true" style="z-index: 1050; display: block;">
            <div class="modal-dialog modal-lg" ng-class="size ? 'modal-' + size : ''" style="width: 1601px; height: 1000px;">
                <div class="modal-content" uib-modal-transclude="">
                    <div class="modal-header ng-scope">
                        <h3 class="ng-binding">Zabbix (Em preparação)</h3>
                    </div>
                    <div class="modal-body ng-scope" id="zabbix" style="max-height: 750px; overflow-y: auto;">

                    </div>
                    <div class="modal-footer ng-scope">
                        <button class="btn btn-link ng-binding waves-effect" id="usuariosZabbix">Usuarios</button>
                        <button class="btn btn-link ng-binding waves-effect" id="testeGrafico">Graficos</button>
                        <button class="btn btn-link ng-binding waves-effect" id="fecharModal">Fechar</button>
                    </div>
                </div>
            </div>
        </div>
        `;

    var outra = `
        <div uib-modal-animation-class="fade" modal-in-class="in" ng-style="{'z-index': 1040 + (index &amp;&amp; 1 || 0) + index*10}" uib-modal-backdrop="modal-backdrop" modal-animation="true" class="fade modal-backdrop in" style="z-index: 1040;"></div>
        `;

    // Adiciona o modal ao corpo do documento
    document.body.insertAdjacentHTML('beforeend', modalHTML);
    document.body.insertAdjacentHTML('beforeend', outra);

    var closeButton = document.querySelector('#fecharModal');
    if (closeButton) {
        closeButton.addEventListener('click', fecharModal);
    }

    var testeGraficocloseButton = document.querySelector('#testeGrafico');
    if (testeGraficocloseButton) {
        testeGraficocloseButton.addEventListener('click', testeGrafico);
    }

    var usuariosZabbixBtn = document.querySelector('#usuariosZabbix');
    if (usuariosZabbixBtn) {
        usuariosZabbixBtn.addEventListener('click', usuariosZabbix);
    }
}

function carregarSpinner() {
    var img = document.createElement("img");
    img.src = 'https://i.gifer.com/origin/34/34338d26023e5515f6cc8969aa027bca.gif';
    img.id = 'spinner';
    img.width = 250;
    img.height = 250;
    img.style.margin = 'auto';
    document.getElementById("zabbix").appendChild(img);
}

function retirarSpinner() {
    var elementoImg = document.getElementById('spinner');
    if (elementoImg) {
        elementoImg.remove();
    }
}

function removerConteudo() {
    var divContainer = document.getElementById('zabbix');
    if (divContainer) {
        divContainer.innerHTML = '';
    }
}

function retornarPorta() {
    var xpath = "/html/body/data/section/section/div/div[2]/div[5]/div[2]/div[3]/uib-accordion/div/div[2]/div[2]/div/div/form/div[4]/div/div/div/input";
    var resultado = document.evaluate(xpath, document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null);
    var valorElemento = resultado.singleNodeValue.value;
    return valorElemento;
}

function retornarCnpj(){
    var xpath = "/html/body/data/section/section/div/div[2]/div[5]/div[2]/div[3]/uib-accordion/div/div[2]/div[2]/div/div/form/div[2]/div/div/div/input";
    var resultado = document.evaluate(xpath, document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null);
    var valorElemento = resultado.singleNodeValue.value;
    return valorElemento;
}

function testeGrafico() {
    removerConteudo()
    carregarSpinner()
    var portaZabbix = retornarPorta();
    console.log(portaZabbix);

    var myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/x-www-form-urlencoded");

    var urlencoded = new URLSearchParams();
    urlencoded.append("porta", portaZabbix);

    var requestOptions = {
        method: 'POST',
        headers: myHeaders,
        body: urlencoded,
        redirect: 'follow'
    };

    fetch("https://portal.infowaycloud.com.br/api/graph_zabbix.php", requestOptions)
        .then(response => response.json())
        .then(result => {
            retirarSpinner();
            result.forEach(graph => {
                var img = document.createElement("img");
                img.src = 'data:image/png;base64,' + graph.imageData;
                img.width = 1500;
                img.height = 500;
                document.getElementById("zabbix").appendChild(img);
            });
        })
        .catch(error => console.log('error', error));
}

function usuariosZabbix() {
    removerConteudo()
    carregarSpinner()
    var portaZabbix = retornarPorta();

    var myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/x-www-form-urlencoded");

    var urlencoded = new URLSearchParams();
    urlencoded.append("porta", portaZabbix);

    console.log(portaZabbix);

    var requestOptions = {
        method: 'POST',
        headers: myHeaders,
        body: urlencoded,
        redirect: 'follow'
    };

    fetch("https://portal.infowaycloud.com.br/api/host_usuarios.php", requestOptions)
        .then(response => response.json())
        .then(result => {
            retirarSpinner();
            console.log(result[0].result[0].lastvalue)
            var a = document.createElement("h2");
            a.textContent = result[0].result[0].lastvalue;
            document.getElementById("zabbix").appendChild(a);
        })
        .catch(error => console.log('error', error));
}


//Modal de alerta

function modalBenvindo() {
    var modalHTML = `
        <div class="sweet-alert showSweetAlert visible" id="modal" bis_skin_checked="1" data-has-cancel-button="false" data-has-confirm-button="true" data-allow-ouside-click="false" data-has-done-function="false" data-timer="null" style="display: block; margin-top: -150px;">
    <div class="icon error animateErrorIcon" bis_skin_checked="1" style="display: none;"><span class="x-mark animateXMark"><span class="line left"></span><span class="line right"></span></span></div>
    <div class="icon warning" bis_skin_checked="1" style="display: none;"> <span class="body"></span> <span class="dot"></span> </div>
    <div class="icon info" bis_skin_checked="1" style="display: none;"></div>
    <div class="icon success" bis_skin_checked="1" style="display: block;">
        <span class="line tip"></span> <span class="line long"></span> 
        <div class="placeholder" bis_skin_checked="1"></div>
        <div class="fix" bis_skin_checked="1"></div>
    </div>
    <div class="icon custom" bis_skin_checked="1" style="display: none;"></div>
    <h2>Ebaaa!</h2>
    <p class="lead text-muted swall-text" style="display: block;">A extensão da infoway está em funcionamento, parabens! Aproveite a extensão, caso tenha alguma ideia entre em contato (luizmarroni)</p>
    <p class="swall-details-container" style="display: none;"><a class="swall-details-button">Detalhes</a><span class="swall-details m-t-5"></span></p>
    <p><button class="btn btn-lg btn-default" id="naomostrar" style="display: inline-block;">Não mostrar novamente</button> <button class="confirm btn btn-lg btn-primary" id="fecharModal" style="display: inline-block;">OK</button></p>
    </div>
    `;

    var outra = `
        <div class="sweet-overlay" id="modal-backdrop" bis_skin_checked="1" style="opacity: 1.07; display: block;"></div>
        `;

    // Adiciona o modal ao corpo do documento
    document.body.insertAdjacentHTML('beforeend', modalHTML);
    document.body.insertAdjacentHTML('beforeend', outra);

    var closeButton = document.querySelector('#fecharModal');
    if (closeButton) {
        closeButton.addEventListener('click', fecharAlerta);
    }

    var closeButton = document.querySelector('#naomostrar');
    if (closeButton) {
        closeButton.addEventListener('click', naoMostrar);
    }
}

function modalErro() {
    var modalHTML = `
        <div class="sweet-alert showSweetAlert visible" id="modal" bis_skin_checked="1" data-has-cancel-button="false" data-has-confirm-button="true" data-allow-ouside-click="false" data-has-done-function="false" data-timer="null" style="display: block; margin-top: -150px;">
    <div class="icon error animateErrorIcon" bis_skin_checked="1" style="display: block;"><span class="x-mark animateXMark"><span class="line left"></span><span class="line right"></span></span></div>
    <div class="icon warning" bis_skin_checked="1" style="display: none;"> <span class="body"></span> <span class="dot"></span> </div>
    <div class="icon info" bis_skin_checked="1" style="display: none;"></div>
    <div class="icon success" bis_skin_checked="1" style="display: none;">
        <span class="line tip"></span> <span class="line long"></span> 
        <div class="placeholder" bis_skin_checked="1"></div>
        <div class="fix" bis_skin_checked="1"></div>
    </div>
    <div class="icon custom" bis_skin_checked="1" style="display: none;"></div>
    <h2>Erro :(</h2>
    <p class="lead text-muted swall-text" style="display: block;">Erro, verifique suas credenciais e a conexão ao eden, qualquer duvida entre em contato (luizmarroni)</p>
    <p class="swall-details-container" style="display: none;"><a class="swall-details-button">Detalhes</a><span class="swall-details m-t-5"></span></p>
    <p><button class="btn btn-lg btn-default" id="fecharModal" style="display: inline-block;">Entrar mesmo assim</button></p>
    </div>
    `;

    var outra = `
        <div class="sweet-overlay" id="modal-backdrop" bis_skin_checked="1" style="opacity: 1.07; display: block;"></div>
        `;

    // Adiciona o modal ao corpo do documento
    document.body.insertAdjacentHTML('beforeend', modalHTML);
    document.body.insertAdjacentHTML('beforeend', outra);

    var closeButton = document.querySelector('#fecharModal');
    if (closeButton) {
        closeButton.addEventListener('click', fecharAlerta);
    }
}

function modalChamado(err) {
    var modalHTML = `
        <div class="sweet-alert showSweetAlert visible" id="modal" bis_skin_checked="1" data-has-cancel-button="false" data-has-confirm-button="true" data-allow-ouside-click="false" data-has-done-function="false" data-timer="null" style="display: block; margin-top: -150px;">
    <div class="icon error animateErrorIcon" bis_skin_checked="1" style="display: none;"><span class="x-mark animateXMark"><span class="line left"></span><span class="line right"></span></span></div>
    <div class="icon warning" bis_skin_checked="1" style="display: none;"> <span class="body"></span> <span class="dot"></span> </div>
    <div class="icon info" bis_skin_checked="1" style="display: none;"></div>
    <div class="icon success" bis_skin_checked="1" style="display: block;">
        <span class="line tip"></span> <span class="line long"></span> 
        <div class="placeholder" bis_skin_checked="1"></div>
        <div class="fix" bis_skin_checked="1"></div>
    </div>
    <div class="icon custom" bis_skin_checked="1" style="display: none;"></div>
    <h2>Tudo certinho!</h2>
    <p class="lead text-muted swall-text" style="display: block;">`+ err +`</p>
    <p class="swall-details-container" style="display: none;"><a class="swall-details-button">Detalhes</a><span class="swall-details m-t-5"></span></p>
    <p><button class="confirm btn btn-lg btn-primary" id="fecharChamado" style="display: inline-block;">fechar e finalizar chamado</button> <button class="confirm btn btn-lg btn-primary" id="fecharModal" style="display: inline-block;">fechar</button></p>
    </div>
    `;

    var outra = `
        <div class="sweet-overlay" id="modal-backdrop" bis_skin_checked="1" style="opacity: 1.07; display: block;"></div>
        `;

    // Adiciona o modal ao corpo do documento
    document.body.insertAdjacentHTML('beforeend', modalHTML);
    document.body.insertAdjacentHTML('beforeend', outra);

    var closeButton = document.querySelector('#fecharModal');
    if (closeButton) {
        closeButton.addEventListener('click', fecharAlerta);
    }

    var closeButton = document.querySelector('#naomostrar');
    if (closeButton) {
        closeButton.addEventListener('click', naoMostrar);
    }

    var closeButton = document.querySelector('#fecharChamado');
    if (closeButton) {
        closeButton.addEventListener('click', fecharChamado);
    }
}


function fecharChamado(){
    const botao = document.evaluate("/html/body/data/section/section/div/div[2]/div[5]/div[1]/div[1]/div[2]/span[4]", document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
    botao.click();
    fecharAlerta();
}


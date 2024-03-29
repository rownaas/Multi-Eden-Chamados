var auth;
var auth_multi;
var id_user;
var name_user;
var login_user;
var log = false;
var logado = false;
var usuario_multi;
var senha_multi;


function startup() {
    chrome.storage.local.get(['usuario', 'senha', 'naoMostrar', 'usuario_multi', 'senha_multi'], function (result) {
        var usuario = result.usuario;
        var senha = result.senha;
        usuario_multi = result.usuario_multi;
        senha_multi = result.senha_multi;

        // Verificar se usuário e senha são nulos ou indefinidos
        if (usuario === null || senha === null || usuario_multi === null || senha_multi === null || typeof usuario === 'undefined' || typeof senha === 'undefined' || typeof usuario_multi === 'undefined' || typeof senha_multi === 'undefined') {
            modalErro("Por favor, condigure as suas credenciais para utilizar a extensão");
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

                        var myHeaders = new Headers();
                        myHeaders.append("Content-Type", "application/x-www-form-urlencoded");

                        var urlencoded = new URLSearchParams();
                        urlencoded.append("login", usuario_multi);
                        urlencoded.append("senha", senha_multi);

                        var requestOptions = {
                            method: 'POST',
                            headers: myHeaders,
                            body: urlencoded,
                            redirect: 'follow'
                        };

                        fetch("https://portal.infowaycloud.com.br/api/auth_multi.php", requestOptions)
                            .then(response => {
                                if (response.status == 200) {
                                } else {
                                    modalErro("Suas credenciais da MULTI360 estão incorretas, por favor verifique novamente ou ignore.");
                                }
                            })
                            .then(result => console.log(result))
                            .catch(error => console.log('error', error));
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

                        var elementoHeader = document.evaluate('/html/body/data/section/aside/div/div[2]/div/div[2]/div/a', document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
                        if (elementoHeader) {
                            elementoHeader.style.setProperty('background-color', 'rgb(255, 118, 0)', 'important');
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
                    modalErro("Erro na requisição, verifique se o eden está disponivel na sua rede");
                });
        }
    });
}

function inicializarSite() {
    console.log(".");
    buscarEAdicionarBotao();
    startup();
    document.addEventListener('click', function () {
        buscarEAdicionarBotao();
    });
}

window.addEventListener('load', inicializarSite);
window.addEventListener('popstate', inicializarSite);



function buscarEAdicionarBotao() {
    var contactActions = document.querySelector('.contact-actions');
    if (!contactActions) {
        return;
    }

    if (contactActions.querySelector('#mandarChamado') &&
        contactActions.querySelector('#zabbixBtn') &&
        contactActions.querySelector('#syncinfo')) {
        return;
    }
    var lancarChamado = criarBotao('mandarChamado', 'MANDAR CHAMADO (EDEN)', 'zmdi zmdi-plus', mostrarModal);
    contactActions.appendChild(lancarChamado);

    var zabbixModalBtn = criarBotao('zabbixBtn', 'VERIFICAR ZABBIX PELA PORTA', 'zmdi zmdi-memory', zabbixModal);
    contactActions.appendChild(zabbixModalBtn);

    var syncInfoBtn = criarBotao('syncinfo', 'SINCRONIZAR INFORMAÇÕES', 'zmdi zmdi-refresh-sync', syncInfo);
    contactActions.appendChild(syncInfoBtn);
}

function criarBotao(id, title, iconClass, clickHandler) {
    var botao = document.createElement('span');
    botao.id = id;
    botao.title = title;
    botao.className = 'icone no-mobile i-finalizar';
    botao.style = '';
    botao.innerHTML = '<i class="' + iconClass + '"></i>';
    botao.addEventListener('click', clickHandler);
    return botao;
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
                                <option id=8>Acesso Cloud/Web/Drive</option>
                                <option id=10>Acesso Suporte</option>
                                <option id=1>Atualização</option>
                                <option id=11>Backup</option>
                                <option id=5>Certificado</option>
                                <option id=12>Dúvida</option>
                                <option id=13>Erro sistema</option>
                                <option id=17>Gerenciador Infoway</option>
                                <option id=14>Impressora</option>
                                <option id=2>Infodrive</option>
                                <option id=9>Instalação</option>
                                <option id=3>Lentidão</option>
                                <option id=4>Oscilação</option>
                                <option id=16>Outros</option>
                                <option id=6>Programa de Governo</option>
                                <option id=7>VPN</option>
                                <option id=15>Zabbix</option>
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
    carregarClientes();

    const xpath = "/html/body/data/section/section/div/div[2]/div[5]/div[2]/div[3]/div/div[2]/div[1]";
    const xpathResult = document.evaluate(xpath, document, null, XPathResult.STRING_TYPE, null);
    const Protocolo = xpathResult.stringValue;
    protocoloModal(Protocolo);
}

function retornarProtocolo() {
    const xpath = "/html/body/data/section/section/div/div[2]/div[5]/div[2]/div[3]/div/div[2]/div[1]";
    const xpathResult = document.evaluate(xpath, document, null, XPathResult.STRING_TYPE, null);
    const Protocolo = xpathResult.stringValue;
    return Protocolo
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
        .catch(error => modalErro("Não foi possivel carregar os clientes"));
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

    // Ordena as razões sociais em ordem alfabética
    razoesSociais.sort(function (a, b) {
        return a.razaoSocial.localeCompare(b.razaoSocial);
    });

    // Adiciona as opções ordenadas do array de razões sociais
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
    chrome.storage.local.get(['usuario_multi', 'senha_multi'], function (result) {
        var dialogo;
        var origem = document.querySelector('#origem').value;
        var status = document.querySelector('#status').value;
        var tipoAtendimento = document.querySelector('#tipoAtendimento');
        var tipoAtendimentoId = tipoAtendimento.options[tipoAtendimento.selectedIndex].id;
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


        var myHeaders = new Headers();
        myHeaders.append("Content-Type", "application/x-www-form-urlencoded");

        var urlencoded = new URLSearchParams();
        urlencoded.append("protocolo", protocolo);
        urlencoded.append("usuario", result.usuario_multi);
        urlencoded.append("senha", result.senha_multi);

        var requestOptions = {
            method: 'POST',
            headers: myHeaders,
            body: urlencoded,
            redirect: 'follow'
        };

        fetch("https://portal.infowaycloud.com.br/api/funcoes/historicoMensagens.php", requestOptions)
            .then(response => response.text())
            .then(result => {
                console.log(result), dialogo = result
                if (log) {
                    console.log(origem);
                    console.log(status);
                    console.log(tipoAtendimento);
                    console.log(cliente);
                    console.log(protocolo);
                    console.log(observacao);
                    console.log(dialogo);
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
                    "dialogo": dialogo,
                    "documento": "",
                    "nomeDocumento": "",
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
                    "tipoAtendimento": {
                        "nome": tipoAtendimento.value,
                        "id": tipoAtendimentoId,
                        "dataCadastro": "01/01/0001 00:00:00",
                        "dataAlteracao": "01/01/0001 00:00:00"
                    },
                    "cliente": {
                        "razaoSocial": cliente,
                        "id": id
                    }
                };

                var jsonString = JSON.stringify(json_de_novo_chamado);

                console.log(json_de_novo_chamado);

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
            })
            .catch(error => console.log('error', error));
    });
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
                        <button class="btn btn-link ng-binding waves-effect" id="recursos">Recursos</button>
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

    var recursosBtn = document.querySelector('#recursos');
    if (recursosBtn) {
        recursosBtn.addEventListener('click', recursosZabbix);
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
    var xpath = "/html/body/data/section/section/div/div[2]/div[5]/div[2]/div[3]/uib-accordion/div/div[2]/div[2]/div/div/form/div[6]/div/div/div/input";
    var resultado = document.evaluate(xpath, document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null);
    var valorElemento = resultado.singleNodeValue.value;
    return valorElemento;
}

function retornarCnpj() {
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
                var data = graph.imageData;
                var img = document.createElement("img");
                img.src = 'data:image/png;base64,' + data;
                img.width = 1500;
                img.height = 500;
                document.getElementById("zabbix").appendChild(img);
            });
        })
        .catch(error => console.log('error', error));
}

function recursosZabbix() {
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

    fetch("https://portal.infowaycloud.com.br/api/funcoes/recursosPorta.php", requestOptions)
        .then(response => response.json())
        .then(result => {
            console.log(result)
            retirarSpinner();

            miniCartao('NOME', result.nome)
            miniCartao('RAM', result.ram, true, 'Utilização: ', result.consumoRam)
            miniCartao('DISCO', result.free + 'GB Livres/' + result.total + 'GB Totais')
            miniCartao('VCPU', result.vcpu, true, 'Consumo atual: ', result.consumoCpu)
            miniCartao('CLOUD', result.cloud)
            miniCartao('TEMPO LIGADO', result.tempo)
            miniCartao('USUARIOS', result.usuarios, true, 'Ativos: ', result.usuarios_ativos)
        })
        .catch(error => console.log('error', error));
}

function syncInfo() {
    chrome.storage.local.get(['usuario_multi', 'senha_multi'], function (result) {
        var porta = retornarPorta();
        var protocolo = retornarProtocolo();
        var usuario_multi = result.usuario_multi;
        var senha_multi = result.senha_multi;
        var myHeaders = new Headers();
        myHeaders.append("Content-Type", "application/x-www-form-urlencoded");
        var urlencoded = new URLSearchParams();
        urlencoded.append("login", usuario_multi);
        urlencoded.append("senha", senha_multi);
        urlencoded.append("porta", porta);
        urlencoded.append("protocolo", protocolo);
        console.log(usuario_multi)
        console.log(senha_multi)
        console.log(porta)
        console.log(protocolo)
        var requestOptions = {
            method: 'POST',
            headers: myHeaders,
            body: urlencoded,
            redirect: 'follow'
        };
        fetch("https://portal.infowaycloud.com.br/api/sync_zabbix.php", requestOptions)
            .then(response => response.json())
            .then(result => {
                if (result) {
                    const dados = result;

                    // Agora você pode referenciar as informações assim:
                    const cnpj = dados.cnpj;
                    const erpnow = dados.erpnow;
                    const senha = dados.senha;
                    const personalizacao = dados.personalizacao;
                    campoCnpj(cnpj);
                    campoNome(erpnow);
                    campoSenha(senha);
                    campoPersonalizacao(personalizacao);

                    console.log("Dados:", dados);
                } else {
                    console.log("Resposta vazia ou sem dados.");
                }

                clearInterval(intervalId);
            })
            .catch(error => console.log('Erro na requisição:', error));
    });
}

function campoCnpj(cnpj) {
    var elementoXPath = document.evaluate(
        '/html/body/data/section/section/div/div[2]/div[5]/div[2]/div[3]/uib-accordion/div/div[2]/div[2]/div/div/form/div[2]/div/div/div/input',
        document,
        null,
        XPathResult.FIRST_ORDERED_NODE_TYPE,
        null
    ).singleNodeValue;

    if (elementoXPath) {
        elementoXPath.value = cnpj;
    }
}

function campoNome(nome) {
    var elementoXPath = document.evaluate(
        '/html/body/data/section/section/div/div[2]/div[5]/div[2]/div[3]/uib-accordion/div/div[2]/div[2]/div/div/form/div[3]/div/div/div/input',
        document,
        null,
        XPathResult.FIRST_ORDERED_NODE_TYPE,
        null
    ).singleNodeValue;

    if (elementoXPath) {
        elementoXPath.value = nome;
    }
}

function campoSenha(senha) {
    var elementoXPath = document.evaluate(
        '/html/body/data/section/section/div/div[2]/div[5]/div[2]/div[3]/uib-accordion/div/div[2]/div[2]/div/div/form/div[7]/div/div/div/input',
        document,
        null,
        XPathResult.FIRST_ORDERED_NODE_TYPE,
        null
    ).singleNodeValue;

    if (elementoXPath) {
        elementoXPath.value = senha;
    }
}

function campoPersonalizacao(personalizacao) {
    var elementoXPath = document.evaluate(
        '/html/body/data/section/section/div/div[2]/div[5]/div[2]/div[3]/uib-accordion/div/div[2]/div[2]/div/div/form/div[5]/div/div/div/input',
        document,
        null,
        XPathResult.FIRST_ORDERED_NODE_TYPE,
        null
    ).singleNodeValue;

    if (elementoXPath) {
        elementoXPath.value = personalizacao;
    }
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
            console.log(result[0].result[0].lastvalue);
            var divElement = document.createElement("div");
            divElement.textContent = result[0].result[0].lastvalue;
            divElement.style.whiteSpace = "pre-wrap";
            divElement.style.wordWrap = "break-word";
            divElement.style.fontSize = "40px";
            var numeroDeLinhas = result[0].result[0].lastvalue.split('\n').length;
            var spanElement = document.createElement("span");
            spanElement.textContent = "Número total de usuarios: " + numeroDeLinhas;
            spanElement.style.fontSize = "40px";
            document.getElementById("zabbix").appendChild(spanElement);
            document.getElementById("zabbix").appendChild(divElement);
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

function modalErro(mensagem) {
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
    <p class="lead text-muted swall-text" style="display: block;">` + mensagem + `</p>
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
    <p class="lead text-muted swall-text" style="display: block;">`+ err + `</p>
    <p class="swall-details-container" style="display: none;"><a class="swall-details-button">Detalhes</a><span class="swall-details m-t-5"></span></p>
    <p><button class="confirm btn btn-lg btn-primary" id="fecharChamado" style="display: inline-block;">fechar e finalizar chamado</button> <button class="confirm btn btn-lg btn-danger" id="fecharModal" style="display: inline-block;">fechar</button></p>
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

function fecharAlerta() {
    var modal = document.getElementById('modal');
    modal.parentNode.removeChild(modal);
    var overlay = document.getElementById('modal-backdrop');
    overlay.parentNode.removeChild(overlay);
}

function fecharChamado() {
    const botao = document.evaluate("/html/body/data/section/section/div/div[2]/div[5]/div[1]/div[1]/div[2]/span[4]", document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
    botao.click();
    fecharAlerta();
}

// function syncAll() {
//     var myHeaders = new Headers();
//     myHeaders.append("Content-Type", "application/x-www-form-urlencoded");

//     var urlencoded = new URLSearchParams();
//     urlencoded.append("login", usuario_multi);
//     urlencoded.append("senha", senha_multi);

//     var requestOptions = {
//         method: 'POST',
//         headers: myHeaders,
//         body: urlencoded,
//         redirect: 'follow'
//     };

//     fetch("https://portal.infowaycloud.com.br/api/sync_all.php", requestOptions)
//         .then(response => response.text())
//         .then(result => console.log(result))
//         .catch(error => console.log('error', error));
// }


function miniCartao(nome, valor, util, subtitulo, consumo) {
    if (!util) {
        var elemento = `
        <div class="col-lg-3 col-md-6" bis_skin_checked="1">
            <div class="indicador-item" style="background-color: rgb(161, 136, 127); --darkreader-inline-bgcolor: #a88072;" data-darkreader-inline-bgcolor="" bis_skin_checked="1">
                <i class="" data-fa-i2svg=""><svg height="655" viewBox="0 0 400.83 104.99" width="2500" xmlns="http://www.w3.org/2000/svg"><path d="m0 0h400.83v104.99h-400.83zm0 0" fill="#d40000"/><path d="m17.14 16h57.96v7.53l-46.65 57.15h47.79v8.31h-60.24v-7.53l46.65-57.15h-45.51zm98.3 9.73-13.54 36.33h27.13zm-5.64-9.73h11.32l28.12 72.99h-10.38l-6.71-18.72h-33.27l-6.72 18.72h-10.53zm60.14 38.13v26.74h16.01c5.37 0 9.35-1.1 11.94-3.3s3.88-5.57 3.88-10.09c0-4.56-1.29-7.93-3.88-10.1-2.59-2.16-6.57-3.25-11.94-3.25zm0-30.02v22h14.78c4.88 0 8.51-.91 10.9-2.71 2.39-1.81 3.58-4.57 3.58-8.28 0-3.68-1.2-6.44-3.58-8.26-2.39-1.82-6.02-2.74-10.9-2.74h-14.78zm-9.98-8.11h25.5c7.61 0 13.48 1.56 17.59 4.69 4.12 3.13 6.17 7.58 6.17 13.35 0 4.46-1.05 8.02-3.16 10.66s-5.21 4.29-9.29 4.94c4.91 1.04 8.72 3.21 11.44 6.52s4.08 7.44 4.08 12.39c0 6.52-2.24 11.55-6.72 15.11-4.48 3.55-10.86 5.33-19.12 5.33h-26.49zm78.32 38.13v26.74h16.02c5.37 0 9.35-1.1 11.93-3.3 2.59-2.2 3.88-5.57 3.88-10.09 0-4.56-1.29-7.93-3.88-10.1-2.59-2.16-6.57-3.25-11.93-3.25zm0-30.02v22h14.78c4.88 0 8.51-.91 10.9-2.71 2.39-1.81 3.58-4.57 3.58-8.28 0-3.68-1.19-6.44-3.58-8.26s-6.02-2.74-10.9-2.74h-14.78zm-9.98-8.11h25.5c7.61 0 13.48 1.56 17.59 4.69 4.12 3.13 6.18 7.58 6.18 13.35 0 4.46-1.05 8.02-3.16 10.66s-5.21 4.29-9.29 4.94c4.91 1.04 8.72 3.21 11.44 6.52s4.08 7.44 4.08 12.39c0 6.52-2.24 11.55-6.72 15.11-4.48 3.55-10.86 5.33-19.12 5.33h-26.5zm97.24 0h10.98l17.35 26.21 17.52-26.21h10.61l-22.84 34.19 25.68 38.8h-10.98l-20.21-30.54-20.41 30.54h-10.61l25.74-38.52zm-28.91 0h9.98v72.99h-9.98zm0 0" fill="#fff"/></svg></i>
                <div class="indicador-informacoes" bis_skin_checked="1">
                    <small class="ng-binding">` + nome + `</small>
                    <h2 class="ng-binding">` + valor + `</h2>
                </div>
                <hr>
            </div>
        </div>`;
    } else {
        var elemento = `
        <div class="col-lg-3 col-md-6" bis_skin_checked="1">
            <div class="indicador-item" style="background-color: rgb(161, 136, 127); --darkreader-inline-bgcolor: #a88072;" data-darkreader-inline-bgcolor="" bis_skin_checked="1">
            <i class="" data-fa-i2svg=""><svg height="655" viewBox="0 0 400.83 104.99" width="2500" xmlns="http://www.w3.org/2000/svg"><path d="m0 0h400.83v104.99h-400.83zm0 0" fill="#d40000"/><path d="m17.14 16h57.96v7.53l-46.65 57.15h47.79v8.31h-60.24v-7.53l46.65-57.15h-45.51zm98.3 9.73-13.54 36.33h27.13zm-5.64-9.73h11.32l28.12 72.99h-10.38l-6.71-18.72h-33.27l-6.72 18.72h-10.53zm60.14 38.13v26.74h16.01c5.37 0 9.35-1.1 11.94-3.3s3.88-5.57 3.88-10.09c0-4.56-1.29-7.93-3.88-10.1-2.59-2.16-6.57-3.25-11.94-3.25zm0-30.02v22h14.78c4.88 0 8.51-.91 10.9-2.71 2.39-1.81 3.58-4.57 3.58-8.28 0-3.68-1.2-6.44-3.58-8.26-2.39-1.82-6.02-2.74-10.9-2.74h-14.78zm-9.98-8.11h25.5c7.61 0 13.48 1.56 17.59 4.69 4.12 3.13 6.17 7.58 6.17 13.35 0 4.46-1.05 8.02-3.16 10.66s-5.21 4.29-9.29 4.94c4.91 1.04 8.72 3.21 11.44 6.52s4.08 7.44 4.08 12.39c0 6.52-2.24 11.55-6.72 15.11-4.48 3.55-10.86 5.33-19.12 5.33h-26.49zm78.32 38.13v26.74h16.02c5.37 0 9.35-1.1 11.93-3.3 2.59-2.2 3.88-5.57 3.88-10.09 0-4.56-1.29-7.93-3.88-10.1-2.59-2.16-6.57-3.25-11.93-3.25zm0-30.02v22h14.78c4.88 0 8.51-.91 10.9-2.71 2.39-1.81 3.58-4.57 3.58-8.28 0-3.68-1.19-6.44-3.58-8.26s-6.02-2.74-10.9-2.74h-14.78zm-9.98-8.11h25.5c7.61 0 13.48 1.56 17.59 4.69 4.12 3.13 6.18 7.58 6.18 13.35 0 4.46-1.05 8.02-3.16 10.66s-5.21 4.29-9.29 4.94c4.91 1.04 8.72 3.21 11.44 6.52s4.08 7.44 4.08 12.39c0 6.52-2.24 11.55-6.72 15.11-4.48 3.55-10.86 5.33-19.12 5.33h-26.5zm97.24 0h10.98l17.35 26.21 17.52-26.21h10.61l-22.84 34.19 25.68 38.8h-10.98l-20.21-30.54-20.41 30.54h-10.61l25.74-38.52zm-28.91 0h9.98v72.99h-9.98zm0 0" fill="#fff"/></svg></i>
                <div class="indicador-informacoes" bis_skin_checked="1">
                    <small class="ng-binding">` + nome + `</small>
                    <h2 class="ng-binding">` + valor + `</h2>
                </div>
                <hr>
                    <div class="indicador-informacoes" bis_skin_checked="1">
                        <div class="ng-binding" bis_skin_checked="1">` + subtitulo + ` <b class="ng-binding">` + consumo + `</b></div>
                    </div>
            </div>
        </div>`;
    }
    document.getElementById("zabbix").insertAdjacentHTML('beforeend', elemento);
}

/**
 * @class Alloy.Globals
 * Classe global, instanciada automáticamente antes de executar a classe controllers.Index.  
 * Todas as propriedades publicas são acessíveis através de Alloy.Globals, que é uma variável global. 
 * @alteracao 21/01/2015 176562 Projeto Carlos Eduardo Santos Alves Domingos
 * Criação
 */

/**
 * @property {Number} CustomComponentHeight
 * Altura padrão dos controles. Exemplo: Botões
 */
Alloy.Globals.CustomComponentHeight = 40;
/**
 * @property {Object} CustomImageSize Tamanho padrão dos icones
 * @property {Number} CustomImageSize.height Altura
 * @property {Number} CustomImageSize.width Largura
 */
Alloy.Globals.CustomImageSize = {height: 32, width: 32};
/**
 * @property {Number} CustomTextSize Tamanho padrão da fonte dos controles.
 */
Alloy.Globals.CustomTextSize = 18;
/**
 * @property {Number} CustomTitleFont Tamanho padrao da fonte dos titulos dos controles.
 */
Alloy.Globals.CustomTitleFont = 20;
/**
 * @property {String} MainColor Cor padrão no aplicativo. Todo controle que precise ficar em destaque, deve estar nessa cor.
 */
Alloy.Globals.MainColor = "#18465f";
/**
 * @property {String} MainColorLight Cor que indica quando um controle foi selecionado. Exemplo: clique no botão.
 */
Alloy.Globals.MainColorLight = "#2b7fad";

/**
 * @property Cloud
 * Biblioteca de acesso a nuvem do appcelerator.
 * @type {Object}
 */
Alloy.Globals.Cloud = require('ti.cloud');

/**
 * @property CloudUser
 * Dados do usuário na nuvem do appcelerator.
 * @type {Object}
 */
Alloy.Globals.CloudUser = null;

/**
 * @proerty DeviceToken
 * Token do dispositivo, utilizado para as notificações.
 * @type {String}
 */
Alloy.Globals.DeviceToken = null;

/**
 * @property CanaisNotificacao
 * Array de canais de notificação, para utilizar um novo canal, basta adicionar o nome do canal neste vetor.
 * @type {Array}
 */
Alloy.Globals.CanaisNotificacao = ["processopagamento", "medicao"];

Titanium.App.addEventListener("notificacao", function(e){
	switch(e.servico){
		case "processopagamento":
			var detalhes = Alloy.createController("AprovacaoPagamento/DetalhesProcessoDePagamento", {dados: e.dados});
			Alloy.Globals.Transicao.proximo(detalhes, detalhes.init, {});
			break;
	}
});

/**
 * @property EmProducao
 * Indica se o aplicativo está em produção ou não.
 * @type {Boolean}
 */
Alloy.Globals.EmProducao = false;

/**
 * @property LocaWebDomain
 * Endereço do servidor do LocalWeb.
 * @type {String} 
 */
Alloy.Globals.LocaWebDomain = null;


if(Alloy.Globals.EmProducao){
	/* Deve alternar de versão para versão*/
//Alloy.Globals.LocaWebDomain = "http://www.uau.com.br/MobileWebApi2/";
	Alloy.Globals.LocaWebDomain = "http://www.uau.com.br/MobileWebAPI/";
	Alloy.Globals.Cloud.debug = true;
}else{
Alloy.Globals.LocaWebDomain = "http://192.168.2.125:8686/UAUMobileWebAPI/";
	Alloy.Globals.Cloud.debug = true;
}




/**
 * @property VersaoUAU
 * Versão do uau que o aplicativo trabalha.
 * @type {String}
 */
Alloy.Globals.VersaoUAU = "10";

/**
 * @property {JSONObject} Empresa Informações da empresa que o usuário está logado. Instanciado após o login. Possuí os mesmos atributos do modelo {widgets.Login.models.Empresa}.
 */
Alloy.Globals.Empresa = null;
/**
 * @property {JSONObject} Usuario Informações do usuário logado. Instanciado após o login. Possuí os mesmos atributos do modelo {widgets.Login.models.Usuario}.
 */
Alloy.Globals.Usuario = null;
/**
 * @property {Array} pilhaWindow Pilha contendo todas as janelas abertas. O topo da pilha representa a janela atual.
 */
Alloy.Globals.pilhaWindow = [];
/**
 * @method currentWindow
 * Retorna a janela atual.
 * @alteracao 21/01/2015 176562 Projeto Carlos Eduardo Santos Alves Domingos
 * Criação.
 * @returns {Ti.UI.Window}
 */
Alloy.Globals.currentWindow = function(){
	return Alloy.Globals.pilhaWindow[Alloy.Globals.pilhaWindow.length - 1];
};

/**
 * @property {widgets.Util.Tela} configTela propriedade usada configurar telas.
 * @private
 */
var configTela = Alloy.createWidget("Util", "Tela");
/**
 * @method configWindow
 * Configura a janela para o padrão da arquitetura. Obrigatório o uso no construtor de qualquer janela.
 * @param {Ti.UI.Window} janela Janela que se deseja configurar.
 * @param {Alloy} seuAlloy Variável $ reservada em todo controller.
 * @returns {null}
 * @alteracao 21/01/2015 176562 Projeto Carlos Eduardo Santos Alves Domingos
 * Criação.
 */
Alloy.Globals.configWindow = function(janela, seuAlloy){
	configTela.initConfigWindow(janela, seuAlloy);
};

/**
 * @method configPopUp
 * Configura a popup para o padrão da arquitetura. Obrigatório o uso no construtor de qualquer popup.
 * @param {Controller} controller Controller da popup.
 * @param {Function} [showFunction] Função que será executada toda vez que o controller executar a função show.
 * @param {Function} [cancelFunction] Função que será executada toda vez que o controller executar a função close.
 * @returns {null} 
 * @alteracao 21/01/2015 176562 Projeto Carlos Eduardo Santos Alves Domingos
 * Criação.
 */
Alloy.Globals.configPopUp = function(controller, showFunction, cancelFunction){
	configTela.initConfigPopUp(controller, showFunction, cancelFunction);
};
/**
 * @property {Boolean} estaOnline Indica se o dispositivo está online.
 */
Alloy.Globals.estaOnline = Ti.Network.online;
/**
 * @property {widgets.Util.Format} format Objeto utilizado para formatação de dados. Toda formatação de dados deve ser feita por esse objeto.
 */
Alloy.Globals.format = Alloy.createWidget("Util", "Format");
/**
 * @property {widgets.DAL.widget} DAL Objeto utilizado para a camada de persistencia de dados.
 */
Alloy.Globals.DAL = Alloy.createWidget("DAL");
/**
 * @property {widgets.Util.Transicao} Transicao Deve ser utilizado sempre que for necessário chamar uma nova janela.
 */
Alloy.Globals.Transicao = Alloy.createWidget("Util", "Transicao");
/**
 * @method Alerta
 * Exibe um alerta simples com o título e a mensagem.
 * @param {String} titulo Título do alerta. Por parão será considerado "Alerta".
 * @param {String} mensagem Mensagem a ser exibida no alerta.
 * @returns {null}
 * @alteracao 21/01/2015 176562 Projeto Carlos Eduardo Santos Alves Domingos
 * Criação.
 */
Alloy.Globals.Alerta = function(titulo, mensagem){
	var check = Alloy.createWidget("GUI", "Mensagem");
	check.init(titulo, mensagem);
	check.show();
};

var telaLog = Alloy.createWidget("GUI", "TelaLog");
telaLog.init();
Alloy.Globals.log = function(mensagem){
	telaLog.setMensagem(mensagem);
	telaLog.show();
};

/**
 * @property {widgets.Util.Erro} telaErro Controller da tela de erro.
 * @private
 */
var telaErro = Alloy.createWidget("Util", "Erro");
/**
 * @event onError
 * Deve ser invocado em todo caso catch não tratado.
 * @returns {null}
 * @alteracao 21/01/2015 176562 Projeto Carlos Eduardo Santos Alves Domingos
 * Criação.
 */
Alloy.Globals.onError = function(erro, rotina, arquivo){
	telaErro.show(erro, rotina, arquivo);
};

/**
 * @property {widgets.Util.Usuario} UtilUsuario Controller de utilitarios do usuário.
 * @private
 */
Alloy.Globals.UtilUsuario = Alloy.createWidget("Util", "Usuario");

/**
 * @method logout
 * Exibe a mensagem de confirmação de logout.
 * @private
 * @returns {null}
 * @alteracao 21/01/2015 176562 Projeto Carlos Eduardo Santos Alves Domingos
 * Criação.
 */
var logout = function(){
	var check = Alloy.createWidget("GUI", "Mensagem");
	check.init("Atenção !", "Gostaria de sair ?", true);
	check.show({callback: executeLogout});	
};
/**
 * @event executeLogout
 * Volta a tela de login.
 * @param {Object} parans Resposta da mensagem de logout.
 * @param {Boolean} parans.value true para o click no ok, false para o click no cancelar
 * @returns {null}
 * @alteracao 21/01/2015 176562 Projeto Carlos Eduardo Santos Alves Domingos
 * Criação.
 */
var executeLogout = function(parans){
	if(parans.value){
		Alloy.createController("index");
		Ti.API.info("logout, tamanhao da pilha: " + Alloy.Globals.pilhaWindow.length);
	}
};
/**
 * @method resetPilhaWindow
 * Fecha todas as janelas abertas da aplicação, menos a janela atual.
 * @returns {null}
 * @alteracao 21/01/2015 176562 Projeto Carlos Eduardo Santos Alves Domingos
 * Criação.
 */
Alloy.Globals.resetPilhaWindow = function(){
	while(Alloy.Globals.pilhaWindow.length > 1){
		Alloy.Globals.pilhaWindow[0].close();
		Alloy.Globals.pilhaWindow[0] = null;
		Alloy.Globals.pilhaWindow.splice(0, 1);	
	}
	Ti.API.info("janelas removidas, tamanhao da pilha: " + Alloy.Globals.pilhaWindow.length);
	return null;
};
/**
 * @property {Object} Servicos Tamanho da barra lateral de serviços.
 * @property {Number} Servicos.Largura Largura.
 */
Alloy.Globals.Servicos = {Largura: Alloy.isHandheld?250:350};
/**
 * @property {widgets.GUI.ListaServicos} ListaServicos Controller da barra lateral de serviços.
 */
Alloy.Globals.ListaServicos = Alloy.createWidget("GUI", "ListaServicos");

/**
 * @property {Object} ServicosDisponiveis Enum dos serviços disponíveis no aplicativo.
 */
Alloy.Globals.ServicosDisponiveis = {Inicio: "Início", AprovPagamento: "Aprov. de pagamento", AprovMedicao: "Aprov. de medição", 
									Tokens: "Tokens cadastrados"};

/**
 * @property {Object} ListaServicosUsuario Lista de programas de permissão para o usuário.
 * Caso seja necessário validar o acesso do usuário a um determinado programa, este deve ser adicionado nessa lista.
 * Se o programa está na lista e o usuário não tem acesso a este, o serviço será removido da lista lateral e da tela de resumo.
 */
Alloy.Globals.ListaServicosUsuario = [{programa: "FICHEQUE", acesso:false, servico: Alloy.Globals.ServicosDisponiveis.AprovPagamento}];

/**
 * @event callbackServicos
 * Quando um novo serviço é selecionado pela barra lateral de serviços, essa rotina é invocada.
 * Como usar: Caso o serviço de nome 'novo' seja criado, deve-se criar um case dentro dessa rotina com o mesmo nome. 
 * Dentro do case deve-se colocar o código de instancia desse novo serviço. 
 * @param {String} nome Nome do serviço.
 * @returns {null}
 * @alteracao 21/01/2015 176562 Projeto Carlos Eduardo Santos Alves Domingos
 * Criação.
 * @alteracao 12/05/2015 185753 Projeto Carlos Eduardo Santos Alves Domingos
 * Adicionado o serviço Aprovação de medição de contrato e Início.
 */
var callbackServicos = function(nome){
	try{
		Alloy.Globals.ListaServicos.fechar();
		switch(nome) {
			case "Sair": 
				logout();
				break;
			case Alloy.Globals.ServicosDisponiveis.Inicio:
				Alloy.Globals.iniciarServicos();
				var novo = Alloy.createController("Resumo/Inicio");
				Alloy.createWidget("Util", "Transicao").nova(novo, novo.init, {});
				break;	
			case Alloy.Globals.ServicosDisponiveis.AprovPagamento: 
				Alloy.Globals.iniciarServicos();
				var novo = Alloy.createController("AprovacaoPagamento/ListaProcessoDePagamento");
				Alloy.createWidget("Util", "Transicao").nova(novo, novo.init, {});
				break;
			case Alloy.Globals.ServicosDisponiveis.AprovMedicao: 
				Alloy.Globals.iniciarServicos();
				var novo = Alloy.createController("Medicao/ListaMedicao");
				Alloy.createWidget("Util", "Transicao").nova(novo, novo.init, {});
				break;	
			case "Cotações": 
				Alloy.Globals.iniciarServicos();
				var novo = Alloy.createController("Cotacao/ListaCotacoes");
				Alloy.createWidget("Util", "Transicao").nova(novo, novo.init, {});
				break;		
			case "Tokens cadastrados":
				var janelaToken = Alloy.createWidget("Login", "ListaToken");
				Alloy.createWidget("Util", "Transicao").proximo(janelaToken, janelaToken.init, {});
				break;	
			default :
				alert("Servico não implementado.");
				break;	
		}
	}
	catch(e){
		Alloy.Globals.onError(e.message, "callbackServicos", "app/alloy.js");
	}
};
/**
 * @method iniciarServicosLogin
 * Inicia a lista de serviços com os serviços do login.
 * @returns {null}
 * @alteracao 21/01/2015 176562 Projeto Carlos Eduardo Santos Alves Domingos
 * Criação.
 */
Alloy.Globals.iniciarServicosLogin = function(){
	Alloy.Globals.ListaServicos.configCabecalho(false);
	Alloy.Globals.ListaServicos.resetar();
	Alloy.Globals.ListaServicos.adicionarServico("/images/servicos/token.png", Alloy.Globals.ServicosDisponiveis.Tokens, callbackServicos);
};
/**
 * @method iniciarServicos
 * Inicia a lista de serviços com os serviços globais.
 * Qualquer novo serviço no aplicativo deve ser adicionado por essa rotina. 
 * Exemplo: Queremos adicionar o serviço 'novo', basta vir nesta rotina e invocar a rotina adicionarServico da classe widgets.GUI.ListaServicos passando os devidos parâmetros.
 * @returns {null}
 * @alteracao 21/01/2015 176562 Projeto Carlos Eduardo Santos Alves Domingos
 * Criação.
 * @alteracao 12/05/2015 185753 Projeto Carlos Eduardo Santos Alves Domingos
 * Adicionado o serviço Aprovação de medição de contrato.
 * @alteracao 21/09/2015 199320 Projeto Carlos Eduardo Santos Alves Domingos
 * Só adiciona o serviço caso o usuário tenha permissão no programa.
 */
Alloy.Globals.iniciarServicos = function(){
	Alloy.Globals.ListaServicos.configCabecalho(true);
	Alloy.Globals.ListaServicos.resetar();
	/*Alloy.Globals.ListaServicos.adicionarSecaoServicos("Aprov. de pagamento", "/images/servicos/aprovacao.png", 
		[{servico: "Processo de pagamento", callback: callbackServicos}]);*/
	Alloy.Globals.ListaServicos.adicionarServico("/images/home.png", Alloy.Globals.ServicosDisponiveis.Inicio, callbackServicos);	
	Alloy.Globals.ListaServicos.adicionarServico("/images/servicos/aprovacao.png", Alloy.Globals.ServicosDisponiveis.AprovPagamento, callbackServicos);
	Alloy.Globals.ListaServicos.adicionarServico("/images/contrato.png", Alloy.Globals.ServicosDisponiveis.AprovMedicao, callbackServicos);
	Alloy.Globals.ListaServicos.adicionarServico("/images/servicos/cotacao.png", "Cotações", callbackServicos);
	Alloy.Globals.ListaServicos.adicionarServico("/images/logout.png", "Sair", callbackServicos);
};

/**
 * @event Network_change
 * Disparado ao se clicar no ícone de lista. Caso exista uma janela anterior, esta janela será fechada e a anterior será aberta.
 * @alteracao 21/01/2015 176562 Projeto Carlos Eduardo Santos Alves Domingos
 * Criação. 
 */
Ti.Network.addEventListener("change", function(e){
	Alloy.Globals.estaOnline = e.online;
});
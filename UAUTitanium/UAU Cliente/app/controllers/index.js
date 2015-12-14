/**
 * @class controllers.Index
 * Classe principal, primeira a ser executada.
 * @alteracao 21/01/2015 176562 Projeto Carlos Eduardo Santos Alves Domingos
 * Criação.
 * @alteracao 09/07/2015 191658 Projeto Carlos Eduardo Santos Alves Domingos
 * O banner foi movido para a tela de reimpressão de boleto.
 */
var args = arguments[0] || {};

/**
 * @method callbackOK
 * Rotina executada caso o login seja bem-sucedido.
 * @private
 * @alteracao 21/01/2015 176562 Projeto Carlos Eduardo Santos Alves Domingos
 * Criação.
 * @alteracao 09/07/2015 191657 Projeto Carlos Eduardo Santos Alves Domingos
 * Chama controllers.Index.obtemListaServicos.
 */
var callbackOK = function(){
	obtemListaServicos();
};

/**
 * @method obtemListaServicos
 * Tenta obter a lista de serviços configurados para a empresa selecionada.
 * @private
 * @alteracao 09/07/2015 191657 Projeto Carlos Eduardo Santos Alves Domingos
 * Criação.
 */
function obtemListaServicos(){
	var novoWebService = Alloy.createWidget("WebService");
	var httpRequest = novoWebService.iniciarHttpRequest({
		url: Alloy.Globals.LocaWebDomain + "api/Configuracao/getServicosDaEmpresa", 
		metodo: "POST", 
		callback: sucessListaServico,
		error: failListaServico,
		timeout: 60000
	});
	if(httpRequest){
		httpRequest.adicionaParametro({CodEmpresa: Alloy.Globals.Empresa.num});
		httpRequest.NovoEnvia({outArch: true});
	}
}

/**
 * @method sucessListaServico
 * Callback de sucesso da solicitação de controllers.Index.obtemListaServicos
 * @private
 * @param {BackBone.Collection} e Coleção de serviços disponibilizados pela empresa.
 * @alteracao 09/07/2015 191657 Projeto Carlos Eduardo Santos Alves Domingos
 * Criação.
 */
function sucessListaServico(e){
	try{
		Alloy.Globals.listaServicosEmpresa = e.at(0).toJSON().ListaServicos;
		var servicoInicial = Alloy.Globals.iniciarServicos();
		if(servicoInicial.temServico){
			var novo = Alloy.createController(servicoInicial.servico);
			Alloy.Globals.Transicao.nova(novo, novo.init, {});
			//Inicia o processo de notificações.
			//Deve ficar após a transição de janelas, pois as notificações pendentes devem ser apresentadas apenas nas próximas janelas.
			var cloudLogin = Alloy.createWidget("CloudService", "Login");
			cloudLogin.checkLogin({clienteId: (Alloy.Globals.Usuario.UsuarioUAU.length<=8?Alloy.Globals.Usuario.UsuarioUAU:Alloy.Globals.Usuario.Codigo), tokenEmpresa: Alloy.Globals.Empresa.token, tipo: "cliente"});
		}else{
			Alloy.Globals.Alerta("Atenção !", "Esta empresa não possuí nenhum serviço disponível no momento.");	
		}
	}
	catch(e){
		Alloy.Globals.onError(e.message, "callbackOK", "app/controllers/index.js");
	}	
}

/**
 * @method failListaServico
 * Callback de falha da solicitação de controllers.Index.obtemListaServicos
 * @private
 * @alteracao 09/07/2015 191657 Projeto Carlos Eduardo Santos Alves Domingos
 * Criação.
 */
function failListaServico(e){
	failLogin("Erro ao tentar recuperar as configurações de serviços da empresa." + "\nCódigo: " + e.code + "\nDescrição: "+ e.error);
}

/**
 * @method callbackNaoOK
 * Rotina executada caso ocorra erro ao tentar fazer o login.
 * @private
 * @alteracao 21/01/2015 176562 Projeto Carlos Eduardo Santos Alves Domingos
 * Criação.
 */
var callbackNaoOK = function(mensagem){
	try{
		Alloy.Globals.Alerta("Erro ao entrar", mensagem);
	}
	catch(e){
		Alloy.Globals.onError(e.message, "callbackNaoOK", "app/controllers/index.js");
	}
};

/**
 * @method init
 * Construtor da classe
 * @private
 * @alteracao 21/01/2015 176562 Projeto Carlos Eduardo Santos Alves Domingos
 * Criação.
 */
function init(){
	try{
		Alloy.Globals.configWindow($.janela, $);
		$.meuLogin.init(callbackOK, callbackNaoOK);
		$.meuLogin.getView().setOpacity(0);
		$.boxTitulo.setTop(200);
		$.titulo.setOpacity(0);
	}
	catch(e){
		Alloy.Globals.onError(e.message, "init", "app/controllers/index.js");
	}
}

/**
 * @event open
 * Faz a animação incial da logo da Globaltec.
 * @alteracao 09/07/2015 191658 Projeto Carlos Eduardo Santos Alves Domingos
 * Criação.
 */
$.janela.addEventListener("open", function(e){
	var animacaoTitulo = Ti.UI.createAnimation({
		top: 0,
		duration: 800,
		delay: 150
	});
	$.boxTitulo.animate(animacaoTitulo, colocaOpacidadeLogin);
});

/**
 * @event colocaOpacidadeLogin
 * Callback da animação da logo da globaltec.
 * Faz a animação de shade-in no formulário de login.
 * @alteracao 09/07/2015 191658 Projeto Carlos Eduardo Santos Alves Domingos
 * Criação.
 */
function colocaOpacidadeLogin(){
	var animacaoBoxLogin = Ti.UI.createAnimation({
		opacity: 1,
		duration: 450
	});
	$.titulo.animate(animacaoBoxLogin);
	$.meuLogin.getView().animate(animacaoBoxLogin);
}

//Abro a janela.
Alloy.Globals.Transicao.nova($, init, {});
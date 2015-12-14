/**
 * @class controllers.inicio
 * Classe que contém o login.
 * @alteracao 04/03/2015 180419 Projeto Carlos Eduardo Santos Alves Domingos
 * Criação.
 */
var args = arguments[0] || {};

/**
 * @method callbackOK
 * Rotina executada caso o login seja bem-sucedido.
 * Chama {controllers.AprovacaoPagamento.ListaProcessoDePagamento}.
 * @private
 * @alteracao 04/03/2015 180419 Projeto Carlos Eduardo Santos Alves Domingos
 * Criação.
 */
var callbackOK = function(){
	obtemListaPermissoes();
};

/**
 * @method obtemListaServicos
 * Tenta obter a lista de serviços configurados para a empresa selecionada.
 * @private
 * @alteracao 21/09/2015 199320 Projeto Carlos Eduardo Santos Alves Domingos
 * Criação.
 */
function obtemListaPermissoes(){
	var novoWebService = Alloy.createWidget("WebService");
	var httpRequest = novoWebService.iniciarHttpRequest({
		url: Alloy.Globals.LocaWebDomain + "api/Configuracao/getPermCorporativo", 
		metodo: "POST", 
		callback: sucessObterPermissoes,
		error: function(e){Alloy.Globals.Alerta("Falhou", 
			"Erro ao tentar recuperar as configurações de serviços da empresa." + "\nCódigo: " + e.code + "\nDescrição: "+ e.error);},
		timeout: 60000,
		headerType: "application/json"
	});
	if(httpRequest){
		
		var programas = [];
		for(var i = 0; i < Alloy.Globals.ListaServicosUsuario.length; i++){
			programas.push(Alloy.Globals.ListaServicosUsuario[i].programa);
		}	
		httpRequest.adicionaParametro({usuario: Alloy.Globals.Usuario.UsuarioUAU, programas: programas});
		httpRequest.NovoEnvia();
	}
}

var sucessObterPermissoes = function(ret){
	try{
		preencheListaServicoUsuario(ret.toJSON());
		Alloy.Globals.iniciarServicos();
		var resumo = Alloy.createController("Resumo/Inicio");
		Alloy.Globals.Transicao.nova(resumo, resumo.init, {});
	}
	catch(e){
		Alloy.Globals.onError(e.message, "callbackOK", "app/controllers/inicio.js");
	}
};

function preencheListaServicoUsuario(programas){
	Ti.API.info(JSON.stringify(programas));
	for(var i = 0; i < programas.length; i++){
		for(var j = 0; j < Alloy.Globals.ListaServicosUsuario.length; j++){
			if(programas[i].programa == Alloy.Globals.ListaServicosUsuario[j].programa){
				Alloy.Globals.ListaServicosUsuario[j].acesso = programas[i].acesso;
			}
		}
	}
	Ti.API.info(JSON.stringify(Alloy.Globals.ListaServicosUsuario));
}

/**
 * @method callbackNaoOK
 * Rotina executada caso ocorra erro ao tentar fazer o login.
 * @private
 * @alteracao 04/03/2015 180419 Projeto Carlos Eduardo Santos Alves Domingos
 * Criação.
 */
var callbackNaoOK = function(mensagem){
	try{
		Alloy.Globals.Alerta("Erro ao entrar", mensagem);
	}
	catch(e){
		Alloy.Globals.onError(e.message, "callbackNaoOK", "app/controllers/inicio.js");
	}
};

/**
 * @method init
 * Construtor da classe
 * @private
 * @alteracao 04/03/2015 180419 Projeto Carlos Eduardo Santos Alves Domingos
 * Criação.
 */
$.init = function(){
	try{
		Alloy.Globals.configWindow($.winInicio, $);
		$.minhaTopBar.iniciar("Entrar no UAU Corporativo");
		$.meuLogin.init(callbackOK, callbackNaoOK);
		$.meuLogin.adicionaBotao("Voltar para novidades", verNovidades);
	}
	catch(e){
		Alloy.Globals.onError(e.message, "init", "app/controllers/inicio.js");
	}
};


/**
 * @event verNovidades
 * Chama a tela de novidades
 * @private
 * @alteracao 05/03/2015 180419 Projeto Carlos Eduardo Santos Alves Domingos
 * Criação
 */
function verNovidades(){
	Alloy.createController("index");
};

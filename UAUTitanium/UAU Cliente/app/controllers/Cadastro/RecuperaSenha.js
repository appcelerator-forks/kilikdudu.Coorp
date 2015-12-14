/**
 * @class controllers.Cadastro.RecuperaSenha
 * Recupera a senha do usuário.
 * @alteracao 09/07/2015 191658 Projeto Carlos Eduardo Santos Alves Domingos
 * Criação. 
 */
var args = arguments[0] || {};

/**
 * @property {Number} CodEmpresa Código da empresa.
 * @private
 */
var CodEmpresa = args.CodEmpresa;
/**
 * @property {String} UrlEmpresa Url do webservice da empresa.
 * @private
 */
var UrlEmpresa = args.UrlEmpresa;

/**
 * @method init
 * Construtor da classe. 
 * @alteracao 10/07/2015 191658 Projeto Carlos Eduardo Santos Alves Domingos
 * Criação. 
 */
$.init = function(){
	try{
		Alloy.Globals.configWindow($.winRecuperaSenha, $);
		$.minhaTopBar.iniciar("Recuperar senha");
		$.tipo.setGroup(["Por login", "Por email"]);
		$.loginemail.init({nome: "*Login"});
	}
	catch(e){
		Alloy.Globals.onError(e.message, "init", "app/controllers/BoletoDetalhe.js");
	} 
};

/**
 * @method alteraTipo
 * Configura a tela para o tipo selecionado. 
 * @private
 * @param {Object} e Parâmetros
 * @param {Number} e.index Indice do tipo de recuperação selecionado.
 * @alteracao 10/07/2015 191658 Projeto Carlos Eduardo Santos Alves Domingos
 * Criação. 
 */
function alteraTipo(e){
	$.loginemail.setDesc(e.index==0?"*Login":"*Email");
	$.loginemail.setInputValue("");
}

/**
 * @method checkRecuperar
 * Válida se o usuário informou todos os dados obrigatórios.
 * @private
 * @return {Boolean}
 * @alteracao 10/07/2015 191658 Projeto Carlos Eduardo Santos Alves Domingos
 * Criação. 
 */
function checkRecuperar(){
	try{
		var check = Alloy.createWidget("GUI", "Mensagem");
		if($.loginemail.getInputValue() == ""){
			check.init("Alerta", "Preencha o " + ($.tipo.getSelected().index==0?"Login":"Email"));
			check.show({callback: $.loginemail.selecionar});
			return false;
		}else {
			if($.tipo.getSelected().index==0){
				if($.loginemail.getInputValue() < 9){
					check.init("Alerta","O login possuí conter mais de 8 caracteres");
					check.show({callback: $.loginemail.selecionar});
					return false;
				}
			}else{
				if(!Alloy.Globals.validador.validarEmail($.loginemail.getInputValue())){
					check.init("Alerta","Email inválido.");
					check.show({callback: $.loginemail.selecionar});
					return false;
				}
			}
		}
		return true;
	}
	catch(e){
		Alloy.Globals.onError(e.message, "checkLogin", "app/widgets/Login/controllers/login.js");
	}
}

/**
 * @method recuperar
 * Verifica se as informações foram preenchidas e solicita a recuperação de senha.
 * @private
 * @alteracao 10/07/2015 191658 Projeto Carlos Eduardo Santos Alves Domingos
 * Criação.
 */
function recuperar(e){
	if(checkRecuperar()){
		tentaRecuperar();
	}
}

/**
 * @method tentaRecuperar
 * Tenta recuperar a senha do usuário.
 * @private
 * @alteracao 10/07/2015 191658 Projeto Carlos Eduardo Santos Alves Domingos
 * Criação.
 */
function tentaRecuperar(){
	var novoWebService = Alloy.createWidget("WebService");
	var httpRequest = novoWebService.iniciarHttpRequest({
		url: Alloy.Globals.LocaWebDomain + "api/Cliente/" + ($.tipo.getSelected().index==0?"RecuperaSenhaPorLogin":"RecuperaSenhaPorEmail"),
		metodo: "POST", 
		callback: confirmaRecuperacao,
		error: failRecuperaSenha,
		timeout: 60000
	});
	if(httpRequest){
		var remoteParans = {_wsDomain: UrlEmpresa, _mobEmProducao: Alloy.Globals.EmProducao?'true':'false', CodEmpresa: CodEmpresa};
		if($.tipo.getSelected().index==0){
			remoteParans.Login = $.loginemail.getInputValue();
		}else{
			remoteParans.Email = $.loginemail.getInputValue();
		}
		httpRequest.adicionaParametro(remoteParans);
		httpRequest.NovoEnvia({outArch: true});	
	}
}

/**
 * @method failRecuperaSenha
 * Callback de falha da recuperação de senha.
 * @private
 * @alteracao 10/07/2015 191658 Projeto Carlos Eduardo Santos Alves Domingos
 * Criação.
 */
function failRecuperaSenha(e){
	Alloy.Globals.Alerta("Falhou", "Ocorreu um erro ao tentar recupear a sua senha." + "\nCódigo: " + e.code + "\nDescrição: "+ e.error);
}

/**
 * @method confirmaRecuperacao
 * Callback de falha da recuperação de senha.
 * @private
 * @alteracao 10/07/2015 191658 Projeto Carlos Eduardo Santos Alves Domingos
 * Criação.
 */
function confirmaRecuperacao(e){
	var res = e.at(0).toJSON();
	var check = Alloy.createWidget("GUI", "Mensagem");
	check.init((res.sucesso?"Sucesso":"Falha"), res.mensagem);
	check.show({callback: Alloy.Globals.Transicao.anterior});
};

/**
 * @class widgets.Login.NovoToken
 * Popup para adicionar um novo token de empresa.
 * @private
 * @alteracao 21/01/2015 176562 Projeto Carlos Eduardo Santos Alves Domingos
 * Criação.
 */
var args = arguments[0] || {};

$.token.init({nome: "Token:", next: $.usrname});
$.usrname.init({nome: "Usuário:", next: $.senha});
$.senha.init({nome: "Senha:"});
$.senha.novoNome.passwordMask = true;
$.senha.novoNome.maxLength = 15;

/**
 * @property {Function} funcGravar Rotina que será executada para salvar o token. 
 */
var funcGravar = null;

/**
 * @method init
 * Construtor da classe. 
 * @param {Object} parans Parâmetros do construtor.
 * @param {Function} parans.gravar Rotina que será executada para salvar o token.
 * @alteracao 21/01/2015 176562 Projeto Carlos Eduardo Santos Alves Domingos
 * Criação.
 */
$.init = function(parans){
	try{
		funcGravar = parans.gravar;
		Alloy.Globals.configPopUp($);
	}
	catch(e){
		Alloy.Globals.onError(e.message, "init", "app/widgets/Login/NovoToken.js");
	}
};

/**
 * @event cancelar
 * Rotina executada ao se clicar em cancelar. Fecha a popup.
 * @alteracao 21/01/2015 176562 Projeto Carlos Eduardo Santos Alves Domingos
 * Criação.
 */
function cancelar(){
	$.close();
}

/**
 * @event gravarTrigger
 * Rotina executada ao se clicar em gravar. Tenta gravar e fecha a popup.
 * @alteracao 21/01/2015 176562 Projeto Carlos Eduardo Santos Alves Domingos
 * Criação.
 * @alteracao 18/05/2015 187463 Projeto Carlos Eduardo Santos Alves Domingos
 * Válida os dados antes de tentar buscar, validar e adicionar o token.
 */
function gravarTrigger(){
	if(validar()){
		funcGravar({codEmpresa: $.token.getInputValue(), login: $.usrname.getInputValue(), senha: $.senha.getInputValue()});
		$.token.setInputValue("");
		$.usrname.setInputValue("");
		$.senha.setInputValue("");
		$.close();	
	}
}

/**
 * @method validar
 * Valida se todos os campos foram preenchidos.
 * @alteracao 18/05/2015 187463 Projeto Carlos Eduardo Santos Alves Domingos
 * Criação.
 */
function validar(){
	var check = Alloy.createWidget("GUI", "Mensagem");
	if($.token.getInputValue() == ""){
		check.init("Alerta", "Preencha o token com o código da empresa.");
		check.show({callback: $.token.selecionar});
		return false;		
	}
	if($.usrname.getInputValue() == ""){
		check.init("Alerta", "Preencha o login.");
		check.show({callback: $.usrname.selecionar});
		return false;
	}
	if($.usrname.getInputValue().length > 8){
		check.init("Alerta", "O login possuí no máximo 8 caracteres.");
		check.show({callback: $.usrname.selecionar});
		return false;
	}
	if($.senha.getInputValue() == ""){
		check.init("Alerta", "Preencha a senha.");
		check.show({callback: $.senha.selecionar});
		return false;
	}
	return true;
}

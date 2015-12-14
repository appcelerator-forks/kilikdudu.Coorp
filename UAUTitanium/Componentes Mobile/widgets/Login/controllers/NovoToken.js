/**
 * @class widgets.Login.NovoToken
 * Popup para adicionar um novo token de empresa.
 * @private
 * @alteracao 21/01/2015 176562 Projeto Carlos Eduardo Santos Alves Domingos
 * Criação.
 */
var args = arguments[0] || {};

$.token.init({nome: "Token"});

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
		Alloy.Globals.configPopUp($, null, null);
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
 */
function gravarTrigger(){
	funcGravar({valor: $.token.getInputValue()});
	$.token.setInputValue("");
	$.close();
}

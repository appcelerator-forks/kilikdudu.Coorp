/**
 * @class widgets.Login.ListaToken
 * Lista todos os tokens cadastrados.
 * @private
 * @alteracao 21/01/2015 176562 Projeto Carlos Eduardo Santos Alves Domingos
 * Criação.
 */
var args = arguments[0] || {};

//Listo todos os tokens.
$.empresas.fetch();

/**
 * @method init
 * Construtor da classe.
 * @alteracao 21/01/2015 176562 Projeto Carlos Eduardo Santos Alves Domingos
 * Criação.
 */
$.init = function(){
	Alloy.Globals.configWindow($.winToken, $);
	
	$.minhaTopBar.iniciar("Tokens cadastrados");
	
};

/**
 * @event deletar
 * Exibe uma mensagem perguntando se confirma a exclusão do token.
 * @param {Object} e Retorno do evento click do controle Ti.UI.Button. (Ver documentação no Titanium para mais detalhes).
 * @alteracao 21/01/2015 176562 Projeto Carlos Eduardo Santos Alves Domingos
 * Criação.
 */
function deletar(e){
	var check = Alloy.createWidget("GUI", "Mensagem");
	check.init("Atenção !", "Gostaria de deletar o token ?", true);
	check.chave = e.source.chave;
	check.show({callback: executeDelete});
}

/**
 * @event executeDelete
 * Caso seja confirmado a exclusão do dado, esta rotina apaga a empresa vincula a este token.
 * @param {Object} parans Resposta obtida do controle widgets.GUI.Mensagem
 * @alteracao 21/01/2015 176562 Projeto Carlos Eduardo Santos Alves Domingos
 * Criação.
 */
function executeDelete(parans){
	if(parans.value){
		Alloy.Collections.empresas.where({num: parans.source.chave})[0].destroy();
		$.empresas.fetch();
		Alloy.Collections.empresas.trigger("change");
	}
}
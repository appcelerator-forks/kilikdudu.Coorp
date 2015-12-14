/**
 * @class controllers.Novidade.PopUpNovidades
 * Popup contendo a lista dos módulos com descrição.
 * @alteracao 04/03/2015 180419 Projeto Carlos Eduardo Santos Alves Domingos
 * Criação.
 */
var args = arguments[0] || {};

/**
 * @method init
 * Construtor da classe.
 * @alteracao 04/03/2015 180419 Projeto Carlos Eduardo Santos Alves Domingos
 * Criação.
 */
$.init = function(parans){
	Alloy.Globals.configPopUp($);
};

/**
 * @event fechar
 * Fecha a popup.
 * @alteracao 04/03/2015 180419 Projeto Carlos Eduardo Santos Alves Domingos
 * Criação.
 */
function fechar(){
	$.close();
}

/**
 * @event listar
 * Mostra a lista de novidades para o módulo selecionado.
 * @alteracao 04/03/2015 180419 Projeto Carlos Eduardo Santos Alves Domingos
 * Criação.
 */
function listar(e){
	var lstNovidades = Alloy.createController("Novidade/ListaNovidades", {descrModulo: e.source.desc, numModulo: e.source.numero});
	Alloy.Globals.Transicao.proximo(lstNovidades, lstNovidades.init, {});
}
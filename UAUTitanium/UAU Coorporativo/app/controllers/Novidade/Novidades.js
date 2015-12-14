/**
 * @class controllers.Novidade.Novidades
 * Lista horizontal contendo os módulos.
 * @alteracao 04/03/2015 180419 Projeto Carlos Eduardo Santos Alves Domingos
 * Criação.
 */
var args = arguments[0] || {};

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

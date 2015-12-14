/**
 * @class widgets.Util.Usuario
 * Utilitários do usuário.
 * @alteracao 21/09/2015 199320 Projeto Carlos Eduardo Santos Alves Domingos
 * Criação.
 */
var args = arguments[0] || {};

/**
 * @method checaServicoDisponivel
 * Válida se o serviço pode ser adicionado.
 * @param {String} servico Serviço que se deseja adicionar.
 * @alteracao 21/09/2015 199320 Projeto Carlos Eduardo Santos Alves Domingos
 * Criação.
 */
$.checaServicoDisponivel = function(servico){
	for(var i = 0; i < Alloy.Globals.ListaServicosUsuario.length; i++){
		if(Alloy.Globals.ListaServicosUsuario[i].servico == servico && !Alloy.Globals.ListaServicosUsuario[i].acesso){
			return false;
		}
	}
	return true;
};
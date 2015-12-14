/**
 * @class widgets.Login.UltimoLogin
 * Realiza as operações de persistencia do modelo widgets.Login.models.UltimoLogin
 * @private
 * @alteracao 21/01/2015 176562 Projeto Carlos Eduardo Santos Alves Domingos
 * Criação.
 */
var args = arguments[0] || {};

/**
 * @method resetUltimoLogin
 * Deleta as informações do UltimoLogin
 * @private
 * @alteracao 21/01/2015 176562 Projeto Carlos Eduardo Santos Alves Domingos
 * Criação.
 */
function resetUltimoLogin(){
	try{
		var last = Widget.createCollection("UltimoLogin");
		last.fetch();
		Alloy.Globals.DAL.destroyColecao(last);
	}
	catch(e){
		Alloy.Globals.onError(e.message, "resetUltimoLogin", "app/widgets/Login/Controllers/UltimoLogin.js");
	}
}

/**
 * @method createUltimoLogin
 * Persiste as informações do UltimoLogin, veja widgets.Login.models.UltimoLogin
 * @param {Object} args Informações do UltimoLogin validado.
 * @param {String} args.Codigo Código do usuário, veja widgets.Login.models.Usuario.Codigo
 * @param {String} args.token Token da empresa, veja widgets.Login.models.Empresa.token
 * @alteracao 21/01/2015 176562 Projeto Carlos Eduardo Santos Alves Domingos
 * Criação.
 */
$.createUltimoLogin = function(args){
	try{
		resetUltimoLogin();
		var ultimologin = Widget.createModel("UltimoLogin", {codusuario: args.Codigo, token: args.token});
		ultimologin.save();
	}
	catch(e){
		Alloy.Globals.onError(e.message, "createUltimoLogin", "app/widgets/Login/Controllers/UltimoLogin.js");
	}
};

/**
 * @method getInfoUltimoLogin
 * Recupera as informações do ultimo login, substituindo o Código de usuário pelo login.
 * @returns {JSONObject} 
 * @alteracao 21/01/2015 176562 Projeto Carlos Eduardo Santos Alves Domingos
 * Criação.
 */
$.getInfoUltimoLogin = function(){
	try{
		var ultimoCol = Widget.createCollection("UltimoLogin");
		ultimoCol.fetch();
		
		if(ultimoCol.length > 0){
			var ultimo = ultimoCol.at(0).toJSON();
			
			var usuarios = Widget.createCollection("Usuario");
			usuarios.fetch();
			var usuario = usuarios.where({Codigo: parseInt(ultimo.codusuario)})[0].toJSON();
			
			return {login: usuario.Login, UsuarioUAU: usuario.UsuarioUAU, token: ultimo.token};
		}
		else{
			return false;
		}
	}
	catch(e){
		Alloy.Globals.onError(e.message, "getInfoUltimoLogin", "app/widgets/Login/Controllers/UltimoLogin.js");
	}
};

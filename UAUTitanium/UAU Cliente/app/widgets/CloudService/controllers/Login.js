/**
 * @class widgets.CloudService.Login
 * Realiza o login do usuário na nuvem do appcelerator.
 * @alteracao 23/07/2015 183484 Projeto Carlos Eduardo Santos Alves Domingos
 * Criação. 
 */
var args = arguments[0] || {};

var tokenEmpresa = null;

$.checkLogin = function(parans){
	tokenEmpresa = parans.tokenEmpresa;
	var dados = geraDadosusuario(parans.clienteId, parans.tokenEmpresa, parans.tipo);
	Ti.API.info(JSON.stringify(dados));
	var localUsers = Widget.createCollection("CloudUser");
	localUsers.fetch();
	var localUser = localUsers.where({CodigoUAU: dados.idUsuarioUAU})[0];
	if(localUser){
		localUser = localUser.toJSON();
		Alloy.Globals.Cloud.sessionId = localUser.SessionId;
		solicitaInscricaoCanal(parans.tokenEmpresa, localUser.CloudId);
	}else{
		function loginACS(){
			Alloy.Globals.Cloud.Users.login({
				login: dados.userLogin,
				password: dados.senha
			}, function (e) {
			    if (e.success) {
			        var user = e.users[0];
			        gravaUsuario(user, dados.idUsuarioUAU);
			        solicitaInscricaoCanal({token: parans.tokenEmpresa, cloudId: user.id});
				} else {
				    Ti.API.info('Error:\n' +
				            ((e.error && e.message) || JSON.stringify(e)));
				    Ti.API.info("Código usuario: " + parans.clienteId + '\nToken empresa: ' + parans.tokenEmpresa + '\nSenha: ' + dados.senha);
				    cadastrarUsuario(dados);
				}
			});
		}
		liberaNovoLogin(localUsers, loginACS);
	}
};

function cadastrarUsuario(dados){
	Alloy.Globals.Cloud.Users.create({
		username: dados.userLogin,
	    password: dados.senha,
	    password_confirmation: dados.senha
	}, function (e) {
	    if (e.success) {
	        var user = e.users[0];
	        gravaUsuario(user, dados.idUsuarioUAU);
	        solicitaInscricaoCanal({token: dados.tokenEmpresa, cloudId: user.id}); 
	    } else {
	        Ti.API.info('Error:\n' +
	            ((e.error && e.message) || JSON.stringify(e)));  
	    }
	});
};

function geraDadosusuario(id, token, tipo){
	var userLogin = token + "_" + id + "_" + tipo;
	var senha = Ti.Utils.md5HexDigest(token + id);
	return {userLogin: userLogin, senha: senha, idUsuarioUAU: id, tokenEmpresa: token};
}

function gravaUsuario(user, usuarioUAUId){
	var usuarios = Widget.createCollection("CloudUser");
	usuarios.fetch();
	Alloy.Globals.DAL.destroyColecao(usuarios);
	var usuario = Widget.createModel("CloudUser", {CodigoUAU: usuarioUAUId, CloudId: user.id, Login: user.username, SessionId: Alloy.Globals.Cloud.sessionId});
	usuario.save();
	//Coloco as informações de usuário em uma variável global.
	Alloy.Globals.CloudUser = usuario.toJSON();
}

function solicitaInscricaoCanal(parans){
	var inscricaoController = Widget.createController("Notificacao");
	inscricaoController.CadastroNotificacoes({token: parans.token, cloudId: parans.cloudId});
}

function liberaNovoLogin(usuarios, callback){
	if(usuarios.length > 0){
		cancelaNotificacaoUsuario(usuarios, callback);
	}else{
		callback();
	}	
}

function cancelaNotificacaoUsuario(usuario, callback){
	var usuario = usuarios.at(0).toJSON();
	Alloy.Globals.Cloud.sessionId = usuario.SessionId;
	Alloy.Globals.DeviceToken = usuario.DeviceToken;
	var canaisUsuario = Widget.createCollection("Inscricao");
	canaisUsuario.fetch();
	cancelaInscricao(0, canaisUsuario, continuaExecucao);
	function continuaExecucao(){
		Alloy.Globals.DAL.destroyColecao(canaisUsuario);
		callback();
	}
}

function cancelaInscricao(index, canais, callback){
	if(canais.at(index)){
		Alloy.Globals.Cloud.PushNotifications.unsubscribe({
	        device_token: Alloy.Globals.DeviceToken,
	        channel: canal + "_" + empresaToken,
	        type: Ti.Platform.name == 'android' ? 'android' : 'ios'
	    }, function (e) {
	        if (e.success) {
	            Ti.API.info('Inscrição no canal: ' + canal + "_" + empresaToken + " cancelado.");
	        } else {
	            Ti.API.info('Erro inscrição canal:\n' + ((e.error && e.message) || JSON.stringify(e)) + ", cancelamento não realizado.");
	        }
	 		cancelaInscricao(index + 1, canais, callback);
	    });
	}else{
		callback();
	}
}

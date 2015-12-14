/**
 * @class widgets.Login.SolicitacoesLogin
 * Responsável pelas rotinas que valida o token da empresa no SuportNet e validar o login e senha no domínio da empresa.
 * @private
 * @alteracao 21/01/2015 176562 Projeto Carlos Eduardo Santos Alves Domingos
 * Criação.
 */
var args = arguments[0] || {};

/**
 * @property {Function} sucessoLogin Caso o login seja validado, esta rotina será executada. 
 * @private 
 */
var sucessoLogin = null;
/**
 * @property {Function} failLogin Caso o login não seja validado, esta rotina será executada. 
 * @private 
 */
var failLogin = null;
/**
 * @property {String} currentToken Token a ser validado
 */
var currentToken = null;
/**
 * @property {Object} info Dados de login e senha.
 * @property {String} info.login Login do usuário.
 * @property {String} info.senha Senha do usuário.
 * @property {Number} info.codEmpresa Código da empresa.
 * @private 
 */
var info = null;

/**
 * @event failAdressServer
 * Rotina executada quando ocorre algum erro durante a validação do token.
 * @private
 * @alteracao 21/01/2015 176562 Projeto Carlos Eduardo Santos Alves Domingos
 * Criação.
 */
function failAdressServer(){
	if(failLogin){
		failLogin("Servidor fora do ar.\nTente novamente em alguns instantes.");	
	}
	else{
		Alloy.Globals.Alerta("Erro ao entrar", "Token inválido ou servidor fora do ar.\nTente novamente em alguns instantes.");
	}
}

/**
 * @method failGetHospedagem
 * Invocada quando ocorre alguma falha ao se tentar  obter o endereço de hospedagem do UAU Web.
 * @private
 * @alteracao 21/01/2015 176562 Projeto Carlos Eduardo Santos Alves Domingos
 * Criação.
 */
function failGetHospedagem(e){
	failLogin("Não foi possível acessar as informações no servidor da empresa."/* + "\nCódigo: " + e.code + "\nDescrição: "+ e.error*/);
}

/**
 * @method failAcessLogin
 * Rotina executada quando ocorre algum erro ao acessar o webservice da empresa vinculada ao token.
 * @private
 * @alteracao 21/01/2015 176562 Projeto Carlos Eduardo Santos Alves Domingos
 * Criação.
 */
function failAcessLogin(e){
	failLogin("Ocorreu um erro ao tentar utilizar os serviços da empresa."/* + "\nCódigo: " + e.code + "\nDescrição: "+ e.error*/);
}

/**
 * @method failListaEmpresas
 * Rotina executada quando ocorre algum erro ao acessar o webservice que fornece a lista de empresas.
 * @private
 * @alteracao 09/07/2015 191658 Projeto Carlos Eduardo Santos Alves Domingos
 * Criação.
 */
function failListaEmpresas(e){
	Alloy.Globals.Alerta("Erro", "Ocorreu um erro ao tentar obter a lista de empresas."/* + "\nCódigo: " + e.code + "\nDescrição: "+ e.error*/);
}

$.gravaUsuario = function(dados){
	try{
		var usuarios = Widget.createCollection("Usuario");
		usuarios.fetch();
		Alloy.Globals.DAL.destroyColecao(usuarios);
		var usuario = Widget.createModel("Usuario", dados);
		usuario.save();
		return usuario;
	}catch(e){
		Alloy.Globals.onError(e.message, "gravaUsuario", "app/widgets/Login/controllers/SolicitacoesLogin.js");
	}
};

/**
 * @event sucessAcesslogin
 * Rotina executada no sucesso a validação do login e senha.
 * @param {BackBone.Collection} ret Coleção retornada pelo WebService AutentificadorMob.asmx/AutentificarUsuarioTitanium 
 * @alteracao 21/01/2015 176562 Projeto Carlos Eduardo Santos Alves Domingos
 * Criação.
 */
function sucessAcesslogin(ret){
	try{
		var resposta = ret.at(0).toJSON();
		if(resposta.Sucesso){
			if(resposta.Pessoa){
				var usuario = $.gravaUsuario(resposta.Pessoa);
				//Coloco as informações de usuário em uma variável global.
				Alloy.Globals.Usuario = usuario.toJSON();
				//Gravo os dados de login e token.
				Widget.createController("UltimoLogin").createUltimoLogin({Codigo: Alloy.Globals.Usuario.UsuarioUAU, token: Alloy.Globals.Empresa.token});
				sucessoLogin();
			}
			else{
				failLogin("Login e senha válidos, porém não existe nenhum dado cadastrado para o usuario");	
			}
		}
		else{
			failLogin(resposta.Mensagem);
		}
	}
	catch(e){
		Alloy.Globals.onError(e.message, "sucessAcesslogin", "app/widgets/Login/controllers/SolicitacoesLogin.js");
	}
	
}

/**
 * @method executeLogin
 * Método responsável por validar o token, login e senha.
 * @param {Function} callOK Rotina utilizada em widgets.Login.SolicitacoesLogin.sucessoLogin
 * @param {Function} callFail widgets.Login.SolicitacoesLogin.failLogin
 * @param {String} token Token que referencia a empresa dentro do SuporteNet.
 * @param {String} dados Objeto do tipo widgets.Login.SolicitacoesLogin.info
 * @alteracao 21/01/2015 176562 Projeto Carlos Eduardo Santos Alves Domingos
 * Criação.
 */
$.executeLogin = function(callOK, callFail, token, dados){
	info = dados;
	sucessoLogin = callOK;
	failLogin = callFail;
	$.getDadosEmpresa(verificaHospedagem, token);
};

/**
 * @method getListaEmpresas
 * Tenta obter a lista de empresas.
 * @param {BackBone.Collection} colecao Colecao que será preenchida com a lista de empresas.
 * @param {Function} callOk Função executada caso a lista seja obtida.
 * @param {Object} parans Parâmetros do método de callback.
 */
$.getListaEmpresas = function(colecao, callOK, parans){
	
	var callbackSucessListaEmpresas = function(e){
		callOK(parans);
	};
	
	var novoWebService = Alloy.createWidget("WebService");
	var httpRequest = novoWebService.iniciarHttpRequest({
		url: Alloy.Globals.EmProducao?"http://www.uau.com.br/webservices/wsregistrouau.asmx/ConsultarEmpresasUauWebPorStatus":"http://192.168.2.125:8282/wsEmpresa.asmx/ConsultarEmpresasUauWebPorStatus",
		metodo: "POST", 
		callback: callbackSucessListaEmpresas,
		error: failListaEmpresas,
		timeout: 60000,
		colecao: colecao,
	});
	if(httpRequest){
		httpRequest.adicionaParametro({AtivInativ: 0});
		httpRequest.NovoEnvia({outArch: true});	
	}
};

/**
 * @method getDadosEmpresa
 * Método responsável por validar o token.
 * @param {Object} callOK Rotina utilizada em widgets.Login.SolicitacoesLogin.sucessoLogin
 * @param {Object} token Token que referencia a empresa dentro do SuporteNet.
 * @alteracao 21/01/2015 176562 Projeto Carlos Eduardo Santos Alves Domingos
 * Criação.
 */
$.getDadosEmpresa = function(callOK, token, failCallback, loginUser){
	try{
		if(token == null){
			Alloy.Globals.Alerta("Alerta", "Nenhuma empresa selecionada.");
			return ;
		}
		currentToken = token;
		var callBackGravaEmpresa = function(dados){
			var dadosEmpresa = dados.at(0).toJSON();
			var empresa = adicionarEmpresa(dadosEmpresa, loginUser);
			callOK(empresa, validaUsuarioSenha);
		};
		var novoWebService = Alloy.createWidget("WebService");
		var httpRequest = novoWebService.iniciarHttpRequest({
			url: Alloy.Globals.EmProducao?"http://www.uau.com.br/webservices/wsregistrouau.asmx/ConsultarDadosConfPortalUauPorToken":"http://192.168.2.125:8282/wsEmpresa.asmx/ConsultarDadosConfPortalUauPorToken",
			metodo: "POST", 
			callback: callBackGravaEmpresa,
			error: failCallback || failAdressServer,
			timeout: 60000
		});
		if(httpRequest){
			httpRequest.adicionaParametro({token: currentToken});
			httpRequest.NovoEnvia({outArch: true});	
		}
	}
	catch(e){
		Alloy.Globals.onError(e.message, "checkLogin", "app/widgets/Login/controllers/SolicitacoesLogin.js");
	}
};

/**
 * @method verificaHospedagem
 * Resposável por buscar o endereço do UAU Web.
 * @private
 * @param {BackBone.Model} empresa Dados da empresa obtido a partir do suportnet.
 * @param {Function} callOk Função executada caso o serviço seja bem sucedido.
 * @alteracao 05/03/2015 180419 Projeto Carlos Eduardo Santos Alves Domingos
 * Criação.
 */
function verificaHospedagem(empresa, callOK){
	try{
		var callbackVerificaHospedagem = function(dados){
			var upEmpresa = Widget.createModel("Empresa", {num: empresa.num, urlWs: empresa.urlWs, email: empresa.email, 
				dataAlter: Alloy.Globals.format.NetDateTimeParaFormatSQLite(empresa.dataAlter), descricao: empresa.descricao, 
				token: currentToken, urlMobileWebAPI: dados.at(0).toJSON().hospedaWebAPI, login: info.login});
			upEmpresa.save();
			if(Alloy.Collections.empresas){
				Alloy.Collections.empresas.fetch();
				Alloy.Collections.empresas.trigger("change");	
			}	
			Ti.API.info(JSON.stringify(upEmpresa.toJSON()));
			callOK(upEmpresa.toJSON());
		};
		var novoWebService = Alloy.createWidget("WebService");
		var httpRequest = novoWebService.iniciarHttpRequest({
			url: Alloy.Globals.LocaWebDomain + "api/Configuracao/getHospedagem", 
			metodo: "POST", 
			callback: callbackVerificaHospedagem,
			error: failGetHospedagem,
			timeout: 60000
		});
		if(httpRequest){
			httpRequest.adicionaParametro({_wsDomain: empresa.urlWs});
			httpRequest.NovoEnvia({outArch: true});	
		}
			
	}
	catch(e){
		Alloy.Globals.onError(e.message, "verificaHospedagem", "app/widgets/Login/controllers/SolicitacoesLogin.js");
	}
};

/**
 * @method validaUsuarioSenha
 * Valida o login e a senha.
 * @param {BackBone.Model} empresa Dados da empresa obtido a partir do suportnet.
 * @alteracao 21/01/2015 176562 Projeto Carlos Eduardo Santos Alves Domingos
 * Criação.
 */
function validaUsuarioSenha(empresa){
	try{
		//Define se o aplicativo consome os web services localizados na loca web ou no servidor do cliente.
		Alloy.Globals.MainDomain = empresa.urlMobileWebAPI || Alloy.Globals.LocaWebDomain;
		Ti.API.info(Alloy.Globals.MainDomain);
		Alloy.Globals.Empresa = empresa;
		var servicoAutentificador = "api/Validador/ValidaUsuario";
		var novoWebService = Alloy.createWidget("WebService");
		var httpRequest = novoWebService.iniciarHttpRequest({
			url: Alloy.Globals.MainDomain + servicoAutentificador, 
			metodo: "POST", 
			callback: sucessAcesslogin,
			error: failAcessLogin,
			timeout: 60000
		});
		if(httpRequest){
			httpRequest.adicionaParametro({usuario: info.login, senha: info.senha, CodEmpresa: info.codEmpresa});
			httpRequest.NovoEnvia();
		}
	}
	catch(e){
		Alloy.Globals.onError(e.message, "validaUsuarioSenha", "app/widgets/Login/controllers/SolicitacoesLogin.js");
	}	
}

/**
 * @method adicionarEmpresa
 * Persiste no SQLite os dados da empresa vinculada ao token.
 * @private
 * @param {Object} colec Coleção retornada pelo WebService wsempresa.asmx/CarregarConfPortalEmpresaMobile
 * @returns {JSONObject}
 * @alteracao 21/01/2015 176562 Projeto Carlos Eduardo Santos Alves Domingos
 * Criação.
 * @alteracao 09/07/2015 191657 Projeto Carlos Eduardo Santos Alves Domingos
 * Grava o login do usuário, com isso o usuário é vinculado a empresa.
 */
function adicionarEmpresa(colec, loginUser){
	try{
		var loginVinculado = loginUser || info.login;
		var dadosEmpresa = colec;
		var empresa = Widget.createModel("Empresa", {num: dadosEmpresa.NumEmp_PWeb, urlWs: dadosEmpresa.URLWS_PWeb, email: dadosEmpresa.EmailContato_PWeb, 
			dataAlter: Alloy.Globals.format.NetDateTimeParaFormatSQLite(dadosEmpresa.DataAlt_Pweb), descricao: dadosEmpresa.DescrPortalUAU_PWeb, 
			token: currentToken, urlMobileWebAPI: null, login: loginVinculado});
		empresa.save();
		if(Alloy.Collections.empresas){
			Alloy.Collections.empresas.fetch();
			Alloy.Collections.empresas.trigger("change");	
		}
		return empresa.toJSON();
	}
	catch(e){
		Alloy.Globals.onError(e.message, "adicionarEmpresa", "app/widgets/Login/controllers/SolicitacoesLogin.js");
	}
}

/**
 * @method failVerificaConfEmpresa
 * Callback de falha ao obter a lista de empresas
 * @private
 * @alteracao 09/07/2015 191658 Projeto Carlos Eduardo Santos Alves Domingos
 * Criação.
 */
function failVerificaConfEmpresa(e){
	Alloy.Global.Alerta("Ocorreu um erro ao tentar verificar as configurações da empresa."/* + "\nCódigo: " + e.code + "\nDescrição: "+ e.error*/);
}

/**
 * @method verificaConfEmpresa
 * Tenta obter a configuração da empresa.
 * @param {Object} parans Parâmetros.
 * @param {Number} parans.CodEmpresa Código da empresa.
 * @alteracao 09/07/2015 191658 Projeto Carlos Eduardo Santos Alves Domingos
 * Criação.
 */
$.verificaConfEmpresa = function(parans){
	var novoWebService = Alloy.createWidget("WebService");
	var httpRequest = novoWebService.iniciarHttpRequest({
		url: Alloy.Globals.LocaWebDomain + "api/Cliente/ValidaConfEmpresa", 
		metodo: "POST", 
		callback: parans.callback,
		error: failVerificaConfEmpresa,
		timeout: 60000
	});
	if(httpRequest){
		httpRequest.adicionaParametro({CodEmpresa: parans.CodEmpresa});
		httpRequest.NovoEnvia({outArch: true});
	}
};

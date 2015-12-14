/**
 * @class widgets.Login.login
 * Inicia a tela de login.
 * @alteracao 21/01/2015 176562 Projeto Carlos Eduardo Santos Alves Domingos
 * Criação.
 */
var args = arguments[0] || {};

/**
 * @property {Function} sucessCallback Caso o login seja validado, esta rotina será executada.
 * @private
 */
var sucessCallback = null;
/**
 * @property {Function}  failCallback Caso o login não seja validado, esta rotina será executada.
 * @private
 */
var failCallback = null;

/**
 * @property {widgets.Login.NovoToken} controlAddToken Controller da popup que adiciona um novo token.
 * @private
 */
var controlAddToken = Alloy.createWidget("Login", "NovoToken");

/**
 * @property {widgets.Login.SolicitacoesLogin} solicitacoes Classe responsável por buscar o dominio da empresa vinculada ao token e validar o login e senha neste domínio.
 * @private 
 */
var solicitacoes = Widget.createController("SolicitacoesLogin");

//Inicio uma colecao do tipo Empresa.
Alloy.Collections.empresas = Widget.createCollection("Empresa");
/**
 * @property {widgets.Login.models.Empresa} empresas Colecao do modelo Empresa.
 * @private 
 */
var empresas = Alloy.Collections.empresas;

//Carrego todas as empresas cadastradas.
empresas.fetch();

var chaves = ["token"];

/**
 * @method init
 * Construtor da classe.
 * @param {Function} sucesso Função a ser executada no sucesso do login.
 * @param {Function} falha Função a ser executada na falha do login.
 * @alteracao 21/01/2015 176562 Projeto Carlos Eduardo Santos Alves Domingos
 * Criação.
 */
$.init = function(sucesso, falha){
	try{
		sucessCallback = sucesso;
		failCallback = falha;
		$.usrname.init({nome: "Usuário", next: $.senha});
		$.senha.init({nome: "Senha"});
		$.senha.novoNome.passwordMask = true;
		$.senha.novoNome.maxLength = 15;
		$.empresa.init({nome: "Empresa", addFunc: showNovoToken, colecao: empresas, chave: chaves, coluna: "descricao"});
		controlAddToken.init({gravar: validarToken});
		Alloy.Globals.iniciarServicosLogin();
		iniciarValores();
	}
	catch(e){
		Alloy.Globals.onError(e.message, "init", "app/widgets/Login/controllers/login.js");
	}
};

/**
 * @method adicionaBotao
 * Adiciona um novo botão ao login.
 * @param {Function} titulo Descrição do botão.
 * @param {Function} callback Função a ser executada no click do botão.
 * @alteracao 16/03/2015 183507 Projeto Carlos Eduardo Santos Alves Domingos
 * Criação.
 */
$.adicionaBotao = function(titulo, callback){
	try{
		var sty = $.createStyle({
	        classes: ['CustomButton'],
	        apiName: 'Button'
	    });
		var btn = Ti.UI.createButton({
			width: "90%",
			left: "5%",
			top: "10",
			height: Alloy.Globals.CustomComponentHeight,
			funcao: callback,
			title: titulo
		});
		btn.applyProperties(sty);
		btn.addEventListener("click", function(e){
			e.source.funcao();
		});
		$.conteudo.add(btn);
	}
	catch(e){
		Alloy.Globals.onError(e.message, "adicionaBotao", "app/widgets/Login/controllers/login.js");
	}
};

/**
 * @method iniciarvalores
 * Inicia os inputs de usuario e empresa com os valores do ultimo login validado.
 * @private
 * @alteracao 21/01/2015 176562 Projeto Carlos Eduardo Santos Alves Domingos
 * Criação
 */
function iniciarValores(){
	var dados = Widget.createController("UltimoLogin").getInfoUltimoLogin();
	if(dados){
		$.usrname.setInputValue(dados.UsuarioUAU);
		var flagEmpresa = empresas.where({token: dados.token}).length;
		if(flagEmpresa > 0){
			var empresa = empresas.where({token: dados.token})[0].toJSON();
			$.empresa.setSelected(empresa.descricao, [empresa.token]);
		}
	}
}

/**
 * @event showNovoToken
 * Apresenta a popup para adicionar um novo token. Dispara ao clique do botão Adicionar.
 * @alteracao 21/01/2015 176562 Projeto Carlos Eduardo Santos Alves Domingos
 * Criação
 */
function showNovoToken(){
	controlAddToken.show();
}

/**
 * @method validarToken
 * Inicia a validação e busca do token da empresa.
 * @param {Object} parans Parâmetros do método.
 * @param {String} parans.login Login do usuário.
 * @param {String} parans.senha Senha do usuário.
 * @param {Number} parans.codEmpresa Código da empresa.
 * @alteracao 18/05/2015 187463 Projeto Carlos Eduardo Santos Alves Domingos
 * Criação
 */
function validarToken(parans){
	solicitacoes.buscaToken(parans, callbackValidarToken);
}

/**
 * @method callbackValidarToken
 * Callback de sucesso da busca e validação do token da empresa.
 * @param {BackBone.Collection} ret Dados de retorno.
 * @alteracao 18/05/2015 187463 Projeto Carlos Eduardo Santos Alves Domingos
 * Criação
 */
function callbackValidarToken(ret){
	try{
		var md = ret.at(0).toJSON();
		if(md.Sucesso){
			addNovoToken({valor: md.Token});
		}else{
			Alloy.Globals.Alerta("Falha na validação !", md.Mensagem);
		}	
	}
	catch(e){
		Alloy.Globals.onError(e.message, "callbackValidarToken", "app/widgets/Login/controllers/login.js");
	}
}

/**
 * @method addNovoToken
 * Executada quando um novo token é adicionado pela popup widgets.Login.NovoToken.
 * @private
 * @param {Object} e Resposta obtida pela popup widgets.Login.NovoToken.
 * @alteracao 21/01/2015 176562 Projeto Carlos Eduardo Santos Alves Domingos
 * Criação
 */
function addNovoToken(e){
	solicitacoes.getDadosEmpresa(checkAddToken, e.valor);
}

/**
 * @event checkAddToken 
 * No caso de sucesso ao adicionar o novo token, está rotina é executada. 
 * @alteracao 21/01/2015 176562 Projeto Carlos Eduardo Santos Alves Domingos
 * Criação
 */
function checkAddToken(){
	Alloy.Globals.Alerta("Sucesso", "Token adicionado");
}

/**
 * @event checkLogin
 * Valida se os controles foram preenchidos e então inicia a validação do token no SuporteNet e do login e senha no domínio da empresa.
 * Disparo ao se clicar no botão Entrar.
 * @private
 * @alteracao 21/01/2015 176562 Projeto Carlos Eduardo Santos Alves Domingos
 * Criação
 */
function checkLogin(){
	try{
		var check = Alloy.createWidget("GUI", "Mensagem");
		if($.empresa.getSelected().chave[0] == ""){
			check.init("Alerta", "É necessário selecionar o token.");
			check.show({callback: $.empresa.selecionar});
			return;		
		}
		if($.usrname.getInputValue() == ""){
			check.init("Alerta", "Preencha o login.");
			check.show({callback: $.usrname.selecionar});
			return;
		}
		if($.usrname.getInputValue().length > 8){
			check.init("Alerta", "O login possuí no máximo 8 caracteres.");
			check.show({callback: $.usrname.selecionar});
			return;
		}
		if($.senha.getInputValue() == ""){
			check.init("Alerta", "Preencha a senha.");
			check.show({callback: $.senha.selecionar});
			return;
		}
		if($.senha.getInputValue().length > 15){
			check.init("Alerta", "A senha deve conter no máximo 15 caracteres.");
			check.show({callback: $.senha.selecionar});
			return;
		}
		solicitacoes.executeLogin(sucessCallback, failCallback, $.empresa.getSelected().chave[0], 
			{login: $.usrname.getInputValue(), senha: $.senha.getInputValue()});
	}
	catch(e){
		Alloy.Globals.onError(e.message, "checkLogin", "app/widgets/Login/controllers/login.js");
	}
}

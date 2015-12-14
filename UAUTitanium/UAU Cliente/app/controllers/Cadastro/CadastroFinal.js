/**
 * @class controllers.Cadastro.CadastroFinal
 * Tela final de cadastro do usuário.
 * @alteracao 09/07/2015 191658 Projeto Carlos Eduardo Santos Alves Domingos
 * Criação. 
 */
var args = arguments[0] || {};

/**
 * @property {Number} CodEmpresa Código da empresa.
 * @private 
 */
var CodEmpresa = args.CodEmpresa;
/**
 * @property {String} UrlEmpresa Url do webservice da empresa.
 * @private
 */
var UrlEmpresa = args.UrlEmpresa;
/**
 * @property {String} DataNasc Data de nascimento da pessoa.
 * @private
 */
var DataNasc =  args.DataNasc; 
/**
 * @property {String} CpfCnpj Cpf ou cnpj da pessoa.
 * @private
 */
var CpfCnpj =  args.CpfCnpj;
/**
 * @property {String} email Email da pessoa.
 * @private
 */
var email = args.email;

var Token = args.Token;

/**
 * @method init
 * Construtor da classe. 
 * @alteracao 10/07/2015 191658 Projeto Carlos Eduardo Santos Alves Domingos
 * Criação. 
 */
$.init = function(){
	try{
		Alloy.Globals.configWindow($.winCadastroFinal, $);
		$.minhaTopBar.iniciar("Cadastro Final");
		$.login.init({nome: "*Login", next: $.senha});
		$.senha.init({nome: "*Senha", next: $.senhaConfirma});
		$.senha.novoNome.passwordMask = true;
		$.senha.novoNome.maxLength = 6;
		$.senhaConfirma.init({nome: "*Redigite a senha"});
		$.senhaConfirma.novoNome.passwordMask = true;
		$.senhaConfirma.novoNome.maxLength = 6;
	}
	catch(e){
		Alloy.Globals.onError(e.message, "init", "app/controllers/BoletoDetalhe.js");
	} 
};

/**
 * @method checkCriarConta
 * Válida se os dados foram preenchidos.
 * @return {Boolean}
 * @alteracao 10/07/2015 191658 Projeto Carlos Eduardo Santos Alves Domingos
 * Criação.
 */
function checkCriarConta(e){
	try{
		var check = Alloy.createWidget("GUI", "Mensagem");
		if($.login.getInputValue() == ""){
			check.init("Alerta", "Preencha o login");
			check.show({callback: $.login.selecionar});
			return false;
		}else if($.login.getInputValue().length <= 8){
			check.init("Alerta", "O login deve conter mais de 8 caracteres");
			check.show({callback: $.login.selecionar});
			return false;
		}
		
		if($.senha.getInputValue() == ""){
			check.init("Alerta", "Preencha a senha");
			check.show({callback: $.senha.selecionar});
			return false;
		}else if($.senha.getInputValue().length != 6){
			check.init("Alerta", "A senha deve conter 6 caracteres.");
			check.show({callback: $.senha.selecionar});
			return false;
		}
		
		if($.senhaConfirma.getInputValue() == ""){
			check.init("Alerta", "Confirme a senha");
			check.show({callback: $.senhaConfirma.selecionar});
			return false;
		}else if($.senhaConfirma.getInputValue() != $.senha.getInputValue()){
			check.init("Alerta", "A repetição da senha não confere com a senha.");
			check.show({callback: $.senhaConfirma.selecionar});
			return false;
		}
		
		return true;
	}
	catch(e){
		Alloy.Globals.onError(e.message, "checkLogin", "app/widgets/Login/controllers/login.js");
	}
}

/**
 * @method criarConta
 * Verifica se as informações foram preenchidas e solicita o cadastro.
 * @alteracao 10/07/2015 191658 Projeto Carlos Eduardo Santos Alves Domingos
 * Criação.
 */
function criarConta(){ 
	if(checkCriarConta()){
		solicitaCadastro();
	}
}

/**
 * @method solicitaCadastro
 * Tenta realizar o cadastro do usuário.
 * @alteracao 10/07/2015 191658 Projeto Carlos Eduardo Santos Alves Domingos
 * Criação.
 */
function solicitaCadastro(){
	var novoWebService = Alloy.createWidget("WebService");
	var httpRequest = novoWebService.iniciarHttpRequest({
		url: Alloy.Globals.LocaWebDomain + "api/Cliente/AtualizaCadastroPessoa",
		metodo: "POST", 
		callback: confirmarCriarConta,
		error: failValidaCriarConta,
		timeout: 60000
	});
	if(httpRequest){
		httpRequest.adicionaParametro({_wsDomain: UrlEmpresa, _mobEmProducao: Alloy.Globals.EmProducao?'true':'false', CodEmpresa: CodEmpresa, 
			DataNasc: DataNasc, CpfCnpj: CpfCnpj, Email: email, Senha: $.senha.getInputValue(), Login: $.login.getInputValue()});
		httpRequest.NovoEnvia({outArch: true});	
	}
}

/**
 * @method failValidaCriarConta
 * Callback de falha ao solicitar o cadastro de usuário.
 * @alteracao 10/07/2015 191658 Projeto Carlos Eduardo Santos Alves Domingos
 * Criação.
 */
function failValidaCriarConta(e){
	Alloy.Globals.Alerta("Falhou", "Ocorreu um erro ao tentar criar a conta." + "\nCódigo: " + e.code + "\nDescrição: "+ e.error);
}

/**
 * @method confirmarCriarConta
 * Callback de falha ao solicitar o cadastro de usuário.
 * @param {BackBone.Collection} e Coleção de retorno. 
 * @alteracao 10/07/2015 191658 Projeto Carlos Eduardo Santos Alves Domingos
 * Criação.
 */

function confirmarCriarConta(e){
	var res = e.at(0).toJSON();
	if(res.sucesso){
		//Gravo os dados básicos do usuário.
		var solicitacoes = Alloy.createWidget("Login", "SolicitacoesLogin");
		solicitacoes.gravaUsuario({Login: $.login.getInputValue(), UsuarioUAU: $.login.getInputValue(), Codigo: res.Dados.Codigo});
		
		var check = Alloy.createWidget("GUI", "Mensagem");
		check.init("Sucesso", res.mensagem.replace(/\<BR\>/g, "\n"));
		check.show({callback: gravaEmpresa});
	}else{
		Alloy.Globals.Alerta("Erro", res.mensagem.replace(/\<BR\>/g, "\n"));
	}
}

/**
 * @method gravaEmpresa
 * Grava a empresa, isso facilita na usabilidade do cliente.
 * @private
 * @alteracao 12/07/2015 191658 Projeto Carlos Eduardo Santos Alves Domingos
 * Criação.
 */
function gravaEmpresa(){
	var solicitacoes = Alloy.createWidget("Login", "SolicitacoesLogin");
	solicitacoes.getDadosEmpresa(gravaUltimoLogin, Token, voltar, $.login.getInputValue());
}

function gravaUltimoLogin(){
	Alloy.createWidget("Login", "UltimoLogin").createUltimoLogin({Codigo: $.login.getInputValue(), token: Token});
	voltar();
}

/**
 * @method voltar
 * Grava este usuário como sendo o último login válido. Reinicia o aplicativo.
 * @alteracao 10/07/2015 191658 Projeto Carlos Eduardo Santos Alves Domingos
 * Criação.
 */
function voltar(){
	Alloy.createController("index");
}

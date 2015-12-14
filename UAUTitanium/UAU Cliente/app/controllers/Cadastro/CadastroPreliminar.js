/**
 * @class controllers.Cadastro.CadastroPreliminar
 * Cadastro preliminar do usuário.
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

var Token = args.Token;

/**
 * @method init
 * Construtor da classe. 
 * @alteracao 10/07/2015 191658 Projeto Carlos Eduardo Santos Alves Domingos
 * Criação. 
 */
$.init = function(){
	try{
		Alloy.Globals.configWindow($.winCadastroPreliminar, $);
		$.minhaTopBar.iniciar("Cadastro Preliminar");
		$.dataNascimento.init({nome: "Data de nascimento"});
		$.natureza.setGroup(["Física", "Jurídica"]);
		$.cpfcnpj.init({nome: "*CPF", next: $.email, keyboardType: Titanium.UI.KEYBOARD_NUMBER_PAD});
		$.email.init({nome: "*Email", keyboardType: Titanium.UI.KEYBOARD_EMAIL});
	}
	catch(e){
		Alloy.Globals.onError(e.message, "init", "app/controllers/BoletoDetalhe.js");
	} 
};

/**
 * @method alteraNatureza
 * Configura a tela para a natureza selecionada. 
 * @private
 * @param {Object} e Parâmetros
 * @param {Number} e.index Indice da natureza selecionada.
 * @alteracao 10/07/2015 191658 Projeto Carlos Eduardo Santos Alves Domingos
 * Criação. 
 */
function alteraNatureza(e){
	$.dataNascimento.setDesc(e.index==0?"Data de nascimento":"Data de fundação");
	$.cpfcnpj.setDesc(e.index==0?"*CPF":"*CNPJ");
	$.cpfcnpj.setInputValue("");
}

/**
 * @method validaCpfCnpj
 * Válida se o Cpf ou Cnpj é válido.
 * @private
 * @param {Object} e
 * @param {String} e.text Texto do input.
 * @alteracao 10/07/2015 191658 Projeto Carlos Eduardo Santos Alves Domingos
 * Criação. 
 */
function validaCpfCnpj(e){
	if(e.text == ""){
		return ;
	}
	if($.natureza.getSelected().index==0){
		if(Alloy.Globals.validador.validarCPF(e.text)){
				e.source.value = Alloy.Globals.format.cpf(e.text);
		}else{
			Alloy.Globals.Alerta("Alerta", "CPF inválido");
			e.source.value = Alloy.Globals.format.soDigitos(e.text);
		}
	}else{
		if(Alloy.Globals.validador.validarCNPJ(e.text)){
				e.source.value = Alloy.Globals.format.cnpj(e.text);
		}else{
			Alloy.Globals.Alerta("Alerta", "CNPJ inválido");
			e.source.value = Alloy.Globals.format.soDigitos(e.text);
		}
	}
}

/**
 * @method checkEntrar
 * Válida se o usuário informou todos os dados obrigatórios.
 * @private
 * @return {Boolean}
 * @alteracao 10/07/2015 191658 Projeto Carlos Eduardo Santos Alves Domingos
 * Criação. 
 */
function checkEntrar(){
	try{
		var check = Alloy.createWidget("GUI", "Mensagem");
		if($.cpfcnpj.getInputValue() == ""){
			check.init("Alerta", "Preencha o " + ($.natureza.getSelected().index==0?"CPF":"CNPJ"));
			check.show({callback: $.cpfcnpj.selecionar});
			return false;
		}else if(!(
			$.natureza.getSelected().index==0?
				Alloy.Globals.validador.validarCPF($.cpfcnpj.getInputValue()):
				Alloy.Globals.validador.validarCNPJ($.cpfcnpj.getInputValue()))
			){
			check.init("Alerta", ($.natureza.getSelected().index==0?"CPF":"CNPJ") + " inválido.");
			check.show({callback: $.cpfcnpj.selecionar});
			return false;	
		}
		if($.email.getInputValue() == ""){
			check.init("Alerta", "Preencha o email");
			check.show({callback: $.email.selecionar});
			return false;
		}else if(!Alloy.Globals.validador.validarEmail($.email.getInputValue())){
			check.init("Alerta", "Email inválido");
			check.show({callback: $.email.selecionar});
			return false;
		}
		return true;
	}
	catch(e){
		Alloy.Globals.onError(e.message, "checkLogin", "app/widgets/Login/controllers/login.js");
	}
}

/**
 * @method entrar
 * Verifica se as informações foram preenchidas e solicita a validação preliminar do cadastro.
 * @private
 * @alteracao 10/07/2015 191658 Projeto Carlos Eduardo Santos Alves Domingos
 * Criação.
 */
function entrar(e){
	if(checkEntrar()){
		validaCadastroPreliminar();
	}
}

/**
 * @method validaCadastroPreliminar
 * Tenta validar os dados do cadastro preliminar.
 * @private
 * @alteracao 10/07/2015 191658 Projeto Carlos Eduardo Santos Alves Domingos
 * Criação.
 */
function validaCadastroPreliminar(){
	var novoWebService = Alloy.createWidget("WebService");
	var httpRequest = novoWebService.iniciarHttpRequest({
		url: Alloy.Globals.LocaWebDomain + "api/Cliente/ValidaCadastroPessoa",
		metodo: "POST", 
		callback: confirmaEntrar,
		error: failValidaCadastroPreliminar,
		timeout: 60000
	});
	if(httpRequest){
		httpRequest.adicionaParametro({_wsDomain: UrlEmpresa, CodEmpresa: CodEmpresa, 
			DataNasc: Alloy.Globals.format.customFormatData($.dataNascimento.getSelected().data, "DD/MM/YYYY", "YYYY-MM-DD"), 
			CpfCnpj: Alloy.Globals.format.soDigitos($.cpfcnpj.getInputValue())});
		httpRequest.NovoEnvia({outArch: true});	
	}
}

/**
 * @method failValidaCadastroPreliminar
 * Callback de falha da validação dos dados proliminares.
 * @private
 * @alteracao 10/07/2015 191658 Projeto Carlos Eduardo Santos Alves Domingos
 * Criação.
 */
function failValidaCadastroPreliminar(e){
	Alloy.Globals.Alerta("Falhou", "Ocorreu um erro ao tentar validar o cadastro preliminar." + "\nCódigo: " + e.code + "\nDescrição: "+ e.error);
}

/**
 * @method confirmaEntrar
 * Callback de sucesso da validação dos dados proliminares.
 * @private
 * @alteracao 10/07/2015 191658 Projeto Carlos Eduardo Santos Alves Domingos
 * Criação.
 */
function confirmaEntrar(e){
	var res = e.at(0).toJSON();
	if(res.sucesso){
		var parans = {DataNasc: Alloy.Globals.format.customFormatData($.dataNascimento.getSelected().data, "DD/MM/YYYY", "YYYY-MM-DD"), 
					  CpfCnpj: Alloy.Globals.format.soDigitos($.cpfcnpj.getInputValue()), 
					  email: $.email.getInputValue(), CodEmpresa: CodEmpresa, UrlEmpresa: UrlEmpresa, Token: Token};
		var novo = Alloy.createController("Cadastro/CadastroFinal", 
			parans
		);
		Alloy.Globals.Transicao.proximo(novo, novo.init, {});	
	}else{
		Alloy.Globals.Alerta("Erro", res.mensagem.replace(/\<BR\>/g, "\n"));
	}
};

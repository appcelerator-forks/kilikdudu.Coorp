/**
 * @class widgets.Login.login
 * Inicia a tela de login.
 * @alteracao 21/01/2015 176562 Projeto Carlos Eduardo Santos Alves Domingos
 * Criação.
 * @alteracao 09/07/2015 191658 Projeto Carlos Eduardo Santos Alves Domingos
 * Utiliza a lista de empresas fornecida pelo suporte net.
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

/**
 * @property {BackBone.Collection}  empresasSupNet Coleção de empresa fornecida pelo suporte net.
 */
var empresasSupNet = Widget.createCollection("EmpresaSupNet");
//Carrego a lista de empresas do Suporte Net.
empresasSupNet.fetch();

/**
 * @property {Array} chaves Lista de chaves presentes na coleção widgets.Login.login.empresasSupNet , Cada chave consegue identificar unicamente o registro.
 */
var chaves = ["Token", "NumEmp_PWeb", "URLWS_PWeb"];

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
		$.senha.novoNome.maxLength = 6;
		$.empresa.init({nome: "Empresa", colecao: empresasSupNet, chave: chaves, coluna: "Descricao", showFunction: buscaListaEmpresas, 
			filterHandler: limiteFiltro, defaultData: montaListaExecao(), mensagem: "Digite o nome da empresa, informe no mínimo três letras."});
		iniciarValores();
	}
	catch(e){
		Alloy.Globals.onError(e.message, "init", "app/widgets/Login/controllers/login.js");
	}
};

/**
 * @method montaListaExecao
 * Consulta a lista de empresas que o usuário já tentou logar e monta uma lista de widgets.Login.login.chaves.
 * Essa lista configura a lista para mostrar como padrão a lista de empresas que o usuário já tentou logar.
 * @private
 * @alteracao 09/07/2015 191657 Projeto Carlos Eduardo Santos Alves Domingos
 * Criação.
 */
function montaListaExecao(){
	var dados = [];
	for(var i = 0; i < empresas.length; i++){
		var execao = [
			empresas.at(i).get("token"),
			empresas.at(i).get("num"),
		    empresas.at(i).get("urlWs")
		];
		dados.push(execao);
	}
	return dados;
}

/**
 * @method limiteFiltro
 * Callback do filtro de empresas.
 * Utilizada para configurar a lista para só mostrar 5 empresas de cada vez e quando o usuário digitar 3 caracteres.
 * @private
 * @param {BackBone.Collection} e Coleção filtrada.
 * @alteracao 09/07/2015 191657 Projeto Carlos Eduardo Santos Alves Domingos
 * Criação.
 */
function limiteFiltro(e){
	try{
		//Testo se o usuário digitou 3 caracteres
		if(e.filtro.length >= 3){
			//Retorno apenas 5 registros.
			return e.colecaoFiltrada.first(5);
		}else{
			//Caso o usuário não tenha digitado 3 caracteres, eu mostro apenas os registros padrão.
			var registrosPadrao =  montaListaExecao();
			return e.colecaoFiltrada.filter(function(md){
						for(var i = 0; i < registrosPadrao.length; i++){
			        		for(var j = 0; j < chaves.length; j++){
								if(md.get(chaves[j]) == registrosPadrao[i][j]){
				        			return true;
				        		}
							}	
			        	}
		            	return false;
					});
		}
	}catch(e){
		Alloy.Globals.onError(e.message, "init", "app/widgets/Login/controllers/login.js");
	}
}

/**
 * @method buscaListaEmpresas
 * Callback do click para abrir a lista de empresas.
 * @private
 * @param {Object} parans Parâmetros.
 * @param {Function} parans.show Mostra a lista de empresas. 
 * @alteracao 09/07/2015 191657 Projeto Carlos Eduardo Santos Alves Domingos
 * Criação.
 */
function buscaListaEmpresas(parans){
	solicitacoes.getListaEmpresas(empresasSupNet, confirmaListaEmpresas, {callback: parans.show});
}

/**
 * @method confirmaListaEmpresas
 * Callback de sucesso para a solicitação da lista de empresas do suporte net.
 * Atualiza a coleção widgets.Login.login.empresasSupNet.
 * @private
 * @param {Object} parans Parâmetros.
 * @param {Function} parans.callback Rotina a ser executada ao final dessa. 
 * @alteracao 09/07/2015 191657 Projeto Carlos Eduardo Santos Alves Domingos
 * Criação.
 */
function confirmaListaEmpresas(parans){
	for(var i = 0; i < empresasSupNet.length; i++){
		empresasSupNet.at(i).save({silent: true});
	}
	empresasSupNet.trigger("change");
	parans.callback();
}

/**
 * @method deletaEmpresa
 * Callback callback do evento onListlngclick.
 * Deleta uma empresa da lista.
 * @private
 * @param {Object} e Parâmetros.
 * @param {Array} e.chave Vetor de chaves do registro. 
 * @alteracao 09/07/2015 191657 Projeto Carlos Eduardo Santos Alves Domingos
 * Criação.
 */
function deletaEmpresa(e){
	try{
		var arrayEmpresa = empresas.where({num: e.chave[1]});
		if(arrayEmpresa.length == 0){
			return ;
		}
		var check = Alloy.createWidget("GUI", "Mensagem");
		check.init("Atenção !", "Gostaria de remover a empresa da lista ?", true);
		check.show({callback: sucessDeleteEmpresa});
		
		function sucessDeleteEmpresa(ev){
			if(ev.value){
				var mdEmpresa = arrayEmpresa[0];
				mdEmpresa.destroy();
				empresas.fetch();
				$.empresa.setDefaultData(montaListaExecao());
			}
		}
	}
	catch(e){
		Alloy.Globals.onError(e.message, "deletaEmpresa", "app/widgets/Login/controllers/login.js");
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
			classes: ["CustomButton"],
			apiName: 'Button',
			width: "90%",
			left: "5%",
			top: "10"
		});
		
		var btn = Ti.UI.createButton({
			funcao: callback,
			title: titulo
		});
		
		btn.applyProperties(sty);
		
		btn.addEventListener("click", function(e){
			e.source.funcao();
		});
		$.caixa.add(btn);
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
			$.empresa.setSelected(empresa.descricao, [empresa.token, empresa.num, empresa.urlWs]);
		}
	}
}

/**
 * @method setUsuarioLogin
 * Callback do onChange da lista de empresas.
 * Seleciona o usuário vinculado a empresa selcionada.
 * @private
 * @param {Object} e Parâmetros.
 * @param {Array} e.chave Vetor de chaves do registro. 
 * @alteracao 09/07/2015 191658 Projeto Carlos Eduardo Santos Alves Domingos
 * Criação
 */
function setUsuarioLogin(e){
	var resul = empresas.where({num: e.chave[1]});
	if(resul.length > 0){
		var login = resul[0].get("login");
	}
	if(login != null){
		$.usrname.setInputValue(login);	
	}
}

/**
 * @method sucessCallbackHandler
 * Callback de sucesso do login.
 * Atualiza a lista de empresas que o usuário já tentou logar.
 * @private
 * @param {Object} parans Parâmetros para o método de callback de sucesso.
 * @alteracao 09/07/2015 191658 Projeto Carlos Eduardo Santos Alves Domingos
 * Criação
 */
function sucessCallbackHandler(parans){
	empresas.fetch();
	$.empresa.setDefaultData(montaListaExecao());
	sucessCallback(parans);
}

/**
 * @method failCallbackHandler
 * Callback de falha do login.
 * Atualiza a lista de empresas que o usuário já tentou logar.
 * @private
 * @param {Object} parans Parâmetros para o método de callback de falha.
 * @alteracao 09/07/2015 191658 Projeto Carlos Eduardo Santos Alves Domingos
 * Criação
 */
function failCallbackHandler(parans){
	empresas.fetch();
	$.empresa.setDefaultData(montaListaExecao());
	failCallback(parans);
}

/**
 * @method checkLogin
 * Valida se os controles foram preenchidos e então inicia a validação do token no SuporteNet e do login e senha no domínio da empresa.
 * Disparo ao se clicar no botão Entrar.
 * @private
 * @alteracao 21/01/2015 176562 Projeto Carlos Eduardo Santos Alves Domingos
 * Criação
 */
function checkLogin(){
	try{
		var check = Alloy.createWidget("GUI", "Mensagem");
		if($.empresa.getSelected().chave == ""){
			check.init("Alerta", "É necessário selecionar a empresa.");
			check.show({callback: $.empresa.selecionar});
			return;		
		}
		if($.usrname.getInputValue() == ""){
			check.init("Alerta", "Preencha o login.");
			check.show({callback: $.usrname.selecionar});
			return;
		}
		if($.usrname.getInputValue().length < 9){
			check.init("Alerta", "O login possuí no mínimo 9 caracteres.");
			check.show({callback: $.usrname.selecionar});
			return;
		}
		if($.senha.getInputValue() == ""){
			check.init("Alerta", "Preencha a senha.");
			check.show({callback: $.senha.selecionar});
			return;
		}
		solicitacoes.executeLogin(sucessCallbackHandler, failCallbackHandler, $.empresa.getSelected().chave[0], 
			{login: $.usrname.getInputValue(), senha: $.senha.getInputValue(), codEmpresa: $.empresa.getSelected().chave[1]});
	}
	catch(e){
		Alloy.Globals.onError(e.message, "checkLogin", "app/widgets/Login/controllers/login.js");
	}
}

/**
 * @method cadastrar
 * Callback do botão cadastrar.
 * Valida se o usuário selecionou a empresa.
 * @private
 * @alteracao 09/07/2015 191658 Projeto Carlos Eduardo Santos Alves Domingos
 * Criação
 */
function cadastrar(){
	var check = Alloy.createWidget("GUI", "Mensagem");
	if($.empresa.getSelected().chave == ""){
		check.init("Alerta", "É necessário selecionar a empresa.");
		check.show({callback: $.empresa.selecionar});
		return;		
	}
	solicitacoes.verificaConfEmpresa({CodEmpresa: $.empresa.getSelected().chave[1], callback: successCadastro});
}

/**
 * @method successCadastro
 * Callback de sucesso ao se obter os dados de configuração da empresa.
 * Caso a empresa tenha a configuração válida, o sistema abre a tela de cadastro.
 * @param {BackBone.Collection} e Coleção de retorno.
 * @private
 * @alteracao 09/07/2015 191658 Projeto Carlos Eduardo Santos Alves Domingos
 * Criação
 */
function successCadastro(e){
	var res = e.at(0).toJSON();
	if(res.sucesso){
		var novo = Alloy.createController("Cadastro/CadastroPreliminar", {CodEmpresa: $.empresa.getSelected().chave[1], UrlEmpresa: $.empresa.getSelected().chave[2], Token: $.empresa.getSelected().chave[0]});
		Alloy.Globals.Transicao.proximo(novo, novo.init, {});
	}else{
		Alloy.Globals.Alerta("Erro", res.mensagem.replace(/\<BR\>/g, "\n"));
	}
}

/**
 * @method esqueciSenha
 * Callback ao se clicar no botão de esqueci a senha.
 * Valida se o usuário selecionou uma empresa.
 * Abre a tela de "Esqueci a senha".
 * @private
 * @alteracao 09/07/2015 191658 Projeto Carlos Eduardo Santos Alves Domingos
 * Criação 
 */
function esqueciSenha(){
	var check = Alloy.createWidget("GUI", "Mensagem");
	if($.empresa.getSelected().chave == ""){
		check.init("Alerta", "É necessário selecionar a empresa.");
		check.show({callback: $.empresa.selecionar});
		return;		
	}
	var novo = Alloy.createController("Cadastro/RecuperaSenha", {CodEmpresa: $.empresa.getSelected().chave[1], UrlEmpresa: $.empresa.getSelected().chave[2]});
	Alloy.Globals.Transicao.proximo(novo, novo.init, {});
}



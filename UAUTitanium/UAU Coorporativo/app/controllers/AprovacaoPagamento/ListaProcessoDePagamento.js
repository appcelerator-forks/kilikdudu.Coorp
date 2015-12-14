/**
 * @class controllers.AprovacaoPagamento.ListaProcessoDePagamento
 * Exibi a lista de processos de pagamentos que podem ser aprovados pelo usuário logado.
 * @alteracao 24/02/2015 180419 Projeto Carlos Eduardo Santos Alves Domingos
 * Criação.
 * @alteracao 05/05/2015 186931 Projeto Carlos Eduardo Santos Alves Domingos
 * Adaptação para pullToRefresh e lista infinita.
 */
var args = arguments[0] || {};

//Ativo a multiseleção
Alloy.createWidget("Util", "Tela").initConfigList($.minhaListaProcessoDePagamento, {
	click:{
		callback: detalhar
	}, 
	multiSelecao: true
});
//Escuto quando a multi-seleção é ativada.
$.minhaListaProcessoDePagamento.addEventListener("enabledMultiselection", function(e){
	//Ativo o botão de aprovar.
	btnAprovar.enable = true;
	btnAprovar.visible = true;
});
//Escuto quando a multi-seleção é desativada.
$.minhaListaProcessoDePagamento.addEventListener("disableMultiselection", function(e){
	//Desativo o botão.
	btnAprovar.enable = false;
	btnAprovar.visible = false;
});

/**
 * @property {Number} limite Limite de registros por página. 
 */
var limite = 20;

/**
 * @property {Ti.UI.Button} btnAprovar Botão utilizado para aprovar os processos. 
 */
var btnAprovar;

/**
 * @property {widgets.Util.ListaInfinita} listaInfinita Funcionalidades da lista infinita.
 */
var listaInfinita = Alloy.createWidget("Util", "ListaInfinita", {colecao: $.processosdepagamentos, lista: $.minhaListaProcessoDePagamento, 
	refreshCallback: getProcessosDePagamentos, limite: limite, multiselecao: true});

/**
 * @event myRefresher
 * Disparado no pushToRefresh.
 * @alteracao 05/05/2015 186931 Projeto Carlos Eduardo Santos Alves Domingos
 * Criação.
 */
function myRefresher(e) {
	listaInfinita.myRefresher();	
}

/**
 * @event sucesso
 * Conseguiu obter os processos do WebService.
 * @alteracao 24/02/2015 180419 Projeto Carlos Eduardo Santos Alves Domingos
 * Criação.
 */
function sucesso(){
	try{
		$.processosdepagamentos.trigger("change");
		$.ptr.hide();
		listaInfinita.reiniciarContainer();
		if($.processosdepagamentos.length == 0){
			$.minhaListaProcessoDePagamento.setOpacity(0);
			$.lblEmpty.setOpacity(1);
		}
		else{
			$.lblEmpty.setOpacity(0);
			$.minhaListaProcessoDePagamento.setOpacity(1);
		}
	}
	catch(e){
		Alloy.Globals.onError(e.message, "sucesso", "app/controllers/AprovacaoPagamento/ListaProcessoDePagamento.js");
	}
}

/**
 * @event adicionarRegistros
 * Disparado ao se clicar em buscar mais registros.
 * @alteracao 05/05/2015 186931 Projeto Carlos Eduardo Santos Alves Domingos
 * Criação.
 */
function adicionarRegistros(ret){
	listaInfinita.adicionarRegistros(ret.toJSON());
}

/**
 * @event buscar
 * Disparado ao se confirmar a texto da busca.
 * @alteracao 05/05/2015 186931 Projeto Carlos Eduardo Santos Alves Domingos
 * Criação. 
 */
function buscar(e){
	$.minhaListaProcessoDePagamento.releaseSelecionados();
	getProcessosDePagamentos({semLoader: false, limite: limite, cursor: 0});
}

/**
 * @method init
 * Construtor da classe.
 * @alteracao 24/02/2015 180419 Projeto Carlos Eduardo Santos Alves Domingos
 * Criação.
 */
$.init = function(){
	try{
		Alloy.Globals.configWindow($.winListaProcessoDePagamento, $);
		$.minhaTopBar.iniciar("Processos de pagamentos");
		btnAprovar = $.minhaTopBar.addRightButtom("/images/aprova.png", perguntaAprovarEmLote);
		btnAprovar.enable = false;
		btnAprovar.visible = false;
	}
	catch(e){
		Alloy.Globals.onError(e.message, "init", "app/controllers/AprovacaoPagamento/ListaProcessoDePagamento.js");
	}
};

/**
 * @event open
 * Disparado ao abrir a janela. Executa controllers.ListaProcessoDePagamento.getProcessosDePagamentos
 * @alteracao 24/02/2015 180419 Projeto Carlos Eduardo Santos Alves Domingos
 * Criação.
 */
$.winListaProcessoDePagamento.addEventListener("open", function(e){
	try{
		getProcessosDePagamentos({semLoader: false, limite: limite, cursor: 0});	
	}
	catch(e){
		Alloy.Globals.onError(e.message, "open", "app/controllers/AprovacaoPagamento/ListaProcessoDePagamento.js");
	}
});

/**
 * @method getProcessosDePagamentos
 * Tenta obter os processos de pagamentos a partir do WebService api/ProcessoDePagamento/ConsultarProcessoDePagamento.
 * @private
 * @alteracao 24/02/2015 180419 Projeto Carlos Eduardo Santos Alves Domingos
 * Criação.
 */
function getProcessosDePagamentos(parans){
	try{
		var limit = parans.limite;
		var semLoader = parans.semLoader;
		var cursor = parans.cursor;
		if(cursor > 0){
			listaInfinita.iniciarLoader();
		}
		var ws = Alloy.createWidget("WebService").iniciarHttpRequest({
			callback: cursor==0?sucesso:adicionarRegistros,
			error: function(e){Alloy.Globals.Alerta("Erro", "Ocorreu um erro ao obter os processos de pagamento, tente novamente mais tarde.");},
			url:  Alloy.Globals.MainDomain + "api/ProcessoPagamento/consultarProcessos", 
			metodo: "POST", 
			timeout: 120000,
			colecao: cursor==0?$.processosdepagamentos:undefined,
			semLoader: semLoader
		});
		if(ws){
			ws.adicionaParametro({usuario: Alloy.Globals.Usuario.UsuarioUAU, limit: limit, cursor: cursor, busca: $.schBusca.getValue(), 
				keyOrdena: "DtPagParc_Proc", ModoOrdenacao: "ASC"});
			ws.NovoEnvia();
		}	
	}
	catch(e){
		Alloy.Globals.onError(e.message, "getNovidades", "app/controllers/AprovacaoPagamento/ListaProcessoDePagamento.js");
	}
}

/**
 * @event formatar
 * Disparado a cada nova linha na lista de processos de pagamento. Formata os dados para a lista.
 * @param {BackBone.Model} model Modelo que representa o processo de pagamento, veja models.ProcessoDePagamento
 * @returns {JSONObject}
 * @alteracao 24/02/2015 180419 Projeto Carlos Eduardo Santos Alves Domingos
 * Criação.
 * @alteracao 10/04/2015 185753 Projeto Carlos Eduardo Santos Alves Domingos
 * Foi alterado o dado mostrado como valor do processo, de ValorProcesso para ValPagar.
 */
function formatar(model){
	try{
		var md = model.toJSON();
		md.ValorProcesso = "Valor do processo: " + Alloy.Globals.format.paraReal(md.ValPagar, ".");
		md.EmpresaObra = "Obra: " + md.EmpresaObra;
		md.Fornecedor = "Fornecedor: " + md.Fornecedor;
		md.DataProrrogacao = "Data de prorrogação: " + Alloy.Globals.format.FormatoDiaMesAno(md.DataProrrogacao);
		md.Identificador = new Object();
		md.Identificador.NumeroProcesso = md.NumeroProcesso;
		md.Identificador.EmpresaCod = md.EmpresaCod;
		md.Identificador.ObraCod = md.ObraCod;
		md.Identificador.Parcela = md.Parcela;
		md.NumeroProcesso = "Número do processo: " + md.NumeroProcesso;
		md.Parcela = "Parcela: " + md.Parcela;
		return md;	
	}
	catch(e){
		Alloy.Globals.onError(e.message, "formatar", "app/controllers/AprovacaoPagamento/ListaProcessoDePagamento.js");
	}
}

/**
 * @event detalhar
 * Detalha o processo de pagamento. Disparado ao se clicar em um registro da lista.
 * @private
 * @param {Object} e Registro selecionado.
 * @alteracao 05/05/2015 186931 Projeto Carlos Eduardo Santos Alves Domingos
 * Criação.
 */
function detalhar(e){
	try{
		//Testa se o registro selecionado é o registro que busca mais registros.
		if(e.row.tipo == "atualizar"){
			listaInfinita.mostrarMais();
			return;
		}
		Alloy.createWidget("Util", "Animation").animarClick(e.row.children[0]);
		var selectedProc = $.processosdepagamentos.where({
			NumeroProcesso: e.row.modelo.NumeroProcesso, EmpresaCod: e.row.modelo.EmpresaCod, ObraCod: e.row.modelo.ObraCod, Parcela: e.row.modelo.Parcela})
			[0].toJSON();
		var detalhes = Alloy.createController("AprovacaoPagamento/DetalhesProcessoDePagamento", {dados: selectedProc, colecao: $.processosdepagamentos});
		Alloy.Globals.Transicao.proximo(detalhes, detalhes.init, {});
	}
	catch(e){
		Alloy.Globals.onError(e.message, "detalhar", "app/controllers/AprovacaoPagamento/ListaProcessoDePagamento.js");
	}
}

/**
 * @method perguntaAprovarEmLote
 * Confirma se o usuário vai aprovar todos os processos selecionados.
 * @private
 * @alteracao 05/05/2015 186931 Projeto Carlos Eduardo Santos Alves Domingos
 * Criação.
 */
function perguntaAprovarEmLote(){
	var alerta = Alloy.createWidget("GUI", "Mensagem");
	alerta.init("Atenção", "Gostaria de aprovar todos os processos selecionados ?", true);
	alerta.show({callback: aprovarEmLote});
}

/**
 * @method aprovarEmLote
 * Tenta aprovar os processos selecionados.
 * @private
 * @alteracao 05/05/2015 186931 Projeto Carlos Eduardo Santos Alves Domingos
 * Criação.
 */
function aprovarEmLote(e){
	if(!e.value){
		return ;
	}
	var processos = [];
	//Pego os processos selecionados.
	var processosRaw = $.minhaListaProcessoDePagamento.getSelecionados();
	for(var i = 0; i < processosRaw.length; i++){
		//Busco os dados do processo selecionado.
		var dados = $.processosdepagamentos.where({NumeroProcesso: processosRaw[i].modelo.NumeroProcesso, EmpresaCod: processosRaw[i].modelo.EmpresaCod, 
			ObraCod: processosRaw[i].modelo.ObraCod, Parcela: processosRaw[i].modelo.Parcela})[0].toJSON();
		//Adiciono à coleção a ser aprovada.
		processos.push({codEmpresa: dados.EmpresaCod, codObra: dados.ObraCod, numeroProcesso: dados.NumeroProcesso, numeroParcela: dados.Parcela, 
				tipoProcesso: dados.TipoProcesso, loginUsuario: Alloy.Globals.Usuario.UsuarioUAU, aprovarProcesso: 0});
	}
	var ws = Alloy.createWidget("WebService").iniciarHttpRequest({
		callback: sucessAprovar,
		error: function(e){
			alert("Erro ao tentar aprovar o processo. Tente novamente mais tarde."); 
		},
		url:  Alloy.Globals.MainDomain + "api/ProcessoPagamento/aprovarProcessoEmLote", 
		metodo: "POST", 
		timeout: 120000,
		headerType: "application/json"
	});
	if(ws){
		ws.adicionaParametro({processos: processos});
		ws.NovoEnvia();
	}
}

/**
 * @method sucessAprovar
 * Callback de sucesso ao aprovar
 * @private
 * @param {BackBone.Collection} ret Retorno do webservice.
 * @alteracao 05/05/2015 186931 Projeto Carlos Eduardo Santos Alves Domingos
 * Criação.
 */
function sucessAprovar(ret){
	var processosAprovados = [];
	var processosComErro = [];
	for(var i = 0; i < ret.length; i++){
		var retMd = ret.at(i).toJSON();
		var md = JSON.parse(retMd.mensagem);
		//Busco os dados dos processos aprovados
		md = $.processosdepagamentos.where({NumeroProcesso: md.numeroProcesso, EmpresaCod: parseInt(md.codEmpresa), 
			ObraCod: md.codObra, Parcela: parseInt(md.numeroParcela)})[0];
		//Testo se foi aprovado ou não.	
		if(retMd.sucesso){
			processosAprovados.push(md);	
		}
		else{
			processosComErro.push(md);
		}
	}
	//Caso algum processo não tenha sido aprovado, eu informo quais em uma tela de log.
	if(processosComErro.length > 0){
		var msg = "Os seguintes processos não foram aprovados: ";
		for(var i = 0; i < processosComErro.length; i++){
			msg += "\n\tProcesso: " + processosComErro[i].get("NumeroProcesso");
			msg += "\n\tCódigo Empresa/Obra: " + processosComErro[i].get("EmpresaObra");
			msg += "\n\tParcela: " + processosComErro[i].get("Parcela");
			msg += "\n--------------------";
		}
		Alloy.Globals.log(msg);
	}
	//Removo da lista os processos aprovados.
	removerAprovados(processosAprovados);
}

/**
 * @method removerAprovados
 * Remove os processos aprovados.
 * @private
 * @param {Array} arrayModels Coleção de models que serão excluídos da lista.
 * @alteracao 05/05/2015 186931 Projeto Carlos Eduardo Santos Alves Domingos
 * Criação.
 */
function removerAprovados(arrayModels){
	$.minhaListaProcessoDePagamento.releaseSelecionados();
	$.processosdepagamentos.remove(arrayModels, {silent : true});
	$.processosdepagamentos.trigger("change");
	//Adiciono o container de funções da lista infinita.
	listaInfinita.adicionarTBR();
}

/**
 * @method removeRegistro
 * Remove um registro da lista.
 * @private
 * @param {String} NumeroProcesso número do processo.
 * @param {Number} EmpresaCod Código da empresa.
 * @param {String} ObraCod Código da obra.
 * @param {Number} Parcela Número da parcela.
 * @alteracao 05/05/2015 186931 Projeto Carlos Eduardo Santos Alves Domingos
 * Criação.
 */
function removeRegistro(NumeroProcesso, EmpresaCod, ObraCod, Parcela){
	
}

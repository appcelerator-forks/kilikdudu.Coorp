/**
 * @class controllers.Medicao.ListaMedicao
 * Exibi a lista de processos de pagamentos que podem ser aprovados pelo usuário logado.
 * @alteracao 12/05/2015 185753 Projeto Carlos Eduardo Santos Alves Domingos
 * Criação.
 */
var args = arguments[0] || {};

//Ativo a multiseleção
Alloy.createWidget("Util", "Tela").initConfigList($.minhaListaMedicoes, {
	click:{
		callback: detalhar
	}, 
	multiSelecao: true
});
//Escuto quando a multi-seleção é ativada.
$.minhaListaMedicoes.addEventListener("enabledMultiselection", function(e){
	//Ativo o botão de aprovar.
	btnAprovar.enable = true;
	btnAprovar.visible = true;
});
//Escuto quando a multi-seleção é desativada.
$.minhaListaMedicoes.addEventListener("disableMultiselection", function(e){
	//Desativo o botão.
	btnAprovar.enable = false;
	btnAprovar.visible = false;
});

/**
 * @property {Number} limite Limite de registros por página. 
 */
var limite = 20;

/**
 * @property {Ti.UI.Button} btnAprovar Botão utilizado para aprovar os contratos. 
 */
var btnAprovar;

/**
 * @property {widgets.Util.ListaInfinita} listaInfinita Funcionalidades da lista infinita.
 */
var listaInfinita = Alloy.createWidget("Util", "ListaInfinita", {colecao: $.medicoes, lista: $.minhaListaMedicoes, 
	refreshCallback: getContratosMedicao, limite: limite, multiselecao: true});

/**
 * @event myRefresher
 * Disparado no pushToRefresh.
 * @alteracao 12/05/2015 185753 Projeto Carlos Eduardo Santos Alves Domingos
 * Criação.
 */
function myRefresher(e) {
	listaInfinita.myRefresher();	
}

/**
 * @event sucesso
 * Conseguiu obter os contratos do WebService.
 * @alteracao 12/05/2015 185753 Projeto Carlos Eduardo Santos Alves Domingos
 * Criação.
 */
function sucesso(){
	try{
		$.medicoes.trigger("change");
		$.ptr.hide();
		listaInfinita.reiniciarContainer();
		if($.medicoes.length == 0){
			$.minhaListaMedicoes.setOpacity(0);
			$.lblEmpty.setOpacity(1);
		}
		else{
			$.lblEmpty.setOpacity(0);
			$.minhaListaMedicoes.setOpacity(1);
		}
	}
	catch(e){
		Alloy.Globals.onError(e.message, "sucesso", "app/controllers/Medicao/ListaMedicao.js");
	}
}

/**
 * @event adicionarRegistros
 * Disparado ao se clicar em buscar mais registros.
 * @alteracao 12/05/2015 185753 Projeto Carlos Eduardo Santos Alves Domingos
 * Criação.
 */
function adicionarRegistros(ret){
	listaInfinita.adicionarRegistros(ret.toJSON());
}

/**
 * @event buscar
 * Disparado ao se confirmar a texto da busca.
 * @alteracao 12/05/2015 185753 Projeto Carlos Eduardo Santos Alves Domingos
 * Criação. 
 */
function buscar(e){
	$.minhaListaMedicoes.releaseSelecionados();
	getContratosMedicao({semLoader: false, limite: limite, cursor: 0});
}

/**
 * @method init
 * Construtor da classe.
 * @alteracao 12/05/2015 185753 Projeto Carlos Eduardo Santos Alves Domingos
 * Criação.
 */
$.init = function(){
	try{
		Alloy.Globals.configWindow($.winListaProcessoDePagamento, $);
		$.minhaTopBar.iniciar("Controle de medição");
		btnAprovar = $.minhaTopBar.addRightButtom("/images/aprova.png", perguntaAprovarEmLote);
		btnAprovar.enable = false;
		btnAprovar.visible = false;
	}
	catch(e){
		Alloy.Globals.onError(e.message, "init", "app/controllers/Medicao/ListaMedicao.js");
	}
};

/**
 * @event open
 * Disparado ao abrir a janela. Executa controllers.Medicao.ListaMedicao.getContratosMedicao
 * @alteracao 12/05/2015 185753 Projeto Carlos Eduardo Santos Alves Domingos
 * Criação.
 */
$.winListaProcessoDePagamento.addEventListener("open", function(e){
	try{
		getContratosMedicao({semLoader: false, limite: limite, cursor: 0});	
	}
	catch(e){
		Alloy.Globals.onError(e.message, "open", "app/controllers/Medicao/ListaMedicao.js");
	}
});

/**
 * @method getContratosMedicao
 * Tenta obter os contratos pelo webservice.
 * @private
 * @alteracao 12/05/2015 185753 Projeto Carlos Eduardo Santos Alves Domingos
 * Criação.
 */
function getContratosMedicao(parans){
	try{
		var limit = parans.limite;
		var semLoader = parans.semLoader;
		var cursor = parans.cursor;
		if(cursor > 0){
			listaInfinita.iniciarLoader();
		}
		var ws = Alloy.createWidget("WebService").iniciarHttpRequest({
			callback: cursor==0?sucesso:adicionarRegistros,
			error: function(e){Alloy.Globals.Alerta("Erro", "Ocorreu um erro ao obter os contratos, tente novamente mais tarde.");},
			url:  Alloy.Globals.MainDomain + "api/Medicao/consultarMedicoes", 
			metodo: "POST", 
			timeout: 120000,
			colecao: cursor==0?$.medicoes:undefined,
			semLoader: semLoader
		});
		if(ws){
			ws.adicionaParametro({usuario: Alloy.Globals.Usuario.UsuarioUAU, limit: limit, cursor: cursor, busca: $.schBusca.getValue()});
			ws.NovoEnvia();
		}	
	}
	catch(e){
		Alloy.Globals.onError(e.message, "getContratosMedicao", "app/controllers/Medicao/ListaMedicao.js");
	}
}

/**
 * @event formatar
 * Disparado a cada nova linha na lista de processos de pagamento. Formata os dados para a lista.
 * @param {BackBone.Model} model Modelo que representa a medição de contrato, veja models.Medicao
 * @returns {JSONObject}
 * @alteracao 12/05/2015 185753 Projeto Carlos Eduardo Santos Alves Domingos
 * Criação.
 */
function formatar(model){
	try{
		var md = model.toJSON();
		md.Identificador = new Object();
		md.Identificador.Empresa = md.CodEmp;
		md.Identificador.Contrato = md.Contrato;
		md.Identificador.Medicao = md.CodMedicao;
		md.ValorLiquido = "Valor da medição: " + Alloy.Globals.format.paraReal(md.ValorLiquido, ".");
		md.EmpObra = "Obra: " + md.EmpObra;
		md.Contratado = "Contratado: " + md.Contratado;
		md.DataMedicao = "Data: " + Alloy.Globals.format.FormatoDiaMesAno(md.DataMedicao);
		md.CodMedicao = "Nº medição: " + md.CodMedicao;
		md.Contrato = "Nº contrato: " + md.Contrato;
		return md;	
	}
	catch(e){
		Alloy.Globals.onError(e.message, "formatar", "app/controllers/Medicao/ListaMedicao.js");
	}
}

/**
 * @event detalhar
 * Detalha o contrato. Disparado ao se clicar em um registro da lista.
 * @private
 * @param {Object} e Registro selecionado.
 * @alteracao 12/05/2015 185753 Projeto Carlos Eduardo Santos Alves Domingos
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
		var selectedProc = $.medicoes.where({
			CodEmp: e.row.modelo.Empresa, Contrato: e.row.modelo.Contrato, CodMedicao: e.row.modelo.Medicao})
			[0].toJSON();
		var detalhes = Alloy.createController("Medicao/DetalhesMedicao", {dados: selectedProc, colecao: $.medicoes});
		Alloy.Globals.Transicao.proximo(detalhes, detalhes.init, {});
	}
	catch(e){
		Alloy.Globals.onError(e.message, "detalhar", "app/controllers/Medicao/ListaMedicao.js");
	}
}

/**
 * @method perguntaAprovarEmLote
 * Confirma se o usuário vai aprovar todos os contratos selecionados.
 * @private
 * @alteracao 12/05/2015 185753 Projeto Carlos Eduardo Santos Alves Domingos
 * Criação.
 */
function perguntaAprovarEmLote(){
	var alerta = Alloy.createWidget("GUI", "Mensagem");
	alerta.init("Atenção", "Gostaria de aprovar todos os contratos selecionados ?", true);
	alerta.show({callback: aprovarEmLote});
}

/**
 * @method aprovarEmLote
 * Tenta aprovar os contratos selecionados.
 * @private
 * @alteracao 12/05/2015 185753 Projeto Carlos Eduardo Santos Alves Domingos
 * Criação.
 */
function aprovarEmLote(e){
	try{
		if(!e.value){
			return;
		}
		var medicoes = [];
		//Pego os processos selecionados.
		var medicoesRaw = $.minhaListaMedicoes.getSelecionados();
		for(var i = 0; i < medicoesRaw.length; i++){
			//Busco os dados do processo selecionado.
			var dados = $.medicoes.where({CodEmp: medicoesRaw[i].modelo.Empresa, Contrato: medicoesRaw[i].modelo.Contrato, CodMedicao: medicoesRaw[i].modelo.Medicao})[0].toJSON();
			//Adiciono à coleção a ser aprovada.
			medicoes.push({Empresa: dados.CodEmp, Contrato: dados.Contrato, Medicao: dados.CodMedicao, Obra: dados.CodObra, Usuario: Alloy.Globals.Usuario.UsuarioUAU});
		}
		var ws = Alloy.createWidget("WebService").iniciarHttpRequest({
			callback: sucessAprovar,
			error: function(e){
				alert("Erro ao tentar aprovar o contrato. Tente novamente mais tarde."); 
			},
			url:  Alloy.Globals.MainDomain + "api/Medicao/aprovarMedicaoEmLote", 
			metodo: "POST", 
			timeout: 120000,
			headerType: "application/json"
		});
		if(ws){
			ws.adicionaParametro({medicoes: medicoes});
			ws.NovoEnvia();
		}
	}
	catch(e){
		Alloy.Globals.onError(e.message, "aprovarEmLote", "app/controllers/Medicao/ListaMedicao.js");
	}
}

/**
 * @method sucessAprovar
 * Callback de sucesso ao aprovar
 * @private
 * @param {BackBone.Collection} ret Retorno do webservice.
 * @alteracao 12/05/2015 185753 Projeto Carlos Eduardo Santos Alves Domingos
 * Criação.
 */
function sucessAprovar(ret){
	try{
		var medicoesAprovados = [];
		var medicoesComErro = [];
		for(var i = 0; i < ret.length; i++){
			var retMd = ret.at(i).toJSON();
			var md = JSON.parse(retMd.mensagem);
			//Busco os dados dos processos aprovados
			md = $.medicoes.where({CodEmp: parseInt(md.Empresa), Contrato: md.Contrato, CodMedicao: md.Medicao})[0];
			//Testo se foi aprovado ou não.	
			if(retMd.sucesso){
				medicoesAprovados.push(md);	
			}
			else{
				medicoesComErro.push(md);
			}
		}
		//Caso algum processo não tenha sido aprovado, eu informo quais em uma tela de log.
		if(medicoesComErro.length > 0){
			var msg = "Os seguintes contratos não foram aprovados: ";
			for(var i = 0; i < medicoesComErro.length; i++){
				msg += "\n\Empresa: " + medicoesComErro[i].get("CodEmp");
				msg += "\n\tContrato/Obra: " + medicoesComErro[i].get("Contrato");
				msg += "\n\Medicao: " + medicoesComErro[i].get("CodMedicao");
				msg += "\n--------------------";
			}
			Alloy.Globals.log(msg);
		}
		//Removo da lista os processos aprovados.
		removerAprovados(medicoesAprovados);
	}
	catch(e){
		Alloy.Globals.onError(e.message, "sucessAprovar", "app/controllers/Medicao/ListaMedicao.js");
	}
}

/**
 * @method removerAprovados
 * Remove os processos aprovados.
 * @private
 * @param {Array} arrayModels Coleção de models que serão excluídos da lista.
 * @alteracao 12/05/2015 185753 Projeto Carlos Eduardo Santos Alves Domingos
 * Criação.
 */
function removerAprovados(arrayModels){
	try{
		$.minhaListaMedicoes.releaseSelecionados();
		$.medicoes.remove(arrayModels, {silent : true});
		$.medicoes.trigger("change");
		//Adiciono o container de funções da lista infinita.
		listaInfinita.adicionarTBR();
	}
	catch(e){
		Alloy.Globals.onError(e.message, "removerAprovados", "app/controllers/Medicao/ListaMedicao.js");
	}
}
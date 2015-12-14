/**
 * @class controllers.Medicao.ListaMedicao
 * Exibi a lista de processos de pagamentos que podem ser aprovados pelo usuário logado.
 * @alteracao 12/05/2015 185753 Projeto Carlos Eduardo Santos Alves Domingos
 * Criação.
 */
var args = arguments[0] || {};

/**
 * @property {Number} limite Limite de registros por página. 
 */
var limite = 20;


/**
 * @property {widgets.Util.ListaInfinita} listaInfinita Funcionalidades da lista infinita.
 */
var listaInfinita = Alloy.createWidget("Util", "ListaInfinita", {colecao: $.cotacoesgeral, lista: $.minhaListaCotacoes, 
	refreshCallback: getCotacoes, limite: limite});

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
		$.cotacoesgeral.trigger("change");
		$.ptr.hide();
		listaInfinita.reiniciarContainer();
		if($.cotacoesgeral.length == 0){
			$.minhaListaCotacoes.setOpacity(0);
			$.lblEmpty.setOpacity(1);
		}
		else{
			$.lblEmpty.setOpacity(0);
			$.minhaListaCotacoes.setOpacity(1);
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
	getCotacoes({semLoader: false, limite: limite, cursor: 0});
}

/**
 * @method init
 * Construtor da classe.
 * @alteracao 12/05/2015 185753 Projeto Carlos Eduardo Santos Alves Domingos
 * Criação.
 */
$.init = function(){
	try{
		Alloy.Globals.configWindow($.winListaCotacoes, $);
		$.minhaTopBar.iniciar("Cotações");
	}
	catch(e){
		Alloy.Globals.onError(e.message, "init", "app/controllers/Cotacao/ListaCotacoes.js");
	}
};

/**
 * @event open
 * Disparado ao abrir a janela. Executa controllers.Medicao.ListaMedicao.getCotacoes
 * @alteracao 12/05/2015 185753 Projeto Carlos Eduardo Santos Alves Domingos
 * Criação.
 */
$.winListaCotacoes.addEventListener("open", function(e){
	try{
		getCotacoes({semLoader: false, limite: limite, cursor: 0});	
	}
	catch(e){
		Alloy.Globals.onError(e.message, "open", "app/controllers/Medicao/ListaMedicao.js");
	}
});

/**
 * @method getCotacoes
 * Tenta obter os contratos pelo webservice.
 * @private
 * @alteracao 12/05/2015 185753 Projeto Carlos Eduardo Santos Alves Domingos
 * Criação.
 */
function getCotacoes(parans){
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
			url:  Alloy.Globals.MainDomain + "api/Cotacao/getCotacoes", 
			metodo: "POST", 
			timeout: 120000,
			colecao: cursor==0?$.cotacoesgeral:undefined,
			semLoader: semLoader
		});
		if(ws){
			ws.adicionaParametro({usuario: Alloy.Globals.Usuario.UsuarioUAU, limit: limit, cursor: cursor, busca: $.schBusca.getValue()});
			ws.NovoEnvia();
		}	
	}
	catch(e){
		Alloy.Globals.onError(e.message, "getCotacoes", "app/controllers/Medicao/ListaMedicao.js");
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
		md.cotacoes = JSON.stringify(md.Cotacoes);
		md.CodTipo = md.Cotacoes[0].CodTipo;
		if(md.Geral){
			md.CodEmpresa = -1;
			md.className = "rowListaCotacaoAgrupada";
			md.icone = "/images/Rows/CotacaoAgrupada.png";
			md.Titulo = "Cotação agrupada: " + md.NumGeral + "|" + "Tipo: " + (md.Cotacoes[0].Tipo==null?"":md.Cotacoes[0].Tipo);
		}else{
			md.CodEmpresa = md.Cotacoes[0].CodEmpresa;
			md.className = "rowListaCotacao";
			md.icone = "/images/Rows/Cotacao.png";
			md.Titulo = "Cotação: " + md.NumGeral + (md.Cotacoes[0].DescricaoCotacao==null?"":" - " + md.Cotacoes[0].DescricaoCotacao) + 
				"|" + "Empresa: " + md.CodEmpresa + " " + md.Cotacoes[0].Empresa;
		}
		
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
		var detalhes = Alloy.createController("Cotacao/ListaSimulacao", {dados: {codCotacao: e.row.codCotacao, seCotacaoGeral: e.row.geral, 
																			codEmpresa: e.row.empresa, TipoCotacao: e.row.tipo}, colecao: $.cotacoesgeral});
		Alloy.Globals.Transicao.proximo(detalhes, detalhes.init, {});
	}
	catch(e){
		Alloy.Globals.onError(e.message, "detalhar", "app/controllers/Medicao/ListaMedicao.js");
	}
}
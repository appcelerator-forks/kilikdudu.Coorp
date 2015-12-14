/**
 * @class controllers.Medicao.ListaMedicao
 * Exibi a lista de processos de pagamentos que podem ser aprovados pelo usuário logado.
 * @alteracao 12/05/2015 185753 Projeto Carlos Eduardo Santos Alves Domingos
 * Criação.
 */
var args = arguments[0] || {};


var dados = args.dados;

var totais = args.totais;

/**
 * @event sucesso
 * Conseguiu obter os contratos do WebService.
 * @alteracao 12/05/2015 185753 Projeto Carlos Eduardo Santos Alves Domingos
 * Criação.
 */
function sucesso(e){
	try{
		$.itens.trigger("change");
		var dados = $.minhaListaItens.getData();
		dados.unshift(getRowFornecedor());
		dados.push(getRowTotais());
		$.minhaListaItens.setData(dados);
	}
	catch(e){
		Alloy.Globals.onError(e.message, "sucesso", "app/controllers/Medicao/ListaMedicao.js");
	}
}

function getRowFornecedor(){
	var row = Ti.UI.createTableViewRow();
	var sty = $.createStyle({
		classes: ["RowDetail"],
		apiName: 'TableViewRow',
		color: "white"
	});
	row.applyProperties(sty);
	
	var boxFornecedor = Ti.UI.createView();
	var styBoxFornecedor = $.createStyle({
		classes: ["shadowView"],
		apiName: "View",
		width: "95%",
		height: Ti.UI.SIZE,
		top: 10,
		bottom: 10
	});
	boxFornecedor.applyProperties(styBoxFornecedor);
	row.add(boxFornecedor);
	
	var lblFornecedor = Ti.UI.createLabel();
	var styFornecedor = $.createStyle({
		classes: ["titulo"],
		apiName: "Label",
		width: "90%",
		height: Ti.UI.SIZE,
		textAlign: Ti.UI.TEXT_ALIGNMENT_LEFT,
		color: Alloy.Globals.MainColor,
		text: "Fornecedor: " + dados.NomeFornecedor
	});
	lblFornecedor.applyProperties(styFornecedor);
	boxFornecedor.add(lblFornecedor);
	
	return row;
}

function getRowTotais(){
	var row = Ti.UI.createTableViewRow();
	var sty = $.createStyle({
		classes: ["RowDetail"],
		apiName: 'TableViewRow',
		color: "white"
	});
	row.applyProperties(sty);
	
	totais.props = {
		width: "95%",
		height: Ti.UI.SIZE,
		top: 10,
		bottom: 10
	};
		
	var lblTotais = Alloy.createController("Cotacao/TotaisItem", totais).getView();
	row.add(lblTotais);
	
	return row;
}

$.init = function(){
	try{
		Alloy.Globals.configWindow($.winListaItensFornecedor, $);
		$.minhaTopBar.iniciar("Itens");
	}
	catch(e){
		Alloy.Globals.onError(e.message, "init", "app/controllers/Cotacao/ListaCotacoes.js");
	}
};


$.winListaItensFornecedor.addEventListener("open", function(e){
	try{
		getItensFornecedor();	
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
function getItensFornecedor(){
	try{
		var ws = Alloy.createWidget("WebService").iniciarHttpRequest({
			callback: sucesso,
			error: function(e){Alloy.Globals.Alerta("Erro", "Ocorreu um erro ao obter os itens da simulação, tente novamente mais tarde.");},
			url:  Alloy.Globals.MainDomain + "api/Cotacao/getItensFornecedor", 
			metodo: "POST", 
			timeout: 120000,
			colecao: $.itens
		});
		if(ws){
			var parans = {CodFornecedor: dados.CodFornecedor, NumeroSimulacao: dados.NumeroSimulacao, TipoCotacao: dados.TipoCotacao, 
				codCotacao: dados.codCotacao, seCotacaoGeral: dados.seCotacaoGeral.toString(), codEmpresa: dados.codEmpresa};
			ws.adicionaParametro(parans);
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
		md.descricaProps = {
			width: Ti.UI.FILL,
			textAlign: Ti.UI.TEXT_ALIGNMENT_LEFT,
			color: "black"
		};
		md.valorProps = {
			width: Ti.UI.FILL,
			textAlign: Ti.UI.TEXT_ALIGNMENT_LEFT,
			color: "#505050"
		};
		md.Descricao = md.Descricao + " (" + md.Unidade + ")";
		md.Quantidade = Alloy.Globals.format.paraFormatoDecimal(md.Quantidade, ".", md.CasaDecQuantidade);
		md.PrecoValue = md.Preco;
		md.Preco = Alloy.Globals.format.paraReal(md.Preco, ".", md.CasaDecPreco);
		md.Total = Alloy.Globals.format.paraReal(md.Total, ".");
		return md;	
	}
	catch(e){
		Alloy.Globals.onError(e.message, "formatar", "app/controllers/Medicao/ListaMedicao.js");
	}
}

function verHistorico(e){
	var historico = Alloy.createController("Cotacao/HistoricoInsumo", {insumo: e.source.insumo, nomeInsumo: e.source.nomeInsumo, 
		fornecedor: e.source.fornecedor, cotacao: e.source.cotacao, obra: e.source.obra, empresa: e.source.empresa});
	Alloy.Globals.Transicao.proximo(historico, historico.init, {});
}

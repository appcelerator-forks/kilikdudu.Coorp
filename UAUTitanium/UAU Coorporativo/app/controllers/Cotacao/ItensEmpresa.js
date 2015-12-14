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
		var dados = $.minhaListaItensEmpresa.getData();
		dados.unshift(getRowEmpresa());
		dados.push(getRowTotais());
		$.minhaListaItensEmpresa.setData(dados);
	}
	catch(e){
		Alloy.Globals.onError(e.message, "sucesso", "app/controllers/Medicao/ListaMedicao.js");
	}
}

function getRowEmpresa(){
	var row = Ti.UI.createTableViewRow();
	var sty = $.createStyle({
		classes: ["RowDetail"],
		apiName: 'TableViewRow',
		color: "white"
	});
	row.applyProperties(sty);
	
	var boxEmpresa = Ti.UI.createView();
	var styBoxEmpresa = $.createStyle({
		classes: ["shadowView"],
		apiName: "View",
		width: "95%",
		height: Ti.UI.SIZE,
		top: 10,
		bottom: 10
	});
	boxEmpresa.applyProperties(styBoxEmpresa);
	row.add(boxEmpresa);
	
	var lblEmpresa = Ti.UI.createLabel();
	var styEmpresa = $.createStyle({
		classes: ["titulo"],
		apiName: "Label",
		width: "90%",
		height: Ti.UI.SIZE,
		textAlign: Ti.UI.TEXT_ALIGNMENT_LEFT,
		color: Alloy.Globals.MainColor,
		text: "Empresa: " + dados.NomeEmpresa
	});
	lblEmpresa.applyProperties(styEmpresa);
	boxEmpresa.add(lblEmpresa);
	
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
		Alloy.Globals.configWindow($.winListaItensEmpresas, $);
		$.minhaTopBar.iniciar("Itens");
	}
	catch(e){
		Alloy.Globals.onError(e.message, "init", "app/controllers/Cotacao/ListaCotacoes.js");
	}
};


$.winListaItensEmpresas.addEventListener("open", function(e){
	try{
		getItensEmpresa();	
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
function getItensEmpresa(){
	try{
		var ws = Alloy.createWidget("WebService").iniciarHttpRequest({
			callback: sucesso,
			error: function(e){Alloy.Globals.Alerta("Erro", "Ocorreu um erro ao obter os itens da empresa, tente novamente mais tarde.");},
			url:  Alloy.Globals.MainDomain + "api/Cotacao/getItensEmpresa", 
			metodo: "POST", 
			timeout: 120000,
			colecao: $.itens
		});
		if(ws){
			var parans = {NumeroSimulacao: dados.NumeroSimulacao, TipoCotacao: dados.TipoCotacao, 
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
		md.Preco = Alloy.Globals.format.paraReal(md.Preco, ".");
		md.Total = Alloy.Globals.format.paraReal(md.Total, ".");
		return md;	
	}
	catch(e){
		Alloy.Globals.onError(e.message, "formatar", "app/controllers/Medicao/ListaMedicao.js");
	}
}

/**
 * @class controllers.AprovacaoPagamento.ListaQuemAprovou
 * Exibi a lista de pessoas que já aprovaram o processo de pagamento.
 * @alteracao 24/02/2015 180419 Projeto Carlos Eduardo Santos Alves Domingos
 * Criação.
 */
var args = arguments[0] || {};

/**
 * @property {widgets.GUI.Camada} camada Camada colocada sobre a tela enquanto se busca quem aprovou o processo. 
 */
var camada = Alloy.createWidget("GUI", "Camada", {load: true}).getView();

/**
 * @property {Object} dados Dados do processo de pagamento. Contém os atributos de {Models.ProcessoDePagamento}. 
 */
var dados = args.dados;

$.mestre.add(camada);
getAprovacaoEmissao();	

/**
 * @event sucesso
 * Conseguiu obter as pessoas que aprovaram o processo.
 * @alteracao 24/02/2015 180419 Projeto Carlos Eduardo Santos Alves Domingos
 * Criação.
 */
function sucesso(){
	try{
		$.quemaprovou.trigger("change");
		if($.quemaprovou.length == 0){
			var lblNinguem = Ti.UI.createLabel({
				text: "Este processo ainda não foi aprovado por ninguém.",
				wordWrap: true,
				font: {fontSize: 16},
				width: "90%",
				textAlign: Ti.UI.TEXT_ALIGNMENT_CENTER
			});
			$.mestre.remove($.minhaListaAprovacao);
			$.mestre.add(lblNinguem);
		}
		$.mestre.remove(camada);
	}
	catch(e){
		Alloy.Globals.onError(e.message, "sucesso", "app/controllers/AprovacaoPagamento/ListaQuemAprovou.js");
	}
}

/**
 * @method getAprovacaoEmissao
 * Tenta obter as pessoas que aprovaram o processo de pagamento.
 * @alteracao 24/02/2015 180419 Projeto Carlos Eduardo Santos Alves Domingos
 * Criação.
 */
function getAprovacaoEmissao(){
	try{
		var ws = Alloy.createWidget("WebService").iniciarHttpRequest({
			callback: sucesso,
			error: function(e){
				alert("Erro ao tentar obter a lista de quem aprovou este processo");
				$.mestre.remove(camada);
			},
			url:  Alloy.Globals.MainDomain + "api/ProcessoPagamento/getAprovacaoEmissao", 
			metodo: "POST", 
			timeout: 120000,
			semLoader: true,
			colecao: $.quemaprovou
		});
		if(ws){
			ws.adicionaParametro({CodEmpresa: dados.EmpresaCod, CodObra: dados.ObraCod, NumProcesso: dados.NumeroProcesso, NumParcela: dados.Parcela});
			ws.NovoEnvia();
		}	
	}
	catch(e){
		Alloy.Globals.onError(e.message, "getAprovacaoEmissao", "app/controllers/AprovacaoPagamento/ListaQuemAprovou.js");
	}
}

/**
 * @event formatar
 * Disparado a cada nova linha na lista pessoas que aprovaram o processo. Formata os dados para a lista.
 * @param {BackBone.Model} model Modelo que representa o boleto, veja Models.AprovacaoEmissao
 * @returns {JSONObject}
 * @alteracao 24/02/2015 180419 Projeto Carlos Eduardo Santos Alves Domingos
 * Criação.
 */
function formatar(model){
	try{
		var md = model.toJSON();
		md.Quem = "Quem: " + md.Quem;
		md.DataAprovacao = "Data: " + Alloy.Globals.format.FormatoDiaMesAno(md.DataAprovacao);
		return md;	
	}
	catch(e){
		Alloy.Globals.onError(e.message, "formatar", "app/controllers/AprovacaoPagamento/ListaQuemAprovou.js");
	}
}

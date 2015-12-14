/**
 * @class controllers.Medicao.ListaAprovouMedicao
 * Exibi a lista de pessoas que já aprovaram a medição de contrato.
 * @alteracao 12/05/2015 185753 Projeto Carlos Eduardo Santos Alves Domingos
 * Criação.
 */
var args = arguments[0] || {};

/**
 * @property {widgets.GUI.Camada} camada Camada colocada sobre a tela enquanto se busca quem aprovou o contrato. 
 */
var camada = Alloy.createWidget("GUI", "Camada", {load: true}).getView();

/**
 * @property {Object} dados Dados do contrato. Contém os atributos de {Models.Medicao}. 
 */
var dados = args.dados;

$.mestre.add(camada);
getAprovacaoContrato();	

/**
 * @event sucesso
 * Conseguiu obter as pessoas que aprovaram o contrato.
 * @alteracao 12/05/2015 185753 Projeto Carlos Eduardo Santos Alves Domingos
 * Criação.
 */
function sucesso(){
	try{
		$.quemaprovou.trigger("change");
		if($.quemaprovou.length == 0){
			var lblNinguem = Ti.UI.createLabel({
				text: "Este contrato de medição ainda não foi aprovado por ninguém.",
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
		Alloy.Globals.onError(e.message, "sucesso", "app/controllers/Medicao/ListaAprovouMedicao.js");
	}
}

/**
 * @method getAprovacaoContrato
 * Tenta obter as pessoas que aprovaram o contrato.
 * @alteracao 12/05/2015 185753 Projeto Carlos Eduardo Santos Alves Domingos
 * Criação.
 */
function getAprovacaoContrato(){
	try{
		var ws = Alloy.createWidget("WebService").iniciarHttpRequest({
			callback: sucesso,
			error: function(e){
				alert("Erro ao tentar obter a lista de quem aprovou este contrato de medição");
				$.mestre.remove(camada);
			},
			url:  Alloy.Globals.MainDomain + "api/Medicao/getAprovacaoMedicao", 
			metodo: "POST", 
			timeout: 120000,
			semLoader: true,
			colecao: $.quemaprovou
		});
		if(ws){
			ws.adicionaParametro({Empresa: dados.CodEmp, Contrato: dados.Contrato, Medicao: dados.CodMedicao});
			ws.NovoEnvia();
		}	
	}
	catch(e){
		Alloy.Globals.onError(e.message, "getAprovacaoContrato", "app/controllers/Medicao/ListaAprovouMedicao.js");
	}
}

/**
 * @event formatar
 * Disparado a cada nova linha na lista pessoas que aprovaram o contrato. Formata os dados para a lista.
 * @param {BackBone.Model} model Modelo que representa o boleto, veja Models.Medicao
 * @returns {JSONObject}
 * @alteracao 12/05/2015 185753 Projeto Carlos Eduardo Santos Alves Domingos
 * Criação.
 */
function formatar(model){
	try{
		var md = model.toJSON();
		md.Usuario = "Usuário: " + md.Usuario;
		md.Data = "Data: " + Alloy.Globals.format.FormatoDiaMesAno(md.Data);
		return md;	
	}
	catch(e){
		Alloy.Globals.onError(e.message, "formatar", "app/controllers/Medicao/ListaAprovouMedicao.js");
	}
}

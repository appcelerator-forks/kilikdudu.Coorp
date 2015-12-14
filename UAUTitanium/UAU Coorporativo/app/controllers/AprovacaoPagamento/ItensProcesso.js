/**
 * @class controllers.AprovacaoPagamento.ItensProcesso
 * Itens do processo de pagamento.
 * @alteracao 05/03/2015 180419 Projeto Carlos Eduardo Santos Alves Domingos
 * Criação. 
 */
var args = arguments[0] || {};

/**
 * @property {widgets.GUI.Camada} camada Camada colocada sobre a tela enquanto se busca os itens do processo. 
 */
var camada = Alloy.createWidget("GUI", "Camada", {load: true}).getView();

/**
 * @property {Object} dados Dados do processo de pagamento. Contém os atributos de {Models.ProcessoDePagamento}. 
 */
var dados = args.dados;

$.mestre.add(camada);
getItensProcesso();	

/**
 * @event sucesso
 * Conseguiu obter os itens do processo.
 * @alteracao 24/02/2015 180419 Projeto Carlos Eduardo Santos Alves Domingos
 * Criação.
 */
function sucesso(){
	try{
		$.itensprocesso.trigger("change");
		$.mestre.remove(camada);
	}
	catch(e){
		Alloy.Globals.onError(e.message, "sucesso", "app/controllers/AprovacaoPagamento/ItensProcesso.js");
	}
}

/**
 * @method getProcessosDePagamentos
 * Tenta obter os itens do processo de pagamento.
 * @alteracao 24/02/2015 180419 Projeto Carlos Eduardo Santos Alves Domingos
 * Criação.
 */
function getItensProcesso(){
	try{
		var ws = Alloy.createWidget("WebService").iniciarHttpRequest({
			callback: sucesso,
			error: function(e){
				Alloy.Globals.Alerta("Erro", "Ocorreu um erro ao obter os itens do processo de pagamento, tente novamente mais tarde.");
				$.mestre.remove(camada);
			},
			url:  Alloy.Globals.MainDomain + "api/ProcessoPagamento/getItensProcesso", 
			metodo: "POST", 
			timeout: 120000,
			semLoader: true,
			colecao: $.itensprocesso
		});
		if(ws){
			ws.adicionaParametro({CodEmpresa: dados.EmpresaCod, CodObra: dados.ObraCod, Processo: dados.NumeroProcesso, Contrato: dados.Contrato});
			ws.NovoEnvia();
		}	
	}
	catch(e){
		Alloy.Globals.onError(e.message, "getItensProcesso", "app/controllers/AprovacaoPagamento/ItensProcesso.js");
	}
}

/**
 * @event formatar
 * Disparado a cada nova linha na lista de itens do processo. Formata os dados para a lista.
 * @param {BackBone.Model} model Modelo que representa o item do processo, veja Models.ItemProcesso
 * @returns {JSONObject}
 * @alteracao 24/02/2015 180419 Projeto Carlos Eduardo Santos Alves Domingos
 * Criação.
 */
function formatar(model){
	try{
		var md = model.toJSON();
		md.Descricao = "Descrição: " + md.Descricao;
		md.Codigo = "Código: " + md.Codigo;
		md.Quantidade = "Quantidade: " + md.Quantidade;
		md.ValorTotal = "Valor total: " + Alloy.Globals.format.paraReal(md.ValorTotal, ".");
		md.ValorUnitario = "Valor unitário: " + Alloy.Globals.format.paraReal(md.ValorUnitario, ".");
		md.CodCap = "Cap: " + md.CodCap;
		md.DescricaoCap = "Descrição cap: " + md.DescricaoCap;
		return md;	
	}
	catch(e){
		Alloy.Globals.onError(e.message, "formatar", "app/controllers/AprovacaoPagamento/ItensProcesso.js");
	}
}

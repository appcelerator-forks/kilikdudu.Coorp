/**
 * @class controllers.Medicao.ItensMedicao
 * Itens do contrato.
 * @alteracao 12/05/2015 185753 Projeto Carlos Eduardo Santos Alves Domingos
 * Criação. 
 */
var args = arguments[0] || {};

/**
 * @property {widgets.GUI.Camada} camada Camada colocada sobre a tela enquanto se busca os itens do contrato. 
 */
var camada = Alloy.createWidget("GUI", "Camada", {load: true}).getView();

/**
 * @property {Object} dados Dados da medição de contrato. Contém os atributos de {Models.Medicao}. 
 */
var dados = args.dados;

$.mestre.add(camada);
getItensMedicao();	

/**
 * @event sucesso
 * Conseguiu obter os itens do contrato.
 * @alteracao 12/05/2015 185753 Projeto Carlos Eduardo Santos Alves Domingos
 * Criação.
 */
function sucesso(){
	try{
		$.itensmedicao.trigger("change");
		$.mestre.remove(camada);
	}
	catch(e){
		Alloy.Globals.onError(e.message, "sucesso", "app/controllers/Medicao/ItensMedicao.js");
	}
}

/**
 * @method getProcessosDePagamentos
 * Tenta obter os itens do contrato.
 * @alteracao 12/05/2015 185753 Projeto Carlos Eduardo Santos Alves Domingos
 * Criação.
 */
function getItensMedicao(){
	try{
		var ws = Alloy.createWidget("WebService").iniciarHttpRequest({
			callback: sucesso,
			error: function(e){
				Alloy.Globals.Alerta("Erro", "Ocorreu um erro ao obter os itens do processo de pagamento, tente novamente mais tarde.");
				$.mestre.remove(camada);
			},
			url:  Alloy.Globals.MainDomain + "api/Medicao/getItensMedicao", 
			metodo: "POST", 
			timeout: 120000,
			semLoader: true,
			colecao: $.itensmedicao
		});
		if(ws){
			ws.adicionaParametro({Empresa: dados.CodEmp, Contrato: dados.Contrato, Medicao: dados.CodMedicao});
			ws.NovoEnvia();
		}	
	}
	catch(e){
		Alloy.Globals.onError(e.message, "getItensMedicao", "app/controllers/Medicao/ItensMedicao.js");
	}
}

/**
 * @event formatar
 * Disparado a cada nova linha na lista de itens do contrato. Formata os dados para a lista.
 * @param {BackBone.Model} model Modelo que representa o item do modelo, veja Models.Medicao
 * @returns {JSONObject}
 * @alteracao 12/05/2015 185753 Projeto Carlos Eduardo Santos Alves Domingos
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
		md.Tipo = "Tipo: " + (parseInt(md.Tipo)==0?"Serviço":"Material");
		return md;	
	}
	catch(e){
		Alloy.Globals.onError(e.message, "formatar", "app/controllers/Medicao/ItensMedicao.js");
	}
}

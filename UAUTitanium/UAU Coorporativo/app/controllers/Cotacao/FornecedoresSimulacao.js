/**
 * @class controllers.Medicao.ListaMedicao
 * Exibi a lista de processos de pagamentos que podem ser aprovados pelo usuário logado.
 * @alteracao 12/05/2015 185753 Projeto Carlos Eduardo Santos Alves Domingos
 * Criação.
 */
var args = arguments[0] || {};

var camada = Alloy.createWidget("GUI", "Camada", {load: true}).getView();

var dados = args.dados;

$.mestre.add(camada);
getFornecedoresSimulacao();	

/**
 * @event sucesso
 * Conseguiu obter os contratos do WebService.
 * @alteracao 12/05/2015 185753 Projeto Carlos Eduardo Santos Alves Domingos
 * Criação.
 */
function sucesso(){
	try{
		$.fornecedores.trigger("change");
		$.mestre.remove(camada);
	}
	catch(e){
		Alloy.Globals.onError(e.message, "sucesso", "app/controllers/Medicao/ListaMedicao.js");
	}
}

/**
 * @method getCotacoes
 * Tenta obter os contratos pelo webservice.
 * @private
 * @alteracao 12/05/2015 185753 Projeto Carlos Eduardo Santos Alves Domingos
 * Criação.
 */
function getFornecedoresSimulacao(){
	try{
		var ws = Alloy.createWidget("WebService").iniciarHttpRequest({
			callback: sucesso,
			error: function(e){Alloy.Globals.Alerta("Erro", "Ocorreu um erro ao obter os itens do simulação, tente novamente mais tarde.");},
			url:  Alloy.Globals.MainDomain + "api/Cotacao/getFornecedoresSimulacao", 
			metodo: "POST", 
			timeout: 120000,
			semLoader: true,
			colecao: $.fornecedores
		});
		if(ws){
			ws.adicionaParametro({NumeroSimulacao: dados.NumeroSimulacao, TipoCotacao: dados.TipoCotacao, codCotacao: dados.codCotacao, seCotacaoGeral: dados.seCotacaoGeral.toString(), codEmpresa: dados.codEmpresa});
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
		md.lblNomeFornecedor = "Fornecedor: " + md.NomeFornecedor;
		md.SubTotal = Alloy.Globals.format.paraReal(md.SubTotal, ".");
		md.Desconto = Alloy.Globals.format.paraReal(md.Desconto, ".");
		md.ValorTransp = Alloy.Globals.format.paraReal(md.ValorTransp, ".");
		md.Total = Alloy.Globals.format.paraReal(md.Total, ".");
		md.DifAliqICMS = Alloy.Globals.format.paraReal(md.DifAliqICMS, ".");
		md.TotalComDifICMS = Alloy.Globals.format.paraReal(md.TotalComDifICMS, ".");
		md.Condicao = md.Condicao;
		md.Totais = {SubTotal: md.SubTotal, Desconto: md.Desconto, Transp: md.ValorTransp, Total: md.Total, 
			ValDifICMS: md.DifAliqICMS, TotComDifICMS: md.TotalComDifICMS, Condicao: md.Condicao};
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

		Alloy.createWidget("Util", "Animation").animarClick(e.row.children[0]);
		var detalhes = Alloy.createController("Cotacao/ItensFornecedor", {dados: {NomeFornecedor: e.row.nome, CodFornecedor: e.row.fornecedor, NumeroSimulacao: dados.NumeroSimulacao, codCotacao: dados.codCotacao, seCotacaoGeral: dados.seCotacaoGeral, 
																			codEmpresa: dados.codEmpresa, TipoCotacao: dados.TipoCotacao}, totais: e.row.totais});
		Alloy.Globals.Transicao.proximo(detalhes, detalhes.init, {});
	}
	catch(e){
		Alloy.Globals.onError(e.message, "detalhar", "app/controllers/Medicao/ListaMedicao.js");
	}
}
/**
 * @class controllers.Medicao.ListaMedicao
 * Exibi a lista de processos de pagamentos que podem ser aprovados pelo usuário logado.
 * @alteracao 12/05/2015 185753 Projeto Carlos Eduardo Santos Alves Domingos
 * Criação.
 */
var args = arguments[0] || {};

var dados = args.dados;

/**
 * @event sucesso
 * Conseguiu obter os contratos do WebService.
 * @alteracao 12/05/2015 185753 Projeto Carlos Eduardo Santos Alves Domingos
 * Criação.
 */
function sucesso(){
	try{
		$.simulacoes.trigger("change");
	}
	catch(e){
		Alloy.Globals.onError(e.message, "sucesso", "app/controllers/Medicao/ListaMedicao.js");
	}
}

/**
 * @method init
 * Construtor da classe.
 * @alteracao 12/05/2015 185753 Projeto Carlos Eduardo Santos Alves Domingos
 * Criação.
 */
$.init = function(){
	try{
		Alloy.Globals.configWindow($.winListaSimulacoes, $);
		$.minhaTopBar.iniciar("Simulações");
		if(dados.seCotacaoGeral){
			$.idCotacao.text = "Cotação geral: " + dados.codCotacao;	
		}else{
			$.idCotacao.text = "Cotação: " + dados.codCotacao;
		}
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
$.winListaSimulacoes.addEventListener("open", function(e){
	try{
		getSimulacoes();	
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
function getSimulacoes(){
	try{
		var ws = Alloy.createWidget("WebService").iniciarHttpRequest({
			callback: sucesso,
			error: function(e){Alloy.Globals.Alerta("Erro", "Ocorreu um erro ao obter as simulações, tente novamente mais tarde.");},
			url:  Alloy.Globals.MainDomain + "api/Cotacao/getSimulacoes", 
			metodo: "POST", 
			timeout: 120000,
			colecao: $.simulacoes
		});
		if(ws){
			ws.adicionaParametro({usuario:  Alloy.Globals.Usuario.UsuarioUAU, codCotacao: dados.codCotacao, seCotacaoGeral: dados.seCotacaoGeral.toString(), codEmpresa: dados.codEmpresa});
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
		md.lblNumeroSimulacao = "Simulação: " + md.NumeroSimulacao;
		md.SubTotal = Alloy.Globals.format.paraReal(md.SubTotal, ".");
		md.Desconto = Alloy.Globals.format.paraReal(md.Desconto, ".");
		md.ValTransporte = Alloy.Globals.format.paraReal(md.ValorTransporte, ".");
		md.Total = Alloy.Globals.format.paraReal(md.Total, ".");
		md.DifAliqICMS = Alloy.Globals.format.paraReal(md.DifAliqICMS, ".");
		md.TotalDifICMS = Alloy.Globals.format.paraReal(md.TotalComDifICMS, ".");
		md.lblOrigem = "";
		switch(md.Origem){
			case "0":
				md.lblOrigem += "Manual";
				break;
			case "1":
				md.lblOrigem += "Melhor valor de compra";
				break;
			case "2":
				md.lblOrigem += "Melhor entrega";
				break;
			case "3":
				md.lblOrigem += "Melhor qualidade de fornecedor";
				break;	
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
 
		Alloy.createWidget("Util", "Animation").animarClick(e.row.children[0]);
		var detalhes = Alloy.createController("Cotacao/DetalhesSimulacao", {dados: {NumeroSimulacao: e.row.codSimulacao, codCotacao: dados.codCotacao, seCotacaoGeral: dados.seCotacaoGeral, 
																			codEmpresa: dados.codEmpresa, TipoCotacao: dados.TipoCotacao}, colecao: args.colecao});
		Alloy.Globals.Transicao.proximo(detalhes, detalhes.init, {});
	}
	catch(e){
		Alloy.Globals.onError(e.message, "detalhar", "app/controllers/Medicao/ListaMedicao.js");
	}
}
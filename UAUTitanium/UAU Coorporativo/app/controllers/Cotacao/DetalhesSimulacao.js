/**
 * @class controllers.Medicao.DetalhesMedicao
 * Scrollable view contendo abas sobre o contrato de medição.
 * @alteracao 12/05/2015 185753 Projeto Carlos Eduardo Santos Alves Domingos
 * Criação. 
 */
var args = arguments[0] || {};

var colecaoAnterior = args.colecao;


var empresasSimulacao = Alloy.createController("Cotacao/EmpresasSimulacao", {dados: args.dados});

var fornecedoresSimulacao = Alloy.createController("Cotacao/FornecedoresSimulacao", {dados: args.dados});

var listaAprovacaoSimulacao = Alloy.createController("Cotacao/ListaAprovacaoSimulacao", {dados: args.dados});

/**
 * @method init
 * Construtor da classe. 
 * @alteracao 12/05/2015 185753 Projeto Carlos Eduardo Santos Alves Domingos
 * Criação. 
 */
$.init = function(){
	try{
		Alloy.Globals.configWindow($.winDetalhes, $);
		$.minhaTopBar.iniciar("Simulação: " + args.dados.NumeroSimulacao);
		$.minhaTopBar.addRightButtom("/images/aprova.png", perguntaAprovar);
		$.minhaScrollable.init([fornecedoresSimulacao.getView(), empresasSimulacao.getView(), listaAprovacaoSimulacao.getView()], ["Fornecedor", "Empresa", "Aprovou"]);
	}
	catch(e){
		Alloy.Globals.onError(e.message, "init", "app/controllers/Medicao/DetalhesMedicao.js");
	} 
};

/**
 * @method perguntaAprovar
 * Confirma se o usuário gostaria de aprovar o processo.
 * @private
 * @alteracao 12/05/2015 185753 Projeto Carlos Eduardo Santos Alves Domingos
 * Criação.
 */
function perguntaAprovar(){
	var alerta = Alloy.createWidget("GUI", "Mensagem");
	alerta.init("Atenção", "Gostaria de aprovar esta simulação ?", true);
	alerta.show({callback: tentaAprovarContrato});
}

/**
 * @method tentaAprovarContrato
 * Invoca o webservice responsável por aprovar o contrato. 
 * @private
 * @alteracao 12/05/2015 185753 Projeto Carlos Eduardo Santos Alves Domingos
 * Criação. 
 */
function tentaAprovarContrato(parans){
	try{
		if(parans.value){
			/*var ws = Alloy.createWidget("WebService").iniciarHttpRequest({
				callback: voltar,
				error: function(e){
					alert("Erro ao tentar aprovar o contrato. Tente novamente mais tarde."); 
					voltar();
				},
				url:  Alloy.Globals.MainDomain + "api/Medicao/aprovarMedicao", 
				metodo: "POST", 
				timeout: 120000
			});
			if(ws){
				var dados =  args.dados;
				ws.adicionaParametro({Empresa: dados.CodEmp, Contrato: dados.Contrato, Medicao: dados.CodMedicao, Obra: dados.CodObra, Usuario: Alloy.Globals.Usuario.UsuarioUAU});
				ws.NovoEnvia();
			}*/
		}
	}
	catch(e){
		Alloy.Globals.onError(e.message, "tentaAprovarProcesso", "app/controllers/Medicao/DetalhesMedicao.js");
	}
}

/**
 * @event voltar
 * Invocado ao se obter sucesso na aprovação do contrato.
 * @alteracao 12/05/2015 185753 Projeto Carlos Eduardo Santos Alves Domingos
 * Criação. 
 */
function voltar(e){
	var res = e.at(0).toJSON();
	if(res.sucesso){
		var novo = Alloy.createController("Cotacao/ListaCotacoes");
		Alloy.createWidget("Util", "Transicao").nova(novo, novo.init, {});
	}else{
		Alloy.Globals.Alerta("Erro", res.mensagem);
	}
}

/**
 * @class controllers.Medicao.DetalhesMedicao
 * Scrollable view contendo abas sobre o contrato de medição.
 * @alteracao 12/05/2015 185753 Projeto Carlos Eduardo Santos Alves Domingos
 * Criação. 
 */
var args = arguments[0] || {};

/**
 * @property {BackBone.Collection} listaAnterior Coleção de mediçoes.
 * @private
 * @alteracao 12/05/2015 185753 Projeto Carlos Eduardo Santos Alves Domingos
 * Criação.
 */
var colecaoAnterior = args.colecao;

/**
 * @property {controllers.Medicao.DadosMedicao} dadosMedicao Dados do contrato.
 * @private
 * @alteracao 12/05/2015 185753 Projeto Carlos Eduardo Santos Alves Domingos
 * Criação.
 */
var dadosMedicao = Alloy.createController("Medicao/DadosMedicao", {dados: args.dados});
/**
 * @property {controllers.Medicao.ItensMedicao} itensMedicao Itens do contrato.
 * @private
 * @alteracao 12/05/2015 185753 Projeto Carlos Eduardo Santos Alves Domingos
 * Criação.
 */
var itensMedicao = Alloy.createController("Medicao/ItensMedicao", {dados: args.dados});
/**
 * @property {controllers.AprovacaoPagamento.ListaQuemAprovou} listaAprovouMedicao Lista de quem aprovou o contrato.
 * @private
 * @alteracao 12/05/2015 185753 Projeto Carlos Eduardo Santos Alves Domingos
 * Criação.
 */
var listaAprovouMedicao = Alloy.createController("Medicao/ListaAprovouMedicao", {dados: args.dados});

/**
 * @method init
 * Construtor da classe. 
 * @alteracao 12/05/2015 185753 Projeto Carlos Eduardo Santos Alves Domingos
 * Criação. 
 */
$.init = function(){
	try{
		Alloy.Globals.configWindow($.winDetalhes, $);
		$.minhaTopBar.iniciar("Detalhes do contrato");
		var btn = $.minhaTopBar.addRightButtom("/images/aprova.png", perguntaAprovar);
		dadosMedicao.init(btn);
		$.minhaScrollable.init([dadosMedicao.getView(), itensMedicao.getView(), listaAprovouMedicao.getView()], ["Dados", "Itens", "Aprovou"]);
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
	alerta.init("Atenção", "Gostaria de aprovar este contrato ?", true);
	alerta.show({callback: tentaAprovarContrato});
	//var vwAssinatura = Alloy.createWidget("GUI", "AssinaturaView");
	//vwAssinatura.show();
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
			var ws = Alloy.createWidget("WebService").iniciarHttpRequest({
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
			}
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
	var dados =  args.dados;
	var md = colecaoAnterior.where({
			CodEmp: dados.CodEmp, Contrato: dados.Contrato, CodMedicao: dados.CodMedicao})[0];
	colecaoAnterior.remove(md, {silent : true});
	colecaoAnterior.trigger("change");		
	Alloy.createWidget("Util", "Transicao").anterior();
	}else{
		Alloy.Globals.Alerta("Erro", res.mensagem);	
}
}

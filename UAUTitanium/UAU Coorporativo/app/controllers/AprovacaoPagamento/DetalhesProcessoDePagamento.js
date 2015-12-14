/**
 * @class controllers.AprovacaoPagamento.DetalhesProcessoDePagamento
 * Scrollable view contendo abas sobre a aprovação da emissão de processo de pagamento.
 * @alteracao 05/03/2015 180419 Projeto Carlos Eduardo Santos Alves Domingos
 * Criação. 
 */
var args = arguments[0] || {};

/**
 * @property {BackBone.Collection} listaAnterior Coleção de processos de pagamento.
 * @private
 * @alteracao 05/05/2015 186931 Projeto Carlos Eduardo Santos Alves Domingos
 * Criação.
 */
var colecaoAnterior = args.colecao;

/**
 * @property {controllers.AprovacaoPagamento.DadosProcesso} dadosProcesso Dados do processo.
 * @private
 * @alteracao 05/03/2015 180419 Projeto Carlos Eduardo Santos Alves Domingos
 * Criação.
 */
var dadosProcesso = Alloy.createController("AprovacaoPagamento/DadosProcesso", {dados: args.dados});
/**
 * @property {controllers.AprovacaoPagamento.ItensProcesso} itensProcesso Itens do processo.
 * @private
 * @alteracao 05/03/2015 180419 Projeto Carlos Eduardo Santos Alves Domingos
 * Criação.
 */
var itensProcesso = Alloy.createController("AprovacaoPagamento/ItensProcesso", {dados: args.dados});
/**
 * @property {controllers.AprovacaoPagamento.ListaQuemAprovou} listaQuemAprovou Lista de quem aprovou o processo.
 * @private
 * @alteracao 05/03/2015 180419 Projeto Carlos Eduardo Santos Alves Domingos
 * Criação.
 */
var listaQuemAprovou = Alloy.createController("AprovacaoPagamento/ListaQuemAprovou", {dados: args.dados});

/**
 * @method init
 * Construtor da classe. 
 * @alteracao 05/03/2015 180419 Projeto Carlos Eduardo Santos Alves Domingos
 * Criação. 
 */
$.init = function(){
	try{
		Alloy.Globals.configWindow($.winDetalhes, $);
		$.minhaTopBar.iniciar("Detalhes do processo");
		var btn = $.minhaTopBar.addRightButtom("/images/aprova.png", requisitarAprovacao);
		dadosProcesso.init(btn);
		$.minhaScrollable.init([dadosProcesso.getView(), itensProcesso.getView(), listaQuemAprovou.getView()], ["Dados", "Itens", "Aprovou"]);
	}
	catch(e){
		Alloy.Globals.onError(e.message, "init", "app/controllers/AprovacaoPagamento/DetalhesProcessoDePagamento.js");
	} 
};

/**
 * @method requisitarAprovacao
 * Invoca o webservice que testa se o usuário tem permissão para alterar e se o processo pode ser aprovado. 
 * @private
 * @alteracao 05/03/2015 180419 Projeto Carlos Eduardo Santos Alves Domingos
 * Criação. 
 */
function requisitarAprovacao(){
	try{
		var ws = Alloy.createWidget("WebService").iniciarHttpRequest({
			callback: preparaAprovacaorProcesso,
			error: function(e){alert("Erro ao tentar validar a aprovação do processo. Tente novamente mais tarde.");},
			url:  Alloy.Globals.MainDomain + "api/ProcessoPagamento/validarProcesso", 
			metodo: "POST", 
			timeout: 120000
		});
		if(ws){
			var dados = args.dados;
			ws.adicionaParametro({codEmpresa: dados.EmpresaCod, codObra: dados.ObraCod, numeroProcesso: dados.NumeroProcesso, numeroParcela: dados.Parcela, 
				tipoProcesso: dados.TipoProcesso, loginUsuario: Alloy.Globals.Usuario.UsuarioUAU, aprovarProcesso: dadosProcesso.getAprovacaoSwitch()?0:1});
			ws.NovoEnvia();
		}
	}
	catch(e){
		Alloy.Globals.onError(e.message, "requisitarAprovacao", "app/controllers/AprovacaoPagamento/DetalhesProcessoDePagamento.js");
	}
}

/**
 * @method preparaAprovacaorProcesso
 * Informo ao usuário se o processo é válido e pergunto se o mesmo deseja prosseguir. 
 * @private
 * @alteracao 05/03/2015 180419 Projeto Carlos Eduardo Santos Alves Domingos
 * Criação. 
 */
function preparaAprovacaorProcesso(ret){
	try{
		var resposta = ret.at(0).toJSON();
		var alerta = Alloy.createWidget("GUI", "Mensagem");
		if(resposta.sucesso){
			if(resposta.mensagem === ""){
				alerta.init("Atenção", "Processo válido para a aprovação.\nGostaria de prosseguir com a aprovação ?", true);
			}
			else{
				alerta.init("Atenção", resposta.mensagem, true);
			}
			alerta.addCronometroRegressivo(30);
			alerta.show({callback: tentaAprovarProcesso});
		}
		else{
			alerta.init("Alerta", resposta.mensagem);
			alerta.show();
		}
	}
	catch(e){
		Alloy.Globals.onError(e.message, "preparaAprovacaorProcesso", "app/controllers/AprovacaoPagamento/DetalhesProcessoDePagamento.js");
	}
}

/**
 * @method tentaAprovarProcesso
 * Invoca o webservice responsável por aprovar o processo de pagamento. 
 * @private
 * @alteracao 05/03/2015 180419 Projeto Carlos Eduardo Santos Alves Domingos
 * Criação. 
 */
function tentaAprovarProcesso(parans){
	try{
		if(parans.value){
			var ws = Alloy.createWidget("WebService").iniciarHttpRequest({
				callback: voltar,
				error: function(e){
					alert("Erro ao tentar aprovar o processo. Tente novamente mais tarde."); 
					voltar();
				},
				url:  Alloy.Globals.MainDomain + "api/ProcessoPagamento/aprovarProcesso", 
				metodo: "POST", 
				timeout: 120000
			});
			if(ws){
				var dados =  args.dados;
				ws.adicionaParametro({codEmpresa: dados.EmpresaCod, codObra: dados.ObraCod, numeroProcesso: dados.NumeroProcesso, numeroParcela: dados.Parcela, 
					tipoProcesso: dados.TipoProcesso, loginUsuario: Alloy.Globals.Usuario.UsuarioUAU, aprovarProcesso: dadosProcesso.getAprovacaoSwitch()?0:1});
				ws.NovoEnvia();
			}
		}
	}
	catch(e){
		Alloy.Globals.onError(e.message, "tentaAprovarProcesso", "app/controllers/AprovacaoPagamento/DetalhesProcessoDePagamento.js");
	}
}

/**
 * @event voltar
 * Invocado ao se obeter sucesso na aprovação de pagamento.
 * @alteracao 05/03/2015 180419 Projeto Carlos Eduardo Santos Alves Domingos
 * Criação. 
 */
function voltar(e){
	var res = e.at(0).toJSON();
	if(res.sucesso){
		if(colecaoAnterior){
	var dados =  args.dados;
	var md = colecaoAnterior.where({
			NumeroProcesso: dados.NumeroProcesso, EmpresaCod: dados.EmpresaCod, ObraCod: dados.ObraCod, Parcela: dados.Parcela})[0];
	colecaoAnterior.remove(md, {silent : true});
	colecaoAnterior.trigger("change");		
		}		
	Alloy.createWidget("Util", "Transicao").anterior();
	}else{
		Alloy.Globals.Alerta("Erro", res.mensagem);	
}
}

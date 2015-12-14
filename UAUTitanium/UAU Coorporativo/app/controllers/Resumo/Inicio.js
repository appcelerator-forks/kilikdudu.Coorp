/**
 * @class controllers.Resumo.Inicio
 * Mostra a tela inicial do usuário, contendo os principais resumos dos serviços.
 * @alteracao 15/05/2015 185753 Projeto Carlos Eduardo Santos Alves Domingos
 * Criação. 
 */
var args = arguments[0] || {};

/**
 * @property {controllers.Resumo.ResumoProcessoDePagamento} processo Controller que mostra o resumo dos processos de pagamento.
 * @private 
 */
var processo = Alloy.createController("Resumo/ResumoProcessoDePagamento");
addResumo(processo, Alloy.Globals.ServicosDisponiveis.AprovPagamento);

/**
 * @property {controllers.Resumo.ResumoMedicao} medicao Controller que mostra o resumo das medições de contrato.
 * @private 
 */
var medicao = Alloy.createController("Resumo/ResumoMedicao");
addResumo(medicao, Alloy.Globals.ServicosDisponiveis.AprovMedicao);

/**
 * @property {controllers.Resumo.ResumoCotacao} cotacao Controller que mostra o resumo das cotações.
 * @private 
 */
var cotacao = Alloy.createController("Resumo/ResumoCotacao");
addResumo(cotacao);

/**
 * @method init
 * Construtor da classe
 * @private
 * @alteracao 15/05/2015 185753 Projeto Carlos Eduardo Santos Alves Domingos
 * Criação.
 */
$.init = function(args){
	try{
		Alloy.Globals.configWindow($.win, $);
		$.minhaTopBar.iniciar("Início");
		$.nome.setText("Olá, " + (Alloy.Globals.Usuario.Nome?Alloy.Globals.Usuario.Nome:Alloy.Globals.Usuario.UsuarioUAU));
		$.descEmpresa.setText("Você está logado na empresa: " + Alloy.Globals.Empresa.descricao);
	}
	catch(e){
		Alloy.Globals.onError(e.message, "init", "app/controllers/inicio.js");
	}
};

/**
 * @method addResumo
 * @private
 * @param {Object} controller Controller que será adicionado a lista de resumos.
 * @alteracao 15/05/2015 185753 Projeto Carlos Eduardo Santos Alves Domingos
 * Criação.
 * @alteracao 21/09/2015 199320 Projeto Carlos Eduardo Santos Alves Domingos
 * Alterado para não adicionar os serviços que o usuário não tem permissão.
 */
function addResumo(controller, servico){
	if(!Alloy.Globals.UtilUsuario.checaServicoDisponivel(servico)){
		return ;
	}
	var vw = controller.getView();
	vw.top = 15;
	$.conteudo.add(vw);
}


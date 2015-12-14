/**
 * @class controllers.Medicao.DadosMedicao
 * Detalhes do contrato.
 * @alteracao 12/05/2015 185753 Projeto Carlos Eduardo Santos Alves Domingos
 * Criação. 
 */
var args = arguments[0] || {};

/**
 * @property {Ti.UI.Buttom} btnAprovar Botão no canto superior direito, utilizado para aprovar o contrato.
 * @private 
 */
var btnAprovar;

$.ValorLiquido.setValueText(Alloy.Globals.format.paraReal(args.dados.ValorLiquido, "."));
$.Contratado.setValueText(args.dados.Contratado);
$.DataMedicao.setValueText(Alloy.Globals.format.FormatoDiaMesAno(args.dados.DataMedicao));
$.ObsMedicao.setValueText(args.dados.ObsMedicao);
$.Contrato.setValueText(args.dados.Contrato);
$.CodMedicao.setValueText(args.dados.CodMedicao);
$.ValorMedicao.setValueText(Alloy.Globals.format.paraReal(args.dados.ValorMedicao, "."));
$.ValorDesconto.setValueText(Alloy.Globals.format.paraReal(args.dados.ValorDesconto, "."));
$.ValorAdiantamento.setValueText(Alloy.Globals.format.paraReal(args.dados.ValorAdiantamento, "."));
$.ValorAcrescimo.setValueText(Alloy.Globals.format.paraReal(args.dados.ValorAcrescimo, "."));
$.DescEmpresa.setValueText(args.dados.DescEmpresa);
$.DescObra.setValueText(args.dados.DescObra);


/**
 * @method getAprovacaoSwitch
 * Retorna o estado do switch de aprovação.
 * @return {Boolean}
 * @alteracao 12/05/2015 185753 Projeto Carlos Eduardo Santos Alves Domingos
 * Criação.
 */
$.getAprovacaoSwitch = function(){
	return $.switcherAprovar.getValue();
};

/**
 * @method init
 * Construtor da classe. 
 * @alteracao 12/05/2015 185753 Projeto Carlos Eduardo Santos Alves Domingos
 * Criação. 
 */
$.init = function(btn){
	try{
		btnAprovar = btn;
		btnAprovar.setEnabled(false);
		btnAprovar.setOpacity(0.6);
		//Caso o switcher de aprovar mude seu estado, eu altero também o estado no botão aprovar.
		$.switcherAprovar.addEventListener("change", function(e){
			if(e.value){
				btnAprovar.setEnabled(true);
				btnAprovar.setOpacity(1);	
			}
			else{
				btnAprovar.setEnabled(false);
				btnAprovar.setOpacity(0.6);
			}
		});
	}
	catch(e){
		Alloy.Globals.onError(e.message, "init", "app/controllers/Medicao/DadosMedicao.js");
	} 
};
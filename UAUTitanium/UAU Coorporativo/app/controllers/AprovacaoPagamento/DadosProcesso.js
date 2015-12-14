/**
 * @class controllers.AprovacaoPagamento.DadosProcesso
 * Detalhes do processo de pagamento.
 * @alteracao 05/03/2015 180419 Projeto Carlos Eduardo Santos Alves Domingos
 * Criação. 
 */
var args = arguments[0] || {};

/**
 * @property {Ti.UI.Buttom} btnAprovar Botão no canto superior direito, utilizado para aprovar o processo.
 * @private 
 */
var btnAprovar;

$.ValPagar.setValueText(Alloy.Globals.format.paraReal(args.dados.ValPagar, "."));
$.Fornecedor.setValueText(args.dados.Fornecedor);
$.DataProrrogacao.setValueText(Alloy.Globals.format.FormatoDiaMesAno(args.dados.DataProrrogacao));
$.Observacao.setValueText(args.dados.Observacao);
$.NumeroProcesso.setValueText(args.dados.NumeroProcesso);
$.Parcela.setValueText(args.dados.Parcela);
$.DataVencimento.setValueText(Alloy.Globals.format.FormatoDiaMesAno(args.dados.DataVencimento));
$.DocumentoFiscal.setValueText(args.dados.DocumentoFiscal!==""?args.dados.DocumentoFiscal:"-");
$.ValorDocumentoFiscal.setValueText(Alloy.Globals.format.paraReal(args.dados.ValorDocumentoFiscal, "."));
$.ValorProcesso.setValueText(Alloy.Globals.format.paraReal(args.dados.ValorProcesso, "."));
$.Acrescimo.setValueText(Alloy.Globals.format.paraReal(args.dados.Acrescimo, "."));
$.Desconto.setValueText(Alloy.Globals.format.paraReal(args.dados.Desconto, "."));
$.BancoConta.setValueText(args.dados.BancoConta);	
$.TipoEmissao.setValueText(args.dados.TipoEmissao);
$.Empresa.setValueText(args.dados.Empresa);
$.Obra.setValueText(args.dados.Obra);
$.NumeroCotacao.setValueText(args.dados.NumeroCotacao);
$.OrdemCompra.setValueText(args.dados.OrdemCompra);
$.Contrato.setValueText(args.dados.Contrato);
$.Medicao.setValueText(args.dados.Medicao);
$.DataGeracao.setValueText(Alloy.Globals.format.FormatoDiaMesAno(args.dados.DataGeracao));

/**
 * @method getAprovacaoSwitch
 * Retorna o estado do switch de aprovação.
 * @return {Boolean}
 * @alteracao 05/03/2015 180419 Projeto Carlos Eduardo Santos Alves Domingos
 * Criação.
 */
$.getAprovacaoSwitch = function(){
	return $.switcherAprovar.getValue();
};

/**
 * @method init
 * Construtor da classe. 
 * @alteracao 05/03/2015 180419 Projeto Carlos Eduardo Santos Alves Domingos
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
		Alloy.Globals.onError(e.message, "init", "app/controllers/AprovacaoPagamento/DadosProcesso.js");
	} 
};
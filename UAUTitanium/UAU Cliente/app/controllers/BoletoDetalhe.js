/**
 * @class controllers.BoletoDetalhe
 * Detalhes do boleto.
 * @alteracao 21/01/2015 176562 Projeto Carlos Eduardo Santos Alves Domingos
 * Criação. 
 */
var args = arguments[0] || {};

//$.LinhaDigitavel.setValueText(args.dados.LinhaDigitavel);
//Inicio montagem linha digitavel
var blocos = separaLinhaDigitavel(args.dados.LinhaDigitavel);
$.bloco1.setText(blocos[0]);
$.bloco2.setText(blocos[1]);
$.bloco3.setText(blocos[2]);
$.bloco4.setText(blocos[3]);
$.bloco5.setText(blocos[4]);
$.bloco6.setText(blocos[5]);
$.bloco7.setText(blocos[6]);
$.bloco8.setText(blocos[7]);
//Fim montagem linha digitavel
$.LocalPagamento.setValueText(args.dados.LocalPagamento);
$.Banco.setValueText(args.dados.Banco);
$.Beneficiario.setValueText(args.dados.Beneficiario);
$.DataDocumento.setValueText(Alloy.Globals.format.FormatoDiaMesAno(args.dados.DataDocumento));
$.DataVencimento.setValueText(Alloy.Globals.format.FormatoDiaMesAno(args.dados.DataVencimento));
$.AgenciaCod.setValueText(args.dados.AgenciaCod);
$.NossoNumero.setValueText(args.dados.NossoNumero);
$.ValorDocumento.setValueText(Alloy.Globals.format.paraReal(args.dados.ValorDocumento, "."));
$.Instrucoes.setValueText(args.dados.Instrucoes);

/**
 * @method init
 * Construtor da classe. 
 * @alteracao 21/01/2015 176562 Projeto Carlos Eduardo Santos Alves Domingos
 * Criação. 
 */
$.init = function(){
	try{
		Alloy.Globals.configWindow($.winDetalhes, $);
		$.minhaTopBar.iniciar("Reimpressão de boletos");
	}
	catch(e){
		Alloy.Globals.onError(e.message, "init", "app/controllers/BoletoDetalhe.js");
	} 
};
/**
 * @method separaLinhaDigitavel
 * Retorna um vetor com os blocos da linha digitável.
 * @private
 * @param {String} linhaDigitavel string da linha digitável com os espaços e pontos.
 * @return {Object} vetor contendo os blocos da linha digitável.
 * @alteracao 22/07/2015 183484 Projeto Carlos Eduardo Santos Alves Domingos
 * Criação. 
 */
function separaLinhaDigitavel(linhaDigitavel){
	var tempEspacos = linhaDigitavel.split(" ");
	var ret = [];
	for(var i = 0; i < tempEspacos.length; i++){
		var tempPontos = tempEspacos[i].split(".");
		for(var j = 0; j < tempPontos.length; j++){
			ret.push(tempPontos[j]);
		}
	}
	return ret;
}

/**
 * @event copiar
 * Disparado quando se clica no botão copiar. Copia os dados para a área de transferencia.
 * @alteracao 21/01/2015 176562 Projeto Carlos Eduardo Santos Alves Domingos
 * Criação.
 */
function copiar(){
	try{
		Alloy.Globals.Alerta("Copiar", "A linha digitável foi copiada para a sua área de transferência.");
		Ti.UI.Clipboard.setText(args.dados.LinhaDigitavel);
	}
	catch(e){
		Alloy.Globals.onError(e.message, "copiar", "app/controllers/BoletoDetalhe.js");
	} 
}

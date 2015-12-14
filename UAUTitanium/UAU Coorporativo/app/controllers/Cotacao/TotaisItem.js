var args = arguments[0] || {};

$.boxTotaisItem.applyProperties(args.props);

$.SubTotal.setValor(args.SubTotal);
$.Desconto.setValor(args.Desconto);
$.Transp.setValor(args.Transp);
$.Total.setValor(args.Total);
$.ValDifICMS.setValor(args.ValDifICMS);
$.TotComDifICMS.setValor(args.TotComDifICMS);
if(args.Condicao){
	$.Condicao.setValor(args.Condicao);
}else{
	$.boxTotaisItem.remove($.Condicao.getView());
}


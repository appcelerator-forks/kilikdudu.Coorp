var args = arguments[0] || {};

$.boxPrecoMeta.applyProperties(args);

$.PrecoMeta.setValor(Alloy.Globals.format.paraReal(args.precoMeta, "."));
$.TotalMeta.setValor(Alloy.Globals.format.paraReal(args.totalMeta, "."));

var valueProporcaoMeta = 0;

if(args.precoMeta >= args.preco){
	$.proporcaoPreco.setBackgroundColor("#104E8B");
	valueProporcaoMeta = (args.preco/args.precoMeta) * 100;
	$.proporcaoMeta.setWidth(valueProporcaoMeta.toString() + "%");
	$.RelacaoMeta.setValor((100 - valueProporcaoMeta).toFixed(2).toString() + "%", {color: "#009a3d"});
	$.RelacaoMeta.setDescricao("Mais barato:", {color: "#009a3d"});
}else{
	$.proporcaoPreco.setBackgroundColor("#ca060e");
	valueProporcaoMeta = (args.precoMeta/args.preco) * 100;
	$.proporcaoMeta.setWidth(valueProporcaoMeta.toString() + "%");
	$.RelacaoMeta.setValor((((args.preco/args.precoMeta)*100)-100).toFixed(2).toString() + "%", {color: "#ca060e"});
	$.RelacaoMeta.setDescricao("Mais caro:", {color: "#ca060e"});
}

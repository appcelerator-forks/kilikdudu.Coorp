var args = arguments[0] || {};

$.boxDetalhe.applyProperties(args);

$.descricao.setText(args.descricao);
$.valor.setText(args.valor);

var sty = $.createStyle({
	classes: [args.tipo || "default"],
	apiName: 'Label'
});

$.valor.applyProperties(sty);

if(args.descricaProps){
	$.descricao.applyProperties(args.descricaProps);	
}

if(args.valorProps){
	$.valor.applyProperties(args.valorProps);
}

$.setValor = function(valor, props){
	$.valor.setText(valor);
	if(props){
		$.valor.applyProperties(props);
	}
};

$.setDescricao = function(valor, props){
	$.descricao.setText(valor);
	if(props){
		$.descricao.applyProperties(props);
	}
};

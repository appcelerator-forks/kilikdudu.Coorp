var args = arguments[0] || {};

var plusFunction = null;
var minusFunction = null;

$.lblDesc.setText(args.descricao);

$.init = function(parans){
	plusFunction = parans.plusFunction;
	minusFunction = parans.minusFunction;
	if(parans.valueWidth){
		$.boxControles.setWidth(parans.valueWidth);
		$.boxControles.setLeft(0);
	}
};

function Plus(e){
	if(plusFunction){
		plusFunction($);
	}	
}

function Minus(e){
	if(minusFunction){
		minusFunction($);
	}	
}

$.getValue = function(){
	return $.Valor.getText();
};

$.setValue = function(value){
	$.Valor.setText(value);
};

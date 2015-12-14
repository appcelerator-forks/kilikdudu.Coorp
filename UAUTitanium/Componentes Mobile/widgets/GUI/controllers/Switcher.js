var args = arguments[0] || {};

$.getValue = function(){
	if($.carro === "Sim"){
		return true;
	}
	else{
		return false;
	}
};

$.setValue = function(value){
	if(value){
		$.carro.animate(animacaoSim);
	}
	else{
		$.carro.animate(animacaoNao);
	}
};

var animacaoSim = Ti.UI.createAnimation({
	right: 0,
	left: 25,
	duration: 100
});

animacaoSim.addEventListener("complete", function(e){
	$.carro.setText("Sim");
	$.carro.setColor("white");
	$.carro.setBackgroundColor(Alloy.Globals.MainColor);
});

var animacaoNao = Ti.UI.createAnimation({
	left: 0,
	right: 25,
	duration: 100
});

animacaoNao.addEventListener("complete", function(e){
	$.carro.setText("Não");
	$.carro.setColor(Alloy.Globals.MainColor);
	$.carro.setBackgroundColor("#B6B6B6");
});

$.carro.addEventListener("click", function(e){
	if($.carro.text === "Sim"){
		$.carro.animate(animacaoNao);
	}
	else{
		$.carro.animate(animacaoSim);
	}
});

$.carro.addEventListener("swipe", function(e){
	if(e.direction === 'right'){
		$.carro.animate(animacaoSim);
	}
	if(e.direction === 'left'){
		$.carro.animate(animacaoNao);
	}
});
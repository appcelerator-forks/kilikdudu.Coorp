var args = arguments[0] || {};

var collection = Backbone.Collection.extend();

var empobrcol = new collection();

var empobrDefault = args.empobr;

$.init = function(parans){
	try{
		$.meses.init({plusFunction: addMes, minusFunction: subMes, valueWidth: 150});
		$.meses.setValue(args.numMeses || 1);
		$.empobr.init({nome: "Obra", colecao: empobrcol, chave: ["EmpObr"], coluna: "EmpObr"});
		Alloy.Globals.configPopUp($);
	}
	catch(e){
		Alloy.Globals.onError(e.message, "init", "app/widgets/GUI/controllers/Mensagem.js");
	}
};

function addMes(e){
	e.Valor.setText(parseInt(e.Valor.text) + 1);
}

function subMes(e){
	if(parseInt(e.Valor.text) > 1){
		e.Valor.setText(parseInt(e.Valor.text) - 1);	
	}
}

function aplicarConfig(e){
	$.trigger("filtro", {
		fornecedor: ($.switcherFornecedor.value?args.fornecedor:undefined),
		empobr: $.empobr.getSelected().chave[0],
		numMeses: $.meses.getValue()
	});
	$.close();
}

function cancelar(e){
	$.close();
}

function habilitaEmpObr(e){
	if(!e.value){
		$.boxInfoEmpObr.setHeight(Ti.UI.SIZE);
	}else{
		$.boxInfoEmpObr.setHeight(0);
		resetaObraDaCotacao();
	}
}

function resetaObraDaCotacao(){
	$.empobr.setSelected(empobrDefault, [empobrDefault]);
}

$.setColecao = function(collection){
	var obras = _.uniq(_.map(collection.toJSON(), function(obj){ return obj.CodEmpresa + "|" + obj.Obra;}));
	for(var i = 0; i < obras.length; i++){
		empobrcol.add([{EmpObr: obras[i]}], {silent: true});
	}
	empobrcol.trigger("change");
	resetaObraDaCotacao();
};

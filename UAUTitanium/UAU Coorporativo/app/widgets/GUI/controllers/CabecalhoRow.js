var args = arguments[0] || {};

$.boxCabecalho.applyProperties(args);

$.imagem.setImage(args.icone);

$.addTitulo = function(titulo){
	var lblTitulo = Ti.UI.createLabel();
	var sty = $.createStyle({
		classes: ["descricaoTitulo"],
		apiName: "Label",
		width: Ti.UI.FILL,
		height: Ti.UI.SIZE,
		wordWrap: true,
		ellipsize: false,
		text: titulo
	});
	lblTitulo.applyProperties(sty);
	$.boxTitulos.add(lblTitulo);
};

if(args.titulo){
	var titulos = args.titulo.split("|");
	for(var i = 0; i<titulos.length; i++){
		$.addTitulo(titulos[i]);	
	}	
}

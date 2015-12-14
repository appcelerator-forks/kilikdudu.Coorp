var args = arguments[0] || {};

var cotacoes = JSON.parse(args.cotacoes);
var geral = args.geral;
montaCotacoes();

function montaDetalhe(descricao, texto, gap){
	var html = "<font size=" + (Alloy.isHandheld?18:22) + " color=\"black\">" + descricao + "</font><font color=\"gray\" size=" +  (Alloy.isHandheld?18:22) + ">" + texto + "</font>";
	//Testo se a plataforma é iOS, se sim, monto a mensagem com o widget.				   
	if(Ti.Platform.name === 'iPhone OS'){
		lblDetalhe = Alloy.createWidget("nl.fokkezb.html2as.widget", "widget", {
			textAlign: Titanium.UI.TEXT_ALIGNMENT_LEFT,
			left: (gap?"5%":0),
			width: (gap?"95%":Ti.UI.FILL),
			height: Ti.UI.SIZE,
			html: html
		}).getView();
	}else{
		lblDetalhe = Ti.UI.createLabel({
			font: {fontSize: Alloy.isHandheld?18:20},
			textAlign: Titanium.UI.TEXT_ALIGNMENT_LEFT,
			left: 10,
			html: html
		});
	}
	
	return lblDetalhe;
}

function montaCotacoes(){
	for(var i =0; i < cotacoes.length; i++){
		var box = Ti.UI.createView({
			width: Ti.UI.FILL,
			height: Ti.UI.SIZE,
			layout: "vertical"
		});
		
		if(geral){
			var cotacao = montaDetalhe("Cotação: ", cotacoes[i].CodCotacao + (cotacoes[i].DescricaoCotacao==null?"":" - " + cotacoes[i].DescricaoCotacao), false);
			box.add(cotacao);
			var descEmpresa = montaDetalhe("Empresa: ", cotacoes[i].CodEmpresa + " " + cotacoes[i].Empresa, false);
			box.add(descEmpresa);		
		}
		
		if(!geral){
			var tipoValue = cotacoes[i].Tipo==null?"":cotacoes[i].Tipo;
			var tipo = montaDetalhe("Tipo: ", tipoValue, geral);
			box.add(tipo);	
		}
		
		box.add(Ti.UI.createView({height: 10}));
		$.boxCotacoes.add(box);
	}
}

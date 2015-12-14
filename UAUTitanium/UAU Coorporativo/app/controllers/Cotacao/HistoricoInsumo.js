var args = arguments[0] || {};


var camada = Alloy.createWidget("GUI", "Camada", {load: true}).getView();

var grafico = null;

var collectionHistorico = null;
var seriesGrafico = null;
var lblSeriesGrafico = null;

var flagGeraGrafico = false;

var webViewPronta = false;

var numMeses = 6;

var configGrafico = Alloy.createController("Cotacao/ConfigGrafico", {numMeses: numMeses, fornecedor: args.fornecedor, empobr: args.empresa + "|" + args.obra});
configGrafico.init();


$.chartWebView.addEventListener('load', function() { 
	Ti.API.info('chartWebView ready');
	webViewPronta = true; 
	if(flagGeraGrafico){
		geraGrafico();
	}
});


function geraGrafico(){
	grafico = {
	    chart: {
	        renderTo: 'container',
	        plotBackgroundColor: null,
	        plotBorderWidth: null,
	        type: 'column'
	    },
	    plotOptions: {
            column: {
                depth: 25
            }
        },
	    credits: {
	        enabled: false
	    },
	    title: {
	        text: 'Histórico de compra ' + args.nomeInsumo
	    },
	    xAxis: {
            categories: lblSeriesGrafico
            //crosshair: true
        },
	    yAxis: {
	        title: {
	            text: 'Valor (R$)'
	        }
	    },
	    tooltip: {
	        valuePrefix: 'R$ '
	    },
	    series: seriesGrafico
	};
	
	var viewConfig = {
		width: "100%",
		height: "250px"
	};
    $.chartWebView.evalJS('plotChart(\'' + JSON.stringify(grafico) + '\', \'' + JSON.stringify(viewConfig) + '\')');
	$.winHistoricoInsumo.remove(camada);  
}

$.init = function(){
	try{
		Alloy.Globals.configWindow($.winHistoricoInsumo, $);
		$.minhaTopBar.iniciar("Histórico");
		$.minhaTopBar.addRightButtom("/images/config_white.png", opcoes);
	}
	catch(e){
		Alloy.Globals.onError(e.message, "init", "app/controllers/Cotacao/HistoricoInsumo.js");
	}
};

function opcoes(){
	configGrafico.show();
}

$.winHistoricoInsumo.addEventListener("open", function(e){
	getHistoricoInsumo();
});

function montaSeriesGrafico(parans){
	seriesGrafico = [
		{
			name: "Maior valor",
			color: "#ca060e", 
			data: []
		}, 
		{
			name: "Menor valor",
			color: "#009a3d",
			data: []
		}]; 
	lblSeriesGrafico = [];
	
	var hoje = new Date();
	var inicial = new Date(new Date().setMonth(hoje.getMonth() - parans.numMeses));
	
	var arrayMeses = [];
	arrayMeses.push(Alloy.Globals.format.customFormatData(inicial, undefined, "YYYY-MM"));
	lblSeriesGrafico.push(Alloy.Globals.format.customFormatData(inicial, undefined, "MM/YYYY"));
	
	for(var i = 0; i < parans.numMeses; i++){
		inicial.setMonth(inicial.getMonth() + 1);
		arrayMeses.push(Alloy.Globals.format.customFormatData(inicial, undefined, "YYYY-MM"));
		lblSeriesGrafico.push(Alloy.Globals.format.customFormatData(inicial, undefined, "MM/YYYY"));
	}
	
	for(var i = 0; i < arrayMeses.length; i++){
		var colDados = _.filter(parans.collection.toJSON(), function(historico){ 
			return (Alloy.Globals.format.customFormatData(historico.DataCotacao, undefined, "YYYY-MM") == arrayMeses[i])
				&& (parans.cotacao.indexOf(historico.Cotacao) > -1) 
				&& ((parans.fornecedor == undefined) || (parans.fornecedor == historico.Fornecedor)); 
		});
		Ti.API.info("2" + JSON.stringify(collectionHistorico.toJSON()));
		seriesGrafico[0].data.push(_.max(colDados, function(historico){ return historico.Preco; }).Preco);
		seriesGrafico[1].data.push(_.min(colDados, function(historico){ return historico.Preco; }).Preco);  
	}
	flagGeraGrafico = true;
	if(webViewPronta){
		geraGrafico();	
	}
}

function sucesso(ret){
	collectionHistorico = ret;
	montaSeriesGrafico({numMeses: numMeses, collection: collectionHistorico, cotacao: getCotacoesDaObra(args.empresa + "|" + args.obra)});
	configGrafico.setColecao(collectionHistorico);
}

function getHistoricoInsumo(parans){
	try{
		$.winHistoricoInsumo.add(camada);
		
		var atualizarGrafico = function(ret){
			collectionHistorico = ret;
			montaSeriesGrafico({numMeses: numMeses, collection: collectionHistorico, cotacao: parans.cotacao, fornecedor: parans.fornecedor}); 
			configGrafico.setColecao(collectionHistorico);
		};
		
		var ws = Alloy.createWidget("WebService").iniciarHttpRequest({
			callback: parans?atualizarGrafico:sucesso,
			error: function(e){
				Alloy.Globals.Alerta("Erro", "Ocorreu um erro ao obter o histórico de compra do insumo, tente novamente mais tarde."); 
			},
			url:  Alloy.Globals.MainDomain + "api/Cotacao/getHistoricoInsumo", 
			metodo: "POST", 
			timeout: 120000,
			colecao: undefined,
			semLoader: true
		});
		if(ws){
			var hoje = new Date();
			var inicial = new Date(new Date().setMonth(hoje.getMonth() - numMeses));
			inicial.setDate(1);
			
			ws.adicionaParametro({codigoInsumo: args.insumo, naoMostraInsumoSemCotacao: "true", 
				dataInicial: Alloy.Globals.format.customFormatData(inicial, undefined, "YYYY-MM-DD"), 
				dataFinal: Alloy.Globals.format.customFormatData(hoje, undefined, "YYYY-MM-DD")});
			ws.NovoEnvia();
		}	
	}
	catch(e){
		Alloy.Globals.onError(e.message, "getCotacoes", "app/controllers/Cotacao/HistoricoInsumo.js"); 
	}
}

function getCotacoesDaObra(empobr){
	return _.uniq(
		_.pluck(
			_.filter(collectionHistorico.toJSON(), function(historico){
				return (historico.CodEmpresa + "|" + historico.Obra) == empobr;
			}), 
			"Cotacao"
		)
	);
}

configGrafico.on("filtro", function(e){
	Ti.API.info("1" + JSON.stringify(collectionHistorico.toJSON()));
	Ti.API.info(JSON.stringify(getCotacoesDaObra(e.empobr)));
	if(e.numMeses != numMeses){
		numMeses = e.numMeses;
		getHistoricoInsumo({cotacao: getCotacoesDaObra(e.empobr), fornecedor: e.fornecedor});
	}else{
		montaSeriesGrafico({numMeses: e.numMeses, collection: collectionHistorico, cotacao: getCotacoesDaObra(e.empobr), fornecedor: e.fornecedor});
		Ti.API.info("2" + JSON.stringify(collectionHistorico.toJSON()));	
	}
});
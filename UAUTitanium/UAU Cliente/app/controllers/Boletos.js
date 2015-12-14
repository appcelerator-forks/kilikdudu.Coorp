/**
 * @class controllers.Boletos
 * Lista boletos.
 * @alteracao 21/01/2015 176562 Projeto Carlos Eduardo Santos Alves Domingos
 * Criação.
 * @alteracao 09/07/2015 191657 Projeto Carlos Eduardo Santos Alves Domingos
 * O banner foi movido para esta tela.
 */
var args = arguments[0] || {};

/**
 * @property {Number} limite Limite de registros por página. 
 */
var limite = 20;


/**
 * @property {widgets.Util.ListaInfinita} listaInfinita Funcionalidades da lista infinita.
 */
var listaInfinita = Alloy.createWidget("Util", "ListaInfinita", {colecao: $.boletos, lista: $.listaBoletos, 
	refreshCallback: getBoletos, limite: limite});

/**
 * @event sucesso
 * Conseguiu obter os boletos do WebService.
 * @alteracao 21/01/2015 176562 Projeto Carlos Eduardo Santos Alves Domingos
 * Criação.
 */
function sucesso(){
	try{
		$.boletos.trigger("change");
		$.ptr.hide();
		listaInfinita.reiniciarContainer();
		if($.boletos.length == 0){
			$.listaBoletos.setOpacity(0);
			$.lblEmpty.setOpacity(1);
		}
		else{
			$.lblEmpty.setOpacity(0);
			$.listaBoletos.setOpacity(1);
		}
	}
	catch(e){
		Alloy.Globals.onError(e.message, "sucesso", "app/controllers/Boletos.js");
	}
}

/**
 * @event myRefresher
 * Disparado no pushToRefresh.
 * @alteracao 05/05/2015 186931 Projeto Carlos Eduardo Santos Alves Domingos
 * Criação.
 */
function myRefresher(e) {
	listaInfinita.myRefresher();	
}

/**
 * @event buscar
 * Disparado ao se confirmar a texto da busca.
 * @alteracao 05/05/2015 186931 Projeto Carlos Eduardo Santos Alves Domingos
 * Criação. 
 */
function buscar(e){
	getBoletos({semLoader: false, limite: limite, cursor: 0});
}

/**
 * @event adicionarRegistros
 * Disparado ao se clicar em buscar mais registros.
 * @alteracao 05/05/2015 186931 Projeto Carlos Eduardo Santos Alves Domingos
 * Criação.
 */
function adicionarRegistros(ret){
	listaInfinita.adicionarRegistros(ret.toJSON());
}

/**
 * @method init
 * Construtor da classe.
 * @alteracao 21/01/2015 176562 Projeto Carlos Eduardo Santos Alves Domingos
 * Criação.
 */
$.init = function(){
	try{
		Alloy.Globals.configWindow($.winBoletos, $);
		$.minhaTopBar.iniciar("Reimpressão de boletos");	
	}
	catch(e){
		Alloy.Globals.onError(e.message, "init", "app/controllers/Boletos.js");
	}
};

/**
 * @event open
 * Disparado ao abrir a janela. Executa controllers.Boletos.getBoletos
 * @alteracao 21/01/2015 176562 Projeto Carlos Eduardo Santos Alves Domingos
 * Criação.
 */
$.winBoletos.addEventListener("open", function(e){
	try{
		getBoletos({semLoader: false, limite: limite, cursor: 0});	
	}
	catch(e){
		Alloy.Globals.onError(e.message, "open", "app/controllers/Boletos.js");
	}
});

/**
 * @method getBoletos
 * Tenta obter os boletos a partir do WebService WebServices/wsMobile.asmx/getBoletosMob .
 * @alteracao 21/01/2015 176562 Projeto Carlos Eduardo Santos Alves Domingos
 * Criação.
 */
function getBoletos(parans){
	try{
		
		var limit = parans.limite;
		var semLoader = parans.semLoader;
		var cursor = parans.cursor;
		if(cursor > 0){
			listaInfinita.iniciarLoader();
		}
		
		var ws = Alloy.createWidget("WebService").iniciarHttpRequest({
			callback: cursor==0?sucesso:adicionarRegistros,
			error: function(e){alert("Erro ao recuperar os boletos.");},
			url:  Alloy.Globals.MainDomain + "api/Boleto/getBoletosCliente", 
			metodo: "POST", 
			timeout: 60000,
			colecao: cursor==0?$.boletos:undefined,
			semLoader: semLoader
		});
		if(ws){
			ws.adicionaParametro({codUsuario: Alloy.Globals.Usuario.Codigo, usuario: Alloy.Globals.Usuario.Login, limit: limit, cursor: cursor, busca: $.schBusca.getValue(), token: Alloy.Globals.Empresa.token});
			ws.NovoEnvia();
		}	
	}
	catch(e){
		Alloy.Globals.onError(e.message, "getBoletos", "app/controllers/Boletos.js");
	}
}

/**
 * @event formatar
 * Disparado a cada nova linha na lista de boletos. Formata os dados para a lista.
 * @param {BackBone.Model} model Modelo que representa o boleto, veja models.Boleto
 * @returns {JSONObject}
 * @alteracao 21/01/2015 176562 Projeto Carlos Eduardo Santos Alves Domingos
 * Criação.
 */
function formatar(model){
	try{
		var bol = model.toJSON();
		bol.Buscar = Alloy.Globals.format.paraReal(bol.ValorDocumento, ".") + "|" + bol.Empreendimento + "|" + Alloy.Globals.format.FormatoDiaMesAno(bol.DataVencimento) + "|" + bol.SeuNumero; 
		bol.ValorDocumento = "Valor : " + Alloy.Globals.format.paraReal(bol.ValorDocumento, ".");
		bol.Empreendimento = "Empreendimento : "+ bol.Empreendimento;
		bol.DataVencimento = "Vencimento : "+ Alloy.Globals.format.FormatoDiaMesAno(bol.DataVencimento);
		bol.SeuNumeroShow = "Seu número : "+ bol.SeuNumero;
		return bol;	
	}
	catch(e){
		Alloy.Globals.onError(e.message, "formatar", "app/controllers/Boletos.js");
	}
}


/**
 * @event detalhar
 * Disparado quando se clica na lista. Detalha o boleto.
 * @param {Ti.UI.TableView.Row} e
 */
function detalhar(e){
	try{
		if(e.row.tipo == "atualizar"){
			listaInfinita.mostrarMais();
			return;
		}
		Alloy.createWidget("Util", "Animation").animarClick(e.row.children[0]);
		var selectedBol = $.boletos.where({SeuNumero: e.row.model})[0].toJSON();
		var detalhes = Alloy.createController("BoletoDetalhe", {dados: selectedBol});
		Alloy.Globals.Transicao.proximo(detalhes, detalhes.init, {});
	}
	catch(e){
		Alloy.Globals.onError(e.message, "detalhar", "app/controllers/Boletos.js");
	}
}

//Banner.
var adMob = require ('ti.admob');

if(Ti.Platform.name === 'android'){
	var ad = adMob.createView({
		height : '50',
		bottom: '0',
		width: "100%",
		publisherId : "ca-app-pub-1286785516365762/7962551134", 
		testing : false
	});
	$.winBoletos.add(ad);
}
else{
	var ad = adMob.createView({
	    height : '50',
	    width: "100%",
		bottom: '0',
	    adUnitId: 'ca-app-pub-1286785516365762/7962551134', 
	    adBackgroundColor: 'white',
	    testDevices: [adMob.SIMULATOR_ID],
	    dateOfBirth: new Date(1991, 10, 1, 12, 1, 1),
	    gender: 'male',
	    keywords: ''
	});
	$.winBoletos.add(ad);
}

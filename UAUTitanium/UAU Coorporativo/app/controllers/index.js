/**
 * @class controllers.index
 * Classe principal, primeira a ser executada.
 * @alteracao 04/03/2015 180419 Projeto Carlos Eduardo Santos Alves Domingos
 * Criação.
 */
var args = arguments[0] || {};

var adMob = require ('ti.admob');

/**
 * @method init
 * Construtor da classe
 * @private
 * @alteracao 04/03/2015 180419 Projeto Carlos Eduardo Santos Alves Domingos
 * Criação.
 */
function init(){
	try{
		Alloy.Globals.configWindow($.janela, $);
	}
	catch(e){
		Alloy.Globals.onError(e.message, "init", "app/controllers/index.js");
	}
}

/**
 * @property {controllers.Novidade.Novidades} novs Lista de novidades na horizontal.
 */
var novs = Alloy.createController("Novidade/Novidades");
$.conteudoNovidades.add(novs.getView());

if(Ti.Platform.name === 'android'){
	var ad = adMob.createView({
		height : '50',
		bottom: '0',
		publisherId : "ca-app-pub-1286785516365762/5800844736", // You can get your own at http://www.admob.com/
		testing : false
	});
	$.janela.add(ad);
}
else{
	var ad = adMob.createView({
	    height : '50',
		bottom: '0',
	    adUnitId: 'ca-app-pub-1286785516365762/5800844736', // You can get your own at http: //www.admob.com/
	    adBackgroundColor: 'white',
	    // You can get your device's id for testDevices by looking in the console log after the app launched
	    testDevices: [adMob.SIMULATOR_ID],
	    dateOfBirth: new Date(1991, 10, 1, 12, 1, 1),
	    gender: 'male',
	    keywords: ''
	});
	$.janela.add(ad);
}


/*$.banner1.setImage("/banners/01.jpg");
$.banner2.setImage("/banners/02.jpg");
$.banner3.setImage("/banners/01.jpg");*/

/**
 * @property {controllers.Novidade.PopUpNovidades} popUpNovidades Popup contendo a lista dos módulos.
 */
//var popUpNovidades = Alloy.createController("Novidade/PopUpNovidades");
//popUpNovidades.init();

//Alloy.createWidget("Util", "Animation").dragToLocation($.barraDrag, $.slideEntrar, entrar);

//Abro a janela.
Alloy.Globals.Transicao.nova($, init, {});

/**
 * @event redirectBanner
 * Invocada quando se clica no banner.
 * @alteracao 04/03/2015 180419 Projeto Carlos Eduardo Santos Alves Domingos
 * Criação.
 */
function redirectBanner(){
	try{
		Ti.Platform.openURL("http://www.uauglobaltec.com/site/home/");	
	}
	catch(e){
		Alloy.Globals.onError(e.message, "redirectBanner", "app/controllers/index.js");
	}
}

/**
 * @event showPopUpNovidades
 * Exibe a popup de novidades.
 * @alteracao 04/03/2015 180419 Projeto Carlos Eduardo Santos Alves Domingos
 * Criação.
 */
function showPopUpNovidades(){
	try{
		//popUpNovidades.show();	
	}
	catch(e){
		Alloy.Globals.onError(e.message, "showPopUpNovidades", "app/controllers/index.js");
	}
}

/**
 * @event entrar
 * Chama a página de login.
 * @alteracao 04/03/2015 180419 Projeto Carlos Eduardo Santos Alves Domingos
 * Criação.
 */
function entrar(){
	//Abro a janela.
	try{
		var ini = Alloy.createController("inicio");
		Alloy.Globals.Transicao.nova(ini, ini.init, {});	
	}
	catch(e){
		Alloy.Globals.onError(e.message, "entrar", "app/controllers/index.js");
	}
}
 

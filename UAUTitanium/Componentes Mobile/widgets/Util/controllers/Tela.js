/**
 * @class widgets.Util.Tela 
 * Configura componentes genéricos na tela.
 * @alteracao 21/01/2015 176562 Projeto Carlos Eduardo Santos Alves Domingos
 * Criação.
 */
var args = arguments[0] || {};

/**
 * Faz as configurações iniciais da window. Deve ser invocado no costrutor de todo Controller que possui janela.
 * @param {Ti.UI.Window} janela Window a se configurar.
 * @param {Alloy} runningAlloy Alloy vinculado ao Controller.
 * @alteracao 21/01/2015 176562 Projeto Carlos Eduardo Santos Alves Domingos
 * Criação.
 */
$.initConfigWindow = function(janela, runningAlloy)
{
	try{
		
		janela.addEventListener("close", function(e){
			runningAlloy.destroy();
		});
		
		if(Ti.Platform.name === 'android')
		{
			janela.width = Ti.UI.FILL;
			janela.height = Ti.UI.FILL;
			janela.windowSoftInputMode = Titanium.UI.Android.SOFT_INPUT_ADJUST_PAN;
			janela.exitOnClose = false;
		}
	}
	catch(e){
		Alloy.Globals.onError(e.message, "initConfigWindow", "app/widgets/Util/controllers/Tela.js");
	}
};

/**
 * Faz as configurações iniciais da popup na tela. Deve ser invocado no costrutor de todo Controller que se comporta como popup.
 * @param {Ti.UI.View} popupController PopUp a se configurar.
 * @param {Function} showFunction Rotina executa toda vez que o método show da popup é invocado.
 * @param {Function} cancelFunction Rotina executa toda vez que o método close da popup é invocado.
 * @alteracao 21/01/2015 176562 Projeto Carlos Eduardo Santos Alves Domingos
 * Criação.
 */
$.initConfigPopUp = function(popupController, showFunction){
	var camada = Alloy.createWidget("GUI", "Camada").getView();
	var component = popupController.getView();
	var animacaoAbrir = Ti.UI.createAnimation({
		duration: 200,
		opacity: 1
	});
	
	popupController.show = function(parans){
		try{
			//Adiciono a nova função do botão voltar no android. Não interfere com o iOS.
			Alloy.Globals.currentWindow().stackBackFunction.push(popupController.close);
			Alloy.Globals.currentWindow().add(camada);
			component.opacity = 0;
			Alloy.Globals.currentWindow().add(component);
			component.animate(animacaoAbrir);
			if(showFunction){
				showFunction(parans);	
			}
		}
		catch(e){
			Alloy.Globals.onError(e.message, "initConfigPopUp", "app/widgets/Util/controllers/Tela.js");
		}
	};
	popupController.close = function(parans){
		try{
			//Desempilho a função do botão voltar para essa popup.
			Alloy.Globals.currentWindow().stackBackFunction.pop();
			Alloy.Globals.currentWindow().remove(camada);
			Alloy.Globals.currentWindow().remove(component);
		}
		catch(e){
			Alloy.Globals.onError(e.message, "initConfigPopUp", "app/widgets/Util/controllers/Tela.js");
		}
	};
};

/**
 * @class widgets.GUI.LblTextField
 * Componente para entrada de texto personalizado.
 * @alteracao 21/01/2015 176562 Projeto Carlos Eduardo Santos Alves Domingos
 * Criação.
 */
var args = arguments[0] || {};

/**
 * @method
 * Construtor da classe.
 * @param {Object} parans Configurações do textInput
 * @param {String} parans.nome Título do texto input.
 */
$.init = function(parans){
	if(parans.nome){
		$.lblNovoNome.text = parans.nome;
	}
	return null;
};

/**
 * @method
 * Pega o texto inserido.
 * @alteracao 21/01/2015 176562 Projeto Carlos Eduardo Santos Alves Domingos
 * Criação.
 * @return {String}
 */
$.getInputValue = function(){
	return $.novoNome.value;
};

/**
 * @method setDesc
 * Altera o título.
 * @param {Object} desc
 * @alteracao 21/01/2015 176562 Projeto Carlos Eduardo Santos Alves Domingos
 * Criação.
 */
$.setDesc = function(desc){
	$.lblNovoNome.text = desc;
};

/**
 * @method setInputValue
 * Altera o valor do input. 
 * @param {String} value
 * @alteracao 21/01/2015 176562 Projeto Carlos Eduardo Santos Alves Domingos
 * Criação.
 */
$.setInputValue = function(value){
	$.novoNome.value = value;
};

/**
 * @method desfocar
 * Retira o foco do controle.
 * @alteracao 21/01/2015 176562 Projeto Carlos Eduardo Santos Alves Domingos
 * Criação.
 */
$.desfocar = function(){
	$.novoNome.blur();
};

/**
 * @method selecionar
 * Coloca o foco no text input.
 * @alteracao 21/01/2015 176562 Projeto Carlos Eduardo Santos Alves Domingos
 * Criação.
 */
$.selecionar = function(){
	$.novoNome.softKeyboardOnFocus = Ti.UI.Android.SOFT_KEYBOARD_SHOW_ON_FOCUS;
	$.linha.setBackgroundColor(Alloy.Globals.MainColor);
	$.novoNome.focus();
};

/**
 * @event singletap 
 * Da o foco ao componente.
 * @alteracao 21/01/2015 176562 Projeto Carlos Eduardo Santos Alves Domingos
 * Criação.
 */
$.novoNome.addEventListener('singletap', function() {
	if(Ti.Platform.name === 'android'){
		$.novoNome.softKeyboardOnFocus = Ti.UI.Android.SOFT_KEYBOARD_SHOW_ON_FOCUS;	
	}
    $.linha.setBackgroundColor(Alloy.Globals.MainColor);
	$.novoNome.focus();
});
/**
 * @event click 
 * Da o foco ao componente.
 * @alteracao 21/01/2015 176562 Projeto Carlos Eduardo Santos Alves Domingos
 * Criação.
 */
$.novoNome.addEventListener('click', function() {
	if(Ti.Platform.name === 'android'){
		$.novoNome.softKeyboardOnFocus = Ti.UI.Android.SOFT_KEYBOARD_SHOW_ON_FOCUS;	
	}
    $.linha.setBackgroundColor(Alloy.Globals.MainColor);
	$.novoNome.focus();
});
/**
 * @event blur
 * Disparado ao se perder o foco ao componente.
 * @alteracao 21/01/2015 176562 Projeto Carlos Eduardo Santos Alves Domingos
 * Criação.
 */    
$.novoNome.addEventListener('blur', function() {
	if(Ti.Platform.name === 'android'){
		$.novoNome.softKeyboardOnFocus = Ti.UI.Android.SOFT_KEYBOARD_HIDE_ON_FOCUS;	
	}
	$.linha.setBackgroundColor("black");
});
/**
 * @class widgets.GUI.Camada
 * Cria uma camada na janela para desabilitar o click nos componentes sobrepostos por ela.
 * @alteracao 21/01/2015 176562 Projeto Carlos Eduardo Santos Alves Domingos
 * Criação.
 * @cfg {Boolean} load Indica se a camada vai possuir loading.
 */
var args = arguments[0] || {};
if(args.load){
	Alloy.createWidget("Util", "Animation").loaderAnimation($.engrenagem);
	$.boxEngrenagem.visible = true;
}

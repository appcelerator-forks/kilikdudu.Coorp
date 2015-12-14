/**
 * @class controllers.Resumo.ResumoMedicao
 * Mostra o resumo dos processos de pagamento. 
 * Nesta primeira versão, apresenta apenas o número de medições que carecem de aprovação deste usuário.
 * @alteracao 15/05/2015 185753 Projeto Carlos Eduardo Santos Alves Domingos
 * Criação. 
 */
var args = arguments[0] || {};

/**
 * @property {Ti.UI.Button} btnAtualizar Botão que é apresentado caso ocorra algum erro ao buscar o resumo das medições de contrato.
 * @private 
 */
var btnAtualizar = Ti.UI.createButton({
	width: 32,
	height: 32,
	backgroundSelectedColor: "#E6E6E6",
	backgroundImage: "/images/refresh.png"
});

btnAtualizar.addEventListener("click", getInfo);

/**
 * @property {Ti.UI.ImageView} loader ImageView apresentada enquanto busca o resumo.
 * @private 
 */
var loader = Ti.UI.createImageView({
	height: 32,
	width: 32,
	images: Alloy.createWidget("Util", "Animation").getImagesLoader(),
	duration: 50
});

$.info.add(loader);

loader.addEventListener("load", function(e){
	loader.start();
});

//Busco o resumo.
getInfo();

/**
 * @method getInfo
 * Busca o resumo das medições de contrato.
 * @private
 * @alteracao 15/05/2015 185753 Projeto Carlos Eduardo Santos Alves Domingos
 * Criação.   
 */
function getInfo(){
	var ws = Alloy.createWidget("WebService").iniciarHttpRequest({
		callback: sucesso,
		error: function(e){
			Alloy.Globals.Alerta("Erro", "Ocorreu um erro ao obter a quantidade de cotações.");
			loader.stop();
			$.info.remove(loader);
			$.info.add(btnAtualizar);
		},
		url:  Alloy.Globals.MainDomain + "api/Cotacao/contaCotacoes", 
		metodo: "POST", 
		timeout: 120000,
		semLoader: true
	});
	if(ws){
		ws.adicionaParametro({usuario: Alloy.Globals.Usuario.UsuarioUAU});
		ws.NovoEnvia();
	}
}

/**
 * @event sucesso
 * Invocado quando se obtem sucesso ao obter o resumo.
 * @param {BackBone.Collection} ret Dados do resumo.
 * @alteracao 15/05/2015 185753 Projeto Carlos Eduardo Santos Alves Domingos
 * Criação. 
 */
function sucesso(ret){
	try{
		var md = ret.at(0).toJSON();
		var lblMensagem;
		//Monto o html da mensagem.
		var html = "<label><b><font color=\"black\">" + md.Quantidade + "</font></b><font color=\"gray\">" + 
				   "  cotações precisam de sua aprovação.</font></label>";
		//Testo se a plataforma é iOS, se sim, monto a mensagem com o widget.				   
		if(Ti.Platform.name === 'iPhone OS'){
			lblMensagem = Alloy.createWidget("nl.fokkezb.html2as.widget", "widget", {
				font: {fontSize: Alloy.isHandheld?18:20},
				textAlign: Titanium.UI.TEXT_ALIGNMENT_LEFT,
				left: 10,
				right: 10,
				html: html
			}).getView();
		}else{
			lblMensagem = Ti.UI.createLabel({
				font: {fontSize: Alloy.isHandheld?18:20},
				textAlign: Titanium.UI.TEXT_ALIGNMENT_LEFT,
				left: 10,
				right: 10,
				html: html
			});
		}
		loader.stop();
		$.info.remove(loader);
		$.info.add(lblMensagem);
		$.info.addEventListener("click", vai);
	}
	catch(e){
		Alloy.Globals.onError(e.message, "sucesso", "app/controllers/Medicao/ItensMedicao.js");
	}
}	

/**
 * @event vai 
 * Leva o usuário até a página das medições de contrato.
 * @alteracao 15/05/2015 185753 Projeto Carlos Eduardo Santos Alves Domingos
 * Criação. 
 */
function vai(e){
	var novo = Alloy.createController("Cotacao/ListaCotacoes");
	Alloy.createWidget("Util", "Transicao").nova(novo, novo.init, {});
}

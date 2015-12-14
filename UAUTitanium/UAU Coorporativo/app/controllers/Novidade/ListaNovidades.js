/**
 * @class controllers.Novidade.ListaNovidades
 * Lista de novidades por módulo.
 * @alteracao 04/03/2015 180419 Projeto Carlos Eduardo Santos Alves Domingos
 * Criação.
 */
var args = arguments[0] || {};

/**
 * @property {String} descrModulo Título do módulo. 
 */
var descrModulo = args.descrModulo;

/**
 * @property {Number} numModulo Número do módulo. 
 */
var numModulo = args.numModulo;

//Ativo o filtro inteligente.
$.minhaTopBar.enableSmartFilter($.minhaListaNovidades);

/**
 * @event sucesso
 * Conseguiu obter as novidades do WebService.
 * @alteracao 04/03/2015 180419 Projeto Carlos Eduardo Santos Alves Domingos
 * Criação.
 */
function sucesso(){
	try{
		$.novidades.trigger("change");
	}
	catch(e){
		Alloy.Globals.onError(e.message, "sucesso", "app/controllers/Novidade/ListaNovidades.js");
	}
}

/**
 * @method init
 * Construtor da classe.
 * @alteracao 04/03/2015 180419 Projeto Carlos Eduardo Santos Alves Domingos
 * Criação.
 */
$.init = function(){
	try{
		Alloy.Globals.configWindow($.winListaNovidades, $);
		$.minhaTopBar.iniciar("Novidades");	
		$.subtitulo.text += " " + descrModulo;
	}
	catch(e){
		Alloy.Globals.onError(e.message, "init", "app/controllers/Novidade/ListaNovidades.js");
	}
};

/**
 * @event open
 * Disparado ao abrir a janela. Executa a rotina getNovidades.
 * @alteracao 04/03/2015 180419 Projeto Carlos Eduardo Santos Alves Domingos
 * Criação.
 */
$.winListaNovidades.addEventListener("open", function(e){
	try{
		getNovidades();	
	}
	catch(e){
		Alloy.Globals.onError(e.message, "open", "app/controllers/Novidade/ListaNovidades.js");
	}
});

/**
 * @method getNovidades
 * Tenta obter as novidades a partir do WebService api/Novidades/NovidadesPorModuloVersao.
 * @alteracao 04/03/2015 180419 Projeto Carlos Eduardo Santos Alves Domingos
 * Criação.
 */
function getNovidades(){
	try{
		var ws = Alloy.createWidget("WebService").iniciarHttpRequest({
			callback: sucesso,
			error: function(e){alert("Erro ao tentar obter novidades");},
			url:  Alloy.Globals.LocaWebDomain + "api/Novidades/NovidadesPorModuloVersao", 
			metodo: "POST", 
			timeout: 60000,
			colecao: $.novidades
		});
		if(ws){
			ws.adicionaParametro({suportNetLocaWeb: "http://www.uau.com.br/", modulo: numModulo, versao: Alloy.Globals.VersaoUAU});
			ws.NovoEnvia({outArch: true});
		}	
	}
	catch(e){
		Alloy.Globals.onError(e.message, "getNovidades", "app/controllers/Novidade/ListaNovidades.js");
	}
}

/**
 * @event formatar
 * Disparado a cada nova linha na lista de novidades. Formata os dados para a lista.
 * @param {BackBone.Model} model Modelo que representa a novidade, veja models.Novidade
 * @returns {JSONObject}
 * @alteracao 04/03/2015 180419 Projeto Carlos Eduardo Santos Alves Domingos
 * Criação.
 */
function formatar(model){
	try{
		var md = model.toJSON();
		md.Projeto = "Tarefa : " + md.NumeroTarefa;
		if(md.linkVirtual){
			md.ativaLink = true;
		}
		else{
			md.ativaLink = false;
		}
		md.Busca = md.NumeroTarefa + " " + md.Descricao + " " + md.linkVirtual;
		return md;	
	}
	catch(e){
		Alloy.Globals.onError(e.message, "formatar", "app/controllers/Novidade/ListaNovidades.js");
	}
}

/**
 * @event verVirtual
 * Disparado quando se clica na lista. Detalha o boleto.
 * @param {Object} e
 */
function verVirtual(e){
	try{
		Ti.Platform.openURL(e.source.link);	
	}
	catch(e){
		Alloy.Globals.onError(e.message, "verVirtual", "app/controllers/Novidade/ListaNovidades.js");
	}
}
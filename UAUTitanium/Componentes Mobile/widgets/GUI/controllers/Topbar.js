/**
 * @class widgets.GUI.Topbar
 * Barra no topo do App.
 * @alteracao 21/01/2015 176562 Projeto Carlos Eduardo Santos Alves Domingos
 * Criação. 
 */
var args = arguments[0] || {};

/**
 * @method iniciar
 * Construtor da classe. Altera o título e caso exista uma janela anterior, a barra substitui o ícone de lista para o ícone voltar.
 * Adiciona também o evento de swipe na lateral esquerda da tela. 
 * @param {Object} titulo
 * @alteracao 21/01/2015 176562 Projeto Carlos Eduardo Santos Alves Domingos
 * Criação. 
 */
$.iniciar = function(titulo){
	try{
		if(Alloy.Globals.currentWindow()){
			if(Alloy.Globals.currentWindow()._previousWin){
				$.boxListaServico.setBackgroundImage("/images/voltar.png");	
			}
		}
		$.titulo.text = titulo;
		
		var camadaTeste = Ti.UI.createView({
			zIndex: 10,
			width: 25,
			left: 0,
			height: Ti.UI.FILL,
			top: 50
		});
		
		camadaTeste.addEventListener("swipe", function(e){
			if(e.direction === 'right'){
				$.boxListaServico.fireEvent("click", {source: $.boxListaServico});
			}
		});
		
		Alloy.Globals.currentWindow().add(camadaTeste);
	}
	catch(e){
		Alloy.Globals.onError(e.message, "iniciar", "app/widgets/GUI/controllers/Topbar.js");
	}
};

$.addRightButtom = function(icon, callback){
	var btnRight = Ti.UI.createButton({
		right: 10,
		width: 32,
		height: 32,
		backgroundColor: 'transparent',
		backgroundImage: icon,
		backgroundSelectedColor: Alloy.Globals.MainColorLight
	});
	btnRight.addEventListener("click", callback);
	$.boxTopBar.add(btnRight);
};

$.enableSmartFilter = function(tableView){
	var searchBar = null;
	var inputSearch = null;
	var semaforo = false;
	if(Ti.Platform.name !== 'android'){
		searchBar = Ti.UI.createSearchBar({
			visible: false,
			height: 0,
			top: 0
		});	
		inputSearch =Ti.UI.createTextField({
			height: 40,
			top: 5,
			right: 47,
			width: 0,
			backgroundColor: "white",
			color: "black",
			textAlign: Ti.UI.TEXT_ALIGNMENT_RIGHT,
			borderRadius: 4,
			hintText: "Buscar"
		});
	}
	else{
		searchBar = Ti.UI.Android.createSearchView({
			height: 0,
			top: 0,
			visible: false
		});
		inputSearch =Ti.UI.createTextField({
			height: 40,
			top: 5,
			right: 47,
			width: 0,
			backgroundColor: "white",
			color: "black",
			textAlign: Ti.UI.TEXT_ALIGNMENT_RIGHT,
			borderRadius: 4,
			hintText: "Buscar",
			softKeyboardOnFocus: Ti.UI.Android.SOFT_KEYBOARD_SHOW_ON_FOCUS
		});
	}
	tableView.search = searchBar;
	tableView.setFilterCaseInsensitive(true);
	tableView.setFilterAttribute("title");
	
	inputSearch.addEventListener("change", function(e){
		searchBar.setValue(e.source.value);
	});
	
	var btSearch = Ti.UI.createButton({
		backgroundColor: 'transparent',
		backgroundImage: '/images/lupa_white.png',
		right: 10,
		width: 32,
		height: 32,
		ativado: false,
		search: searchBar,
		input: inputSearch,
		tituloTopBar: $.titulo
	});
	
	$.boxTopBar.add(btSearch);
	
	btSearch.addEventListener("click", function(e){
		if(semaforo){
			return ;
		}
		semaforo = true;
		e.source.ativado = !e.source.ativado;
		if(e.source.ativado){
			$.boxTopBar.add(e.source.input);
			e.source.input.focus();
			e.source.backgroundImage = "/images/delete_white.png";
		}
		else{
			e.source.backgroundImage = "/images/lupa_white.png";
			e.source.input.setValue("");
			e.source.search.setValue("");
		}
		var animacaoinputSearch = Ti.UI.createAnimation({
			width: e.source.ativado?"60%":0,
			duration: 150,
			input: e.source.input,
			ativado : e.source.ativado,
			btnSemaforo: e.source.semaforo
		});
		
		animacaoinputSearch.addEventListener("complete", function(e){
			if(!e.source.ativado){
				$.boxTopBar.remove(e.source.input);
			}
			else{
				e.source.input.focus();
			}
			semaforo = false;
		});
		
		var animacaoTitulo = Ti.UI.createAnimation({
			opacity: e.source.ativado?0:1,
			duration: 100
		});
		e.source.input.animate(animacaoinputSearch);
		e.source.tituloTopBar.animate(animacaoTitulo);
	});
	
};

/**
 * @event click_boxListaServico
 * Disparado ao se clicar no ícone de lista. Caso exista uma janela anterior, esta janela será fechada e a anterior será aberta.
 * @alteracao 21/01/2015 176562 Projeto Carlos Eduardo Santos Alves Domingos
 * Criação. 
 */
$.boxListaServico.addEventListener("click", function(e){
	if(Alloy.Globals.currentWindow()._previousWin){
		Alloy.createWidget("Util", "Transicao").anterior();
	}
	else{
		Alloy.Globals.ListaServicos.abrir();
	}
});
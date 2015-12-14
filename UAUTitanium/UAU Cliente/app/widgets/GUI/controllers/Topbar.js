/**
 * @class widgets.GUI.Topbar
 * Barra no topo do App.
 * @alteracao 21/01/2015 176562 Projeto Carlos Eduardo Santos Alves Domingos
 * Criação. 
 */
var args = arguments[0] || {};

var inputSearch = null;
var searchBar = null;
var semaforo = false;

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

/**
 * @method addRightButtom
 * Adiciona um botão no canto superior direito da tela.
 * @param {String} icon Url do icone.
 * @param {Function} callback Função executada quando se clica no botão.
 * @alteracao 05/03/2015 180419 Projeto Carlos Eduardo Santos Alves Domingos
 * Criação. 
 */
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
	return btnRight;
};


function configSearchBariOS(tableView){
	searchBar = Ti.UI.createSearchBar({
		hintText: "Procurar...",
		height: Alloy.isTablet?60:40,
		left: 0,
		right: 0,
		width: Ti.UI.FILL
	});
	tableView.search = searchBar;
	tableView.setFilterCaseInsensitive(true);
	tableView.setFilterAttribute("title");
}

/**
 * @method enableSmartFilter
 * Ativa o filtro inteligente para a lista.
 * @param {Ti.UI.TableView} tableView Tabela a ser filtrada.
 * @alteracao 05/03/2015 180419 Projeto Carlos Eduardo Santos Alves Domingos
 * Criação. 
 */
$.enableSmartFilter = function(tableView){
	if(Ti.Platform.name === 'iPhone OS'){
		configSearchBariOS(tableView);
		return ;
	}
	else if(Ti.Platform.name === 'android'){
		searchBar = Ti.UI.Android.createSearchView({
			height: 0,
			top: 0,
			visible: false
		});
		inputSearch =Ti.UI.createTextField({
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
		inputSearch.addEventListener("change", function(e){
			searchBar.setValue(e.source.value);
		});
		
	}
	
	tableView.search = searchBar;
	tableView.setFilterCaseInsensitive(true);
	tableView.setFilterAttribute("title");	
	
	var btSearch = Ti.UI.createButton({
		backgroundColor: 'transparent',
		backgroundImage: '/images/lupa_white.png',
		right: 10,
		width: 32,
		height: 32,
		ativado: false
	});
	
	$.boxTopBar.add(btSearch);
	
	btSearch.addEventListener("click", function(e){
		if(semaforo){
			return ;
		}
		semaforo = true;
		btSearch.ativado = !btSearch.ativado;
		if(btSearch.ativado){
			$.boxTopBar.add(inputSearch);
			inputSearch.focus();
			btSearch.backgroundImage = "/images/delete_white.png";
		}
		else{
			btSearch.backgroundImage = "/images/lupa_white.png";
			inputSearch.setValue("");
			searchBar.setValue("");
		}
		var animacaoinputSearch = Ti.UI.createAnimation({
			width: btSearch.ativado?"60%":0,
			duration: 150
		});
		
		animacaoinputSearch.addEventListener("complete", function(){
			if(!btSearch.ativado){
				$.boxTopBar.remove(inputSearch);
			}
			else{
				inputSearch.focus();
			}
			semaforo = false;
		});
		
		var animacaoTitulo = Ti.UI.createAnimation({
			opacity: e.source.ativado?0:1,
			duration: 100
		});
		
		Ti.API.info("Tenta executar evento.");
		if(Ti.Platform.name === 'android'){
			inputSearch.animate(animacaoinputSearch);	
		}
		else{
			if(!btSearch.ativado){
				$.boxTopBar.remove(inputSearch);
			}
			else{
				inputSearch.focus();
			}
			semaforo = false;
		}
		$.titulo.animate(animacaoTitulo);
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

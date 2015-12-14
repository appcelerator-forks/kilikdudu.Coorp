/**
 * @class widgets.GUI.PopUpList
 * Component  de lista em forma de popup.
 * @alteracao 21/01/2015 176562 Projeto Carlos Eduardo Santos Alves Domingos
 * Criação.
 */
var args = arguments[0] || {};

/**
 * @property {String} dataColumn Coluna da coleção que será exibida na lista. 
 */
var dataColumn = null;
/**
 * @property {String} chaveColumn Coluna chave da coleção. 
 */
var chaveColumn = null;
/**
 * @property {BackBone.Collection} refColecao Referência para a coleção vinculada a lista. 
 */
var refColecao = null;
/**
 * @property {Function} meuCallback Rotina executada quando se seleciona um item da lista.  
 */
var meuCallback = null;
/**
 * @property {Object} selectedRow Linha selecionada. Veja a documentação do Titanium para Ti.UI.TableViewRow.
 * @property {String} selectedRow.text Descrição da linha selecionada.
 * @property {String} selectedRow.chave Chave da linha selecionada.  
 */
var selectedRow = null;

//A barra de pesquisa não diferencia maiusculas de minusculas.
$.listaPopUp.setFilterCaseInsensitive(true);
$.listaPopUp.setFilterAttribute("title");

/**
 * @method preencher
 * Preenche a lista com os dados contidos na coleção passada.
 * @param {BackBone.Collection} dados Coleção que se deseja vincular a lista.
 * @alteracao 21/01/2015 176562 Projeto Carlos Eduardo Santos Alves Domingos
 * Criação.
 */
function preencher(dados){
	try{
		deselecionarRow();
		var tableData = [];
		for(var i = 0; i < dados.length; i++)
		{
			var tvRow = Ti.UI.createTableViewRow({
				width: Titanium.UI.FILL,
				height: 40,
				title: dados.at(i).get(dataColumn),
				chave: dados.at(i).get(chaveColumn),
				color: "white",
				selectedBackgroundColor: "transparent",
				className: "PopUpListRow"
			});
			var texto = Ti.UI.createLabel({
				text: dados.at(i).get(dataColumn),
				color: "black",
				textAlign: Titanium.UI.TEXT_ALIGNMENT_CENTER,
				width: Titanium.UI.FILL,
				height: 25,
				backgroundColor: "white",
				wordWrap: false,
				ellipsize: true
			});
			tvRow.add(texto);
			var linha = Ti.UI.createView({
				height: 0.5,
				backgroundImage: "/images/linhaBlack.png", 
				width: "90%",
				left: "5%",
				bottom: 1
			});
			tvRow.add(linha);
			tvRow.lblTexto = texto;
			tvRow.lin = linha;
			tableData.push(tvRow);
		}
		$.listaPopUp.setData(tableData);
	}
	catch(e){
		Alloy.Globals.onError(e.message, "preencher", "app/widgets/GUI/controllers/PopUpList.js");
	}
}

/**
 * @method setColecao 
 * Vincula uma nova coleção a lista.
 * @param {BackBone.Collection} novaColecao Nova coleção a ser vinculada.
 * @alteracao 21/01/2015 176562 Projeto Carlos Eduardo Santos Alves Domingos
 * Criação.
 */
$.setColecao = function(novaColecao){
	refColecao = novaColecao;
	refColecao.on("change", $.refresh);
	preencher(refColecao);
};

/**
 * @method refresh
 * Atualiza a lista de acordo com a coleção.
 * @alteracao 21/01/2015 176562 Projeto Carlos Eduardo Santos Alves Domingos
 * Criação.
 */
$.refresh = function(){
	preencher(refColecao);
	$.getView().fireEvent("atualizou", {colecao: refColecao.toJSON()});
};

/**
 * @method init
 * Construtor da classe. Realiza o vinculo a uma BackBone.Collection, toda vez que a coleção é atualizada a lista é regerada. 
 * Para evitar isso, utilize silence: true nas operações com a coleção.
 * @param {String} titulo título da lista
 * @param {BackBone.Collection} colecao Usado como referência por widgets.GUI.PopUpList.refColecao
 * @param {String} chave Usado como referência por widgets.GUI.PopUpList.chaveColumn
 * @param {String} coluna Usado como referência por widgets.GUI.PopUpList.chaveColumn
 * @param {Function} callback Usado como referência por widgets.GUI.PopUpList.meuCallback
 * @alteracao 21/01/2015 176562 Projeto Carlos Eduardo Santos Alves Domingos
 * Criação.
 */
$.init = function(titulo, colecao, chave, coluna, callback){
	try{
		$.tituloPopUp.text = titulo;
		chaveColumn = chave;
		dataColumn = coluna;
		meuCallback = callback;
		refColecao = colecao;
		preencher(refColecao);
		refColecao.on("change", $.refresh);
		Alloy.Globals.currentWindow().addEventListener("close", function(e){
			refColecao.off("change", $.refresh);
		});
		Alloy.Globals.configPopUp($, deselecionarRow);
	}
	catch(e){
		Alloy.Globals.onError(e.message, "init", "app/widgets/GUI/controllers/PopUpList.js");
	}
};

/**
 * @event listaClick
 * Click na lista. Altera a propriedade widgets.GUI.PopUpLista.selectedRow
 * @param {Ti.UI.TableViewRow} e 
 * @alteracao 21/01/2015 176562 Projeto Carlos Eduardo Santos Alves Domingos
 * Criação.
 */
function listaClick(e){
    deselecionarRow();
    selectedRow = e.row;
    selectedRow.lblTexto.setColor(Alloy.Globals.MainColor);
	selectedRow.lin.setBackgroundImage("/images/linhaBlue.png");
	$.btnOk.setEnabled(true);
    var animacao = Ti.UI.createAnimation({
    	duration: 300,
    	opacity: 1
    });
    $.btnOk.animate(animacao);
}

/**
 * @event clickOk
 * Executa widgets.GUI.PopUpList.meuCallback e fecha a lista.
 * @alteracao 21/01/2015 176562 Projeto Carlos Eduardo Santos Alves Domingos
 * Criação.
 */
function clickOk(e){
    meuCallback(selectedRow.title, selectedRow.chave);
	$.close();
}

/**
 * @event clickCancelar
 * Fecha a lista.
 * @alteracao 21/01/2015 176562 Projeto Carlos Eduardo Santos Alves Domingos
 * Criação.
 */
function clickCancelar(e){
	$.close();
}

/**
 * @method deselecionarRow
 * Retorna a lista para o seu estado inicial.
 * @private
 * @alteracao 21/01/2015 176562 Projeto Carlos Eduardo Santos Alves Domingos
 * Criação.
 */
function deselecionarRow(){
	if(selectedRow !== null){
		selectedRow.lblTexto.setColor("black");
		selectedRow.lin.setBackgroundImage("/images/linhaBlack.png");
    }
    selectedRow = null;
    $.btnOk.setEnabled(false);
    $.btnOk.setOpacity(0.6);
}
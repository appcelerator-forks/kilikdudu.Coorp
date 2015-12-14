/**
 * @class widgets.GUI.ComboBox
 * ComboBox personalizada.
 * @alteracao 21/01/2015 176562 Projeto Carlos Eduardo Santos Alves Domingos
 * Criação.
 */
var args = arguments[0] || {};

/**
 * @property {String} keyColumn Nome da coluna chave da coleção.
 * @private
 */
var keyColumn = null;

/**
 * @property {widgets.GUI.PopUpList} lista Controller da lista apresentada ao listar a ComboBox
 * @private
 */
var lista = Widget.createWidget("GUI", "PopUpList");

/**
 * @property {Function} funcAdd Rotina executada ao se clicar em Adicionar.
 * @private
 */
var funcAdd = null;

/**
 * @method init
 * Construtor da classe. 
 * @param {Object} parans Configurações da ComboBox
 * @param {String} parans.nome título da combobox
 * @param {Function} addFunc Referência utilizada por widgets.GUI.ComboBox.funcAdd
 * @param {String} chave Referência utilizada por widgets.GUI.ComboBox.keyColumn
 * @param {BackBone.Collection} colecao Coleção vinculada a listagem da combobox
 * @param {String} coluna Coluna da coleção que será exibida na listagem.
 * @alteracao 21/01/2015 176562 Projeto Carlos Eduardo Santos Alves Domingos
 * Criação.
 */
$.init = function(parans){
	try{
		$.lblDesc.text = parans.nome;
		funcAdd = parans.addFunc;
		keyColumn = parans.chave;
		lista.init($.lblDesc.text, parans.colecao, parans.chave, parans.coluna, $.setSelected);	
		lista.getView().addEventListener("atualizou", checkInput);
		return null;
	}
	catch(e){
		Alloy.Globals.onError(e.message, "init", "app/widgets/GUI/controllers/ComboBox.js");
	}
};

/**
 * @event checkInput 
 * Rotina executada quando a coleção vinculada a lista é atualizada.
 * @param {Object} param Resposta do evento.
 * @param {BackBone.Collection} colecao Nova coleção.
 * @alteracao 21/01/2015 176562 Projeto Carlos Eduardo Santos Alves Domingos
 * Criação.
 */
function checkInput(param){
	var flag = false;
	if($.selectedDesc.chave !== null){
		for(var i = 0; i < param.colecao.length; i++){
			if(param.colecao[i][keyColumn] === $.selectedDesc.chave){
				flag = true;
				break;
			}
		}
		if(!flag){
			$.selectedDesc.chave = null;
			$.selectedDesc.text = "";
		}
	}
}

/**
 * @method refreshList
 * Atualiza manualmente a lista vinculada.
 * @alteracao 21/01/2015 176562 Projeto Carlos Eduardo Santos Alves Domingos
 * Criação.
 */
$.refreshList = function(){
	try{
		lista.refresh();
	}
	catch(e){
		Alloy.Globals.onError(e.message, "refreshList", "app/widgets/GUI/controllers/ComboBox.js");
	}
};

/**
 * @method selecionar
 * Abre a lista da combobox.
 * @alteracao 21/01/2015 176562 Projeto Carlos Eduardo Santos Alves Domingos
 * Criação.
 */
$.selecionar = function(){
	$.btList.fireEvent("click", {source: $.btList});
};

/**
 * @method getSelected
 * Pega as informações do item selecionado na lista da combobox
 * @return {Object} Item selecionado
 * @return {String} return.texto Descrição do item selecionado.
 * @return {String} return.chave Chave do item selecionado.
 * @alteracao 21/01/2015 176562 Projeto Carlos Eduardo Santos Alves Domingos
 * Criação.
 */
$.getSelected = function(){
	var retorno = {texto: $.selectedDesc.text, chave: $.selectedDesc.chave};
	return retorno;
};

/**
 * @method setSelected
 * Altera o item selecionado manualmente.
 * @param {String} texto Descrição.
 * @param {String} chave Chave que identifica o item.
 * @alteracao 21/01/2015 176562 Projeto Carlos Eduardo Santos Alves Domingos
 * Criação.
 */
$.setSelected = function(texto, chave){
	$.selectedDesc.text = texto;
	$.selectedDesc.chave = chave;
};

/**
 * @event listar
 * Execuatada quando o botão listar é clicado.
 * @alteracao 21/01/2015 176562 Projeto Carlos Eduardo Santos Alves Domingos
 * Criação.
 */
function listar(){
	try{
		lista.show();
	}
	catch(e){
		Alloy.Globals.onError(e.message, "listar", "app/widgets/GUI/controllers/ComboBox.js");
	}
}

/**
 * @event btAddFunc
 * Executada quando o botão adicionar é clicado.
 * @alteracao 21/01/2015 176562 Projeto Carlos Eduardo Santos Alves Domingos
 * Criação.
 */
function btAddFunc(){
	try{
		funcAdd();
	}
	catch(e){
		Alloy.Globals.onError(e.message, "btAddFunc", "app/widgets/GUI/controllers/ComboBox.js");
	}
}

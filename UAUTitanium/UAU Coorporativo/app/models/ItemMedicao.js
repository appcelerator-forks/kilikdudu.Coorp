/** @class Models.ItemMedicao
 * Modelo que representa o item da medição de contrato.
 * @private
 * @alteracao 12/05/2015 185753 Projeto Carlos Eduardo Santos Alves Domingos
 * Criação.
 * @cfg {String} Codigo Código do item.
 * @cfg {String} Descricao Descrição do item.
 * @cfg {Number} Quantidade Quantidade deste item no contrato.
 * @cfg {Number} ValorTotal valor total unitário*quantidade.
 * @cfg {Number} ValorUnitario Valor unitário do item.
 */
exports.definition = {
	config: {
		columns: { 
			"Descricao" : "String",
	        "Codigo" : "String",
	        "Quantidade" : "Number",
	        "ValorUnitario" : "Number",
	        "ValorTotal" : "Number",
	        "Tipo" : "Number"
		},
		adapter: {
			type: "properties",
			collection_name: "ItemMedicao"
		}
	},
	extendModel: function(Model) {
		_.extend(Model.prototype, {
			// extended functions and properties go here
		});

		return Model;
	},
	extendCollection: function(Collection) {
		_.extend(Collection.prototype, {
			// extended functions and properties go here
		});

		return Collection;
	}
};
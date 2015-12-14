/** @class Models.ItemProcesso
 * Modelo que representa as o item do processo de pagamento.
 * @private
 * @alteracao 04/03/2015 180419 Projeto Carlos Eduardo Santos Alves Domingos
 * Criação.
 * @cfg {String} Codigo Código do item.
 * @cfg {String} Descricao Descrição do item.
 * @cfg {String} CodCap Código do cap do item.
 * @cfg {String} DescricaoCap Descrição do cap item.
 * @cfg {Number} Quantidade Quantidade deste item no processo.
 * @cfg {Number} ValorTotal valor total unitário*quantidade.
 * @cfg {Number} ValorUnitario Valor unitário do item.
 */
exports.definition = {
	config: {
		columns: { 
			"Codigo" : "String",
	        "Descricao" : "String",
	        "Quantidade" : "Double",
	        "ValorTotal" : "Double",
	        "ValorUnitario" : "Double",
	        "CodCap" : "String",
	        "DescricaoCap": "String"
		},
		adapter: {
			type: "properties",
			collection_name: "ItemProcesso", 
			idAttribute: "Codigo"
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
			comparator: function(model){
				return model.get("Descricao");
			}
		});

		return Collection;
	}
};
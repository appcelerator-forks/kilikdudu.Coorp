/** @class Models.AprovacaoEmissao
 * Modelo que representa a informação de quem aprovou o processo.
 * @private
 * @alteracao 04/03/2015 180419 Projeto Carlos Eduardo Santos Alves Domingos
 * Criação.
 * @cfg {String} Quem Login da pessoa que aprovou o processo.
 * @cfg {String} DataAprovacao Data em que foi aprovado por essa pessoa.
 */
exports.definition = {
	config: {
		columns: { 
			"Quem" : "String",
	        "DataAprovacao" : "String"
		},
		adapter: {
			type: "properties",
			collection_name: "AprovacaoEmissao"
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
				return model.get("Quem");
			}
		});

		return Collection;
	}
};
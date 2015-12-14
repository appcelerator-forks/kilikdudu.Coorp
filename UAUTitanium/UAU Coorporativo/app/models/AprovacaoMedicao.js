/** @class Models.AprovacaoMedicao
 * Modelo que representa a informação de quem aprovou o processo.
 * @private
 * @alteracao 12/05/2015 185753 Projeto Carlos Eduardo Santos Alves Domingos
 * Criação.
 * @cfg {String} Usuario Login da pessoa que aprovou o contrato.
 * @cfg {String} Date Data em que foi aprovado por essa pessoa.
 */
exports.definition = {
	config: {
		columns: { 
			"Usuario" : "String",
	        "Date" : "Date"
		},
		adapter: {
			type: "properties",
			collection_name: "AprovacaoMedicao"
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
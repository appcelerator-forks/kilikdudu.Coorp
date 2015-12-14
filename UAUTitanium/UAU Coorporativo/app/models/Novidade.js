/** @class Models.Novidade
 * Modelo que representa as informações do usuário.
 * @private
 * @alteracao 04/03/2015 180419 Projeto Carlos Eduardo Santos Alves Domingos
 * Criação.
 * @cfg {String} NumeroTarefa Número da tarefa.
 * @cfg {String} Descricao Descrição da novidade.
 * @cfg {String} linkVirtual Link para o virtuau.
 */
exports.definition = {
	config: {
		columns: { 
		    "NumeroTarefa": "string",
		    "Descricao": "string",
		    "linkVirtual": "string"
		},
		adapter: {
			type: "properties",
			collection_name: "Novidade", 
			idAttribute: 'NumeroTarefa'
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
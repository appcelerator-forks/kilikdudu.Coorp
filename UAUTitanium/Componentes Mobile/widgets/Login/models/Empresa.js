/**
 * @class widgets.Login.models.Empresa
 * Modelo que representa empresa. Só pode ser acessado pelo widget Login.
 * @private
 * @alteracao 21/01/2015 176562 Projeto Carlos Eduardo Santos Alves Domingos
 * Criação.
 * @cfg {Number} num Indentificador da empresa.
 * @cfg {String} urlWs Url do domínio da empresa.
 * @cfg {String} email Email da empresa.
 * @cfg {String} dataAlter Data da ultima alteração na empresa. Formato yyyy-mm-dd hh-mm-ss.
 * @cfg {String} descricao Nome da empresa.
 * @cfg {String} token Token de acesso. Utilizado pelo SuporteNet para identificar a empresa.
 * @cfg {String} urlMobileWebAPI Url do domínio do webservice MobileWebAPI.
 */
exports.definition = {
	config: {
		columns: {
		    "num": "integer PRIMARY KEY",
		    "urlWs": "varchar",
		    "email": "varchar",
		    "dataAlter": "datetime",
		    "descricao": "varchar",
		    "token": "varchar",
		    "urlMobileWebAPI": "varchar"
		},
		adapter: {
			type: "sql",
			collection_name: "Empresa",
			idAttribute: 'token'
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
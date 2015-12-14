/** @class widgets.Login.models.Usuario
 * Modelo que representa as informações do usuário.
 * @private
 * @alteracao 21/01/2015 176562 Projeto Carlos Eduardo Santos Alves Domingos
 * Criação.
 * @cfg {Number} Codigo Código do usuario.
 * @cfg {String} Nome Nome do usuário.
 * @cfg {String} Cpf CPF do usuario
 * @cfg {Date} DataNasc Data de nascimento.
 * @cfg {String} Email Email do usuário.
 * @cfg {String} Endereco Endereço do usuario.
 * @cfg {String} Numero Número do endereço do usuario.
 * @cfg {String} Referencia Ponto de referência para o endereço do usuario.
 * @cfg {String} Bairro Bairro.
 * @cfg {String} Cep Cep.
 * @cfg {String} Cidade Cidade.
 * @cfg {String} UF UF.
 * @cfg {String} Login Login utilizado no UAU web.
 */
exports.definition = {
	config: {
		columns: {
		    "Codigo": "integer PRIMARY KEY",
		    "Nome": "varchar",
		    "Cpf": "varchar",
		    "DataNasc": "datetime",
		    "Email": "varchar",
		    "Endereco": "varchar",
		    "Numero": "varchar",
		    "Referencia": "varchar",
		    "Bairro": "varchar",
		    "Cep": "varchar",
		    "Cidade": "varchar",
		    "UF": "varchar",
		    "Login": "varchar",
		    "UsuarioUAU": "varchar"
		},
		adapter: {
			type: "sql",
			collection_name: "Usuario"
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
/**
 * @class models.Boleto
 * Dados do boleto.
 * @alteracao 21/01/2015 176562 Projeto Carlos Eduardo Santos Alves Domingos
 * Criação.
 * @cfg {String} Beneficiario Empresa que emitiu o boleto.
 * @cfg {Date} DataDocumento Data de emissão do boleto.
 * @cfg {Date} DataVencimento Data de vencimento do boleto.
 * @cfg {String} Instrucoes Introções do boleto.
 * @cfg {String} LinhaDigitavel Linha digitável do boleto.
 * @cfg {String} LocalPagamento Local de pagamento do boleto.
 * @cfg {String} NossoNumero Identificador da globaltec para o boleto.
 * @cfg {String} Empreendimento Obra do boleto.
 * @cfg {String} SeuNumero Identificador do boleto para o cliente.
 * @cfg {Number} ValorDocumento Valor do boleto.
 * @cfg {String} Banco Banco do boleto.
 * @cfg {String} AgenciaCod Agencia / código do beneficiário.  
 */
exports.definition = {
	config: {
		columns: { 
		    "Beneficiario": "string",
		    "DataDocumento": "datetime",
		    "DataVencimento": "datetime",
		    "Instrucoes": "string",
		    "LinhaDigitavel": "string",
		    "LocalPagamento": "string",
		    "NossoNumero": "string",
		    "Empreendimento": "string",
		    "SeuNumero": "string",
		    "ValorDocumento": "real",
		    "Banco": "string",
		    "AgenciaCod": "string"
		},
		adapter: {
			type: "properties",
			collection_name: "Boleto", 
			idAttribute: 'SeuNumero'
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
				return Alloy.Globals.format.FormatoAnoMesDia(model.get("DataVencimento"));
			}
		});

		return Collection;
	}
};
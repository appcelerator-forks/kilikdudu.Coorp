/** @class Models.ProcessoDePagamento
 * Modelo que representa as informações do processo de pagamento.
 * @private
 * @alteracao 04/03/2015 180419 Projeto Carlos Eduardo Santos Alves Domingos
 * Criação.
 * @alteracao 10/04/2015 185753 Projeto Carlos Eduardo Santos Alves Domingos
 * Adicionada a coluna ValPagar.
 * @cfg {Number} NumeroProcesso Número da tarefa.
 * @cfg {String} EmpresaObra Descrição da novidade.
 * @cfg {String} Fornecedor Link para o virtuau.
 * @cfg {Date} DataProrrogacao Número da tarefa.
 * @cfg {Number} Parcela Descrição da novidade.
 * @cfg {Boolean} Aprovado Link para o virtuau.
 * @cfg {Number} ValorProcesso Número da tarefa.
 * @cfg {String} TipoEmissao Descrição da novidade.
 * @cfg {Number} TipoProcesso Link para o virtuau.
 * @cfg {Date} DataVencimento Número da tarefa.
 * @cfg {Date} DataGeracao Descrição da novidade.
 * @cfg {String} BancoConta Link para o virtuau.
 * @cfg {String} Empresa Número da tarefa.
 * @cfg {Number} EmpresaCod Descrição da novidade.
 * @cfg {String} ObraCod Link para o virtuau.
 * @cfg {String} Obra Número da tarefa.
 * @cfg {String} Observacao Descrição da novidade.
 * @cfg {String} DocumentoFiscal Descrição do documento fiscal vinculado.
 * @cfg {Number} ValorDocumentoFiscal Valor do documento fiscal vinculado.
 * @cfg {Number} Acrescimo Acréscimo do processo.
 * @cfg {Number} Desconto Desconto do processo.
 * @cfg {Number} NumeroCotacao Número da cotação.
 * @cfg {Number} OrdemCompra Ordem de compra.
 * @cfg {Number} Contrato Contrato.
 * @cfg {Number} Medicao Medição.
 * @cfg {Number} ValPagar Valor liquido do processo: liquido = valor - desconto + acrescimo.
 */
exports.definition = {
	config: {
		columns: { 
			"NumeroProcesso": "integer",
		    "EmpresaObra": "string",
		    "Fornecedor": "string",
		    "DataProrrogacao": "datetime",
		    "Parcela": "integer",
		    "Aprovado": "boolean",
		    "ValorProcesso": "double",
		    "ValPagar": "double",
		    "TipoEmissao": "string",
		    "TipoProcesso": "integer",
		    "DataVencimento": "datetime",
		    "DataGeracao": "datetime",
		    "BancoConta": "string",
		    "Empresa": "string",
		    "EmpresaCod": "integer",
		    "ObraCod": "string",
		    "Obra": "string",
		    "Observacao": "string",
		    "DocumentoFiscal" : "String",
	        "ValorDocumentoFiscal" : "Double",
	        "Acrescimo" : "Double",
	        "Desconto" : "Double",
	        "NumeroCotacao" : "Integer",
	        "OrdemCompra" : "Integer",
	        "Contrato" : "Integer",
	        "Medicao" : "Integer"
		},
		adapter: {
			type: "properties",
			collection_name: "ProcessoDePagamento"
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
				return Alloy.Globals.format.FormatoAnoMesDia(model.get("DataProrrogacao"));
			}
		});

		return Collection;
	}
};
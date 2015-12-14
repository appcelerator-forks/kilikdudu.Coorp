/** @class Models.Medicao
 * Modelo que representa as informações do processo de pagamento.
 * @private
 * @alteracao 12/05/2015 185753 Projeto Carlos Eduardo Santos Alves Domingos
 * Criação.
 * @cfg {Number} Row Número da linha na tabela.
 * @cfg {String} CodMedicao Código da medição.
 * @cfg {String} Contrato Código do contrato.
 * @cfg {String} Contratado Nome da pessoa que foi contratada neste contrato.
 * @cfg {String} EmpObra Código da empresa e Código da obra.
 * @cfg {Boolean} CodEmp Código da empresa.
 * @cfg {String} CodObra Código da obra.
 * @cfg {String} DescEmpresa Descrição da empresa.
 * @cfg {String} DescObra Descrição da obra.
 * @cfg {Date} DataMedicao Data do contrato.
 * @cfg {String} ObsMedicao Observação do contrato.
 * @cfg {Number} ValorLiquido Valor líquido do contrato.
 * @cfg {Number} ValorMedicao Valor bruto do contrato.
 * @cfg {Number} ValorDesconto Valor do desconto.
 * @cfg {Number} ValorAdiantamento Valor do adiantamento.
 * @cfg {Number} ValorAcrescimo Valor do acréscimo.
 */
exports.definition = {
	config: {
		columns: { 
			 "Row" : "Number",
	         "CodMedicao" : "String",
	         "Contrato" : "String",
	         "Contratado" : "String",
	         "EmpObra" : "String",
	         "CodEmp" : "Number",
	         "CodObra" : "String",
	         "DescEmpresa" : "String",
	         "DescObra" : "String",
	         "DataMedicao" : "Date", 
	         "ObsMedicao" : "String",
	         "ValorLiquido" : "Number",
	         "ValorMedicao" : "Number",
	         "ValorDesconto" : "Number",
	         "ValorAdiantamento" : "Number",
	         "ValorAcrescimo" : "Number"
		},
		adapter: {
			type: "properties",
			collection_name: "Medicao"
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
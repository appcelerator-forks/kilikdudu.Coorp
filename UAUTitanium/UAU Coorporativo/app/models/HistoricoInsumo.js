exports.definition = {
	config: {
		columns: {
			"Quantidade":"Number",
			"Preco":"Number",
			"Total":"Number",
			"DataCotacao":"Date",
			"DataGeracao":"Date",
			"CodEmpresa":"Number",
			"CodFornecedor":"Number",
			"Empresa":"String",
			"Fornecedor":"String",
			"Obra":"String",
			"Cotacao":"Number"
		},
		adapter: {
			type: "properties",
			collection_name: "HistoricoInsumo"
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
				return model.get("DataGeracao");
			}
		});

		return Collection;
	}
};

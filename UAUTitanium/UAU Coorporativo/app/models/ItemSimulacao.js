exports.definition = {
	config: {
		columns: {
			"Codigo":"String",
			"Descricao":"String",
			"Unidade":"String",
			"Quantidade":"Number",
			"Total":"Number",
			"Preco":"Number",
			"CasaDecPreco":"Number",
			"CasaDecQuantidade":"Number",
			"PrecoMeta":"Number",
			"TotalMeta":"Number",
			"Fornecedor":"Number",
			"Cotacao":"Number",
			"Obra":"String"
		},
		adapter: {
			type: "properties",
			collection_name: "ItemSimulacao"
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

			// For Backbone v1.1.2, uncomment the following to override the
			// fetch method to account for a breaking change in Backbone.
			/*
			fetch: function(options) {
				options = options ? _.clone(options) : {};
				options.reset = true;
				return Backbone.Collection.prototype.fetch.call(this, options);
			}
			*/
		});

		return Collection;
	}
};

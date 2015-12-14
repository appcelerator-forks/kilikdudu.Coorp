exports.definition = {
	config: {
		columns: {
		    "codusuario": "text",
		    "token": "text"
		},
		adapter: {
			type: "sql",
			collection_name: "UltimoLogin"
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
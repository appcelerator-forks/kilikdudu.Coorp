exports.definition = {
	config: {
		columns: { 
		    "Token": "varchar",
		    "Descricao": "varchar",
		    "NumEmp_PWeb": "integer",
		    "URLWS_PWeb": "varchar",
		    "EmailContato_PWeb": "varchar",
		    "EmpresaUAU_PWeb": "integer",
		    "ObraUAU_PWeb": "varchar",
		    "UsrCad_PWeb": "varchar",
		    "DataCad_Pweb": "datetime",
		    "DataAlt_Pweb": "datetime",
		    "UsrAlt_PWeb": "varchar",
		    "AtInat_PWeb": "integer",
		    "DescrPortalUAU_PWeb": "varchar",
		    "HTML_PWeb": "varchar",
		    "URLPaginaCentro_PWeb": "varchar",
		    "NumHospUauWeb_PWeb": "integer"
		},
		adapter: {
			type: "sql",
			collection_name: "EmpresaSupNet",
			idAttribute: 'NumEmp_PWeb'
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
				return model.get("Descricao");
			}
			
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

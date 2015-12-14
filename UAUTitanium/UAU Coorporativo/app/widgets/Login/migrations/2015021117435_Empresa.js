migration.up = function(migrator) {
	try{
		migrator.createTable({
			columns: {
				"num": "integer PRIMARY KEY",
		    	"urlWs": "varchar",
		    	"email": "varchar",
		    	"dataAlter": "datetime",
		    	"descricao": "varchar",
		    	"token": "varchar",
		    	"urlMobileWebAPI": "varchar"
			}
		});
	}
	catch(e){
		Ti.API.info("tabela não criada");
		
	}
};

migration.down = function(migrator) {
	Ti.API.info("Fim do migrator");
};

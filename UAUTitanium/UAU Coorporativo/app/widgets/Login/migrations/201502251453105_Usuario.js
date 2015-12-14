migration.up = function(migrator) {
	try{
		migrator.createTable({
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
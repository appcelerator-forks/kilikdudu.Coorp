migration.up = function(migrator) {
	try{
		migrator.db.execute('ALTER TABLE ' + migrator.table + ' ADD COLUMN UsuarioUAU VARCHAR(150);');	
	}
	catch(e){
		Ti.API.info("já existe");
	}
};

migration.down = function(migrator) {

};
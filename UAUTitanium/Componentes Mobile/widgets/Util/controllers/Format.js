/**
 * @class widgets.Util.Format
 * Executa o parser para o formato determinado.
 * @alteracao 21/01/2015 176562 Projeto Carlos Eduardo Santos Alves Domingos
 * Criação. 
 */
var args = arguments[0] || {};

/**
 * @method paraReal
 * Transforma um valor no formato padrão, para o formato monetário do Real.
 * @param {Number} valor Valor a ser formatado.
 * @param {String} separadorDecimal Caracter utilizado para separar as casas decimais do número. 
 * @alteracao 21/01/2015 176562 Projeto Carlos Eduardo Santos Alves Domingos
 * Criação. 
 */
$.paraReal = function(valor, separadorDecimal)
{
	try{
		var valor = valor.toFixed(2) + '';
	    var x = valor.split(separadorDecimal);
	    var x1 = x[0];
	    var x2 = x.length > 1 ? ',' + x[1] : '';
	    var rgx = /(\d+)(\d{3})/;
	    while (rgx.test(x1)) {
	        x1 = x1.replace(rgx, '$1' + '.' + '$2');
	    }
	    return "R$ " + x1 + x2;
	}
	catch(e){
		Alloy.Globals.onError(e.message, "paraReal", "app/widgets/Util/controllers/Format.js");
	}
};

/**
 * @method FormatoDiaMesAno
 * Transforma uma data para o formato dd/MM/YYYY 
 * @param {String} data A data em qualquer formato aceito pela classe Date do javascript.
 * @alteracao 21/01/2015 176562 Projeto Carlos Eduardo Santos Alves Domingos
 * Criação.
 */
$.FormatoDiaMesAno = function(data){
	var dataPrint = data.split(" ")[0];
	dataPrint = dataPrint.split("-");
	var ano = dataPrint[0];
	var mes = (dataPrint[1].length!=2?"0"+dataPrint[1]:dataPrint[1]);
	var dia = (dataPrint[2].length!=2?"0"+dataPrint[2]:dataPrint[2]);
	return dia + "/" + mes + "/" + ano;
};

/**
 * @method FormatoAnoMesDia
 * Transforma uma data para o formato YYYY/MM/dd 
 * @param {String} data A data em qualquer formato aceito pela classe Date do javascript.
 * @alteracao 21/01/2015 176562 Projeto Carlos Eduardo Santos Alves Domingos
 * Criação.
 */
$.FormatoAnoMesDia = function(data){
	var dataPrint = data.split(" ")[0];
	dataPrint = dataPrint.split("-");
	var ano = dataPrint[0];
	var mes = (dataPrint[1].length!=2?"0"+dataPrint[1]:dataPrint[1]);
	var dia = (dataPrint[2].length!=2?"0"+dataPrint[2]:dataPrint[2]);
	return ano + "/" + mes + "/" + dia;
};

/**
 * @method NetDateTimeParaFormatSQLite
 * Transforma a data no formato numérico retornado pelo VB .NET para um formato aceito pelo SQLite (YYYY-MM-dd hh:mm:ss).
 * @param {String} data A data no formato numérico retornado pelo VB .NET.
 * @alteracao 21/01/2015 176562 Projeto Carlos Eduardo Santos Alves Domingos
 * Criação.
 */
$.NetDateTimeParaFormatSQLite = function(data){
	return $.DateParaFormatSQLite(new Date(parseInt(data.substr(6))));
};

/**
 * @method DateParaFormatSQLite
 * Transforma um objeto Date para o formato YYYY-MM-dd hh:mm:ss.
 * @param {Date} data A data no formato Date do javascript.
 * @alteracao 21/01/2015 176562 Projeto Carlos Eduardo Santos Alves Domingos
 * Criação.
 */
$.DateParaFormatSQLite = function(data){
	try{
		var ano = data.getFullYear();
		var mes = (((data.getMonth()+1).toString()).length!=2?"0"+(parseInt(data.getMonth()+1)):data.getMonth()+1);
		var dia = (data.getDate().toString().length!=2?"0"+data.getDate():data.getDate());
		var hora = (data.getHours().toString().length!=2?"0"+data.getHours():data.getHours());
		var minuto = (data.getMinutes().toString().length!=2?"0"+data.getMinutes():data.getMinutes());
		var segundo = (data.getSeconds().toString().length!=2?"0"+data.getSeconds():data.getSeconds());
		return ano + "-" + mes + "-" + dia + " " + hora + ":" + minuto + ":" + segundo;
	}
	catch(e){
		Alloy.Globals.onError(e.message, "deDateParaFormatSQL", "app/widgets/Util/controllers/Format.js");
	}
};

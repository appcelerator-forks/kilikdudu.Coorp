/**
 * @class widgets.Util.Format
 * Executa o parser para o formato determinado.
 * @alteracao 21/01/2015 176562 Projeto Carlos Eduardo Santos Alves Domingos
 * Criação. 
 * @alteracao 10/07/2015 191658 Projeto Carlos Eduardo Santos Alves Domingos
 * Adição do moment.js.
 * Adição da formatação do CPF e do CNPJ.
 */
var args = arguments[0] || {};

//Biblioteca de manipulação de Data e Hora.
var moment = require('alloy/moment');

/**
 * @method cpf
 * Formata a string do cpf.
 * @param {String} cpf Cpf a ser formatado.
 * @alteracao 10/07/2015 191658 Projeto Carlos Eduardo Santos Alves Domingos
 * Criação. 
 */
$.cpf = function(cpf){
	try{
		cpf=cpf.replace(/\D/g,"");
	    var flag = /\d{11}/;
	    if(!flag.test(cpf)){
	    	return "Formato inválido";
	    }
	    cpf=cpf.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/,"$1.$2.$3-$4");
	    return cpf;	
	}
	catch(e){
		Alloy.Globals.onError(e.message, "paraReal", "app/widgets/Util/controllers/Format.js");
	}
};

/**
 * @method cnpj
 * Formata a string do cnpj.
 * @param {String} cnpj Cnpj a ser formatado.
 * @alteracao 10/07/2015 191658 Projeto Carlos Eduardo Santos Alves Domingos
 * Criação. 
 */
$.cnpj = function(cnpj){
	try{
		cnpj=cnpj.replace(/\D/g,"");
	    var flag = /\d{14}/;
	    if(!flag.test(cnpj)){
	    	return "Formato inválido";
	    }
	    cnpj=cnpj.replace(/(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})/,"$1.$2.$3/$4-$5");
	    return cnpj;
	}
	catch(e){
		Alloy.Globals.onError(e.message, "paraReal", "app/widgets/Util/controllers/Format.js");
	}
};

/**
 * @method soDigitos
 * Retira todos os caracteres e deixa apenas dígitos
 * @param {String} texto Texto original. 
 * @alteracao 10/07/2015 191658 Projeto Carlos Eduardo Santos Alves Domingos
 * Criação.
 */
$.soDigitos = function(texto){
	texto=texto.replace(/\D/g,"");
	return texto;
};

/**
 * @method toDiaMesAno
 * Formata uma string de data no formato DD/MM/YYYY
 * @param {String} valor String de data original.
 * @alteracao 10/07/2015 191658 Projeto Carlos Eduardo Santos Alves Domingos
 * Criação. 
 */
$.toDiaMesAno = function(valor){
	try{
		var d1 = moment(valor);
		return d1.format("DD/MM/YYYY");
	}
	catch(e){
		Alloy.Globals.onError(e.message, "paraReal", "app/widgets/Util/controllers/Format.js");
	}
};

/**
 * @method customFormatData
 * Formata a data no formato informado.
 * @param {String} strData Data a ser formatada.
 * @param {String} sourceFormat Formato de origem.
 * @param {String} targetFormat Formato desejado.
 * @alteracao 10/07/2015 191658 Projeto Carlos Eduardo Santos Alves Domingos
 * Criação. 
 */
$.customFormatData = function(strData, sourceFormat, targetFormat){
	var d1 = moment(strData, sourceFormat);
	return d1.format(targetFormat);
};

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
		if(!isNaN(valor)){
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
		else{
			return "R$ 0";
		}
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


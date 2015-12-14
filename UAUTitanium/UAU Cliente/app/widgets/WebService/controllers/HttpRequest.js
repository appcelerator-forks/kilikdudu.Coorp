/**
 * @class widgets.WebService.HttpRequest
 * @private
 * Faz solicitações http.
 * @alteracao 21/01/2015 176562 Projeto Carlos Eduardo Santos Alves Domingos
 * Criação. 
 */
var args = arguments[0] || {};

/**
 * @property
 * @private
 * Url do serviço.
 * @type {String}
 */
var url = args.url;
/**
 * @property
 * @private
 * Time out da requisição.
 * @type {Number}
 */
var timeout = args.timeout;
/**
 * @property
 * @private
 * GET ou POST.
 * @type {widgets.GUI.Camada}
 */
var metodo = args.metodo;
/**
 * @property
 * @private
 * Função executada caso a requisição seja bem-sucedida.
 * @type {Function}
 */
var sucessCallback = args.callback || function(e){alert('Sucesso');};
/**
 * @property
 * @private
 * Função executada caso ocorra erro na requisição.
 * @type {Function}
 */
var errorCallback = args.error || function(e){alert('error');};
/**
 * @property
 * @private
 * Caso seja passada como parâmetro, a mesma é populada com os dados obtidos pela requisição. Caso não seja passada uma nova coleção é criada.
 * @type {BackBone.Collection}
 */
var colecao = args.colecao || null;
/**
 * @property
 * @private
 * Caso a classe crie uma nova coleção, essa configuração será usada na nova BackBone.Collection.
 * @type {BackBone.Options}
 */
var collectionConfig = args.colletionConfig || {};
/**
 * @property
 * @private
 * Armazena os dados que serão enviados pela requisição.
 * @type {Object}
 */
var dados = null;

var headerType = args.headerType || "application/x-www-form-urlencoded";

/**
 * @method 
 * Adiciona os dados que serão enviados pela requisição.
 * @param {JSONObject} parametro
 * @returns {null}
 * @alteracao 21/01/2015 176562 Projeto Carlos Eduardo Santos Alves Domingos
 * Criação.
 */
$.adicionaParametro = function(parametro){
	dados = parametro;	
};

/**
 * @method NovoEnvia
 * Executa a requisição.
 * Ao final da requisição, as funções de sucessCallback ou errorCallback serão ativadas.
 * Caso a função de sucessCallback seja executada, a coleção gerada ou populada será passada como parâmetro.
 * Caso a função de errorCallback seja executada, o erro é retornado como parâmetro.
 * @param {JSONObject} parans Configurações da requisição.
 * @param {Boolean} parans.outArch Indica se o webService está fora da arquitetura mobile WebAPI
 * @returns {null} 
 * @alteracao 21/01/2015 176562 Projeto Carlos Eduardo Santos Alves Domingos
 * Criação.
 */
$.NovoEnvia = function(parans){
	try{
		var client = Ti.Network.createHTTPClient({
		    onload : function(e){
		    	if(this.responseText == null){
		    		sucessCallback();
		    		return ;
		    	}
		    	var jsonText = this.responseText;
		    	//Testo se a resposta é um XML. Caso seja eu recupero o primeiro nó, que deve ser a string do JSON.
		    	if(jsonText[0] === '<'){
		    		var xml;
		    		try{
		    			xml = Titanium.XML.parseString(this.responseText);
		    			jsonText = xml.getFirstChild().textContent;
		    		}
		    		catch(e){
		    			Alloy.Globals.Alerta("Erro", "Ocorreu um erro ao tentar ler a resposta do servidor. Verifique sua permissão no firewall.");
		    			errorCallback(e);
		    			return ;
		    		}
		    	}
				var json = JSON.parse(jsonText);
				if(colecao){
					Alloy.Globals.DAL.refreshColecao(colecao, json);	
				}
				else{
					colecao = Alloy.Globals.DAL.criarColecao(json, collectionConfig);
				}
		    	sucessCallback(colecao);
		    },
		    onerror : function(e){
		    	errorCallback(e);
		    },
		    timeout : args.timeout
		});
		//Parâmetros adicionais.
		if(parans){
			//Testo se o webservice está fora da arquitetura mobile.
			if(parans.outArch){
				Envia(client);
				return ;
			}
		}
		//Configurações obrigatórias para a arquitetura mobile WebAPI.
		if(Alloy.Globals.MainDomain == Alloy.Globals.LocaWebDomain){
			dados._wsDomain = Alloy.Globals.Empresa.urlWs;
		}
		else{
			dados._wsDomain = "";
		}
		dados._mobEmProducao = Alloy.Globals.EmProducao?'true':'false';
		verificaVersao(client);	
	}
	catch(e){
		Alloy.Globals.onError(e.message, "NovoEnvia", "app/widgets/WebService/controllers/HttpRequest.js");
	}
};

/**
 * @method verificaVersao
 * Verifica se o aplicativo está em uma versão compátivel com o webservice. Caso não esteja o usuário é rederecionado para a página de download do app.
 * @private
 * @param {Ti.Network.HTTPClient} cliente Solicitação que deverá ser executada caso a versão seja válida.
 * @alteracao 05/03/2015 180419 Projeto Carlos Eduardo Santos Alves Domingos
 * Criação.
 */
function verificaVersao(cliente){
	var _wsDomain = "";
	var solicitacao = Ti.Network.createHTTPClient({
		onload : function(e){
			var json = JSON.parse(this.responseText);
			if(json.status === "OK"){
				Envia(cliente);	
			}
			else if(json.status === "Fail"){
				var check = Alloy.createWidget("GUI", "Mensagem");
				check.init("Atenção !", "A versão do aplicativo não é mais suportada.\nAtualize o aplicativo e tente novamente.");
				check.show({callback: atualizar});
			}
			else if(json.status === "WsDesatualizado"){
				var check = Alloy.createWidget("GUI", "Mensagem");
				check.init("Atenção !", "A versão do UAU Web dessa empresa não é mais suportado.\nPeça para a empresa atualizar e tente novamente.");
				check.show({callback: reiniciarApp});
			}
	    },
	    onerror : function(e){
	    	Alloy.Globals.Alerta("Erro", "Erro ao verificar a versão do aplicativo. Tente novamente mais tarde." + "\nCódigo: " + e.code + "\nDescrição: "+ e.error);
	    },
	    timeout : args.timeout
	});
	solicitacao.open("POST", Alloy.Globals.MainDomain + "api/Configuracao/verificaVersao");
	if(Alloy.Globals.MainDomain == Alloy.Globals.LocaWebDomain){
		_wsDomain = Alloy.Globals.Empresa.urlWs;
	}
	solicitacao.send({versao: Ti.App.version, _wsDomain: _wsDomain});
}

/**
 * @method Envia
 * Executa uma silicitação com os parâmetros da classe.
 * @private
 * @param {Ti.Network.HTTPClient} cliente Solicitação que deverá ser executada caso a versão seja válida.
 * @alteracao 05/03/2015 180419 Projeto Carlos Eduardo Santos Alves Domingos
 * Criação.
 */
function Envia(cliente){
	cliente.open(metodo, url);
	cliente.setRequestHeader("Content-Type", headerType);
	if(headerType == "application/json"){
		cliente.send(JSON.stringify(dados));	
	}
	else{
		cliente.send(dados);
	}	
}

/**
 * @method atualizar
 * Redireciona para a página de download da aplicação.
 * @private
 * @alteracao 05/03/2015 180419 Projeto Carlos Eduardo Santos Alves Domingos
 * Criação.
 */
function atualizar(){
	Ti.Platform.openURL("https://play.google.com/store/apps/details?id=" + Ti.App.getId());
	errorCallback({error: "Desatualizado"});
}
function reiniciarApp(){
	Alloy.createController("index");
}
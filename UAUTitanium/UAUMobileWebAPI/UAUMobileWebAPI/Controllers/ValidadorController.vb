Imports System.Net
Imports System.Web.Http
Imports UAUMobileWebAPI.Models.Validador
Imports UAUMobileWebAPI.AutentificadorReference
Imports UAUMobileWebAPI.wsEmpresaDevReference
Imports UAUMobileWebAPI.wsEmpresaProdReference
Imports UAUMobileWebAPI.Util
Imports UAUMobileWebAPI.Parametros.Validador
Imports UAUMobileWebAPI.wsPessoasReference

Namespace Controllers
    Public Class ValidadorController
        Inherits ApiController

        Private db As New UauWebBDEntities

        ''' <summary>
        ''' Recupera o token a partir do código da empresa. Deve ser usado apenas pelo módulo mobile em produção.
        ''' </summary>
        ''' <param name="parans">Parâmetros do método.</param>
        ''' <remarks>
        ''' Criação    : Carlos Eduardo Santos Alves Domingos        Data: 18/05/2015
        ''' Projeto    : 187463
        ''' </remarks>
        <HttpPost>
        Public Function BuscaTokenEmpresaProducao(parans As Params_BuscaTokenEmpresa) As StatusAutentificacao
            Try
                Dim referencia As wsRegistroUau = New wsRegistroUau
                'Busco o endereço do webservice.
                Dim token = referencia.GeraTokenEmpresaPorCodigo(parans.codEmpresa)
                Dim confEmpresa = referencia.ConsultarDadosConfPortalUauPorCodigo(parans.codEmpresa)
                Dim resposta = New StatusAutentificacao
                If confEmpresa IsNot Nothing Then

                    Dim webAPIConf As New ConfiguracaoController()
                    'Válido se o webservice está em uma versão compatível.
                    If Not webAPIConf.versaoUAUWebCompativel(confEmpresa.URLWS_PWeb) Then
                        resposta.Sucesso = False
                        resposta.Mensagem = "Esta empresa está com o webservice desatualizado."
                        Return resposta
                    End If

                    Dim paransUsuario As New Params_ValidaUsuario()
                    paransUsuario.senha = parans.senha
                    paransUsuario.usuario = parans.usuario
                    paransUsuario._wsDomain = confEmpresa.URLWS_PWeb
                    Dim resValidacao = ValidaUsuario(paransUsuario)
                    If resValidacao.Sucesso Then
                        resposta.Sucesso = True
                        resposta.Token = token
                    Else
                        resposta.Sucesso = False
                        resposta.Mensagem = "Usuário ou senha inválido para a empresa: " & parans.codEmpresa & "."
                    End If
                Else
                    resposta.Sucesso = False
                    resposta.Mensagem = "Sem configuração de webservice para a empresa: " & parans.codEmpresa & "."
                End If
                Return resposta
            Catch ex As Exception
                Throw
            End Try
        End Function

        ''' <summary>
        ''' Recupera o token a partir do código da empresa. Deve ser usado apenas pelo módulo mobile em processo de desenvolvimento.
        ''' </summary>
        ''' <param name="parans">Parâmetros do método.</param>
        ''' <remarks>
        ''' Criação    : Carlos Eduardo Santos Alves Domingos        Data: 18/05/2015
        ''' Projeto    : 187463
        ''' </remarks>
        <HttpPost>
        Public Function BuscaTokenEmpresaDesenvolvimento(parans As Params_BuscaTokenEmpresa) As StatusAutentificacao
            Try
                Dim referencia As WsEmpresa = New WsEmpresa
                'Busco o endereço do webservice.
                Dim token = referencia.GeraTokenEmpresaPorCodigo(parans.codEmpresa)
                Dim confEmpresa = referencia.CarregarConfPortalEmpresa(parans.codEmpresa)
                Dim resposta = New StatusAutentificacao
                If confEmpresa IsNot Nothing Then

                    Dim webAPIConf As New ConfiguracaoController()
                    'Válido se o webservice está em uma versão compatível.
                    If Not webAPIConf.versaoUAUWebCompativel(confEmpresa.URLWS_PWeb) Then
                        resposta.Sucesso = False
                        resposta.Mensagem = "Esta empresa está com o webservice desatualizado."
                        Return resposta
                    End If

                    Dim paransUsuario As New Params_ValidaUsuario()
                    paransUsuario.senha = parans.senha
                    paransUsuario.usuario = parans.usuario
                    paransUsuario._wsDomain = confEmpresa.URLWS_PWeb
                    Dim resValidacao = ValidaUsuario(paransUsuario)
                    If resValidacao.Sucesso Then
                        resposta.Sucesso = True
                        resposta.Token = token
                    Else
                        resposta.Sucesso = False
                        resposta.Mensagem = "Usuário ou senha inválido para a empresa: " & parans.codEmpresa & "."
                    End If
                Else
                    resposta.Sucesso = False
                    resposta.Mensagem = "Sem configuração de webservice para a empresa: " & parans.codEmpresa & "."
                End If
                Return resposta
            Catch ex As Exception
                Throw
            End Try
        End Function

        ''' <summary>
        ''' Valida o login e senha do usuário. Deve ser usado apenas pelo módulo mobile.
        ''' </summary>
        ''' <param name="parans">Parâmetros do método.</param>
        ''' <remarks>
        ''' Criação    : Carlos Eduardo Santos Alves Domingos        Data: 28/01/2015
        ''' Projeto    : 176562
        ''' 
        ''' Alteracao: Carlos Eduardo Santos Alves Domingos 
        ''' Data: 15/06/2015
        ''' Projeto: 185753 - Projeto
        ''' Manutenção: Foi alterado para gravar no atributo UsuarioUAU, o valor contido na coluna Login_usr.
        '''             Essa alteração só vale para o UAUcorporativo.
        ''' 
        ''' Alteracao: Carlos Eduardo Santos Alves Domingos 
        ''' Data: 10/07/2015
        ''' Projeto: 191658 - Projeto
        ''' Manutenção: Foi alterado para verificar se o usuário possuí cadastro pendente.
        ''' 
        ''' </remarks>
        <HttpPost>
        Public Function ValidaUsuario(parans As Params_ValidaUsuario) As StatusAutentificacao
            Dim referencia As AutentificadorMob = New AutentificadorMob
            'Busco o endereço do webservice.
            referencia.Url = Configuracao.getUrlService("validadorAdress", parans._wsDomain)
            'Autentico o usuário.
            Dim ds = referencia.AutentificarUsuarioTitanium(parans.usuario, parans.senha)
            Dim resposta = New StatusAutentificacao
            'Verifico se algo foi retornado. Se sim, então o usuário é valido.
            If ds IsNot Nothing Then
                resposta.Pessoa = New Usuario
                Dim res = ds.Tables(0).Rows
                'Testo se existe alguma informação no cadastro da pessoa.
                If res.Count > 0 Then
                    resposta.Pessoa.Codigo = Integer.Parse(res(0)("cod_pes"))
                    resposta.Pessoa.Nome = Configuracao.retiraDBNull(res(0)("nome_pes"))
                    resposta.Pessoa.Cpf = Configuracao.retiraDBNull(res(0)("cpf_pes"))
                    resposta.Pessoa.DataNasc = Configuracao.retiraDBNull(res(0)("dtnasc_pes"))
                    resposta.Pessoa.Email = Configuracao.retiraDBNull(res(0)("Email_pes"))
                    resposta.Pessoa.Endereco = Configuracao.retiraDBNull(res(0)("ender_pes"))
                    resposta.Pessoa.Numero = Configuracao.retiraDBNull(res(0)("NumEnd_Pes"))
                    resposta.Pessoa.Referencia = Configuracao.retiraDBNull(res(0)("ReferEnd_pes"))
                    resposta.Pessoa.Bairro = Configuracao.retiraDBNull(res(0)("setor_pes"))
                    resposta.Pessoa.Cep = Configuracao.retiraDBNull(res(0)("cep_pes"))
                    resposta.Pessoa.Cidade = Configuracao.retiraDBNull(res(0)("cidade_pes"))
                    resposta.Pessoa.UF = Configuracao.retiraDBNull(res(0)("uf_pes"))
                    resposta.Pessoa.Login = Configuracao.retiraDBNull(res(0)("Login_pes"))
                    If parans.usuario.Length <= 8 Then
                        resposta.Pessoa.UsuarioUAU = res(0)("Login_usr")
                    Else
                        resposta.Pessoa.UsuarioUAU = parans.usuario
                        'Valido se o usuário cliente do uau web tem o cadastro confirmado
                        If Not validaUsuarioClienteUAUWeb(resposta.Pessoa.Login, resposta.Pessoa.Codigo, parans.CodEmpresa, parans._wsDomain, resposta.Mensagem) Then
                            resposta.Sucesso = False
                            Return resposta
                        Else
                            resposta.Mensagem = "Login efetuado com sucesso"
                            resposta.Sucesso = True
                            Return resposta
                        End If
                    End If
                ElseIf parans.usuario.Length > 8 Then
                    'Usuário cliente precisa ter cadastro de pessoa.
                    resposta.Mensagem = "Não existe cadastro de pessoa."
                    resposta.Sucesso = False
                    Return resposta
                End If


                'Quando não existe cadstro de pessoa, os dados são subtituidos por aqueles que o usuário forneceu.
                If resposta.Pessoa.UsuarioUAU = Nothing Or resposta.Pessoa.UsuarioUAU = String.Empty Then
                    resposta.Pessoa.UsuarioUAU = parans.usuario
                    resposta.Pessoa.Login = parans.usuario
                End If

                'Caso seja usuário do UAU Corporativo, não é obrigado a ter cadastro de pessoa.
                resposta.Sucesso = True
                resposta.Mensagem = "Login efetuado com sucesso"

            Else
                resposta.Sucesso = False
                resposta.Mensagem = "Login ou senha inválido."
            End If
            Return resposta
        End Function

        ''' <summary>
        ''' Válida se o cadastro do usuário está pendente. Utilizado apenas pelo UAU Cliente.
        ''' </summary>
        ''' <remarks>
        ''' Criação    : Carlos Eduardo Santos Alves Domingos        Data: 10/07/2015
        ''' Projeto    : 191658
        ''' 
        ''' </remarks>
        Private Function validaUsuarioClienteUAUWeb(ByVal login As String, ByVal codPessoa As Integer, ByVal codEmpresa As Integer, ByVal wsDomain As String, ByRef msgRetorno As String) As Boolean
            Dim refPessoas As New Pessoas
            Dim infoUsuarioPendente As UsuarioPendenteUauWebInfo
            refPessoas.Url = Configuracao.getUrlService("wsPessoasAdress", wsDomain)
            'Verifica se o usuário está presente na tabela de cadastros pendentes.
            infoUsuarioPendente = refPessoas.ConsultarUsuarioPendenteUauWebPorChave(codPessoa, login)
            If Not infoUsuarioPendente.Login_upweb Is Nothing Then
                Dim confCadUsuario = db.ConfCadUsuario.Find(codEmpresa)
                If confCadUsuario.ConfirmaCadEmail_ccu <> Nothing AndAlso confCadUsuario.ConfirmaCadEmail_ccu Then
                    If (Date.Now - infoUsuarioPendente.DataSolicCad_upweb).Days > 2 Then
                        msgRetorno = "Cadastro de usuario não confirmado. A data de validade expirou."
                        Return False
                    Else
                        msgRetorno = "Cadastro de usuario não confirmado por e-mail."
                        Return False
                    End If
                End If
            End If
            Return True
        End Function

    End Class
End Namespace
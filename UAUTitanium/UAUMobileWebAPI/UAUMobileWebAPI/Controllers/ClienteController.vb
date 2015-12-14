Imports System.Net
Imports System.Web.Http
Imports UAUMobileWebAPI.Parametros.CadastroUsuario
Imports UAUMobileWebAPI.wsPessoasReference
Imports UAUMobileWebAPI.wsUsuariosReference
Imports UAUMobileWebAPI.wsEmpresaDevReference
Imports UAUMobileWebAPI.wsEmpresaProdReference
Imports UAUMobileWebAPI.UAUWeb_EMAIL
Imports Newtonsoft.Json

Namespace Controllers
    Public Class ClienteController
        Inherits ApiController

        Private db As New UauWebBDEntities

        Private Enum DadosRetorno
            DadosUAU = 0
            DadosPortal = 1
        End Enum

        Private mensagemPadrao = "A empresa {0} não está configurada para utilizar o UAU Cliente. Entre em contato com {1} <BR> Informe à empresa: {2} "

        ''' <summary>
        ''' Valida os campos preenchidos no cadastro de usuário para acesso ao PortalUAU!
        ''' </summary>
        ''' <remarks>
        ''' 
        ''' Criação : Carlos Eduardo Santos Alves Domingos               Data: 09/07/2015
        ''' Projeto: 191658
        ''' 
        ''' </remarks>
        <HttpPost>
        Public Function ValidaCadastroPessoa(parans As Params_CadastroUsuario) As RespostaMob
            Dim resultado As New RespostaMob
            resultado.sucesso = True
            Try

                Dim rs = New Pessoas()
                rs.Url = parans._wsDomain & System.Configuration.ConfigurationManager.AppSettings("wsPessoasAdress").ToString
                Dim confPortalUAU As ConfPortalUAU = db.ConfPortalUAU.Find(parans.CodEmpresa)
                Dim dtPessoas As New DataTable
                Dim webAPIConf As New ConfiguracaoController()

                'Válido se o webservice está em uma versão compatível.
                If Not webAPIConf.versaoUAUWebCompativel(parans._wsDomain) Then
                    resultado.sucesso = False
                    resultado.mensagem = String.Format(mensagemPadrao, confPortalUAU.DescrPortalUAU_PWeb, RetornaInformacoesContatoEmpresaLogada(confPortalUAU), "WebService desatualizado.")
                    Return resultado
                End If

                'Verifica se existe essa pessoa no cadastro.
                dtPessoas = rs.ConsultarPessoasPorCPFCNPJDataNascimento(parans.CpfCnpj, Nothing).Tables("Pessoas")
                If dtPessoas.Rows.Count = 0 Then
                    resultado.AddMensagem("Não encontrado.")
                    resultado.AddMensagem("Este é um acesso apenas para os clientes da Empresa")
                    resultado.AddMensagem(String.Format("{0} e seus empreendimentos.", confPortalUAU.DescrPortalUAU_PWeb))
                    resultado.AddMensagem("Caso seja cliente tente novamente ou contate o atendimento a clientes.")
                    resultado.sucesso = False

                    Return resultado
                    'Verifica se o registro está duplicado
                ElseIf dtPessoas.Rows.Count > 1 Then
                    resultado.AddMensagem(" duplicado. Caso seja cliente tente novamente ou contate o atendimento a clientes para atualização do cadastro. ")
                    resultado.sucesso = False
                    Return resultado
                End If

                'Verifica se os dados estão de acordo com os informados no cadastro.
                'A data de nascimento é opcional (Regra da Apple).
                If parans.DataNasc <> DateTime.MinValue Then
                    dtPessoas = rs.ConsultarPessoasPorCPFCNPJDataNascimento(parans.CpfCnpj, parans.DataNasc).Tables("Pessoas")

                    Dim drPessoas As DataRow() = dtPessoas.Select
                    If drPessoas.Length = 0 Then
                        resultado.AddMensagem("Os dados informados não estão de acordo com seu cadastro em nossa empresa. ")
                        resultado.AddMensagem(String.Format("Para atualizar seus dados favor entre em contato com a {0}.", RetornaInformacoesContatoEmpresaLogada(confPortalUAU)))
                        resultado.sucesso = False

                    End If
                End If
                
                Return resultado


            Catch ex As Exception
                Throw
            End Try
        End Function

        ''' <summary>
        ''' Atualiza o cadastro de pessoa com o novo login e senha. Altera o email se a empresa tiver essa opção configurada.
        ''' </summary>
        ''' <remarks>
        ''' 
        ''' Criação : Carlos Eduardo Santos Alves Domingos               Data: 09/07/2015
        ''' Projeto: 191658
        ''' 
        ''' </remarks>
        <HttpPost>
        Public Function AtualizaCadastroPessoa(parans As Params_CadastroUsuario) As RespostaMob
            Dim resultado As New RespostaMob
            Dim usuarioPendenteInfo As New UsuarioPendenteUauWebInfo
            Try
                resultado.sucesso = True
                Dim rs = New Pessoas()
                rs.Url = parans._wsDomain & System.Configuration.ConfigurationManager.AppSettings("wsPessoasAdress").ToString
                Dim confPortalUAU As ConfPortalUAU = db.ConfPortalUAU.Find(parans.CodEmpresa)
                Dim confCadUsuario As ConfCadUsuario = db.ConfCadUsuario.Find(parans.CodEmpresa)
                Dim codPes As Integer
                Dim minDadosPessoa As New Models.Validador.Usuario()
                Dim webAPIConf As New ConfiguracaoController()

                'Válido se o webservice está em uma versão compatível.
                If Not webAPIConf.versaoUAUWebCompativel(parans._wsDomain) Then
                    resultado.sucesso = False
                    resultado.mensagem = String.Format(mensagemPadrao, confPortalUAU.DescrPortalUAU_PWeb, RetornaInformacoesContatoEmpresaLogada(confPortalUAU), "WebService desatualizado.")
                    Return resultado
                End If

                'Válida se o login pode ser usado.
                resultado = ValidaCadastroLogin(rs, confPortalUAU, parans.Login, parans.CpfCnpj, parans.DataNasc, codPes)
                If resultado.sucesso Then

                    'Retorno o código da pessoa.
                    minDadosPessoa.Codigo = codPes
                    resultado.Dados = minDadosPessoa

                    Dim senhaCripto = UAUWeb_CRYPTO.Encriptar(parans.Senha)

                    'Verifico se é necessário atualizar o email no cadastro de pessoa.
                    If confCadUsuario.AtualizaEmail_ccu <> Nothing AndAlso confCadUsuario.AtualizaEmail_ccu Then
                        rs.AlterarPessoaAcessoPortal(codPes, parans.Login, senhaCripto, parans.Email)
                    Else
                        rs.AlterarPessoaAcessoPortal(codPes, parans.Login, senhaCripto, Nothing)
                    End If

                    'No caso da configuração de cadastro automático, um email informativo é disparado para o cliente, para avisa-lo de que houve uma tentativa de cadastro utilizando o cpf/cnpj dele.
                    If confCadUsuario.AutoManual_ccu <> Nothing AndAlso confCadUsuario.AutoManual_ccu Then
                        EnviaEmailInformativo(confPortalUAU, codPes, rs, parans.Email, parans._mobEmProducao)
                    End If

                    'Verifico se é necessário confirmação por email do cadastro.
                    If confCadUsuario.ConfirmaCadEmail_ccu <> Nothing AndAlso confCadUsuario.ConfirmaCadEmail_ccu Then
                        usuarioPendenteInfo.CodPes_upweb = codPes
                        usuarioPendenteInfo.DataSolicCad_upweb = Date.Now
                        usuarioPendenteInfo.Login_upweb = parans.Login
                        usuarioPendenteInfo.Senha_upweb = senhaCripto

                        'Gravo o usuário na tabela de cadastros pendentes. Enquanto o usuário permanecer nesta tabela, o mesmo não consegue logar.
                        rs.GravarUsuarioPendenteUauWeb(usuarioPendenteInfo)

                        EnviaEmailConfirmacao(confPortalUAU, codPes, rs, parans.Email, parans._mobEmProducao)

                        resultado.sucesso = True
                        resultado.AddMensagem("Acesse o seu e-mail '" & parans.Email & "' para realizar a confirmação do seu cadastro.")
                    End If

                End If

                Return resultado

            Catch ex As Exception
                Throw
            End Try
        End Function

        ''' <summary>
        ''' Envia o email de confirmação de cadastro para o email do cliente.
        ''' </summary>
        ''' <remarks>
        ''' 
        ''' Criação : Carlos Eduardo Santos Alves Domingos               Data: 09/07/2015
        ''' Projeto: 191658
        ''' 
        ''' </remarks>
        Private Sub EnviaEmailConfirmacao(ByVal confPortalUAU As ConfPortalUAU, ByVal codPessoa As Integer, ByVal rs As Pessoas, ByVal paramEmail As String, ByVal emProducao As Boolean)

            Dim stbHTML As New StringBuilder
            Dim strDestinatario As String = ""
            Dim strAssunto As String = ""
            Dim strLnkImagem As String = ""
            Dim chave As String = ""
            Dim senha As String
            Dim nome As String
            Dim login As String

            Try

                Dim res = rs.ConsultarPessoaPorChave(codPessoa).Tables(0).Rows
                If res.Count > 0 Then
                    senha = res(0)("Senha_pes")
                    nome = res(0)("Nome_pes")
                    login = res(0)("Login_pes")
                Else
                    Throw New Exception("Cadastro de pessoa inexistente")
                End If

                'Destinatário
                strDestinatario = paramEmail

                '   Montando o corpo do Email
                stbHTML.Append("<HTML><head> <meta charset=""UTF-8"" /> </head> <BODY bgcolor=""#D6D6D6"" style=""width:100%; height:100%"">")
                stbHTML.Append("<div style=""background-color: white; height: 100%; width: 600px; position: relative; padding-right: 5px; padding-left: 5px; "" >")
                stbHTML.Append("<HR width=""100%"" color=""silver"">")

                strLnkImagem = ConfigurationManager.AppSettings("UrlCaminhoPastaLogotipos") & confPortalUAU.NumEmp_PWeb & "\LOGO.JPG"


                '   Assunto do Email
                strAssunto = "UAU Web - " & confPortalUAU.DescrPortalUAU_PWeb & " - Confirmação de Cadastro de Usuário."

                'Chave contendo Login, Senha, Acao e Codigo do cliente criptografados para ser enviado por email ao cliente como link de acesso a area do cliente
                chave = "&Login=" & UAUWeb_CRYPTO.Encriptar(login) & _
                        "&Senha=" & senha & _
                        "&Acao=CONFIRMACADCLI" & _
                        "&CodCli=" & UAUWeb_CRYPTO.Encriptar(codPessoa)

                'verifica se arquivo existe nesta url
                If Envio.verificaUrl(strLnkImagem) Then
                    stbHTML.Append("<div style=""text-align: center""><img id=""Image1"" src=" & strLnkImagem & " runat=""server"" /></div>")
                End If

                stbHTML.Append("<font face=""verdana"" size=""2""><p align=""justify""><strong>Olá, " & nome & "!</strong></p></font>")
                stbHTML.Append("<font face=""verdana"" size=""2""><p align=""justify"">Seja bem vindo(a)!</p></font>")
                stbHTML.Append("<font face=""verdana"" size=""2""><p align=""justify"">Para a confirmação do seu cadastro, por favor, clique no link abaixo para acessar a área de clientes.</p></font>")

                'O endereço de confirmação depende se o sistema está em produção ou não.
                If emProducao Then
                    stbHTML.Append("<font face=""verdana"" size=""2""><p align=""justify""><a href=""" & "http://www.uau.com.br/PortalUAU_Site/AbrePortal.aspx?Empresa=" & GetTokenEmpresa(confPortalUAU.NumEmp_PWeb, emProducao) & chave & """>Acesso a Área de Clientes</a></p></font>")
                Else
                    stbHTML.Append("<font face=""verdana"" size=""2""><p align=""justify""><a href=""" & "http://localhost:3015/AbrePortal.aspx?Empresa=" & GetTokenEmpresa(confPortalUAU.NumEmp_PWeb, emProducao) & chave & """>Acesso a Área de Clientes</a></p></font>")
                End If

                stbHTML.Append("<font face=""verdana"" size=""2""><p align=""justify"">Atenciosamente,</p></font>")
                stbHTML.Append("<font face=""verdana"" size=""2""><p align=""justify"">Equipe Relacionamento com Cliente.</p></font><br>")
                stbHTML.Append("</div></BODY></HTML>")

                '   Enviando email
                Envio.MandarEmail(strAssunto, strDestinatario, stbHTML.ToString, strDestinatario, confPortalUAU.DescrPortalUAU_PWeb)

            Catch ex As Exception
                Throw
            End Try
        End Sub

        ''' <summary>
        ''' Envia um email informativo para o cliente, este alerta ao cliente de que houve uma tentativa de cadastro no CPF/CNPj dele.
        ''' </summary>
        ''' <remarks>
        ''' 
        ''' Criação : Carlos Eduardo Santos Alves Domingos               Data: 09/07/2015
        ''' Projeto: 191658
        ''' 
        ''' </remarks>
        Private Sub EnviaEmailInformativo(ByVal confPortalUAU As ConfPortalUAU, ByVal codPessoa As Integer, ByVal rs As Pessoas, ByVal paramEmail As String, ByVal emProducao As Boolean)
            Dim stbHTML As New StringBuilder
            Dim strDestinatario As String = ""
            Dim strAssunto As String = ""
            Dim strLnkImagem As String = ""
            Dim senha As String
            Dim nome As String
            Dim endereco As String
            Dim cpfcnpj As String
            Dim datanasc As DateTime
            Dim login As String

            Try

                Dim res = rs.ConsultarPessoaPorChave(codPessoa).Tables(0).Rows
                If res.Count > 0 Then
                    senha = res(0)("Senha_pes")
                    nome = res(0)("Nome_pes")
                    endereco = res(0)("Ender_pes")
                    cpfcnpj = res(0)("Cpf_pes")
                    datanasc = res(0)("Dtnasc_pes")
                    login = res(0)("Login_pes")
                Else
                    Throw New Exception("Cadastro de pessoa inexistente")
                End If

                '   Montando o corpo do Email
                stbHTML.Append("<HTML><BODY bgcolor=""#D6D6D6"" style=""text-align:center; width:100%; height:100%"">")
                stbHTML.Append("<div style=""background-color: white; height: 100%; width: 600px; position: relative; padding-right: 5px; padding-left: 5px; "" >")
                stbHTML.Append("<HR width=""100%"" color=""silver"">")

                strLnkImagem = ConfigurationManager.AppSettings("UrlCaminhoPastaLogotipos") & confPortalUAU.NumEmp_PWeb & "\LOGO.JPG"


                '   Destinatário
                '   Para o tipo Reenvio o destinatário será o email da pessoa já cadastrada no Uau!
                strDestinatario = paramEmail

                '   Assunto do Email
                strAssunto = "UAU Web - " & confPortalUAU.DescrPortalUAU_PWeb & " - Dados de acesso."

                '   Descriptografando senha
                senha = UAUWeb_CRYPTO.Desencriptar(senha)

                'verifica se arquivo existe nesta url
                If Envio.verificaUrl(strLnkImagem) Then
                    stbHTML.Append("<div style=""text-align: center""><img id=""Image1"" src=" & strLnkImagem & " runat=""server"" /></div>")
                End If
                stbHTML.Append("<font face=""verdana"" size=""2""><p align=""center""><strong>UAU Web - " & confPortalUAU.DescrPortalUAU_PWeb & " - Dados de acesso.</strong></p></font><br>")
                stbHTML.Append("<font face=""verdana"" size=""2""><p align=""left"">Olá <strong>" & nome & "</strong></p></font>")
                stbHTML.Append("<font face=""verdana"" size=""2""><p align=""justify"">Foi realizada uma tentativa de cadastro para acesso ao UAU Web encaminhamos os dados cadastrados em nosso sistema.</br>Qualquer dúvida entre em contato com nossa empresa.</p></font><br>")



                stbHTML.Append("<div align=left style=""background-color: white; width: 600px;"" >")
                stbHTML.Append("<font face=""verdana"" size=""2""><strong>Nome: </strong> " & nome & "<br>")
                stbHTML.Append("<strong>Endereço: </strong> " & endereco & "<br>")
                stbHTML.Append("<strong>Email: </strong> " & paramEmail & "<br>")
                stbHTML.Append("<strong>CPF/CNPJ: </strong> " & cpfcnpj & "<br>")
                '   Dependendo do tipo do usuário (pessoa fisica ou juridica) deve mostrar um label diferente na frente da data
                If cpfcnpj.Count = 11 Then
                    stbHTML.Append("<strong>Data de Nascimento: </strong> " & datanasc.ToString("dd/MM/yyyy") & "<br>")
                Else
                    stbHTML.Append("<strong>Fundação: </strong> " & datanasc.ToString("dd/MM/yyyy") & "<br>")
                End If
                stbHTML.Append("<font face=""verdana"" size=""2""><p><strong>Dados de Acesso</strong></p></font>")
                stbHTML.Append("<strong>Usuário: </strong> " & login.Trim & "<br>")
                stbHTML.Append("<strong>Senha: </strong> " & senha & "<br>")
                stbHTML.Append("<strong>Cadastrado em: </strong> " & Format(Now(), "dd/MM/yyyy") & " às " & Format(Now(), "HH:mm:ss") & "</font><br>")
                stbHTML.Append("</div>")


                stbHTML.Append("<font face=""verdana"" size=""2""><p><strong>Dados para contato</strong></p></font>")
                If Not confPortalUAU.NomeContato_PWeb Is Nothing AndAlso Not confPortalUAU.NomeContato_PWeb.Equals("") Then
                    stbHTML.Append("<strong>Nome para contato: </strong>" & confPortalUAU.NomeContato_PWeb & "<br>")
                End If
                If Not confPortalUAU.Telefone_PWeb Is Nothing AndAlso Not confPortalUAU.Telefone_PWeb.Equals("") Then
                    stbHTML.Append("<strong>Telefone: </strong>" & confPortalUAU.Telefone_PWeb & "<br>")
                End If
                If Not confPortalUAU.EmailContato_PWeb Is Nothing AndAlso Not confPortalUAU.EmailContato_PWeb.Equals("") Then
                    stbHTML.Append("<strong>Email: </strong>" & confPortalUAU.EmailContato_PWeb & "<br><br>")
                End If

                stbHTML.Append("<center><font face=""verdana"" size=""1""><a href=http://www.uau.com.br/PortalUAU_Site/AbrePortal.aspx?Empresa=" & GetTokenEmpresa(confPortalUAU.NumEmp_PWeb, emProducao) & " target=""UAU Web"">Clique aqui para acessar o UAU Web!</a></font></center>")
                stbHTML.Append("<HR width=""100%"" color=""silver""")
                stbHTML.Append("</font></BODY></HTML>")

                '   Enviando email
                Envio.MandarEmail(strAssunto, strDestinatario, stbHTML.ToString, confPortalUAU.EmailContato_PWeb, confPortalUAU.DescrPortalUAU_PWeb)

            Catch ex As Exception
                Throw
            End Try
        End Sub

        ''' <summary>
        ''' Recupera o token da empresa a partir do código da mesma.
        ''' </summary>
        ''' <remarks>
        ''' 
        ''' Criação : Carlos Eduardo Santos Alves Domingos               Data: 09/07/2015
        ''' Projeto: 191658
        ''' 
        ''' </remarks>
        Public Function GetTokenEmpresa(ByVal codEmpresa As String, ByVal emProducao As Boolean) As String
            Dim tokenEmpresa As String
            If emProducao Then
                Dim referencia As wsRegistroUau = New wsRegistroUau
                tokenEmpresa = referencia.GeraTokenEmpresaPorCodigo(codEmpresa)
            Else
                Dim referencia As WsEmpresa = New WsEmpresa
                tokenEmpresa = referencia.GeraTokenEmpresaPorCodigo(codEmpresa)
            End If
            Return tokenEmpresa
        End Function

        ''' <summary>
        ''' Válida se o login informado é válido para uso.
        ''' </summary>
        ''' <remarks>
        ''' 
        ''' Criação : Carlos Eduardo Santos Alves Domingos               Data: 09/07/2015
        ''' Projeto: 191658
        ''' 
        ''' </remarks>
        Private Function ValidaCadastroLogin(ByVal rs As Pessoas, ByVal confPortalUAU As ConfPortalUAU, ByVal login As String, ByVal CpfCnpj As String, ByVal DataNasc As DateTime, ByRef codPes As Integer) As RespostaMob
            Dim resultado As New RespostaMob
            Try
                resultado.sucesso = True
                Dim dtPessoas As New DataTable

                '   Verifica se o CPF/CNPJ e a Data de Nascimento estão iguais no Uau, ou seja atualizados
                If (DataNasc <> DateTime.MinValue) Then
                    dtPessoas = rs.ConsultarPessoasPorCPFCNPJDataNascimento(CpfCnpj, DataNasc).Tables("Pessoas")
                Else
                    dtPessoas = rs.ConsultarPessoasPorCPFCNPJDataNascimento(CpfCnpj, Nothing).Tables("Pessoas")
                End If


                Dim drPessoas As DataRow() = dtPessoas.Select
                If drPessoas.Length = 0 Then
                    resultado.AddMensagem("Seu cadastro foi alterado/deletado pela empresa. Não será possível concluir. ")
                    resultado.AddMensagem(String.Format("Para maiores informações entre em contato com a empresa {0} {1}.", confPortalUAU.DescrPortalUAU_PWeb, RetornaInformacoesContatoEmpresaLogada(confPortalUAU)))
                    resultado.sucesso = False
                Else
                    Dim drLinha As DataRow = DirectCast(drPessoas.GetValue(0), DataRow)
                    codPes = DirectCast(drLinha("cod_pes"), Integer)
                    'Valida se o login está sendo utilizado por outra pessoa.
                    Dim resulValidacao = rs.ValidaLoginAcessoUauWeb(login, codPes)
                    resultado.sucesso = resulValidacao.Sucesso
                    If Not resultado.sucesso Then
                        resultado.mensagem = resulValidacao.Mensagem
                    End If

                End If
                Return resultado


            Catch ex As Exception
                Throw
            End Try
        End Function

        ''' <summary>
        ''' Monta as informações de contato da empresa.
        ''' </summary>
        ''' <remarks>
        ''' 
        ''' Criação : Carlos Eduardo Santos Alves Domingos               Data: 09/07/2015
        ''' Projeto: 191658
        ''' 
        ''' </remarks>
        Private Function RetornaInformacoesContatoEmpresaLogada(ByVal confPortalUAU As ConfPortalUAU) As String
            Dim stbContato As New StringBuilder("")

            stbContato.Append(" " & UCase(Trim(confPortalUAU.DescrPortalUAU_PWeb)) & ". ")

            If Not confPortalUAU.NomeContato_PWeb Is Nothing AndAlso Not confPortalUAU.NomeContato_PWeb.Equals("") Then
                stbContato.Append("<BR> Através do contato: " & UCase(Trim(confPortalUAU.NomeContato_PWeb)))
            End If

            If Not confPortalUAU.Telefone_PWeb Is Nothing AndAlso Not confPortalUAU.Telefone_PWeb.Equals("") Then
                stbContato.Append("<BR> Pelo telefone: " & UCase(Trim(confPortalUAU.Telefone_PWeb)))
            End If

            If Not confPortalUAU.EmailContato_PWeb Is Nothing AndAlso Not confPortalUAU.EmailContato_PWeb.Equals("") Then
                stbContato.Append("<BR> Ou pelo e-mail: " & UCase(Trim(confPortalUAU.EmailContato_PWeb)))
            End If

            Return stbContato.ToString
        End Function

        ''' <summary>
        ''' Válida se a empresa possuí uma configuração que possibilita o uso do UAU Cliente.
        ''' </summary>
        ''' <remarks>
        ''' 
        ''' Criação : Carlos Eduardo Santos Alves Domingos               Data: 09/07/2015
        ''' Projeto: 191658
        ''' 
        ''' </remarks>
        <HttpPost>
        Public Function ValidaConfEmpresa(parans As Params_CadastroUsuario) As RespostaMob
            Try
                Dim ret = New RespostaMob()
                ret.sucesso = True
                Dim confPortalUAU = db.ConfPortalUAU.Find(parans.CodEmpresa)
                Dim confCadUsuario = db.ConfCadUsuario.Find(parans.CodEmpresa)

                If confPortalUAU Is Nothing Or confCadUsuario Is Nothing Then
                    ret.sucesso = False
                    ret.AddMensagem("A empresa não está configurada utilizar o UAU Cliente")
                    Return ret
                End If

                If Not confCadUsuario.AutoManual_ccu And Not confCadUsuario.AutoCadastro_ccu Then
                    ret.sucesso = False
                    ret.AddMensagem(String.Format(mensagemPadrao, confPortalUAU.DescrPortalUAU_PWeb, RetornaInformacoesContatoEmpresaLogada(confPortalUAU), "Empresa está configurada para cadastro supervisionado, o UAU Cliente só permite cadastro automático."))
                    Return ret
                End If

                If confPortalUAU.UsrLoginUAU_PWeb Is Nothing Then
                    ret.sucesso = False
                    ret.AddMensagem(String.Format(mensagemPadrao, confPortalUAU.DescrPortalUAU_PWeb, RetornaInformacoesContatoEmpresaLogada(confPortalUAU), "Empresa não possuí login do uau cadastrado."))
                    Return ret
                End If

                Return ret
            Catch ex As Exception
                Throw
            End Try
        End Function

        ''' <summary>
        ''' Envia um email para o cliente informando o login e a senha do mesmo no UAU Web.
        ''' </summary>
        ''' <remarks>
        ''' 
        ''' Criação : Carlos Eduardo Santos Alves Domingos               Data: 09/07/2015
        ''' Projeto: 191658
        ''' 
        ''' </remarks>
        Private Function MontaEmailRecuperaSenha(ByVal usuarioUau As String, ByVal senhaUau As String, ByVal usuarioPortal As String, ByVal senhaPortal As String, ByVal mensagemErroUau As String, ByVal mensagemErroPortal As String, ByVal confPortalUAU As ConfPortalUAU, ByVal emProducao As Boolean) As String
            Try

                Dim mensagem As String

                mensagem = "<html>"
                mensagem += "<head></head>"
                mensagem += "<body>"
                mensagem += "<small style='font-weight: bold; font-family: Arial; color: rgb(0, 0, 121);'>"
                mensagem += "Assistente para recupera&ccedil;&atilde;o de senha: " & confPortalUAU.DescrPortalUAU_PWeb & "</small><br><br>"
                mensagem += "<small style='font-family: Arial;'>"
                mensagem += "Voc&ecirc; esta recebendo este email porque foi feita uma solicita&ccedil;&atilde;o de recupera&ccedil;&atilde;o de senha em nosso site.<br><br>"
                mensagem += "<br><br>"

                If usuarioPortal <> "" And senhaPortal <> "" Then
                    mensagem += "Caro cliente para que voc&ecirc; possa acessar os servi&ccedil;os dispon&iacute;veis em nosso site, por favor utilize o usu&aacute;rio e senha abaixo.<br><br>"
                    mensagem += "Usu&aacute;rio do UAU Web: " & usuarioPortal & "<br>"
                    mensagem += "Senha do UAU Web: " & senhaPortal
                    mensagem += "<br><br><br><br>"
                ElseIf mensagemErroPortal <> "" Then
                    mensagem += "Falha na recupera&ccedil;&atilde;o dos dados do UAU Web: " & mensagemErroPortal
                    mensagem += "<br><br><br><br>"
                End If

                If usuarioUau <> "" And senhaUau <> "" Then
                    mensagem += "Voc&ecirc; possui um login de acesso especial, onde &eacute; poss&iacute;vel realizar a&ccedil;&otilde;es como (Espelho de vendas, Cadastro de propostas, CRM e UAU). Para este caso utilize o login e senha abaixo.<br><br>"
                    mensagem += "Usu&aacute;rio do UAU: " & usuarioUau & "<br>"
                    mensagem += "Senha do UAU: " & senhaUau & "<br>"
                    mensagem += "<br><br><br><br>"
                ElseIf mensagemErroUau <> "" Then
                    mensagem += "Falha na recupera&ccedil;&atilde;o dos dados do UAU: " & mensagemErroUau & "<br>"
                    mensagem += "<br><br><br><br>"
                End If

                mensagem += "<p><strong>Dados para contato</strong></p>"


                If Not confPortalUAU.NomeContato_PWeb Is Nothing AndAlso Not confPortalUAU.NomeContato_PWeb.Equals("") Then
                    mensagem += "<strong>Nome para contato: </strong>" & confPortalUAU.NomeContato_PWeb & "<br>"
                End If
                If Not confPortalUAU.Telefone_PWeb Is Nothing AndAlso Not confPortalUAU.Telefone_PWeb.Equals("") Then
                    mensagem += "<strong>Telefone: </strong>" & confPortalUAU.Telefone_PWeb & "<br>"
                End If
                If Not confPortalUAU.EmailContato_PWeb Is Nothing AndAlso Not confPortalUAU.EmailContato_PWeb.Equals("") Then
                    mensagem += "<strong>Email: </strong>" & confPortalUAU.EmailContato_PWeb & "<br><br>"
                End If

                mensagem += "</small>"
                mensagem += "<center><font face=""Arial"" size=""1""><a href=http://www.uau.com.br/PortalUAU_Site/AbrePortal.aspx?Empresa=" & GetTokenEmpresa(confPortalUAU.NumEmp_PWeb, emProducao) & " target=""UAU Web"">Clique aqui para acessar o UAU Web!</a></font></center>"
                mensagem += "<HR width=""100%"" color=""silver"""
                mensagem += "</font></BODY></HTML>"

                Return mensagem

            Catch ex As Exception
                Throw
            End Try
        End Function

        ''' <summary>
        ''' Envia um email para o cliente informando o login e a senha do mesmo no UAU Web.
        ''' </summary>
        ''' <remarks>
        ''' 
        ''' Criação : Carlos Eduardo Santos Alves Domingos               Data: 09/07/2015
        ''' Projeto: 191658
        ''' 
        ''' </remarks>
        <HttpPost>
        Public Function RecuperaSenhaPorLogin(parans As Params_CadastroUsuario) As RespostaMob
            Try
                Dim ret = New RespostaMob()
                ret.sucesso = False
                Dim rs = New wsUsuarios()
                rs.Url = parans._wsDomain & System.Configuration.ConfigurationManager.AppSettings("wsUsuariosAdress").ToString
                Dim confPortalUAU = db.ConfPortalUAU.Find(parans.CodEmpresa)
                Dim webAPIConf As New ConfiguracaoController()

                'Válido se o webservice está em uma versão compatível.
                If Not webAPIConf.versaoUAUWebCompativel(parans._wsDomain) Then
                    ret.sucesso = False
                    ret.mensagem = String.Format(mensagemPadrao, confPortalUAU.DescrPortalUAU_PWeb, RetornaInformacoesContatoEmpresaLogada(confPortalUAU), "WebService desatualizado.")
                    Return ret
                End If

                Dim retorno As New RetornoMetodo

                retorno = rs.RecuperarUsuarioSenhaPorLogin(parans.Login)

                If retorno.Status = StatusRetorno.Sucesso Then

                    Dim usuario, senha As String

                    usuario = UAUWeb_CRYPTO.Desencriptar(retorno.Usuario)
                    senha = UAUWeb_CRYPTO.Desencriptar(retorno.Senha)

                    If parans.Login.Length <= 8 Then
                        'Envia email com os dados de acesso do UAU.
                        Envio.MandarEmail("Solicitação de recuperação de senha - " & confPortalUAU.DescrPortalUAU_PWeb & "", retorno.Email, MontaEmailRecuperaSenha(usuario, senha, "", "", "", "", confPortalUAU, parans._mobEmProducao), confPortalUAU.EmailContato_PWeb, confPortalUAU.DescrPortalUAU_PWeb)
                    Else
                        'Envia email com os dados de acesso do PortalUAU.
                        Envio.MandarEmail("Solicitação de recuperação de senha - " & confPortalUAU.DescrPortalUAU_PWeb & "", retorno.Email, MontaEmailRecuperaSenha("", "", usuario, senha, "", "", confPortalUAU, parans._mobEmProducao), confPortalUAU.EmailContato_PWeb, confPortalUAU.DescrPortalUAU_PWeb)
                    End If

                    ret.sucesso = True
                    ret.mensagem = "Seus dados de acesso foram enviados para o email " & retorno.Email & " !"

                Else

                    'Modifico a mensagem de erro aqui para não ter que passar um parametro a mais para o webservice. Caso contrario teria que passar o fone da empresa no método RecuperarUsuarioSenhaPorLogin.
                    If retorno.Mensagem = "O login informado não possui email cadastrado no sistema, entre em contato conosco para atualizar seus dados." Then
                        retorno.Mensagem = "O login informado não possui e-mail cadastrado, é preciso atualizar seus dados, favor entre em contato conosco através do fone: " & confPortalUAU.Telefone_PWeb
                    End If

                    ret.sucesso = False
                    ret.mensagem = retorno.Mensagem

                End If

                Return ret
            Catch ex As Exception
                Throw
            End Try
        End Function

        ''' <summary>
        ''' Envia o email de recuperação de senha, contendo o login e a senha do usuário.
        ''' </summary>
        ''' <remarks>
        ''' Criação : Carlos Eduardo Santos Alves Domingos               Data: 09/07/2015
        ''' Projeto: 191658
        ''' 
        ''' </remarks>
        <HttpPost>
        Public Function RecuperaSenhaPorEmail(parans As Params_CadastroUsuario) As RespostaMob
            Try

                Dim usuarioUau As String = ""
                Dim senhaUau As String = ""
                Dim usuarioPortal As String = ""
                Dim senhaPortal As String = ""
                Dim mensagemErroUau As String = ""
                Dim mensagemErroPortal As String = ""
                Dim ret = New RespostaMob()
                ret.sucesso = False
                Dim rs = New wsUsuarios()
                rs.Url = parans._wsDomain & System.Configuration.ConfigurationManager.AppSettings("wsUsuariosAdress").ToString
                Dim confPortalUAU = db.ConfPortalUAU.Find(parans.CodEmpresa)
                Dim webAPIConf As New ConfiguracaoController()

                'Válido se o webservice está em uma versão compatível.
                If Not webAPIConf.versaoUAUWebCompativel(parans._wsDomain) Then
                    ret.sucesso = False
                    ret.mensagem = String.Format(mensagemPadrao, confPortalUAU.DescrPortalUAU_PWeb, RetornaInformacoesContatoEmpresaLogada(confPortalUAU), "WebService desatualizado.")
                    Return ret
                End If

                Dim lista() As RetornoMetodo

                lista = rs.RecuperarUsuarioSenhaPorEmail(parans.Email)

                If lista(DadosRetorno.DadosUAU).Status = StatusRetorno.Falha And lista(DadosRetorno.DadosPortal).Status = StatusRetorno.Falha Then
                    ret.sucesso = False
                    ret.mensagem = "O email informado não esta cadastrado ou esta duplicado. Entre em contato conosco atráves do fone: " & confPortalUAU.Telefone_PWeb & "."
                    Return ret
                End If

                If lista(DadosRetorno.DadosUAU).Status = StatusRetorno.Sucesso Then
                    usuarioUau = UAUWeb_CRYPTO.Desencriptar(lista(DadosRetorno.DadosUAU).Usuario)
                    senhaUau = UAUWeb_CRYPTO.Desencriptar(lista(DadosRetorno.DadosUAU).Senha)
                Else
                    mensagemErroUau = lista(DadosRetorno.DadosUAU).Mensagem
                End If

                If lista(DadosRetorno.DadosPortal).Status = StatusRetorno.Sucesso Then
                    usuarioPortal = UAUWeb_CRYPTO.Desencriptar(lista(DadosRetorno.DadosPortal).Usuario)
                    senhaPortal = UAUWeb_CRYPTO.Desencriptar(lista(DadosRetorno.DadosPortal).Senha)
                Else
                    mensagemErroPortal = lista(DadosRetorno.DadosPortal).Mensagem
                End If

                'Envia email com os dados de acesso do UAU.
                Envio.MandarEmail("Solicitação de recuperação de senha - " & confPortalUAU.DescrPortalUAU_PWeb & "", parans.Email, MontaEmailRecuperaSenha(usuarioUau, senhaUau, usuarioPortal, senhaPortal, mensagemErroUau, mensagemErroPortal, confPortalUAU, parans._mobEmProducao), confPortalUAU.EmailContato_PWeb, confPortalUAU.DescrPortalUAU_PWeb)

                ret.sucesso = True
                ret.mensagem = "Seus dados de acesso foram enviados para o email " & parans.Email & "!"

                Return ret

            Catch ex As Exception
                Throw
            End Try

        End Function

    End Class
End Namespace
Imports System.Configuration.ConfigurationManager
Imports System.Net.Mail

Namespace UAUWeb_EMAIL

    Public Class Envio

        ''' <summary>
        ''' 
        ''' </summary>
        ''' <param name="Assunto"></param>
        ''' <param name="Destinatarios"></param>
        ''' <param name="CorpoEmail"></param>
        ''' <remarks>
        ''' 
        ''' Criação : Carlos Eduardo Santos Alves Domingos               Data: 20/26/2015
        ''' Projeto: 191658
        ''' </remarks>
        Public Shared Sub MandarEmail(ByVal Assunto As String, ByVal Destinatarios As String, ByVal CorpoEmail As String, ByVal EnderecoResposta As String, ByVal NomeRemetente As String)

            Try

                Dim Email As New MailMessage
                Dim listaEmailDestinatario As String()
                Dim listaEmailResposta As String()

                '    Formatando Email
                With Email
                    '   Monta a lista de emails que serão enviados para determinado destinatário
                    listaEmailDestinatario = MontarListaDeEmail(Destinatarios)
                    '   Realiza uma iteração adicionando os endereços de email do destinatário
                    For indice As Integer = 0 To listaEmailDestinatario.Length - 1
                        If Not String.IsNullOrEmpty(listaEmailDestinatario.GetValue(indice)) Then
                            .To.Add(New MailAddress(listaEmailDestinatario.GetValue(indice)))
                        End If

                    Next

                    '   Monta a lista de emails que será utilizada quando for responder 
                    listaEmailResposta = MontarListaDeEmail(EnderecoResposta)
                    '   Realiza uma iteração adicionando os endereços de email de resposta
                    For indice As Integer = 0 To listaEmailResposta.Length - 1
                        If indice = 0 Then
                            If Not String.IsNullOrEmpty(listaEmailResposta.GetValue(indice)) Then
                                ' Aceita apenas um endereço de email de resposta
                                .ReplyToList.Add(New MailAddress(listaEmailResposta.GetValue(indice)))
                                Exit For
                            End If

                        End If
                    Next

                    .From = New MailAddress("portaluau@uau.com.br", NomeRemetente)
                    .Subject = Assunto
                    .IsBodyHtml = True
                    .Body = CorpoEmail
                End With

                Dim Conector As New SmtpClient

                With Conector
                    .Host = "smtp.uau.com.br"
                    .Port = 587
                    .UseDefaultCredentials = False
                    Dim cred As New Net.NetworkCredential("portaluau@uau.com.br", "contaportal01")
                    .Credentials = cred
                    If Not Email.To Is Nothing OrElse Not Email.ReplyToList Is Nothing Then
                        .Send(Email)
                    End If

                End With

            Catch ex As Exception
                Throw New Exception("Erro ao enviar email! - " & ex.Message)
            End Try

        End Sub

        ''' <summary>
        ''' Monta a lista de endereços de emails verificando se os endereços estão separados
        ''' por vírgula, ponto e vírgula ou espaço retornando a lista com os emails
        ''' </summary>
        ''' <param name="enderecoEmail">Endereços de email</param>
        ''' <returns>Retorna a lista contendo os endereços</returns>
        ''' <remarks>
        ''' Criação : Evelyn Rodrigues Sales Barbosa Data: 15/08/2012
        ''' Projeto : 113557 - Imediata
        ''' </remarks>
        Private Shared Function MontarListaDeEmail(ByVal enderecoEmail As String) As String()
            Try
                Dim listaEmail As String()

                '   Verifica a existência de vírgula, ponto e vírgula ou espaço separando os endereços de email
                If enderecoEmail.Contains(",") Then
                    listaEmail = enderecoEmail.Split(",")
                ElseIf enderecoEmail.Contains(";") Then
                    listaEmail = enderecoEmail.Split(";")
                ElseIf enderecoEmail.Contains(" ") Then
                    listaEmail = enderecoEmail.Split(" ")
                Else
                    listaEmail = enderecoEmail.Split
                End If

                MontarListaDeEmail = listaEmail
            Catch ex As Exception
                Throw
            End Try
        End Function

        Public Shared Function verificaUrl(ByVal strUrl As String) As Boolean
            '--- cria um objeto do tipo webrequest  ---
            Dim req As Net.WebRequest = Net.WebRequest.Create(strUrl)

            Try
                '--- É feita uma requisição ao url ---
                Dim response As Net.HttpWebResponse = DirectCast(req.GetResponse(), Net.HttpWebResponse)
                Return True

            Catch ex As System.Net.WebException
                Return False
            End Try
        End Function

    End Class

End Namespace



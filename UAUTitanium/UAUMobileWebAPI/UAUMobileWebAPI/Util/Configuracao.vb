Namespace Util
    Public Class Configuracao
        Private Sub New()

        End Sub
        ''' <summary>
        ''' Obtém o endereço do webservice.
        ''' </summary>
        ''' <param name="keyService">Chave no arquivo de configuração (web.config) que contém o caminho para o webservice desejado</param>
        ''' <param name="mainDomain">Domínio em que se encontra o webservice. Caso não seja informado é considerado o valor contido em web.config</param>
        ''' <remarks>
        ''' Criação    : Carlos Eduardo Santos Alves Domingos        Data: 28/01/2015
        ''' Projeto    : 176562
        ''' </remarks>
        Public Shared Function getUrlService(keyService As String, mainDomain As String) As String
            If mainDomain <> "" Then
                Return mainDomain & System.Configuration.ConfigurationManager.AppSettings(keyService).ToString
            End If
            Return System.Configuration.ConfigurationManager.AppSettings("WsMainDomain").ToString & System.Configuration.ConfigurationManager.AppSettings(keyService).ToString
        End Function

        ''' <summary>
        ''' Converte para nothing os campos DBNull.
        ''' </summary>
        ''' <param name="field">Valor do campo a ser convertido</param>
        ''' <remarks>
        ''' Criação    : Carlos Eduardo Santos Alves Domingos        Data: 11/03/2015
        ''' Projeto    : 180419
        ''' </remarks>
        Public Shared Function retiraDBNull(ByVal field As Object) As Object
            Try
                If IsDBNull(field) Then
                    Return Nothing
                Else
                    Return field
                End If
            Catch ex As Exception
                Throw
            End Try
        End Function
    End Class
End Namespace

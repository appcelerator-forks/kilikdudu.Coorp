Imports System.Net
Imports System.Web.Http
Imports UAUMobileWebAPI.Parametros.Novidades
Imports UAUMobileWebAPI.Models.Novidades
Imports UAUMobileWebAPI.wsNovidadeReference

Namespace Controllers
    Public Class NovidadesController
        Inherits ApiController

        ''' <summary>
        ''' Consulta todas as novidades para a versão indicada e o módulo do UAU.
        ''' </summary>
        ''' <param name="parans">Parâmetros do método.</param>
        ''' <remarks>
        ''' Criação    : Carlos Eduardo Santos Alves Domingos        Data: 06/03/2015
        ''' Projeto    : 180419
        ''' </remarks>
        <HttpPost>
        Public Function NovidadesPorModuloVersao(parans As Params_NovidadesPorModuloVersao) As List(Of Novidade)
            Try
                Dim lstNovidades As List(Of Novidade) = New List(Of Novidade)
                Dim ref = New wsNovidade
                ref.Url = parans.suportNetLocaWeb & System.Configuration.ConfigurationManager.AppSettings("wsNovidade").ToString
                Dim res As DataRowCollection = ref.ConsultarNovidadePorModuloVersao(parans.modulo, parans.versao).Tables(0).Rows
                For i As Integer = 0 To res.Count - 1
                    Dim novs = New Novidade
                    novs.NumeroTarefa = res(i)("Num_tar")
                    novs.Descricao = res(i)("ObsSolicitante_tar")
                    novs.linkVirtual = res(i)("LinkVirtuau_tar")
                    lstNovidades.Add(novs)
                Next
                'Retorno a lista de boletos.
                Return lstNovidades
            Catch ex As Exception
                Throw
            End Try
        End Function

    End Class
End Namespace
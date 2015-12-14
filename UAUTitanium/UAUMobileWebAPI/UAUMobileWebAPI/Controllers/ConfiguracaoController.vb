Imports System.Net
Imports System.Web.Http
Imports UAUMobileWebAPI.Parametros.Configuracao
Imports UAUMobileWebAPI.wsMobileReference
Imports UAUMobileWebAPI.segurancaReference
Imports UAUMobileWebAPI.Util
Imports UAUMobileWebAPI.Models.Configuracao


Namespace Controllers
    Public Class ConfiguracaoController
        Inherits ApiController

        Private db As New UauWebBDEntities

        ''' <summary>
        ''' Verifica quais são os serviços permitidos pela empresa.
        ''' </summary>
        ''' <param name="parans">Parâmetros do método.</param>
        ''' <remarks>
        ''' Criação    : Carlos Eduardo Santos Alves Domingos        Data: 25/06/2015
        ''' Projeto    : 191658
        ''' </remarks>
        <HttpPost>
        Public Function getServicosDaEmpresa(parans As Params_ConfEmpresa) As ServicosMobile
            Try
                Dim rowServicos = db.ConfServico.Find(parans.CodEmpresa)
                Dim ret As New ServicosMobile
                ret.ListaServicos = New List(Of Integer)()
                If rowServicos IsNot Nothing Then
                    If rowServicos.BoletoAntecipado_cs Then ret.ListaServicos.Add(ServicosMobile.Servicos.BoletoAntecipado)
                    If rowServicos.HabilitarAnexos_cs Then ret.ListaServicos.Add(ServicosMobile.Servicos.HabilitarAnexos)
                    If rowServicos.InadimplenteGeraBol_cs Then ret.ListaServicos.Add(ServicosMobile.Servicos.InadimplenteGeraBol)
                    If rowServicos.MostrarCadTerrenos_cs Then ret.ListaServicos.Add(ServicosMobile.Servicos.MostrarCadTerrenos)
                    If rowServicos.MostrarDemonsPagtoCli_cs Then ret.ListaServicos.Add(ServicosMobile.Servicos.MostrarDemonstraPagtCli)
                    If rowServicos.MostrarReimpBoleto_cs Then ret.ListaServicos.Add(ServicosMobile.Servicos.MostrarReimpBoleto)
                End If
                Return ret

            Catch ex As Exception
                Throw
            End Try
        End Function

        <HttpPost>
        Public Function getPermCorporativo(parans As Params_getPermCorporativo) As List(Of AcessoPrograma)
            Try
                Dim ref = New Seguranca()
                ref.Url = Configuracao.getUrlService("segurancaAdress", parans._wsDomain)
                Dim ret As New List(Of AcessoPrograma)
                For Each programa As String In parans.programas
                    Dim permisao As New AcessoPrograma()
                    permisao.programa = programa
                    permisao.acesso = Not ref.ChecarPermissaoMob(programa, EnumPermissaoUAU.SemAcesso, parans.usuario)
                    ret.Add(permisao)
                Next
                Return ret

            Catch ex As Exception
                Throw
            End Try
        End Function

        ''' <summary>
        ''' Verifica se a empresa mostra boleto vencido ou não.
        ''' </summary>
        ''' <param name="parans">Parâmetros do método.</param>
        ''' <remarks>
        ''' Criação    : Carlos Eduardo Santos Alves Domingos        Data: 25/06/2015
        ''' Projeto    : 191658
        ''' </remarks>
        <HttpPost>
        Public Function confReimpBoleto(parans As Params_ConfEmpresa) As ConfReimpBoleto
            Try

                Return db.ConfReimpBoleto.Find(parans.CodEmpresa)

            Catch ex As Exception
                Throw
            End Try
        End Function

        ''' <summary>
        ''' Verifica se a empresa hospeda o MobileWebAPI em seu próprio servidor.
        ''' </summary>
        ''' <param name="parans">Parâmetros do método.</param>
        ''' <remarks>
        ''' Criação    : Carlos Eduardo Santos Alves Domingos        Data: 28/01/2015
        ''' Projeto    : 176562
        ''' </remarks>
        <HttpPost>
        Public Function getHospedagem(parans As ParametrosObrigatorios) As Hospedagem
            Try
                Dim rs = New wsMobile()
                rs.Url = parans._wsDomain & System.Configuration.ConfigurationManager.AppSettings("wsMobileAdress").ToString
                Dim hosp = New Hospedagem()
                hosp.enderecoWebAPI = rs.getHospedagemMobileWebAPI()
                Return hosp
            Catch ex As Exception
                Throw
            End Try
        End Function

        ''' <summary>
        ''' Verifica se a versão do app é compatível com a versão do WebAPI.
        ''' </summary>
        ''' <param name="versao">Versão do app.</param>
        ''' <remarks>
        ''' Criação    : Carlos Eduardo Santos Alves Domingos        Data: 06/03/2015
        ''' Projeto    : 180419
        ''' 
        ''' Alteração : Carlos Eduardo Santos Alves Domingos         Data: 08/05/2015
        ''' Projeto   : 188115 - Projeto
        ''' Manutenção: Alterado para verificar a versão do webservice do UAU Web.
        ''' 
        ''' </remarks>
        <HttpPost>
        Public Function verificaVersao(parans As Params_verificaVersao) As StatusVersao
            Dim resposta = New StatusVersao
            Dim versoesAceitas() = System.Configuration.ConfigurationManager.AppSettings("compatibilidade").ToString.Split(";")
            If versoesAceitas.Contains(parans.versao) Then
                If parans._wsDomain <> "" Then
                    If Not versaoUAUWebCompativel(parans._wsDomain) Then
                        resposta.status = "WsDesatualizado"
                    Else
                        resposta.status = "OK"
                    End If
                Else
                    resposta.status = "OK"
                End If
            Else
                resposta.status = "Fail"
            End If

            Return resposta
        End Function

        <HttpPost>
        Public Function versaoUAUWebCompativel(ByVal empDomain As String) As Boolean
            Dim ws = New wsConfigGerais.wsConfigGerais()
            ws.Url = empDomain & System.Configuration.ConfigurationManager.AppSettings("wsConfigAdress").ToString
            Dim versaoUAUWsStr = ws.RetornarVersaoWS().Replace(".", "")
            Dim versaoMinimaStr = System.Configuration.ConfigurationManager.AppSettings("compatibilidadeUAUWeb").ToString.Replace(".", "")
            Dim difDigitos = versaoUAUWsStr.Length - versaoMinimaStr.Length
            versaoMinimaStr = versaoMinimaStr.PadRight(versaoMinimaStr.Length + difDigitos, "0")
            Dim versaoUAUWs = CInt(versaoUAUWsStr)
            Dim versaoMinima = CInt(versaoMinimaStr)
            If versaoUAUWs < versaoMinima Then
                Return False
            Else
                Return True
            End If
        End Function

        ''' <summary>
        ''' Ponte para gravar o log de erro.
        ''' </summary>
        ''' <param name="parans">Parâmetros do método.</param>
        ''' <remarks>
        ''' Criação    : Carlos Eduardo Santos Alves Domingos        Data: 28/01/2015
        ''' Projeto    : 176562
        ''' </remarks>
        <HttpPost>
        Public Sub gravaLogErro(parans As Params_gravaLogErro)
            Try
                Dim rs = New wsMobile()
                rs.Url = Configuracao.getUrlService("wsMobileAdress", parans._wsDomain)
                rs.GravaLogErro(parans.descricao, parans.classe, parans.metodo, parans.os, parans.aplicativo, parans.versao, parans.atividade)
            Catch ex As Exception
                Throw
            End Try
        End Sub
    End Class
End Namespace
Imports System.Web.Services
Imports System.Web.Services.Protocols
Imports System.ComponentModel
Imports UAUMobileWebAPI.Controllers
Imports UAUMobileWebAPI.Models.Boletos

<System.Web.Services.WebService(Namespace:="http://tempuri.org/UAUMobileWebAPI/wsBoleto")> _
Public Class wsBoleto
    Inherits System.Web.Services.WebService

    Private db As New UauWebBDEntities

    <WebMethod(Description:="Envia a notificação de boletos pendentes para o cliente.")> _
    Public Sub EnviaNotificacaoBoleto()
        Try
            Dim cBoleto As New BoletoController()
            Dim listaEmpresas = db.ConfPortalUAU.Where(Function(c) c.AtInat_PWeb = 0).ToList()
            For Each empresa As ConfPortalUAU In listaEmpresas
                Dim token = HttpUtility.UrlEncode(UAUWeb_CRYPTO.Encriptar(empresa.NumEmp_PWeb))
                Dim envBoleto As New EnviaBoleto(token, False)
                envBoleto.start()
            Next
        Catch ex As Exception
            Throw
        End Try

    End Sub

End Class
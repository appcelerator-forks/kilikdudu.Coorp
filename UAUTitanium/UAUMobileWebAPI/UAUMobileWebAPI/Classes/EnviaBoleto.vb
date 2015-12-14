Imports System.ComponentModel
Imports System.Threading.Tasks
Imports UAUMobileWebAPI.Util
Imports System.Threading
Imports System.Web
Imports UAUMobileWebAPI.wsEmpresaProdReference
Imports UAUMobileWebAPI.wsEmpresaDevReference
Imports UAUMobileWebAPI.Controllers
Imports UAUMobileWebAPI.Models.Boletos

Public Class EnviaBoleto
    Public Property TokenEmpresa As String
    Private codEmpresa As Integer
    Private enderecoWs As String
    Private db As New UauWebBDEntities
    Private qtdeClientes As Integer
    Private qtdeEnviados As Integer
    Private progresso As String
    Private temConfiguracao As Boolean
    Private contadorFalhas As Integer = 0

    Public Sub New(ByVal tokenEmpresa As String, ByVal emProducao As Boolean)

        Me.TokenEmpresa = tokenEmpresa
        codEmpresa = UAUWeb_CRYPTO.Desencriptar(HttpUtility.UrlDecode(tokenEmpresa))
        If emProducao Then
            buscaEnderecoWsProducao()
        Else
            buscaEnderecoWsDesenvolvimento()
        End If

    End Sub

    Private Sub buscaEnderecoWsProducao()
        Dim referencia = New wsRegistroUau
        Dim confEmpresa = referencia.ConsultarDadosConfPortalUauPorCodigo(codEmpresa)
        If confEmpresa IsNot Nothing Then
            enderecoWs = confEmpresa.URLWS_PWeb
            temConfiguracao = True
        Else
            temConfiguracao = False
        End If

    End Sub

    Private Sub buscaEnderecoWsDesenvolvimento()
        Dim referencia = New WsEmpresa
        Dim confEmpresa = referencia.CarregarConfPortalEmpresa(codEmpresa)
        If confEmpresa IsNot Nothing Then
            enderecoWs = confEmpresa.URLWS_PWeb
            temConfiguracao = True
        Else
            temConfiguracao = False
        End If
    End Sub

    Private Sub work()

        Dim res = AdminACS.getUsuariosEmpresa(TokenEmpresa, TipoUsuario.Cliente)
        If res.meta.code > 0 Then

            qtdeClientes = res.response.users.Count()

            Parallel.ForEach(Of InfoUsuario)(res.response.users,
                                             Sub(user)
                                                 Dim codUsuario = user.username.Split("_")(1)
                                                 Dim cBoleto = New BoletoController()
                                                 Dim boletos = cBoleto.getBoletosCincoDias(enderecoWs, codEmpresa, codUsuario)
                                                 For Each bol As Boleto In boletos
                                                     AdminACS.EnviarNotificacao("boleto", bol, TipoUsuario.Cliente, TokenEmpresa, user.id, "Seu boleto vence em cinco dias.", "boleto")
                                                 Next
                                             End Sub)
        Else
            contadorFalhas = +1
            Thread.Sleep(300000)
            work()
        End If

    End Sub

    Public Sub start()
        If temConfiguracao Then
            Dim th = New Thread(AddressOf work)
            th.Start()
        End If
    End Sub

End Class

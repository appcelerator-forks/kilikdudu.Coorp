Imports System.Xml
Imports System.IO
Imports System.Net

Public Class Principal

    Private xmldocWebAPI As New XmlDataDocument
    Private xmldocUAUWeb As New XmlDataDocument
    Private pathWebAPI As String
    Private pathUAUWeb As String


    ''' <summary>
    ''' Grava o endereço do MobileWebAPI na configuração do UAUWeb_ws e o endereço do UAUWeb_ws na configuração do MobileWebAPI.
    ''' </summary>
    ''' <remarks>
    ''' Criação    : Carlos Eduardo Santos Alves Domingos        Data: 28/01/2015
    ''' Projeto    : 176562
    ''' </remarks>
    Private Sub btnGravar_Click(sender As Object, e As EventArgs) Handles btnGravar.Click
        Dim attr As XmlAttribute
        'Salvando o endereço do WebAPI em UAUWeb_ws
        attr = xmldocUAUWeb.SelectSingleNode("//appSettings/add[@key = 'mobileHospedagem']/@value")
        attr.Value = txtEnderecoWebAPI.Text()
        xmldocUAUWeb.Save(pathUAUWeb)
        'Salvando o endereço do UAUWeb_ws em MobileWebAPI
        attr = xmldocWebAPI.SelectSingleNode("//appSettings/add[@key = 'WsMainDomain']/@value")
        attr.Value = txtEnderecoUAUWeb.Text
        xmldocWebAPI.Save(pathWebAPI)
        'Confirmo
        MessageBox.Show("Endereço de webservice alterado com sucesso !")
        Me.Close()
    End Sub

    ''' <summary>
    ''' Verifica se o novo endereço do UAUWeb_ws é válido. Usa o webservice do validador.
    ''' </summary>
    ''' <remarks>
    ''' Criação    : Carlos Eduardo Santos Alves Domingos        Data: 28/01/2015
    ''' Projeto    : 176562
    ''' </remarks>
    Private Sub btnTestar_Click(sender As Object, e As EventArgs) Handles btnTestarWebAPI.Click
        Dim res As HttpWebResponse = Nothing
        Dim ServiceAttr As XmlAttribute
        Try
            ServiceAttr = xmldocWebAPI.SelectSingleNode("//appSettings/add[@key = 'validadorAdress']/@value")
            Dim req As HttpWebRequest = DirectCast(WebRequest.Create(txtEnderecoUAUWeb.Text & ServiceAttr.Value), HttpWebRequest)
            req.Credentials = CredentialCache.DefaultNetworkCredentials
            res = DirectCast(req.GetResponse(), HttpWebResponse)
            txtEnderecoUAUWeb.BackColor = Color.Green
            GrupoUAUWeb.Enabled = True
            MessageBox.Show("Endereço de webservice correto.")

        Catch ex As Exception
            txtEnderecoUAUWeb.BackColor = Color.Red
            btnGravar.Enabled = False
            GrupoUAUWeb.Enabled = False
            MessageBox.Show("Endereço de webservice incorreto.")

        End Try
    End Sub

    ''' <summary>
    ''' Verifica se o novo endereço do MobileWebApi é válido.
    ''' </summary>
    ''' <remarks>
    ''' Criação    : Carlos Eduardo Santos Alves Domingos        Data: 28/01/2015
    ''' Projeto    : 176562
    ''' </remarks>
    Private Sub btnTestarUAUWeb_Click(sender As Object, e As EventArgs) Handles btnTestarUAUWeb.Click
        Dim res As HttpWebResponse = Nothing
        Try
            Dim req As HttpWebRequest = DirectCast(WebRequest.Create(txtEnderecoWebAPI.Text & "api/Configuracao/getHospedagem?_wsDomain=" + Uri.EscapeDataString(txtEnderecoUAUWeb.Text)), HttpWebRequest)
            req.Credentials = CredentialCache.DefaultNetworkCredentials
            res = DirectCast(req.GetResponse(), HttpWebResponse)
            txtEnderecoWebAPI.BackColor = Color.Green
            btnGravar.Enabled = True
            MessageBox.Show("Endereço de webservice correto.")

        Catch ex As Exception
            txtEnderecoWebAPI.BackColor = Color.Red
            btnGravar.Enabled = False
            MessageBox.Show("Endereço de webservice incorreto.")

        End Try
    End Sub

    ''' <summary>
    ''' Busca o arquivo de configuração do UAUWeb_ws
    ''' </summary>
    ''' <remarks>
    ''' Criação    : Carlos Eduardo Santos Alves Domingos        Data: 28/01/2015
    ''' Projeto    : 176562
    ''' </remarks>
    Private Sub btnBuscarUAUWeb_Click_1(sender As Object, e As EventArgs) Handles btnBuscarUAUWeb.Click
        configFile.ShowDialog()
        If configFile.FileName <> "" Then
            xmldocUAUWeb.Load(configFile.FileName)
            Dim xmlnode As XmlNode
            xmlnode = xmldocUAUWeb.SelectSingleNode("//appSettings/add[@key='mobileHospedagem']")
            txtEnderecoWebAPI.Text = xmlnode.Attributes("value").Value
            txtEnderecoWebAPI.Enabled = True
            txtConfigFileUAUWeb.Text = configFile.FileName
            pathUAUWeb = configFile.FileName
            btnTestarUAUWeb.Enabled = True
            configFile.Dispose()
        End If
    End Sub

    ''' <summary>
    ''' Busca o arquivo de configuração do MobileWebAPI
    ''' </summary>
    ''' <remarks>
    ''' Criação    : Carlos Eduardo Santos Alves Domingos        Data: 28/01/2015
    ''' Projeto    : 176562
    ''' </remarks>
    Private Sub btnBuscarWebAPI_Click(sender As Object, e As EventArgs) Handles btnBuscarWebAPI.Click
        configFile.ShowDialog()
        If configFile.FileName <> "" Then
            xmldocWebAPI.Load(configFile.FileName)
            Dim xmlnode As XmlNode
            xmlnode = xmldocWebAPI.SelectSingleNode("//appSettings/add[@key='WsMainDomain']")
            txtEnderecoUAUWeb.Text = xmlnode.Attributes("value").Value
            txtEnderecoUAUWeb.Enabled = True
            txtConfigFileWebAPI.Text = configFile.FileName
            pathWebAPI = configFile.FileName
            btnTestarWebAPI.Enabled = True
            configFile.Dispose()
        End If
    End Sub
End Class

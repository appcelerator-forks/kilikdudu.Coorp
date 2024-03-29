﻿'------------------------------------------------------------------------------
' <auto-generated>
'     This code was generated by a tool.
'     Runtime Version:4.0.30319.18444
'
'     Changes to this file may cause incorrect behavior and will be lost if
'     the code is regenerated.
' </auto-generated>
'------------------------------------------------------------------------------

Option Strict Off
Option Explicit On

Imports System
Imports System.ComponentModel
Imports System.Diagnostics
Imports System.Web.Services
Imports System.Web.Services.Protocols
Imports System.Xml.Serialization

'
'This source code was auto-generated by Microsoft.VSDesigner, Version 4.0.30319.18444.
'
Namespace wsConfigGerais
    
    '''<remarks/>
    <System.CodeDom.Compiler.GeneratedCodeAttribute("System.Web.Services", "4.0.30319.18408"),  _
     System.Diagnostics.DebuggerStepThroughAttribute(),  _
     System.ComponentModel.DesignerCategoryAttribute("code"),  _
     System.Web.Services.WebServiceBindingAttribute(Name:="wsConfigGeraisSoap", [Namespace]:="http://tempuri.org/PortalUAU_WS/wsConfigGerais")>  _
    Partial Public Class wsConfigGerais
        Inherits System.Web.Services.Protocols.SoapHttpClientProtocol
        
        Private RetornarVersaoBDOperationCompleted As System.Threading.SendOrPostCallback
        
        Private RetornarVersaoWSOperationCompleted As System.Threading.SendOrPostCallback
        
        Private InformacoesServidorOperationCompleted As System.Threading.SendOrPostCallback
        
        Private RetornarConfiguracaoEmpresaOperationCompleted As System.Threading.SendOrPostCallback
        
        Private RetornarConfiguracoesGeraisOperationCompleted As System.Threading.SendOrPostCallback
        
        Private ObterConfiguracaoDeCasasDecimaisOperationCompleted As System.Threading.SendOrPostCallback
        
        Private GravarTentativasLogonOperationCompleted As System.Threading.SendOrPostCallback
        
        Private useDefaultCredentialsSetExplicitly As Boolean
        
        '''<remarks/>
        Public Sub New()
            MyBase.New
            Me.Url = Global.UAUMobileWebAPI.My.MySettings.Default.UAUMobileWebAPI_wsConfigGerais_wsConfigGerais
            If (Me.IsLocalFileSystemWebService(Me.Url) = true) Then
                Me.UseDefaultCredentials = true
                Me.useDefaultCredentialsSetExplicitly = false
            Else
                Me.useDefaultCredentialsSetExplicitly = true
            End If
        End Sub
        
        Public Shadows Property Url() As String
            Get
                Return MyBase.Url
            End Get
            Set
                If (((Me.IsLocalFileSystemWebService(MyBase.Url) = true)  _
                            AndAlso (Me.useDefaultCredentialsSetExplicitly = false))  _
                            AndAlso (Me.IsLocalFileSystemWebService(value) = false)) Then
                    MyBase.UseDefaultCredentials = false
                End If
                MyBase.Url = value
            End Set
        End Property
        
        Public Shadows Property UseDefaultCredentials() As Boolean
            Get
                Return MyBase.UseDefaultCredentials
            End Get
            Set
                MyBase.UseDefaultCredentials = value
                Me.useDefaultCredentialsSetExplicitly = true
            End Set
        End Property
        
        '''<remarks/>
        Public Event RetornarVersaoBDCompleted As RetornarVersaoBDCompletedEventHandler
        
        '''<remarks/>
        Public Event RetornarVersaoWSCompleted As RetornarVersaoWSCompletedEventHandler
        
        '''<remarks/>
        Public Event InformacoesServidorCompleted As InformacoesServidorCompletedEventHandler
        
        '''<remarks/>
        Public Event RetornarConfiguracaoEmpresaCompleted As RetornarConfiguracaoEmpresaCompletedEventHandler
        
        '''<remarks/>
        Public Event RetornarConfiguracoesGeraisCompleted As RetornarConfiguracoesGeraisCompletedEventHandler
        
        '''<remarks/>
        Public Event ObterConfiguracaoDeCasasDecimaisCompleted As ObterConfiguracaoDeCasasDecimaisCompletedEventHandler
        
        '''<remarks/>
        Public Event GravarTentativasLogonCompleted As GravarTentativasLogonCompletedEventHandler
        
        '''<remarks/>
        <System.Web.Services.Protocols.SoapDocumentMethodAttribute("http://tempuri.org/PortalUAU_WS/wsConfigGerais/RetornarVersaoBD", RequestNamespace:="http://tempuri.org/PortalUAU_WS/wsConfigGerais", ResponseNamespace:="http://tempuri.org/PortalUAU_WS/wsConfigGerais", Use:=System.Web.Services.Description.SoapBindingUse.Literal, ParameterStyle:=System.Web.Services.Protocols.SoapParameterStyle.Wrapped)>  _
        Public Function RetornarVersaoBD() As String
            Dim results() As Object = Me.Invoke("RetornarVersaoBD", New Object(-1) {})
            Return CType(results(0),String)
        End Function
        
        '''<remarks/>
        Public Overloads Sub RetornarVersaoBDAsync()
            Me.RetornarVersaoBDAsync(Nothing)
        End Sub
        
        '''<remarks/>
        Public Overloads Sub RetornarVersaoBDAsync(ByVal userState As Object)
            If (Me.RetornarVersaoBDOperationCompleted Is Nothing) Then
                Me.RetornarVersaoBDOperationCompleted = AddressOf Me.OnRetornarVersaoBDOperationCompleted
            End If
            Me.InvokeAsync("RetornarVersaoBD", New Object(-1) {}, Me.RetornarVersaoBDOperationCompleted, userState)
        End Sub
        
        Private Sub OnRetornarVersaoBDOperationCompleted(ByVal arg As Object)
            If (Not (Me.RetornarVersaoBDCompletedEvent) Is Nothing) Then
                Dim invokeArgs As System.Web.Services.Protocols.InvokeCompletedEventArgs = CType(arg,System.Web.Services.Protocols.InvokeCompletedEventArgs)
                RaiseEvent RetornarVersaoBDCompleted(Me, New RetornarVersaoBDCompletedEventArgs(invokeArgs.Results, invokeArgs.Error, invokeArgs.Cancelled, invokeArgs.UserState))
            End If
        End Sub
        
        '''<remarks/>
        <System.Web.Services.Protocols.SoapDocumentMethodAttribute("http://tempuri.org/PortalUAU_WS/wsConfigGerais/RetornarVersaoWS", RequestNamespace:="http://tempuri.org/PortalUAU_WS/wsConfigGerais", ResponseNamespace:="http://tempuri.org/PortalUAU_WS/wsConfigGerais", Use:=System.Web.Services.Description.SoapBindingUse.Literal, ParameterStyle:=System.Web.Services.Protocols.SoapParameterStyle.Wrapped)>  _
        Public Function RetornarVersaoWS() As String
            Dim results() As Object = Me.Invoke("RetornarVersaoWS", New Object(-1) {})
            Return CType(results(0),String)
        End Function
        
        '''<remarks/>
        Public Overloads Sub RetornarVersaoWSAsync()
            Me.RetornarVersaoWSAsync(Nothing)
        End Sub
        
        '''<remarks/>
        Public Overloads Sub RetornarVersaoWSAsync(ByVal userState As Object)
            If (Me.RetornarVersaoWSOperationCompleted Is Nothing) Then
                Me.RetornarVersaoWSOperationCompleted = AddressOf Me.OnRetornarVersaoWSOperationCompleted
            End If
            Me.InvokeAsync("RetornarVersaoWS", New Object(-1) {}, Me.RetornarVersaoWSOperationCompleted, userState)
        End Sub
        
        Private Sub OnRetornarVersaoWSOperationCompleted(ByVal arg As Object)
            If (Not (Me.RetornarVersaoWSCompletedEvent) Is Nothing) Then
                Dim invokeArgs As System.Web.Services.Protocols.InvokeCompletedEventArgs = CType(arg,System.Web.Services.Protocols.InvokeCompletedEventArgs)
                RaiseEvent RetornarVersaoWSCompleted(Me, New RetornarVersaoWSCompletedEventArgs(invokeArgs.Results, invokeArgs.Error, invokeArgs.Cancelled, invokeArgs.UserState))
            End If
        End Sub
        
        '''<remarks/>
        <System.Web.Services.Protocols.SoapDocumentMethodAttribute("http://tempuri.org/PortalUAU_WS/wsConfigGerais/InformacoesServidor", RequestNamespace:="http://tempuri.org/PortalUAU_WS/wsConfigGerais", ResponseNamespace:="http://tempuri.org/PortalUAU_WS/wsConfigGerais", Use:=System.Web.Services.Description.SoapBindingUse.Literal, ParameterStyle:=System.Web.Services.Protocols.SoapParameterStyle.Wrapped)>  _
        Public Function InformacoesServidor() As String()
            Dim results() As Object = Me.Invoke("InformacoesServidor", New Object(-1) {})
            Return CType(results(0),String())
        End Function
        
        '''<remarks/>
        Public Overloads Sub InformacoesServidorAsync()
            Me.InformacoesServidorAsync(Nothing)
        End Sub
        
        '''<remarks/>
        Public Overloads Sub InformacoesServidorAsync(ByVal userState As Object)
            If (Me.InformacoesServidorOperationCompleted Is Nothing) Then
                Me.InformacoesServidorOperationCompleted = AddressOf Me.OnInformacoesServidorOperationCompleted
            End If
            Me.InvokeAsync("InformacoesServidor", New Object(-1) {}, Me.InformacoesServidorOperationCompleted, userState)
        End Sub
        
        Private Sub OnInformacoesServidorOperationCompleted(ByVal arg As Object)
            If (Not (Me.InformacoesServidorCompletedEvent) Is Nothing) Then
                Dim invokeArgs As System.Web.Services.Protocols.InvokeCompletedEventArgs = CType(arg,System.Web.Services.Protocols.InvokeCompletedEventArgs)
                RaiseEvent InformacoesServidorCompleted(Me, New InformacoesServidorCompletedEventArgs(invokeArgs.Results, invokeArgs.Error, invokeArgs.Cancelled, invokeArgs.UserState))
            End If
        End Sub
        
        '''<remarks/>
        <System.Web.Services.Protocols.SoapDocumentMethodAttribute("http://tempuri.org/PortalUAU_WS/wsConfigGerais/RetornarConfiguracaoEmpresa", RequestNamespace:="http://tempuri.org/PortalUAU_WS/wsConfigGerais", ResponseNamespace:="http://tempuri.org/PortalUAU_WS/wsConfigGerais", Use:=System.Web.Services.Description.SoapBindingUse.Literal, ParameterStyle:=System.Web.Services.Protocols.SoapParameterStyle.Wrapped)>  _
        Public Function RetornarConfiguracaoEmpresa(ByVal intEmpresa As Integer, ByVal strConfiguracao As String) As String
            Dim results() As Object = Me.Invoke("RetornarConfiguracaoEmpresa", New Object() {intEmpresa, strConfiguracao})
            Return CType(results(0),String)
        End Function
        
        '''<remarks/>
        Public Overloads Sub RetornarConfiguracaoEmpresaAsync(ByVal intEmpresa As Integer, ByVal strConfiguracao As String)
            Me.RetornarConfiguracaoEmpresaAsync(intEmpresa, strConfiguracao, Nothing)
        End Sub
        
        '''<remarks/>
        Public Overloads Sub RetornarConfiguracaoEmpresaAsync(ByVal intEmpresa As Integer, ByVal strConfiguracao As String, ByVal userState As Object)
            If (Me.RetornarConfiguracaoEmpresaOperationCompleted Is Nothing) Then
                Me.RetornarConfiguracaoEmpresaOperationCompleted = AddressOf Me.OnRetornarConfiguracaoEmpresaOperationCompleted
            End If
            Me.InvokeAsync("RetornarConfiguracaoEmpresa", New Object() {intEmpresa, strConfiguracao}, Me.RetornarConfiguracaoEmpresaOperationCompleted, userState)
        End Sub
        
        Private Sub OnRetornarConfiguracaoEmpresaOperationCompleted(ByVal arg As Object)
            If (Not (Me.RetornarConfiguracaoEmpresaCompletedEvent) Is Nothing) Then
                Dim invokeArgs As System.Web.Services.Protocols.InvokeCompletedEventArgs = CType(arg,System.Web.Services.Protocols.InvokeCompletedEventArgs)
                RaiseEvent RetornarConfiguracaoEmpresaCompleted(Me, New RetornarConfiguracaoEmpresaCompletedEventArgs(invokeArgs.Results, invokeArgs.Error, invokeArgs.Cancelled, invokeArgs.UserState))
            End If
        End Sub
        
        '''<remarks/>
        <System.Web.Services.Protocols.SoapDocumentMethodAttribute("http://tempuri.org/PortalUAU_WS/wsConfigGerais/RetornarConfiguracoesGerais", RequestNamespace:="http://tempuri.org/PortalUAU_WS/wsConfigGerais", ResponseNamespace:="http://tempuri.org/PortalUAU_WS/wsConfigGerais", Use:=System.Web.Services.Description.SoapBindingUse.Literal, ParameterStyle:=System.Web.Services.Protocols.SoapParameterStyle.Wrapped)>  _
        Public Function RetornarConfiguracoesGerais(ByVal strItem As String, ByVal strConfiguracao As String) As String
            Dim results() As Object = Me.Invoke("RetornarConfiguracoesGerais", New Object() {strItem, strConfiguracao})
            Return CType(results(0),String)
        End Function
        
        '''<remarks/>
        Public Overloads Sub RetornarConfiguracoesGeraisAsync(ByVal strItem As String, ByVal strConfiguracao As String)
            Me.RetornarConfiguracoesGeraisAsync(strItem, strConfiguracao, Nothing)
        End Sub
        
        '''<remarks/>
        Public Overloads Sub RetornarConfiguracoesGeraisAsync(ByVal strItem As String, ByVal strConfiguracao As String, ByVal userState As Object)
            If (Me.RetornarConfiguracoesGeraisOperationCompleted Is Nothing) Then
                Me.RetornarConfiguracoesGeraisOperationCompleted = AddressOf Me.OnRetornarConfiguracoesGeraisOperationCompleted
            End If
            Me.InvokeAsync("RetornarConfiguracoesGerais", New Object() {strItem, strConfiguracao}, Me.RetornarConfiguracoesGeraisOperationCompleted, userState)
        End Sub
        
        Private Sub OnRetornarConfiguracoesGeraisOperationCompleted(ByVal arg As Object)
            If (Not (Me.RetornarConfiguracoesGeraisCompletedEvent) Is Nothing) Then
                Dim invokeArgs As System.Web.Services.Protocols.InvokeCompletedEventArgs = CType(arg,System.Web.Services.Protocols.InvokeCompletedEventArgs)
                RaiseEvent RetornarConfiguracoesGeraisCompleted(Me, New RetornarConfiguracoesGeraisCompletedEventArgs(invokeArgs.Results, invokeArgs.Error, invokeArgs.Cancelled, invokeArgs.UserState))
            End If
        End Sub
        
        '''<remarks/>
        <System.Web.Services.Protocols.SoapDocumentMethodAttribute("http://tempuri.org/PortalUAU_WS/wsConfigGerais/ObterConfiguracaoDeCasasDecimais", RequestNamespace:="http://tempuri.org/PortalUAU_WS/wsConfigGerais", ResponseNamespace:="http://tempuri.org/PortalUAU_WS/wsConfigGerais", Use:=System.Web.Services.Description.SoapBindingUse.Literal, ParameterStyle:=System.Web.Services.Protocols.SoapParameterStyle.Wrapped)>  _
        Public Function ObterConfiguracaoDeCasasDecimais() As CasaDecimal
            Dim results() As Object = Me.Invoke("ObterConfiguracaoDeCasasDecimais", New Object(-1) {})
            Return CType(results(0),CasaDecimal)
        End Function
        
        '''<remarks/>
        Public Overloads Sub ObterConfiguracaoDeCasasDecimaisAsync()
            Me.ObterConfiguracaoDeCasasDecimaisAsync(Nothing)
        End Sub
        
        '''<remarks/>
        Public Overloads Sub ObterConfiguracaoDeCasasDecimaisAsync(ByVal userState As Object)
            If (Me.ObterConfiguracaoDeCasasDecimaisOperationCompleted Is Nothing) Then
                Me.ObterConfiguracaoDeCasasDecimaisOperationCompleted = AddressOf Me.OnObterConfiguracaoDeCasasDecimaisOperationCompleted
            End If
            Me.InvokeAsync("ObterConfiguracaoDeCasasDecimais", New Object(-1) {}, Me.ObterConfiguracaoDeCasasDecimaisOperationCompleted, userState)
        End Sub
        
        Private Sub OnObterConfiguracaoDeCasasDecimaisOperationCompleted(ByVal arg As Object)
            If (Not (Me.ObterConfiguracaoDeCasasDecimaisCompletedEvent) Is Nothing) Then
                Dim invokeArgs As System.Web.Services.Protocols.InvokeCompletedEventArgs = CType(arg,System.Web.Services.Protocols.InvokeCompletedEventArgs)
                RaiseEvent ObterConfiguracaoDeCasasDecimaisCompleted(Me, New ObterConfiguracaoDeCasasDecimaisCompletedEventArgs(invokeArgs.Results, invokeArgs.Error, invokeArgs.Cancelled, invokeArgs.UserState))
            End If
        End Sub
        
        '''<remarks/>
        <System.Web.Services.Protocols.SoapDocumentMethodAttribute("http://tempuri.org/PortalUAU_WS/wsConfigGerais/GravarTentativasLogon", RequestNamespace:="http://tempuri.org/PortalUAU_WS/wsConfigGerais", ResponseNamespace:="http://tempuri.org/PortalUAU_WS/wsConfigGerais", Use:=System.Web.Services.Description.SoapBindingUse.Literal, ParameterStyle:=System.Web.Services.Protocols.SoapParameterStyle.Wrapped)>  _
        Public Sub GravarTentativasLogon(ByVal strUsuario As String, ByVal bytNumTentativas As Byte)
            Me.Invoke("GravarTentativasLogon", New Object() {strUsuario, bytNumTentativas})
        End Sub
        
        '''<remarks/>
        Public Overloads Sub GravarTentativasLogonAsync(ByVal strUsuario As String, ByVal bytNumTentativas As Byte)
            Me.GravarTentativasLogonAsync(strUsuario, bytNumTentativas, Nothing)
        End Sub
        
        '''<remarks/>
        Public Overloads Sub GravarTentativasLogonAsync(ByVal strUsuario As String, ByVal bytNumTentativas As Byte, ByVal userState As Object)
            If (Me.GravarTentativasLogonOperationCompleted Is Nothing) Then
                Me.GravarTentativasLogonOperationCompleted = AddressOf Me.OnGravarTentativasLogonOperationCompleted
            End If
            Me.InvokeAsync("GravarTentativasLogon", New Object() {strUsuario, bytNumTentativas}, Me.GravarTentativasLogonOperationCompleted, userState)
        End Sub
        
        Private Sub OnGravarTentativasLogonOperationCompleted(ByVal arg As Object)
            If (Not (Me.GravarTentativasLogonCompletedEvent) Is Nothing) Then
                Dim invokeArgs As System.Web.Services.Protocols.InvokeCompletedEventArgs = CType(arg,System.Web.Services.Protocols.InvokeCompletedEventArgs)
                RaiseEvent GravarTentativasLogonCompleted(Me, New System.ComponentModel.AsyncCompletedEventArgs(invokeArgs.Error, invokeArgs.Cancelled, invokeArgs.UserState))
            End If
        End Sub
        
        '''<remarks/>
        Public Shadows Sub CancelAsync(ByVal userState As Object)
            MyBase.CancelAsync(userState)
        End Sub
        
        Private Function IsLocalFileSystemWebService(ByVal url As String) As Boolean
            If ((url Is Nothing)  _
                        OrElse (url Is String.Empty)) Then
                Return false
            End If
            Dim wsUri As System.Uri = New System.Uri(url)
            If ((wsUri.Port >= 1024)  _
                        AndAlso (String.Compare(wsUri.Host, "localHost", System.StringComparison.OrdinalIgnoreCase) = 0)) Then
                Return true
            End If
            Return false
        End Function
    End Class
    
    '''<remarks/>
    <System.CodeDom.Compiler.GeneratedCodeAttribute("System.Xml", "4.0.30319.34234"),  _
     System.SerializableAttribute(),  _
     System.Diagnostics.DebuggerStepThroughAttribute(),  _
     System.ComponentModel.DesignerCategoryAttribute("code"),  _
     System.Xml.Serialization.XmlTypeAttribute([Namespace]:="http://tempuri.org/PortalUAU_WS/wsConfigGerais")>  _
    Partial Public Class CasaDecimal
        
        Private qtdeField As Byte
        
        Private precoField As Byte
        
        Private totalField As Byte
        
        Private mensagemField As String
        
        '''<remarks/>
        Public Property Qtde() As Byte
            Get
                Return Me.qtdeField
            End Get
            Set
                Me.qtdeField = value
            End Set
        End Property
        
        '''<remarks/>
        Public Property Preco() As Byte
            Get
                Return Me.precoField
            End Get
            Set
                Me.precoField = value
            End Set
        End Property
        
        '''<remarks/>
        Public Property Total() As Byte
            Get
                Return Me.totalField
            End Get
            Set
                Me.totalField = value
            End Set
        End Property
        
        '''<remarks/>
        Public Property Mensagem() As String
            Get
                Return Me.mensagemField
            End Get
            Set
                Me.mensagemField = value
            End Set
        End Property
    End Class
    
    '''<remarks/>
    <System.CodeDom.Compiler.GeneratedCodeAttribute("System.Web.Services", "4.0.30319.18408")>  _
    Public Delegate Sub RetornarVersaoBDCompletedEventHandler(ByVal sender As Object, ByVal e As RetornarVersaoBDCompletedEventArgs)
    
    '''<remarks/>
    <System.CodeDom.Compiler.GeneratedCodeAttribute("System.Web.Services", "4.0.30319.18408"),  _
     System.Diagnostics.DebuggerStepThroughAttribute(),  _
     System.ComponentModel.DesignerCategoryAttribute("code")>  _
    Partial Public Class RetornarVersaoBDCompletedEventArgs
        Inherits System.ComponentModel.AsyncCompletedEventArgs
        
        Private results() As Object
        
        Friend Sub New(ByVal results() As Object, ByVal exception As System.Exception, ByVal cancelled As Boolean, ByVal userState As Object)
            MyBase.New(exception, cancelled, userState)
            Me.results = results
        End Sub
        
        '''<remarks/>
        Public ReadOnly Property Result() As String
            Get
                Me.RaiseExceptionIfNecessary
                Return CType(Me.results(0),String)
            End Get
        End Property
    End Class
    
    '''<remarks/>
    <System.CodeDom.Compiler.GeneratedCodeAttribute("System.Web.Services", "4.0.30319.18408")>  _
    Public Delegate Sub RetornarVersaoWSCompletedEventHandler(ByVal sender As Object, ByVal e As RetornarVersaoWSCompletedEventArgs)
    
    '''<remarks/>
    <System.CodeDom.Compiler.GeneratedCodeAttribute("System.Web.Services", "4.0.30319.18408"),  _
     System.Diagnostics.DebuggerStepThroughAttribute(),  _
     System.ComponentModel.DesignerCategoryAttribute("code")>  _
    Partial Public Class RetornarVersaoWSCompletedEventArgs
        Inherits System.ComponentModel.AsyncCompletedEventArgs
        
        Private results() As Object
        
        Friend Sub New(ByVal results() As Object, ByVal exception As System.Exception, ByVal cancelled As Boolean, ByVal userState As Object)
            MyBase.New(exception, cancelled, userState)
            Me.results = results
        End Sub
        
        '''<remarks/>
        Public ReadOnly Property Result() As String
            Get
                Me.RaiseExceptionIfNecessary
                Return CType(Me.results(0),String)
            End Get
        End Property
    End Class
    
    '''<remarks/>
    <System.CodeDom.Compiler.GeneratedCodeAttribute("System.Web.Services", "4.0.30319.18408")>  _
    Public Delegate Sub InformacoesServidorCompletedEventHandler(ByVal sender As Object, ByVal e As InformacoesServidorCompletedEventArgs)
    
    '''<remarks/>
    <System.CodeDom.Compiler.GeneratedCodeAttribute("System.Web.Services", "4.0.30319.18408"),  _
     System.Diagnostics.DebuggerStepThroughAttribute(),  _
     System.ComponentModel.DesignerCategoryAttribute("code")>  _
    Partial Public Class InformacoesServidorCompletedEventArgs
        Inherits System.ComponentModel.AsyncCompletedEventArgs
        
        Private results() As Object
        
        Friend Sub New(ByVal results() As Object, ByVal exception As System.Exception, ByVal cancelled As Boolean, ByVal userState As Object)
            MyBase.New(exception, cancelled, userState)
            Me.results = results
        End Sub
        
        '''<remarks/>
        Public ReadOnly Property Result() As String()
            Get
                Me.RaiseExceptionIfNecessary
                Return CType(Me.results(0),String())
            End Get
        End Property
    End Class
    
    '''<remarks/>
    <System.CodeDom.Compiler.GeneratedCodeAttribute("System.Web.Services", "4.0.30319.18408")>  _
    Public Delegate Sub RetornarConfiguracaoEmpresaCompletedEventHandler(ByVal sender As Object, ByVal e As RetornarConfiguracaoEmpresaCompletedEventArgs)
    
    '''<remarks/>
    <System.CodeDom.Compiler.GeneratedCodeAttribute("System.Web.Services", "4.0.30319.18408"),  _
     System.Diagnostics.DebuggerStepThroughAttribute(),  _
     System.ComponentModel.DesignerCategoryAttribute("code")>  _
    Partial Public Class RetornarConfiguracaoEmpresaCompletedEventArgs
        Inherits System.ComponentModel.AsyncCompletedEventArgs
        
        Private results() As Object
        
        Friend Sub New(ByVal results() As Object, ByVal exception As System.Exception, ByVal cancelled As Boolean, ByVal userState As Object)
            MyBase.New(exception, cancelled, userState)
            Me.results = results
        End Sub
        
        '''<remarks/>
        Public ReadOnly Property Result() As String
            Get
                Me.RaiseExceptionIfNecessary
                Return CType(Me.results(0),String)
            End Get
        End Property
    End Class
    
    '''<remarks/>
    <System.CodeDom.Compiler.GeneratedCodeAttribute("System.Web.Services", "4.0.30319.18408")>  _
    Public Delegate Sub RetornarConfiguracoesGeraisCompletedEventHandler(ByVal sender As Object, ByVal e As RetornarConfiguracoesGeraisCompletedEventArgs)
    
    '''<remarks/>
    <System.CodeDom.Compiler.GeneratedCodeAttribute("System.Web.Services", "4.0.30319.18408"),  _
     System.Diagnostics.DebuggerStepThroughAttribute(),  _
     System.ComponentModel.DesignerCategoryAttribute("code")>  _
    Partial Public Class RetornarConfiguracoesGeraisCompletedEventArgs
        Inherits System.ComponentModel.AsyncCompletedEventArgs
        
        Private results() As Object
        
        Friend Sub New(ByVal results() As Object, ByVal exception As System.Exception, ByVal cancelled As Boolean, ByVal userState As Object)
            MyBase.New(exception, cancelled, userState)
            Me.results = results
        End Sub
        
        '''<remarks/>
        Public ReadOnly Property Result() As String
            Get
                Me.RaiseExceptionIfNecessary
                Return CType(Me.results(0),String)
            End Get
        End Property
    End Class
    
    '''<remarks/>
    <System.CodeDom.Compiler.GeneratedCodeAttribute("System.Web.Services", "4.0.30319.18408")>  _
    Public Delegate Sub ObterConfiguracaoDeCasasDecimaisCompletedEventHandler(ByVal sender As Object, ByVal e As ObterConfiguracaoDeCasasDecimaisCompletedEventArgs)
    
    '''<remarks/>
    <System.CodeDom.Compiler.GeneratedCodeAttribute("System.Web.Services", "4.0.30319.18408"),  _
     System.Diagnostics.DebuggerStepThroughAttribute(),  _
     System.ComponentModel.DesignerCategoryAttribute("code")>  _
    Partial Public Class ObterConfiguracaoDeCasasDecimaisCompletedEventArgs
        Inherits System.ComponentModel.AsyncCompletedEventArgs
        
        Private results() As Object
        
        Friend Sub New(ByVal results() As Object, ByVal exception As System.Exception, ByVal cancelled As Boolean, ByVal userState As Object)
            MyBase.New(exception, cancelled, userState)
            Me.results = results
        End Sub
        
        '''<remarks/>
        Public ReadOnly Property Result() As CasaDecimal
            Get
                Me.RaiseExceptionIfNecessary
                Return CType(Me.results(0),CasaDecimal)
            End Get
        End Property
    End Class
    
    '''<remarks/>
    <System.CodeDom.Compiler.GeneratedCodeAttribute("System.Web.Services", "4.0.30319.18408")>  _
    Public Delegate Sub GravarTentativasLogonCompletedEventHandler(ByVal sender As Object, ByVal e As System.ComponentModel.AsyncCompletedEventArgs)
End Namespace

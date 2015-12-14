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
Imports System.Data
Imports System.Diagnostics
Imports System.Web.Services
Imports System.Web.Services.Protocols
Imports System.Xml.Serialization

'
'This source code was auto-generated by Microsoft.VSDesigner, Version 4.0.30319.18444.
'
Namespace wsNovidadeReference
    
    '''<remarks/>
    <System.CodeDom.Compiler.GeneratedCodeAttribute("System.Web.Services", "4.0.30319.18408"),  _
     System.Diagnostics.DebuggerStepThroughAttribute(),  _
     System.ComponentModel.DesignerCategoryAttribute("code"),  _
     System.Web.Services.WebServiceBindingAttribute(Name:="wsNovidadeSoap", [Namespace]:="http://tempuri.org/SuporteNet_Site/wsNovidade")>  _
    Partial Public Class wsNovidade
        Inherits System.Web.Services.Protocols.SoapHttpClientProtocol
        
        Private ConsultarNovidadePorModuloVersaoOperationCompleted As System.Threading.SendOrPostCallback
        
        Private ConsultarNovidadeCriticaPorModuloVersaoOperationCompleted As System.Threading.SendOrPostCallback
        
        Private useDefaultCredentialsSetExplicitly As Boolean
        
        '''<remarks/>
        Public Sub New()
            MyBase.New
            Me.Url = Global.UAUMobileWebAPI.My.MySettings.Default.UAUMobileWebAPI_wsNovidadeReference_wsNovidade
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
        Public Event ConsultarNovidadePorModuloVersaoCompleted As ConsultarNovidadePorModuloVersaoCompletedEventHandler
        
        '''<remarks/>
        Public Event ConsultarNovidadeCriticaPorModuloVersaoCompleted As ConsultarNovidadeCriticaPorModuloVersaoCompletedEventHandler
        
        '''<remarks/>
        <System.Web.Services.Protocols.SoapDocumentMethodAttribute("http://tempuri.org/SuporteNet_Site/wsNovidade/ConsultarNovidadePorModuloVersao", RequestNamespace:="http://tempuri.org/SuporteNet_Site/wsNovidade", ResponseNamespace:="http://tempuri.org/SuporteNet_Site/wsNovidade", Use:=System.Web.Services.Description.SoapBindingUse.Literal, ParameterStyle:=System.Web.Services.Protocols.SoapParameterStyle.Wrapped)>  _
        Public Function ConsultarNovidadePorModuloVersao(ByVal NumModulo As Integer, ByVal NumVersao As String) As System.Data.DataSet
            Dim results() As Object = Me.Invoke("ConsultarNovidadePorModuloVersao", New Object() {NumModulo, NumVersao})
            Return CType(results(0),System.Data.DataSet)
        End Function
        
        '''<remarks/>
        Public Overloads Sub ConsultarNovidadePorModuloVersaoAsync(ByVal NumModulo As Integer, ByVal NumVersao As String)
            Me.ConsultarNovidadePorModuloVersaoAsync(NumModulo, NumVersao, Nothing)
        End Sub
        
        '''<remarks/>
        Public Overloads Sub ConsultarNovidadePorModuloVersaoAsync(ByVal NumModulo As Integer, ByVal NumVersao As String, ByVal userState As Object)
            If (Me.ConsultarNovidadePorModuloVersaoOperationCompleted Is Nothing) Then
                Me.ConsultarNovidadePorModuloVersaoOperationCompleted = AddressOf Me.OnConsultarNovidadePorModuloVersaoOperationCompleted
            End If
            Me.InvokeAsync("ConsultarNovidadePorModuloVersao", New Object() {NumModulo, NumVersao}, Me.ConsultarNovidadePorModuloVersaoOperationCompleted, userState)
        End Sub
        
        Private Sub OnConsultarNovidadePorModuloVersaoOperationCompleted(ByVal arg As Object)
            If (Not (Me.ConsultarNovidadePorModuloVersaoCompletedEvent) Is Nothing) Then
                Dim invokeArgs As System.Web.Services.Protocols.InvokeCompletedEventArgs = CType(arg,System.Web.Services.Protocols.InvokeCompletedEventArgs)
                RaiseEvent ConsultarNovidadePorModuloVersaoCompleted(Me, New ConsultarNovidadePorModuloVersaoCompletedEventArgs(invokeArgs.Results, invokeArgs.Error, invokeArgs.Cancelled, invokeArgs.UserState))
            End If
        End Sub
        
        '''<remarks/>
        <System.Web.Services.Protocols.SoapDocumentMethodAttribute("http://tempuri.org/SuporteNet_Site/wsNovidade/ConsultarNovidadeCriticaPorModuloVe"& _ 
            "rsao", RequestNamespace:="http://tempuri.org/SuporteNet_Site/wsNovidade", ResponseNamespace:="http://tempuri.org/SuporteNet_Site/wsNovidade", Use:=System.Web.Services.Description.SoapBindingUse.Literal, ParameterStyle:=System.Web.Services.Protocols.SoapParameterStyle.Wrapped)>  _
        Public Function ConsultarNovidadeCriticaPorModuloVersao(ByVal NumModulo As Integer, ByVal NumVersao As String) As System.Data.DataSet
            Dim results() As Object = Me.Invoke("ConsultarNovidadeCriticaPorModuloVersao", New Object() {NumModulo, NumVersao})
            Return CType(results(0),System.Data.DataSet)
        End Function
        
        '''<remarks/>
        Public Overloads Sub ConsultarNovidadeCriticaPorModuloVersaoAsync(ByVal NumModulo As Integer, ByVal NumVersao As String)
            Me.ConsultarNovidadeCriticaPorModuloVersaoAsync(NumModulo, NumVersao, Nothing)
        End Sub
        
        '''<remarks/>
        Public Overloads Sub ConsultarNovidadeCriticaPorModuloVersaoAsync(ByVal NumModulo As Integer, ByVal NumVersao As String, ByVal userState As Object)
            If (Me.ConsultarNovidadeCriticaPorModuloVersaoOperationCompleted Is Nothing) Then
                Me.ConsultarNovidadeCriticaPorModuloVersaoOperationCompleted = AddressOf Me.OnConsultarNovidadeCriticaPorModuloVersaoOperationCompleted
            End If
            Me.InvokeAsync("ConsultarNovidadeCriticaPorModuloVersao", New Object() {NumModulo, NumVersao}, Me.ConsultarNovidadeCriticaPorModuloVersaoOperationCompleted, userState)
        End Sub
        
        Private Sub OnConsultarNovidadeCriticaPorModuloVersaoOperationCompleted(ByVal arg As Object)
            If (Not (Me.ConsultarNovidadeCriticaPorModuloVersaoCompletedEvent) Is Nothing) Then
                Dim invokeArgs As System.Web.Services.Protocols.InvokeCompletedEventArgs = CType(arg,System.Web.Services.Protocols.InvokeCompletedEventArgs)
                RaiseEvent ConsultarNovidadeCriticaPorModuloVersaoCompleted(Me, New ConsultarNovidadeCriticaPorModuloVersaoCompletedEventArgs(invokeArgs.Results, invokeArgs.Error, invokeArgs.Cancelled, invokeArgs.UserState))
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
    <System.CodeDom.Compiler.GeneratedCodeAttribute("System.Web.Services", "4.0.30319.18408")>  _
    Public Delegate Sub ConsultarNovidadePorModuloVersaoCompletedEventHandler(ByVal sender As Object, ByVal e As ConsultarNovidadePorModuloVersaoCompletedEventArgs)
    
    '''<remarks/>
    <System.CodeDom.Compiler.GeneratedCodeAttribute("System.Web.Services", "4.0.30319.18408"),  _
     System.Diagnostics.DebuggerStepThroughAttribute(),  _
     System.ComponentModel.DesignerCategoryAttribute("code")>  _
    Partial Public Class ConsultarNovidadePorModuloVersaoCompletedEventArgs
        Inherits System.ComponentModel.AsyncCompletedEventArgs
        
        Private results() As Object
        
        Friend Sub New(ByVal results() As Object, ByVal exception As System.Exception, ByVal cancelled As Boolean, ByVal userState As Object)
            MyBase.New(exception, cancelled, userState)
            Me.results = results
        End Sub
        
        '''<remarks/>
        Public ReadOnly Property Result() As System.Data.DataSet
            Get
                Me.RaiseExceptionIfNecessary
                Return CType(Me.results(0),System.Data.DataSet)
            End Get
        End Property
    End Class
    
    '''<remarks/>
    <System.CodeDom.Compiler.GeneratedCodeAttribute("System.Web.Services", "4.0.30319.18408")>  _
    Public Delegate Sub ConsultarNovidadeCriticaPorModuloVersaoCompletedEventHandler(ByVal sender As Object, ByVal e As ConsultarNovidadeCriticaPorModuloVersaoCompletedEventArgs)
    
    '''<remarks/>
    <System.CodeDom.Compiler.GeneratedCodeAttribute("System.Web.Services", "4.0.30319.18408"),  _
     System.Diagnostics.DebuggerStepThroughAttribute(),  _
     System.ComponentModel.DesignerCategoryAttribute("code")>  _
    Partial Public Class ConsultarNovidadeCriticaPorModuloVersaoCompletedEventArgs
        Inherits System.ComponentModel.AsyncCompletedEventArgs
        
        Private results() As Object
        
        Friend Sub New(ByVal results() As Object, ByVal exception As System.Exception, ByVal cancelled As Boolean, ByVal userState As Object)
            MyBase.New(exception, cancelled, userState)
            Me.results = results
        End Sub
        
        '''<remarks/>
        Public ReadOnly Property Result() As System.Data.DataSet
            Get
                Me.RaiseExceptionIfNecessary
                Return CType(Me.results(0),System.Data.DataSet)
            End Get
        End Property
    End Class
End Namespace

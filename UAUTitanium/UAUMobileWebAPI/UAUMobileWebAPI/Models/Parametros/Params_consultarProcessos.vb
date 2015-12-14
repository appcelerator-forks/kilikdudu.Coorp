Namespace Parametros.ProcessoPagamento
    ''' <summary>
    ''' Representa os parâmetros para invocar o método consultarProcessos. Deve ser usado para automatizar os parâmetros obrigatórios da arquitetura.
    ''' </summary>
    ''' <remarks>
    ''' Criação    : Carlos Eduardo Santos Alves Domingos        Data: 06/03/2015
    ''' Projeto    : 180419
    ''' </remarks>
    Public Class Params_consultarProcessos
        Inherits ParametrosObrigatorios
        Public Property usuario As String 'Login do usuário.
        Public Property limit As Integer
        Public Property busca As String
        Public Property cursor As Integer
        Public Property keyOrdena As String
        Public Property ModoOrdenacao As String
    End Class
End Namespace


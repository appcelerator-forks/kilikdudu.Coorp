Namespace Parametros.Validador
    ''' <summary>
    ''' Representa os parâmetros para invocar o método BuscaTokenEmpresa.
    ''' </summary>
    ''' <remarks>
    ''' Criação    : Carlos Eduardo Santos Alves Domingos        Data: 18/05/2015
    ''' Projeto    : 187463
    ''' </remarks>
    Public Class Params_BuscaTokenEmpresa
        'Login do usuário no uau web.
        Public Property usuario As String
        'Senha do usuário no uau web.
        Public Property senha As String
        'Código da empresa.
        Public Property codEmpresa As Integer
    End Class
End Namespace


Namespace Parametros.Validador
    ''' <summary>
    ''' Representa os parâmetros para invocar o método ValidaUsuario. Deve ser usado para automatizar os parâmetros obrigatórios da arquitetura.
    ''' </summary>
    ''' <remarks>
    ''' Criação    : Carlos Eduardo Santos Alves Domingos        Data: 28/01/2015
    ''' Projeto    : 176562
    ''' </remarks>
    Public Class Params_ValidaUsuario
        Inherits ParametrosObrigatorios
        'Login do usuário no uau web.
        Public Property usuario As String
        'Senha do usuário no uau web.
        Public Property senha As String
        'Código da empresa do usuário
        Public Property CodEmpresa As Integer
    End Class
End Namespace
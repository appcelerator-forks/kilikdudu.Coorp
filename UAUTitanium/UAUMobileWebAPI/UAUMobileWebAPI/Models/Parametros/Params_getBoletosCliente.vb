Namespace Parametros.Boleto
    ''' <summary>
    ''' Representa os parâmetros para invocar o método getBoletosCliente. Deve ser usado para automatizar os parâmetros obrigatórios da arquitetura.
    ''' </summary>
    ''' <remarks>
    ''' Criação    : Carlos Eduardo Santos Alves Domingos        Data: 28/01/2015
    ''' Projeto    : 176562
    ''' 
    ''' Alteração : Carlos Eduardo Santos Alves Domingos         Data: 08/05/2015
    ''' Projeto   : 186931 - Projeto
    ''' Manutenção: Adicionada as propriedades responsáveis pela paginação.
    ''' </remarks>
    Public Class Params_getBoletosCliente
        Inherits ParametrosObrigatorios
        'Código da pessoa.
        Public Property codUsuario As Integer
        'Login do usuário no uau web.
        Public Property usuario As String
        'Limite de registros por página.
        Public Property limit As Integer
        'Texto utilizado na busca.
        Public Property busca As String
        'Aponta para o último registro da lista.
        Public Property cursor As Integer
        'Token da empresa.
        Public Property token As String
    End Class
End Namespace

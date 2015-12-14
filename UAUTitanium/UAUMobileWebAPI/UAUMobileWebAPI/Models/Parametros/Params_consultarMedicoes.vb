Namespace Parametros.Medicao
    ''' <summary>
    ''' Representa os parâmetros para invocar o método consultarMedicoes. Deve ser usado para automatizar os parâmetros obrigatórios da arquitetura.
    ''' </summary>
    ''' <remarks>
    ''' Criação    : Carlos Eduardo Santos Alves Domingos        Data: 13/05/2015
    ''' Projeto    : 185753 - Projeto
    ''' </remarks>
    Public Class Params_consultarMedicoes
        Inherits ParametrosObrigatorios
        Public Property usuario As String 'Login do usuário.
        Public Property limit As Integer 'Limite de registros por página.
        Public Property busca As String 'Texto a ser encontrado na busca.
        Public Property cursor As Integer 'Último registro da lista.
    End Class
End Namespace

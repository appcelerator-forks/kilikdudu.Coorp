Namespace Parametros.Configuracao
    ''' <summary>
    ''' Parâmetros de log de erro.
    ''' </summary>
    ''' <remarks>
    ''' Criação    : Carlos Eduardo Santos Alves Domingos        Data: 28/01/2015
    ''' Projeto    : 176562
    ''' </remarks>
    Public Class Params_gravaLogErro
        Inherits ParametrosObrigatorios
        'Descricao do erro.
        Public Property descricao As String
        'Arquivo que originou o erro.
        Public Property classe As String
        'Método que originou o erro.
        Public Property metodo As String
        'Sistema operacional do aparelho.
        Public Property os As String
        'Nome do aplicativo
        Public Property aplicativo As String
        'Versão do aplicativo
        Public Property versao As String
        'Descrição da atividade do usuário
        Public Property atividade As String
    End Class
End Namespace
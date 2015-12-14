Namespace Parametros.Configuracao
    ''' <summary>
    ''' Parâmetros para verificar a versão.
    ''' </summary>
    ''' <remarks>
    ''' Criação    : Carlos Eduardo Santos Alves Domingos        Data: 28/01/2015
    ''' Projeto    : 176562
    ''' 
    ''' Alteração : Carlos Eduardo Santos Alves Domingos         Data: 08/05/2015
    ''' Projeto   : 188115 - SU
    ''' Manutenção: Alterado para herdar os parametros obrigatórios.
    ''' 
    ''' </remarks>
    Public Class Params_verificaVersao
        Inherits ParametrosObrigatorios
        'versão do aplicativo.
        Public Property versao As String
    End Class
End Namespace
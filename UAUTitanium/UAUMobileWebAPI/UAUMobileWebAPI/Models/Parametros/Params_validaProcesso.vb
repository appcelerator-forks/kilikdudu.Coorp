Namespace Parametros.ProcessoPagamento
    ''' <summary>
    ''' Representa os parâmetros para invocar o método aprovarProcesso. Deve ser usado para automatizar os parâmetros obrigatórios da arquitetura.
    ''' </summary>
    ''' <remarks>
    ''' Criação    : Carlos Eduardo Santos Alves Domingos        Data: 06/03/2015
    ''' Projeto    : 180419
    ''' </remarks>
    Public Class Params_validaProcesso
        Inherits ParametrosObrigatorios
        Public Property codEmpresa As Integer 'Código da empresa.
        Public Property codObra As String 'Código da obra.
        Public Property numeroProcesso As String 'Número do processo.
        Public Property numeroParcela As String 'Número da parcela.
        Public Property tipoProcesso As Integer 'Tipo do processo.
        Public Property loginUsuario As String 'Login do usuário.
        Public Property aprovarProcesso As Integer 'Se vai aprovar o processo.
    End Class
End Namespace
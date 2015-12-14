Namespace Parametros.ProcessoPagamento
    ''' <summary>
    ''' Representa os parâmetros para invocar o método getAprovacaoEmissao. Deve ser usado para automatizar os parâmetros obrigatórios da arquitetura.
    ''' </summary>
    ''' <remarks>
    ''' Criação    : Carlos Eduardo Santos Alves Domingos        Data: 06/03/2015
    ''' Projeto    : 180419
    ''' </remarks>
    Public Class Params_getAprovacaoEmissao
        Inherits ParametrosObrigatorios
        Public Property CodEmpresa As Integer 'Código da empresa.
        Public Property CodObra As String 'Código da obra.
        Public Property NumProcesso As Integer 'Número do processo.
        Public Property NumParcela As Integer 'Número da parcela.
    End Class
End Namespace

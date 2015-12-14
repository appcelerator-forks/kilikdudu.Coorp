Namespace Parametros.ProcessoPagamento
    ''' <summary>
    ''' Representa os parâmetros para invocar o método getItensProcesso. Deve ser usado para automatizar os parâmetros obrigatórios da arquitetura.
    ''' </summary>
    ''' <remarks>
    ''' Criação    : Carlos Eduardo Santos Alves Domingos        Data: 06/03/2015
    ''' Projeto    : 180419
    ''' </remarks>
    Public Class Params_getItensProcesso
        Inherits ParametrosObrigatorios

        Public Property CodEmpresa As Integer 'Código da empresa.
        Public Property CodObra As String 'Código da Obra.
        Public Property Processo As Integer 'Número do processo.
        Public Property Contrato As Integer 'Número do contrato.

    End Class
End Namespace

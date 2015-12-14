Namespace Parametros.Medicao
    ''' <summary>
    ''' Deve ser usado para automatizar os parâmetros obrigatórios da arquitetura.
    ''' </summary>
    ''' <remarks>
    ''' Criação    : Carlos Eduardo Santos Alves Domingos        Data: 13/05/2015
    ''' Projeto    : 185753 - Projeto
    ''' 
    ''' </remarks>
    Public Class Params_infoMedicao
        Inherits ParametrosObrigatorios

        Public Property Empresa As Integer 'Código da empresa
        Public Property Contrato As String 'Código do contrato
        Public Property Medicao As String 'Código da medição
        Public Property Usuario As String 'Login do usuário
        Public Property Obra As String 'Código da obra

    End Class
End Namespace

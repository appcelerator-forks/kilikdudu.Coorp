Namespace Parametros.Medicao
    ''' <summary>
    ''' Deve ser usado para automatizar os parâmetros obrigatórios da arquitetura.
    ''' </summary>
    ''' <remarks>
    ''' Criação    : Carlos Eduardo Santos Alves Domingos        Data: 13/05/2015
    ''' Projeto    : 185753 - Projeto
    ''' 
    ''' </remarks>
    Public Class Params_aprovarMedicaoEmLote
        Inherits ParametrosObrigatorios

        Public Property medicoes As List(Of Params_infoMedicao) 'Lista de contratos

    End Class
End Namespace

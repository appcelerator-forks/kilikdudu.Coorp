''' <summary>
''' Deve ser herdado por todos os modelos que pertencem ao namespace Parametros. Representa os parâmetros obrigatórios.
''' </summary>
''' <remarks>
''' Criação    : Carlos Eduardo Santos Alves Domingos        Data: 28/01/2015
''' Projeto    : 176562
''' </remarks>
Public Class ParametrosObrigatorios
    'Dominio onde está hospedado o webservice.
    Public Property _wsDomain As String
    Public Property _mobEmProducao As Boolean
End Class

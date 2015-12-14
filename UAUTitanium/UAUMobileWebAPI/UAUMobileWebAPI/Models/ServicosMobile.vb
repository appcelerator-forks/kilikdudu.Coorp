Public Class ServicosMobile
    Public Enum Servicos
        MostrarDemonstraPagtCli = 1
        MostrarReimpBoleto = 2
        HabilitarAnexos = 3
        MostrarCadTerrenos = 4
        BoletoAntecipado = 5
        InadimplenteGeraBol = 6
    End Enum

    Public Property ListaServicos As List(Of Integer)
End Class

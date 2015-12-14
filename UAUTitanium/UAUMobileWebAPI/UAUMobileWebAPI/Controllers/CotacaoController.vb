Imports System.Net
Imports System.Web.Http
Imports UAUMobileWebAPI.Util
Imports UAUMobileWebAPI.Models.Cotacao
Imports UAUMobileWebAPI.wsCotacaoReference
Imports UAUMobileWebAPI.wsHistoricoInsumoReference

Namespace Controllers
    Public Class CotacaoController
        Inherits ApiController


        Private Function MontarClausulaWhere(ByVal texto As String, ByVal cursor As Integer, ByVal keyOrdena As String, ByVal modoOrdenacao As String)
            Dim smartFilter As SmartFilterMob = New SmartFilterMob()
            smartFilter.addColuna("NumCotGeral", "S")
            smartFilter.addColuna("NumCotacao", "S")
            smartFilter.addColuna("DescEmpresa", "S")
            smartFilter.addColuna("CodigoEmp", "S")
            smartFilter.addColuna("Descricao", "S")
            smartFilter.addColuna("Tipo", "S")
            Return smartFilter.getClausulaWhere(texto, cursor, keyOrdena, modoOrdenacao)
        End Function


        <HttpPost>
        Public Function getCotacoes(parans As Params_getCotacoes) As List(Of CotacaoGeral)
            Dim lstCotacoesGerais = New List(Of CotacaoGeral)
            Dim ref = New WsCotacao()
            ref.Url = Configuracao.getUrlService("wsCotacao", parans._wsDomain)
            Dim whereClausule As String = MontarClausulaWhere(parans.busca, parans.cursor, "DataCotacao", "ASC")
            Dim res = ref.ConsultaCotacoesMob(parans.usuario, parans.limit, whereClausule).Tables(0).Rows
            For i As Integer = 0 To res.Count - 1

                Dim cotGeral As New CotacaoGeral()
                Dim cot As Cotacao
                cot = MontaCotacao(res, i, True)
                cotGeral.Row = cot.Row

                If cot.CodCotacaoGeral IsNot Nothing Then
                    cotGeral.NumGeral = cot.CodCotacaoGeral
                    cotGeral.Geral = True
                    cotGeral.Cotacoes = BuscaCotacoesPorCotacaoGeral(parans.usuario, CInt(cot.CodCotacaoGeral), ref)
                    lstCotacoesGerais.Add(cotGeral)
                Else
                    cotGeral.NumGeral = cot.CodCotacao
                    cotGeral.Geral = False
                    Dim lstCotacoes As New List(Of Cotacao)
                    lstCotacoes.Add(cot)
                    cotGeral.Cotacoes = lstCotacoes
                    lstCotacoesGerais.Add(cotGeral)
                End If

            Next
            Return lstCotacoesGerais
        End Function

        Private Function MontaCotacao(ByVal cotacao As DataRowCollection, ByVal index As Integer, ByVal geral As Boolean) As Cotacao
            Dim cot = New Cotacao()
            With cot
                If geral Then
                    .Row = Configuracao.retiraDBNull(cotacao(index)("Row"))
                Else
                    .Row = Nothing
                End If
                .CodCotacao = Configuracao.retiraDBNull(cotacao(index)("NumCotacao"))
                .CodCotacaoGeral = Configuracao.retiraDBNull(cotacao(index)("NumCotGeral"))
                .Empresa = Configuracao.retiraDBNull(cotacao(index)("DescEmpresa"))
                .CodEmpresa = Configuracao.retiraDBNull(cotacao(index)("CodigoEmp"))
                .DescricaoCotacao = Configuracao.retiraDBNull(cotacao(index)("Descricao"))
                .Tipo = Configuracao.retiraDBNull(cotacao(index)("Tipo"))
                .CodTipo = Configuracao.retiraDBNull(cotacao(index)("CodTipo"))
            End With
            Return cot
        End Function

        Private Function BuscaCotacoesPorCotacaoGeral(ByVal usuario As String, ByVal cotGeral As Integer, ByRef refWsCotacao As WsCotacao) As List(Of Cotacao)
            Dim lstCotacoes As New List(Of Cotacao)
            Dim cotacoes = refWsCotacao.ConsultaCotacaoPorCotacaoGeral(usuario, cotGeral).Tables(0).Rows
            For i As Integer = 0 To cotacoes.Count - 1
                Dim cot = New Cotacao()
                cot = MontaCotacao(cotacoes, i, False)
                lstCotacoes.Add(cot)
            Next
            Return lstCotacoes
        End Function

        <HttpPost>
        Public Function contaCotacoes(parans As Params_getCotacoes) As Resumo
            Dim resumo = New Resumo
            Dim ref = New WsCotacao()
            ref.Url = Configuracao.getUrlService("wsCotacao", parans._wsDomain)
            Dim res = ref.ContaCotacoesMob(parans.usuario).Tables(0).Rows
            If res.Count > 0 Then
                resumo.Quantidade = res(0)("Quantidade")
            End If
            Return resumo
        End Function

        <HttpPost>
        Public Function getSimulacoes(parans As Params_getSimulacoesCotacao) As List(Of Simulacao)
            Dim lstItens = New List(Of Simulacao)
            Dim ref = New WsCotacao()
            ref.Url = Configuracao.getUrlService("wsCotacao", parans._wsDomain)
            Dim res = ref.ConsultaSimulacoesMob(parans.usuario, parans.codCotacao, parans.seCotacaoGeral, parans.codEmpresa).Tables(0).Rows
            For i As Integer = 0 To res.Count - 1
                Dim item = New Simulacao()
                item.Desconto = Configuracao.retiraDBNull(res(i)("Desconto_Sml"))
                item.DifAliqICMS = Configuracao.retiraDBNull(res(i)("DifAliqICMS"))
                item.NumeroSimulacao = Configuracao.retiraDBNull(res(i)("Numero_Sml"))
                item.Origem = Configuracao.retiraDBNull(res(i)("origem_sml"))
                item.SubTotal = Configuracao.retiraDBNull(res(i)("ValorTot_Sml"))
                item.Total = Configuracao.retiraDBNull(res(i)("Total"))
                item.TotalComDifICMS = Configuracao.retiraDBNull(res(i)("TotComDifICMS"))
                item.ValorTransporte = Configuracao.retiraDBNull(res(i)("ValorTransp"))
                lstItens.Add(item)
            Next
            Return lstItens
        End Function

        <HttpPost>
        Public Function getItensSimulacao(parans As Params_getItensSimulacao) As List(Of ItemSimulacao)
            Dim lstItens = New List(Of ItemSimulacao)
            Dim ref = New WsCotacao()
            ref.Url = Configuracao.getUrlService("wsCotacao", parans._wsDomain)
            Dim res = ref.ConsultaItensSimulacaoMob(parans.NumeroSimulacao, parans.TipoCotacao, parans.codCotacao, parans.seCotacaoGeral, parans.codEmpresa).Tables(0).Rows
            For i As Integer = 0 To res.Count - 1
                Dim item = New ItemSimulacao()
                item.Codigo = Configuracao.retiraDBNull(res(i)("Codigo"))
                item.Descricao = Configuracao.retiraDBNull(res(i)("Descricao"))
                item.Preco = Configuracao.retiraDBNull(res(i)("Preco"))
                item.Quantidade = Configuracao.retiraDBNull(res(i)("Quantidade"))
                item.Total = Configuracao.retiraDBNull(res(i)("Total"))
                item.Unidade = Configuracao.retiraDBNull(res(i)("Unidade"))
                lstItens.Add(item)
            Next
            Return lstItens
        End Function

        <HttpPost>
        Public Function getFornecedoresSimulacao(parans As Params_getItensSimulacao) As List(Of FornecedorSimulacao)
            Dim lstItens = New List(Of FornecedorSimulacao)
            Dim ref = New WsCotacao()
            ref.Url = Configuracao.getUrlService("wsCotacao", parans._wsDomain)
            Dim res = ref.ConsultaFornecedoresSimulacaoMob(parans.NumeroSimulacao, parans.TipoCotacao, parans.codCotacao, parans.seCotacaoGeral, parans.codEmpresa).Tables(0).Rows
            For i As Integer = 0 To res.Count - 1
                Dim item = New FornecedorSimulacao()
                item.CodFornecedor = Configuracao.retiraDBNull(res(i)("CodFornecedor"))
                item.Condicao = Configuracao.retiraDBNull(res(i)("Condicao"))
                item.Desconto = Configuracao.retiraDBNull(res(i)("Desconto"))
                item.DifAliqICMS = Configuracao.retiraDBNull(res(i)("DifAliqICMS"))
                item.NomeFornecedor = Configuracao.retiraDBNull(res(i)("NomeFornecedor"))
                item.Quantidade = Configuracao.retiraDBNull(res(i)("Quantidade"))
                item.SubTotal = Configuracao.retiraDBNull(res(i)("SubTotal"))
                item.Total = Configuracao.retiraDBNull(res(i)("Total"))
                item.TotalComDifICMS = Configuracao.retiraDBNull(res(i)("TotalComDifICMS"))
                item.ValorTransp = Configuracao.retiraDBNull(res(i)("ValorTransp"))
                lstItens.Add(item)
            Next
            Return lstItens
        End Function

        <HttpPost>
        Public Function getItensFornecedor(parans As Params_getItensFornecedor) As List(Of ItemSimulacao)
            Dim lstItens = New List(Of ItemSimulacao)
            Dim ref = New WsCotacao()
            ref.Url = Configuracao.getUrlService("wsCotacao", parans._wsDomain)
            Dim res = ref.ConsultaItensFornecedorMob(parans.codFornecedor, parans.NumeroSimulacao, parans.TipoCotacao, parans.codCotacao, parans.seCotacaoGeral, parans.codEmpresa).Tables(0).Rows
            For i As Integer = 0 To res.Count - 1
                Dim item = New ItemSimulacao()
                item.Codigo = Configuracao.retiraDBNull(res(i)("Insumo"))
                item.Descricao = Configuracao.retiraDBNull(res(i)("Descricao"))
                item.Preco = Configuracao.retiraDBNull(res(i)("Preco"))
                item.Quantidade = Configuracao.retiraDBNull(res(i)("Quantidade"))
                item.Total = Configuracao.retiraDBNull(res(i)("Total"))
                item.Unidade = Configuracao.retiraDBNull(res(i)("Unidade"))
                item.CasaDecPreco = Configuracao.retiraDBNull(res(i)("CasaDecPreco"))
                item.CasaDecQuantidade = Configuracao.retiraDBNull(res(i)("CasaDecQuantidade"))
                item.PrecoMeta = Configuracao.retiraDBNull(res(i)("PrecoMeta"))
                item.TotalMeta = Configuracao.retiraDBNull(res(i)("TotalMeta"))
                item.Fornecedor = Configuracao.retiraDBNull(res(i)("Fornecedor"))
                item.Cotacao = Configuracao.retiraDBNull(res(i)("Cotacao"))
                item.Obra = Configuracao.retiraDBNull(res(i)("Obra"))
                item.CodEmpresa = Configuracao.retiraDBNull(res(i)("CodEmpresa"))
                lstItens.Add(item)
            Next
            Return lstItens
        End Function

        <HttpPost>
        Public Function getEmpresasSimulacao(parans As Params_getItensSimulacao) As List(Of EmpresaSimulacao)
            Dim lstItens = New List(Of EmpresaSimulacao)
            Dim ref = New WsCotacao()
            ref.Url = Configuracao.getUrlService("wsCotacao", parans._wsDomain)
            Dim res = ref.ConsultaEmpresasSimulacaoMob(parans.NumeroSimulacao, parans.TipoCotacao, parans.codCotacao, parans.seCotacaoGeral, parans.codEmpresa).Tables(0).Rows
            For i As Integer = 0 To res.Count - 1
                Dim item = New EmpresaSimulacao()
                item.CodEmpresa = Configuracao.retiraDBNull(res(i)("CodEmpresa"))
                item.Desconto = Configuracao.retiraDBNull(res(i)("Desconto"))
                item.DifAliqICMS = Configuracao.retiraDBNull(res(i)("DifAliqICMS"))
                item.NomeEmpresa = Configuracao.retiraDBNull(res(i)("NomeEmpresa"))
                item.Quantidade = Configuracao.retiraDBNull(res(i)("Quantidade"))
                item.SubTotal = Configuracao.retiraDBNull(res(i)("SubTotal"))
                item.Total = Configuracao.retiraDBNull(res(i)("Total"))
                item.TotalComDifICMS = Configuracao.retiraDBNull(res(i)("TotalComDifICMS"))
                item.ValorTransp = Configuracao.retiraDBNull(res(i)("ValorTransp"))
                lstItens.Add(item)
            Next
            Return lstItens
        End Function

        <HttpPost>
        Public Function getItensEmpresa(parans As Params_getItensEmpresa) As List(Of ItemSimulacao)
            Dim lstItens = New List(Of ItemSimulacao)
            Dim ref = New WsCotacao()
            ref.Url = Configuracao.getUrlService("wsCotacao", parans._wsDomain)
            Dim res = ref.ConsultaItensEmpresasMob(parans.NumeroSimulacao, parans.TipoCotacao, parans.codCotacao, parans.seCotacaoGeral, parans.codEmpresa).Tables(0).Rows
            For i As Integer = 0 To res.Count - 1
                Dim item = New ItemSimulacao()
                item.Codigo = Configuracao.retiraDBNull(res(i)("Insumo"))
                item.Descricao = Configuracao.retiraDBNull(res(i)("Descricao"))
                item.Preco = Configuracao.retiraDBNull(res(i)("Preco"))
                item.Quantidade = Configuracao.retiraDBNull(res(i)("Quantidade"))
                item.Total = Configuracao.retiraDBNull(res(i)("Total"))
                item.Unidade = Configuracao.retiraDBNull(res(i)("Unidade"))
                item.CasaDecPreco = Configuracao.retiraDBNull(res(i)("CasaDecPreco"))
                item.CasaDecQuantidade = Configuracao.retiraDBNull(res(i)("CasaDecQuantidade"))
                item.PrecoMeta = Configuracao.retiraDBNull(res(i)("PrecoMeta"))
                item.TotalMeta = Configuracao.retiraDBNull(res(i)("TotalMeta"))
                item.Fornecedor = Configuracao.retiraDBNull(res(i)("Fornecedor"))
                item.Cotacao = Configuracao.retiraDBNull(res(i)("Cotacao"))
                item.Obra = Configuracao.retiraDBNull(res(i)("Obra"))
                item.CodEmpresa = Configuracao.retiraDBNull(res(i)("CodEmpresa"))
                lstItens.Add(item)
            Next
            Return lstItens
        End Function

        <HttpPost>
        Public Function getHistoricoInsumo(parans As Params_getHistoricoInsumo) As List(Of HistoricoInsumo)
            Dim lstItens = New List(Of HistoricoInsumo)
            Dim ref = New wsHistoricoInsumo()
            ref.Url = Configuracao.getUrlService("wsHistoricoInsumo", parans._wsDomain)
            Dim res = ref.ConsultaHistoricoInsumo(parans.codigoInsumo, parans.naoMostraInsumoSemCotacao, parans.dataInicial, parans.dataFinal, True).Tables(0).Rows
            For i As Integer = 0 To res.Count - 1
                Dim item = New HistoricoInsumo()
                item.CodEmpresa = Configuracao.retiraDBNull(res(i)("Codigo_Emp"))
                item.CodFornecedor = Configuracao.retiraDBNull(res(i)("CodForn_Simc"))
                item.DataCotacao = Configuracao.retiraDBNull(res(i)("Data_cot"))
                item.DataGeracao = Configuracao.retiraDBNull(res(i)("Data_Simc"))
                item.Empresa = Configuracao.retiraDBNull(res(i)("Desc_Emp"))
                item.Fornecedor = Configuracao.retiraDBNull(res(i)("nome_pes"))
                item.Preco = Configuracao.retiraDBNull(res(i)("Preco_Simc"))
                item.Quantidade = Configuracao.retiraDBNull(res(i)("QtdeSimu_Simc"))
                item.Total = Configuracao.retiraDBNull(res(i)("SubTotal"))
                item.Cotacao = Configuracao.retiraDBNull(res(i)("MaxCotacao"))
                item.Obra = Configuracao.retiraDBNull(res(i)("Obra_Simc"))
                lstItens.Add(item)
            Next
            Return lstItens
        End Function

    End Class
#Region "Parâmetros"
    Public Class Params_getCotacoes
        Inherits ParametrosObrigatorios
        Public Property usuario As String 'Usuario 
        Public Property limit As Integer 'Limite de registros por página.
        Public Property busca As String 'Texto a ser encontrado na busca.
        Public Property cursor As Integer 'Último registro da lista.
    End Class
    Public Class Params_getItensFornecedor
        Inherits ParametrosObrigatorios
        Public Property codFornecedor As Integer
        Public Property codCotacao As Integer
        Public Property NumeroSimulacao As Integer
        Public Property TipoCotacao As Integer
        Public Property seCotacaoGeral As Boolean
        Public Property codEmpresa As Nullable(Of Integer)
    End Class
    Public Class Params_getItensEmpresa
        Inherits ParametrosObrigatorios
        Public Property codCotacao As Integer
        Public Property NumeroSimulacao As Integer
        Public Property TipoCotacao As Integer
        Public Property seCotacaoGeral As Boolean
        Public Property codEmpresa As Nullable(Of Integer)
    End Class
    Public Class Params_getItensSimulacao
        Inherits ParametrosObrigatorios
        Public Property codCotacao As Integer
        Public Property NumeroSimulacao As Integer
        Public Property TipoCotacao As Integer
        Public Property seCotacaoGeral As Boolean
        Public Property codEmpresa As Nullable(Of Integer)
    End Class
    Public Class Params_getSimulacoesCotacao
        Inherits ParametrosObrigatorios
        Public Property usuario As String
        Public Property codCotacao As Integer
        Public Property seCotacaoGeral As Boolean
        Public Property codEmpresa As Nullable(Of Integer)
    End Class
    Public Class Params_getHistoricoInsumo
        Inherits ParametrosObrigatorios
        Public Property codigoInsumo As String
        Public Property naoMostraInsumoSemCotacao As Boolean
        Public Property dataInicial As DateTime
        Public Property dataFinal As DateTime
        Public Property ordenar As Boolean
    End Class
#End Region

End Namespace
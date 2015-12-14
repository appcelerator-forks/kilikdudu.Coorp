Imports System.Net
Imports System.Web.Http
Imports UAUMobileWebAPI.Parametros.ProcessoPagamento
Imports UAUMobileWebAPI.Models.ProcessoPagamento
Imports UAUMobileWebAPI.ProcessoPagamentoReference
Imports UAUMobileWebAPI.Util
Imports System.Web.Script.Serialization
Imports Newtonsoft.Json


Namespace Controllers
    Public Class ProcessoPagamentoController
        Inherits ApiController

        ''' <summary>
        ''' Monta a cláusula where da páginação dos processos de emissão de pagamento.
        ''' </summary>
        ''' <param name="texto">Texto que a resposta deve conter, fornecido pela barra de busca no smartphone.</param>
        ''' <param name="cursor">O valor da coluna Row do último registro da lista.</param>
        ''' <param name="keyOrdena">Nome da coluna que ordena a consulta</param>
        ''' <param name="modoOrdenacao">ASC para ascendente e DESC para descendente</param>
        ''' <remarks>
        ''' Criação    : Carlos Eduardo Santos Alves Domingos        Data: 08/05/2015
        ''' Projeto    : 186931
        ''' </remarks>
        Private Function MontarClausulaWhere(ByVal texto As String, ByVal cursor As Integer, ByVal keyOrdena As String, ByVal modoOrdenacao As String)
            Dim smartFilter As SmartFilterMob = New SmartFilterMob()
            smartFilter.addColuna("ValorParc_Proc", "M")
            smartFilter.addColuna("EmpObra", "S")
            smartFilter.addColuna("ChqNome_proc", "S")
            smartFilter.addColuna("DtPagParc_Proc", "D")
            smartFilter.addColuna("Num_proc", "S")
            smartFilter.addColuna("NumParc_proc", "S")
            Return smartFilter.getClausulaWhere(texto, cursor, keyOrdena, modoOrdenacao)
        End Function

        ''' <summary>
        ''' Busca a lista resumida de processos de pagamentos que o usuário pode aprovar.
        ''' </summary>
        ''' <param name="parans">Parâmetros do método.</param>
        ''' <remarks>
        ''' Criação    : Carlos Eduardo Santos Alves Domingos        Data: 06/03/2015
        ''' Projeto    : 180419
        ''' 
        ''' Alteração : Carlos Eduardo Santos Alves Domingos         Data: 08/05/2015
        ''' Projeto   : 186931 - Projeto
        ''' Manutenção: Alterado para montar a clásula where da páginação.
        ''' </remarks>
        <HttpPost>
        Public Function consultarProcessos(parans As Params_consultarProcessos) As List(Of ProcessoDePagamento)
            Dim lstProcessos = New List(Of ProcessoDePagamento)
            Dim ref = New ProcessoPagamento()
            ref.Url = Configuracao.getUrlService("ProcessoPagamento", parans._wsDomain)
            Dim whereClausule As String = MontarClausulaWhere(parans.busca, parans.cursor, "DtPagParc_Proc", "ASC")
            Dim res = ref.ConsultarProcessoEmissaoPagamentoResumido(parans.usuario, parans.limit, whereClausule).Tables(0).Rows
            For i As Integer = 0 To res.Count - 1
                Dim proc = New ProcessoDePagamento()
                proc.Aprovado = False
                proc.Row = res(i)("Row")
                proc.BancoConta = Configuracao.retiraDBNull(res(i)("BancoConta"))
                proc.DataGeracao = Configuracao.retiraDBNull(res(i)("Data_Proc"))
                proc.DataProrrogacao = Configuracao.retiraDBNull(res(i)("DtPagParc_Proc"))
                proc.DataVencimento = Configuracao.retiraDBNull(res(i)("DtVencParc_Proc"))
                proc.Empresa = Configuracao.retiraDBNull(res(i)("Desc_emp"))
                proc.EmpresaCod = Configuracao.retiraDBNull(res(i)("Empresa_proc"))
                proc.EmpresaObra = Configuracao.retiraDBNull(res(i)("EmpObra"))
                proc.Fornecedor = Configuracao.retiraDBNull(res(i)("ChqNome_proc"))
                proc.NumeroProcesso = Configuracao.retiraDBNull(res(i)("Num_proc"))
                proc.Obra = Configuracao.retiraDBNull(res(i)("descr_obr"))
                proc.ObraCod = Configuracao.retiraDBNull(res(i)("Obra_Proc"))
                proc.Observacao = Configuracao.retiraDBNull(res(i)("ObsPag_Proc"))
                proc.TipoProcesso = Configuracao.retiraDBNull(res(i)("TipoDoc_Proc"))
                proc.Parcela = Configuracao.retiraDBNull(res(i)("NumParc_proc"))
                proc.TipoEmissao = Configuracao.retiraDBNull(res(i)("TipoChq_Proc"))
                proc.ValorProcesso = Configuracao.retiraDBNull(res(i)("ValorParc_Proc"))
                proc.ValPagar = Configuracao.retiraDBNull(res(i)("ValPagar"))
                proc.Acrescimo = Configuracao.retiraDBNull(res(i)("AcrescParc_Proc"))
                proc.Contrato = Configuracao.retiraDBNull(res(i)("Contrato_Proc"))
                proc.Desconto = Configuracao.retiraDBNull(res(i)("descParc_Proc"))
                proc.DocumentoFiscal = Configuracao.retiraDBNull(res(i)("DocFiscal_Proc"))
                proc.Medicao = Configuracao.retiraDBNull(res(i)("CodMed_Proc"))
                proc.NumeroCotacao = Configuracao.retiraDBNull(res(i)("NumCot_Proc"))
                proc.OrdemCompra = Configuracao.retiraDBNull(res(i)("OrdemCompra_Proc"))
                proc.ValorDocumentoFiscal = Configuracao.retiraDBNull(res(i)("VlDocFisc_Proc"))
                lstProcessos.Add(proc)
            Next
            Return lstProcessos
        End Function

        ''' <summary>
        ''' Conta os processos de pagamentos que o usuário pode aprovar.
        ''' </summary>
        ''' <param name="parans">Parâmetros do método.</param>
        ''' <remarks>
        ''' Criação    : Carlos Eduardo Santos Alves Domingos        Data: 06/03/2015
        ''' Projeto    : 185753 - Projeto
        ''' 
        ''' </remarks>
        <HttpPost>
        Public Function contarProcessos(parans As Params_consultarProcessos) As Resumo
            Dim resumo = New Resumo
            Dim ref = New ProcessoPagamento()
            ref.Url = Configuracao.getUrlService("ProcessoPagamento", parans._wsDomain)
            Dim res = ref.ContaProcessoEmissaoPagamentoResumido(parans.usuario).Tables(0).Rows
            If res.Count > 0 Then
                resumo.Quantidade = res(0)("Quantidade")
            End If
            Return resumo
        End Function

        ''' <summary>
        ''' Consulta os usuários que já aprovaram determinado processo de pagamanto.
        ''' </summary>
        ''' <param name="parans">Parâmetros da classe</param>
        ''' <remarks>
        ''' Criação    : Carlos Eduardo Santos Alves Domingos        Data: 06/03/2015
        ''' Projeto    : 180419
        ''' </remarks>
        <HttpPost>
        Public Function getAprovacaoEmissao(parans As Params_getAprovacaoEmissao) As List(Of AprovacaoEmissao)
            Dim lstItens = New List(Of AprovacaoEmissao)
            Dim ref = New ProcessoPagamento()
            ref.Url = Configuracao.getUrlService("ProcessoPagamento", parans._wsDomain)
            Dim res = ref.ConsultarAprovacaoEmissao(parans.NumProcesso, parans.NumParcela, parans.CodObra, parans.CodEmpresa).Tables(0).Rows
            For i As Integer = 0 To res.Count - 1
                Dim item = New AprovacaoEmissao()
                item.Quem = res(i)("Quem_apv")
                item.DataAprovacao = res(i)("DataAprov_apv")
                lstItens.Add(item)
            Next
            Return lstItens
        End Function

        ''' <summary>
        ''' Consulta os itens do processo de pagamento.
        ''' </summary>
        ''' <param name="parans">Parâmetros da classe</param>
        ''' <remarks>
        ''' Criação    : Carlos Eduardo Santos Alves Domingos        Data: 06/03/2015
        ''' Projeto    : 180419
        ''' </remarks>
        <HttpPost>
        Public Function getItensProcesso(parans As Params_getItensProcesso) As List(Of ItemProcesso)
            Dim lstItens = New List(Of ItemProcesso)
            Dim ref = New ProcessoPagamento()
            ref.Url = Configuracao.getUrlService("ProcessoPagamento", parans._wsDomain)
            Dim res = ref.ConsultarItensProcessosPagamento(parans.CodEmpresa, parans.CodObra, parans.Processo, parans.Contrato).Tables(0).Rows
            For i As Integer = 0 To res.Count - 1
                Dim item = New ItemProcesso()
                item.Codigo = res(i)("CodInsProc_Item")
                item.Descricao = res(i)("Descricao")
                item.Quantidade = res(i)("QtdeProc_Item")
                item.ValorTotal = res(i)("Total_Item")
                item.ValorUnitario = res(i)("ValUnitProc_Item")
                item.CodCap = res(i)("CapInsProc_Item")
                item.DescricaoCap = res(i)("Desc_cger")
                lstItens.Add(item)
            Next
            Return lstItens
        End Function

        ''' <summary>
        ''' Valida se o processo pode ser aprovado pelo usuário.
        ''' </summary>
        ''' <param name="parans">Parâmetros do método.</param>
        ''' <remarks>
        ''' Criação    : Carlos Eduardo Santos Alves Domingos        Data: 06/03/2015
        ''' Projeto    : 180419
        ''' </remarks>
        <HttpPost>
        Public Function validarProcesso(parans As Params_validaProcesso) As RespostaMob

            Dim ret = New RespostaMob()
            Dim ref = New ProcessoPagamento()
            ref.Url = Configuracao.getUrlService("ProcessoPagamento", parans._wsDomain)
            Dim res = ref.ValidarAprovacaoProcesso(parans.codEmpresa, parans.codObra, parans.numeroProcesso, parans.numeroParcela, parans.tipoProcesso, parans.loginUsuario, parans.aprovarProcesso)

            'Aprovação duplicada
            If res.Sucesso AndAlso res.Mensagem = "O processo selecionado já foi aprovado." Then
                ret.sucesso = False
                ret.mensagem = res.Mensagem
                Return ret
            End If

            If res.Tipo = TipoMensagemResultadoExecucao.Confirmacao AndAlso res.Sucesso = True Then
                ret.sucesso = True
                ret.mensagem = "Existe mais de um processo de pagamento com o mesmo valor para este mesmo fornecedor, gostaria de aprovar mesmo assim ?"
            ElseIf res.Tipo = TipoMensagemResultadoExecucao.Informativa AndAlso res.Sucesso = True Then
                ret.sucesso = True
                ret.mensagem = ""
            Else
                ret.sucesso = False
                ret.mensagem = res.Mensagem
            End If
            Return ret
        End Function

        ''' <summary>
        ''' Aprova o processo de pagamento.
        ''' </summary>
        ''' <param name="parans">Parâmetros do método.</param>
        ''' <remarks>
        ''' Criação    : Carlos Eduardo Santos Alves Domingos        Data: 06/03/2015
        ''' Projeto    : 180419
        ''' </remarks>
        <HttpPost>
        Public Function aprovarProcesso(parans As Params_validaProcesso) As RespostaMob

            Dim ret = New RespostaMob()
            Dim ref = New ProcessoPagamento()
            ref.Url = Configuracao.getUrlService("ProcessoPagamento", parans._wsDomain)
            Dim res = ref.AprovarProcesso(parans.codEmpresa, parans.codObra, parans.numeroProcesso, parans.numeroParcela, parans.tipoProcesso, parans.aprovarProcesso, parans.loginUsuario)
            ret.sucesso = res.Sucesso
            Return ret
        End Function

        ''' <summary>
        ''' Aprova uma lista de processos de emissão de pagamento.
        ''' </summary>
        ''' <param name="parans">Parâmetros do método.</param>
        ''' <remarks>
        ''' Criação    : Carlos Eduardo Santos Alves Domingos        Data: 08/05/2015
        ''' Projeto    : 186931
        ''' </remarks>
        <HttpPost>
        Public Function aprovarProcessoEmLote(parans As Params_aprovarProcessoEmLote) As List(Of RespostaMob)
            Dim lstRet = New List(Of RespostaMob)()
            Dim ref = New ProcessoPagamento()
            ref.Url = Configuracao.getUrlService("ProcessoPagamento", parans._wsDomain)
            For Each processo As Params_validaProcesso In parans.processos
                Dim ret = New RespostaMob()
                'Válido se pode aprovar
                Dim paransValidaProcesso = New Params_validaProcesso()
                paransValidaProcesso._wsDomain = parans._wsDomain
                paransValidaProcesso._mobEmProducao = parans._mobEmProducao
                paransValidaProcesso.aprovarProcesso = processo.aprovarProcesso
                paransValidaProcesso.codEmpresa = processo.codEmpresa
                paransValidaProcesso.codObra = processo.codObra
                paransValidaProcesso.loginUsuario = processo.loginUsuario
                paransValidaProcesso.numeroParcela = processo.numeroParcela
                paransValidaProcesso.numeroProcesso = processo.numeroProcesso
                paransValidaProcesso.tipoProcesso = processo.tipoProcesso
                Dim resValidacao = validarProcesso(paransValidaProcesso)

                If resValidacao.sucesso And resValidacao.mensagem = "" Then
                    Dim res = ref.AprovarProcesso(processo.codEmpresa, processo.codObra, processo.numeroProcesso, processo.numeroParcela, processo.tipoProcesso, processo.aprovarProcesso, processo.loginUsuario)
                ret.sucesso = res.Sucesso
                Else
                    ret.sucesso = False
                End If
                ret.mensagem = New JavaScriptSerializer().Serialize(processo)
                lstRet.Add(ret)
            Next
            Return lstRet
        End Function

    End Class
End Namespace
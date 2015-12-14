Imports System.Net
Imports System.Web.Http
Imports UAUMobileWebAPI.Parametros.Medicao
Imports UAUMobileWebAPI.Models.Medicao
Imports UAUMobileWebAPI.wsMedicaoReference
Imports UAUMobileWebAPI.Util
Imports System.Web.Script.Serialization

Namespace Controllers
    Public Class MedicaoController
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
            smartFilter.addColuna("Valor_Liq_Med", "M")
            smartFilter.addColuna("EmpObra", "S")
            smartFilter.addColuna("Nome_pes", "S")
            smartFilter.addColuna("DtCriacao_med", "D")
            smartFilter.addColuna("Cod_med", "S")
            smartFilter.addColuna("Contrato_med", "S")
            Return smartFilter.getClausulaWhere(texto, cursor, keyOrdena, modoOrdenacao)
        End Function

        ''' <summary>
        ''' Busca a lista resumida de medição de contrato que o usuário pode aprovar.
        ''' </summary>
        ''' <param name="parans">Parâmetros do método.</param>
        ''' <remarks>
        ''' Criação    : Carlos Eduardo Santos Alves Domingos        Data: 13/05/2015
        ''' Projeto    : 185753 - Projeto
        ''' 
        ''' </remarks>
        <HttpPost>
        Public Function consultarMedicoes(parans As Params_consultarMedicoes) As List(Of Medicao)
            Dim lstProcessos = New List(Of Medicao)
            Dim ref = New wsMedicao()
            ref.Url = Configuracao.getUrlService("wsMedicao", parans._wsDomain)
            Dim whereClausule As String = MontarClausulaWhere(parans.busca, parans.cursor, "Empresa_med, Contrato_med, Cod_med", "ASC")
            Dim res = ref.ConsultaMedicoesPendentes(parans.usuario, parans.limit, whereClausule).Tables(0).Rows
            For i As Integer = 0 To res.Count - 1
                Dim proc = New Medicao()
                proc.Row = res(i)("Row")
                proc.CodEmp = Configuracao.retiraDBNull(res(i)("Empresa_med"))
                proc.CodMedicao = Configuracao.retiraDBNull(res(i)("Cod_med"))
                proc.CodObra = Configuracao.retiraDBNull(res(i)("Obra_cont"))
                proc.Contratado = Configuracao.retiraDBNull(res(i)("Nome_pes"))
                proc.Contrato = Configuracao.retiraDBNull(res(i)("Contrato_med"))
                proc.DataMedicao = Configuracao.retiraDBNull(res(i)("DtCriacao_med"))
                proc.DescEmpresa = Configuracao.retiraDBNull(res(i)("Desc_emp"))
                proc.DescObra = Configuracao.retiraDBNull(res(i)("Descr_obr"))
                proc.EmpObra = Configuracao.retiraDBNull(res(i)("EmpObra"))
                proc.ObsMedicao = Configuracao.retiraDBNull(res(i)("Obs_med"))
                proc.ValorAcrescimo = Configuracao.retiraDBNull(res(i)("Acres_med"))
                proc.ValorAdiantamento = Configuracao.retiraDBNull(res(i)("Valor_Adiant"))
                proc.ValorDesconto = Configuracao.retiraDBNull(res(i)("Valor_Desc"))
                proc.ValorLiquido = Configuracao.retiraDBNull(res(i)("Valor_Liq_Med"))
                proc.ValorMedicao = Configuracao.retiraDBNull(res(i)("Valor_med"))
                lstProcessos.Add(proc)
            Next
            Return lstProcessos
        End Function

        ''' <summary>
        ''' Conta as medições que o usuário pode aprovar.
        ''' </summary>
        ''' <param name="parans">Parâmetros do método.</param>
        ''' <remarks>
        ''' Criação    : Carlos Eduardo Santos Alves Domingos        Data: 13/05/2015
        ''' Projeto    : 185753 - Projeto
        ''' 
        ''' </remarks>
        <HttpPost>
        Public Function contarMedicoes(parans As Params_consultarMedicoes) As Resumo
            Dim resumo = New Resumo
            Dim ref = New wsMedicao()
            ref.Url = Configuracao.getUrlService("wsMedicao", parans._wsDomain)
            Dim res = ref.ContaMedicoesPendentes(parans.usuario).Tables(0).Rows
            If res.Count > 0 Then
                resumo.Quantidade = res(0)("Quantidade")
            End If
            Return resumo
        End Function

        ''' <summary>
        ''' Consulta os usuários que já aprovaram determinado contrato.
        ''' </summary>
        ''' <param name="parans">Parâmetros da classe</param>
        ''' <remarks>
        ''' Criação    : Carlos Eduardo Santos Alves Domingos        Data: 13/05/2015
        ''' Projeto    : 185753 - Projeto
        ''' </remarks>
        <HttpPost>
        Public Function getAprovacaoMedicao(parans As Params_infoMedicao) As List(Of AprovacaoMedicao)
            Dim lstItens = New List(Of AprovacaoMedicao)
            Dim ref = New wsMedicao()
            ref.Url = Configuracao.getUrlService("wsMedicao", parans._wsDomain)
            Dim res = ref.ConsultaAprovacaoMedicao(parans.Empresa, parans.Contrato, parans.Medicao).Tables(0).Rows
            For i As Integer = 0 To res.Count - 1
                Dim item = New AprovacaoMedicao()
                item.Usuario = res(i)("UsrAprov_apmed")
                item.Data = res(i)("DataAprov_apmed")
                lstItens.Add(item)
            Next
            Return lstItens
        End Function

        ''' <summary>
        ''' Consulta os itens do contrato.
        ''' </summary>
        ''' <param name="parans">Parâmetros da classe</param>
        ''' <remarks>
        ''' Criação    : Carlos Eduardo Santos Alves Domingos        Data: 13/05/2015
        ''' Projeto    : 180419
        ''' </remarks>
        <HttpPost>
        Public Function getItensMedicao(parans As Params_infoMedicao) As List(Of ItemMedicao)
            Dim lstItens = New List(Of ItemMedicao)
            Dim ref = New wsMedicao()
            ref.Url = Configuracao.getUrlService("wsMedicao", parans._wsDomain)
            Dim res = ref.ConsultaItensMedicoesPendentes(parans.Empresa, parans.Contrato, parans.Medicao).Tables(0).Rows
            For i As Integer = 0 To res.Count - 1
                Dim item = New ItemMedicao()
                item.Codigo = res(i)("Serv_itens")
                item.Descricao = res(i)("Descr_itens")
                item.Quantidade = res(i)("Qtde_Item")
                item.ValorTotal = res(i)("Valor_Total")
                item.ValorUnitario = res(i)("PrecoUnit_Item")
                item.Tipo = res(i)("TipoServMat_Itens")
                lstItens.Add(item)
            Next
            Return lstItens
        End Function

        ''' <summary>
        ''' Aprova a medição de contrato.
        ''' </summary>
        ''' <param name="parans">Parâmetros do método.</param>
        ''' <remarks>
        ''' Criação    : Carlos Eduardo Santos Alves Domingos        Data: 13/05/2015
        ''' Projeto    : 185753
        ''' </remarks>
        <HttpPost>
        Public Function aprovarMedicao(parans As Params_infoMedicao) As RespostaMob

            Dim ret = New RespostaMob()
            Dim ref = New wsMedicao()
            ref.Url = Configuracao.getUrlService("wsMedicao", parans._wsDomain)
            Dim resValidacao = ref.ValidaAprovacaoMedicao(parans.Empresa, parans.Contrato, parans.Medicao, parans.Usuario, parans.Obra)
            If resValidacao.Sucesso Then
                Dim res = ref.AprovaMedicao(parans.Empresa, parans.Contrato, parans.Medicao, parans.Usuario, parans.Obra)
                ret.sucesso = res.Sucesso
                ret.mensagem = res.Mensagem
            Else
                ret.sucesso = False
                ret.mensagem = resValidacao.Mensagem
            End If

            Return ret
        End Function

        ''' <summary>
        ''' Aprova uma lista de contratos.
        ''' </summary>
        ''' <param name="parans">Parâmetros do método.</param>
        ''' <remarks>
        ''' Criação    : Carlos Eduardo Santos Alves Domingos        Data: 13/05/2015
        ''' Projeto    : 185753
        ''' </remarks>
        <HttpPost>
        Public Function aprovarMedicaoEmLote(parans As Params_aprovarMedicaoEmLote) As List(Of RespostaMob)
            Dim lstRet = New List(Of RespostaMob)()
            Dim ref = New wsMedicao()
            ref.Url = Configuracao.getUrlService("wsMedicao", parans._wsDomain)
            For Each medicao As Params_infoMedicao In parans.medicoes
                medicao._wsDomain = parans._wsDomain
                Dim res = aprovarMedicao(medicao)
                Dim ret = New RespostaMob()
                ret.sucesso = res.sucesso
                ret.mensagem = New JavaScriptSerializer().Serialize(medicao)
                lstRet.Add(ret)
            Next
            Return lstRet
        End Function

    End Class
End Namespace
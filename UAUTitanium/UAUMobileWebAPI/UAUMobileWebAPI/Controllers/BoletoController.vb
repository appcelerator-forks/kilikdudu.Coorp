Imports System.Net
Imports System.Web.Http
Imports UAUMobileWebAPI.Models.Boletos
Imports UAUMobileWebAPI.BoletoReference
Imports UAUMobileWebAPI.Util
Imports UAUMobileWebAPI.Parametros.Boleto
Imports System.ComponentModel
Imports System.Threading

Namespace Controllers
    Public Class BoletoController
        Inherits ApiController

        Private db As New UauWebBDEntities

        ''' <summary>
        ''' Monta a cláusula where da páginação do boleto
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
            smartFilter.addColuna("ValDoc_Bol", "M")
            smartFilter.addColuna("Descr_obr", "S")
            smartFilter.addColuna("DataVenc_bol", "D")
            smartFilter.addColuna("SeuNum_Bol", "S")
            Return smartFilter.getClausulaWhere(texto, cursor, keyOrdena, modoOrdenacao)
        End Function

        ''' <summary>
        ''' Busca os boletos não vencidos do cliente. Retorna no formato JSON.
        ''' </summary>
        ''' <param name="parans">Parâmetros do método.</param>
        ''' <remarks>
        ''' Criação    : Carlos Eduardo Santos Alves Domingos        Data: 28/01/2015
        ''' Projeto    : 176562
        ''' 
        ''' Alteração : Carlos Eduardo Santos Alves Domingos         Data: 08/05/2015
        ''' Projeto   : 186931 - Projeto
        ''' Manutenção: Alterado para montar a clásula where da páginação.
        ''' 
        ''' Alteração : Carlos Eduardo Santos Alves Domingos         Data: 08/05/2015
        ''' Projeto   : 191658 - Projeto
        ''' Manutenção: Alterado para solicitar ou não os boletos vencidos.
        ''' 
        ''' </remarks>
        <HttpPost>
        Public Function getBoletosCliente(parans As Params_getBoletosCliente) As List(Of Boleto)
            Try
                Dim bolRef = New BoletoServices
                'Busco a url do webservice.
                bolRef.Url = Configuracao.getUrlService("boletoAdress", parans._wsDomain)
                Dim listBoletoMob As List(Of Boleto) = New List(Of Boleto)
                'Monto a clásula where da paginação.
                Dim whereClausule As String = MontarClausulaWhere(parans.busca, parans.cursor, "DataVenc_bol", "ASC")

                Dim codEmpresa = CInt(UAUWeb_CRYPTO.Desencriptar(HttpUtility.UrlDecode(parans.token)))
                Dim naoMostraBoletoVencido = 1
                Dim confReimpBol = db.ConfReimpBoleto.Find(codEmpresa)
                If confReimpBol IsNot Nothing Then
                    naoMostraBoletoVencido = confReimpBol.NaoMostraBoletoVencido_crb
                End If

                'Obtenho os boletos.
                Dim res As DataRowCollection = bolRef.ConsultarBoletosDoClienteMob(parans.codUsuario, True, parans.usuario, naoMostraBoletoVencido, parans.limit, whereClausule).Tables(0).Rows
                'Percorro a coleção obtendo as informações necessárias.
                For i As Integer = 0 To res.Count - 1
                    Dim boleto = New Boleto
                    boleto.Row = res(i)("Row")
                    boleto.Beneficiario = res(i)("Desc_emp")
                    boleto.DataDocumento = res(i)("DataGera_Bol")
                    boleto.DataVencimento = res(i)("DataVenc_bol")
                    boleto.LocalPagamento = res(i)("LocalPgto_Bol")
                    boleto.NossoNumero = res(i)("NossoNum_Bol")
                    boleto.Empreendimento = res(i)("Descr_obr")
                    boleto.SeuNumero = res(i)("SeuNum_Bol")
                    boleto.ValorDocumento = res(i)("ValDoc_Bol")
                    boleto.Banco = res(i)("Nome_banco")
                    boleto.AgenciaCod = res(i)("AgCodCed_Bol")
                    boleto.LinhaDigitavel = res(i)("LinhaDigitavel_Bol")
                    'Monto as intruções do boleto.
                    boleto.Instrucoes = bolRef.ObterMensagemDoBoleto(res(i)("SeuNum_Bol"), res(i)("Banco_Bol"), res(i)("Empresa_rea"), res(i)("Instrucao_Bol"), res(i)("Carteira_Bol"))
                    listBoletoMob.Add(boleto)
                Next
                'Retorno a lista de boletos.
                Return listBoletoMob
            Catch ex As Exception
                Throw
            End Try
        End Function

        ''' <summary>
        ''' Busca os boletos com data de vencimento para daqui a 5 dias.
        ''' </summary>
        ''' <param name="enderecoWs">Endereço do domínio do webservice UAUWeb_ws da empresa.</param>
        ''' <param name="codEmpresa">Código da empresa.</param>
        ''' <param name="codUsuario">Código do usuário.</param>
        ''' <remarks>
        ''' Criação    : Carlos Eduardo Santos Alves Domingos        Data: 07/08/2015
        ''' Projeto    : 183484
        ''' 
        ''' 
        ''' </remarks>
        Public Function getBoletosCincoDias(ByVal enderecoWs As String, ByVal codEmpresa As Integer, ByVal codUsuario As Integer) As List(Of Boleto)
            Dim resBol As New List(Of Boleto)
            Dim bolRef = New BoletoServices
            'Busco a url do webservice.
            bolRef.Url = Configuracao.getUrlService("boletoAdress", enderecoWs)
            'Pego os boletos com vencimento para daqui a 5 dias.
            Dim whereClausule As String = " DataVenc_bol = '" & Date.Today.AddDays(5).ToString("MM/dd/yyyy") & "'"

            Dim naoMostraBoletoVencido = 1
            Dim confReimpBol = db.ConfReimpBoleto.Find(codEmpresa)
            If confReimpBol IsNot Nothing Then
                naoMostraBoletoVencido = confReimpBol.NaoMostraBoletoVencido_crb
            End If

            'Obtenho os boletos.
            Dim resBoleto As DataRowCollection = bolRef.ConsultarBoletosDoClienteMob(codUsuario, True, "", naoMostraBoletoVencido, 10, whereClausule).Tables(0).Rows
            'Percorro a coleção obtendo as informações necessárias.
            For i As Integer = 0 To resBoleto.Count - 1
                Dim boleto = New Boleto
                boleto.Row = resBoleto(i)("Row")
                boleto.Beneficiario = resBoleto(i)("Desc_emp")
                boleto.DataDocumento = resBoleto(i)("DataGera_Bol")
                boleto.DataVencimento = resBoleto(i)("DataVenc_bol")
                boleto.LocalPagamento = resBoleto(i)("LocalPgto_Bol")
                boleto.NossoNumero = resBoleto(i)("NossoNum_Bol")
                boleto.Empreendimento = resBoleto(i)("Descr_obr")
                boleto.SeuNumero = resBoleto(i)("SeuNum_Bol")
                boleto.ValorDocumento = resBoleto(i)("ValDoc_Bol")
                boleto.Banco = resBoleto(i)("Nome_banco")
                boleto.AgenciaCod = resBoleto(i)("AgCodCed_Bol")
                boleto.LinhaDigitavel = resBoleto(i)("LinhaDigitavel_Bol")
                'Monto as intruções do boleto.
                boleto.Instrucoes = bolRef.ObterMensagemDoBoleto(resBoleto(i)("SeuNum_Bol"), resBoleto(i)("Banco_Bol"), resBoleto(i)("Empresa_rea"), resBoleto(i)("Instrucao_Bol"), resBoleto(i)("Carteira_Bol"))
                resBol.Add(boleto)
            Next
            Return resBol
        End Function

    End Class

End Namespace
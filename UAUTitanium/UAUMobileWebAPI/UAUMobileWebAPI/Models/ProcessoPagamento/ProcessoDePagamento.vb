Namespace Models.ProcessoPagamento
    Public Class ProcessoDePagamento
        Public Property Row As Integer
        Public Property DocumentoFiscal As String
        Public Property ValorDocumentoFiscal As Double
        Public Property Acrescimo As Double
        Public Property Desconto As Double
        Public Property NumeroCotacao As Integer
        Public Property OrdemCompra As Integer
        Public Property Contrato As Integer
        Public Property Medicao As Integer
        Public Property NumeroProcesso As String
        Public Property EmpresaObra As String
        Public Property Fornecedor As String
        Public Property DataProrrogacao() As Object
            Get
                Return dataprorrogacao_value
            End Get
            Set(value As Object)
                Try
                    If Not IsDBNull(value) Then
                        Dim dt = CType(value, DateTime)
                        dataprorrogacao_value = dt.ToString("yyyy-MM-dd HH:mm:ss")
                    End If
                Catch ex As Exception
                    Throw
                End Try
            End Set
        End Property
        Private dataprorrogacao_value As String
        Public Property Parcela As Integer
        Public Property Aprovado As Boolean
        Public Property ValPagar As Double
        Public Property ValorProcesso As Double
        Public Property TipoEmissao As String
        Public Property TipoProcesso As Integer
        Public Property DataVencimento() As Object
            Get
                Return datavencimento_value
            End Get
            Set(value As Object)
                Try
                    If Not IsDBNull(value) Then
                        Dim dt = CType(value, DateTime)
                        datavencimento_value = dt.ToString("yyyy-MM-dd HH:mm:ss")
                    End If
                Catch ex As Exception
                    Throw
                End Try
            End Set
        End Property
        Private datavencimento_value As String
        Public Property DataGeracao() As Object
            Get
                Return datageracao_value
            End Get
            Set(value As Object)
                Try
                    If Not IsDBNull(value) Then
                        Dim dt = CType(value, DateTime)
                        datageracao_value = dt.ToString("yyyy-MM-dd HH:mm:ss")
                    End If
                Catch ex As Exception
                    Throw
                End Try
            End Set
        End Property
        Private datageracao_value As String
        Public Property BancoConta As String
        Public Property Empresa As String
        Public Property EmpresaCod As Integer
        Public Property Obra As String
        Public Property ObraCod As String
        Public Property Observacao() As Object
            Get
                Return obs_value
            End Get
            Set(value As Object)
                Try
                    If Not IsDBNull(value) Then
                        obs_value = value
                    Else
                        obs_value = ""
                    End If
                Catch ex As Exception
                    Throw
                End Try
            End Set
        End Property
        Private obs_value As String
    End Class
End Namespace

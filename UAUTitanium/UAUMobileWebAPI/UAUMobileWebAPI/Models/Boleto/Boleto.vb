Namespace Models.Boletos
    Public Class Boleto
        Public Property Row As Integer
        Public Property Codigo As Integer
        Public Property ValorDocumento As Double
        Public Property Empreendimento As String
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
        Public Property SeuNumero As String
        Public Property LinhaDigitavel As String
        Public Property LocalPagamento As String
        Public Property Beneficiario As String
        Public Property DataDocumento() As Object
            Get
                Return datadocumento_value
            End Get
            Set(value As Object)
                Try
                    If Not IsDBNull(value) Then
                        Dim dt = CType(value, DateTime)
                        datadocumento_value = dt.ToString("yyyy-MM-dd HH:mm:ss")
                    End If
                Catch ex As Exception
                    Throw
                End Try
            End Set
        End Property
        Private datadocumento_value As String
        Public Property NossoNumero As String
        Public Property Instrucoes As String
        Public Property Banco As String
        Public Property AgenciaCod As String
    End Class
End Namespace
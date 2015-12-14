Namespace Models.ProcessoPagamento
    Public Class AprovacaoEmissao
        Public Property Quem As String
        Public Property DataAprovacao() As Object
            Get
                Return dataAprovacao_value
            End Get
            Set(value As Object)
                Try
                    If Not IsDBNull(value) Then
                        Dim dt = CType(value, DateTime)
                        dataAprovacao_value = dt.ToString("yyyy-MM-dd HH:mm:ss")
                    End If
                Catch ex As Exception
                    Throw
                End Try
            End Set
        End Property
        Private dataAprovacao_value As String
    End Class
End Namespace

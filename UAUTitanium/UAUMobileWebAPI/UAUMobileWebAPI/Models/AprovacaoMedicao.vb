Namespace Models.Medicao
    Public Class AprovacaoMedicao
        Public Property Usuario As String
        Public Property Data() As Object
            Get
                Return data_value
            End Get
            Set(value As Object)
                Try
                    If Not IsDBNull(value) Then
                        Dim dt = CType(value, DateTime)
                        data_value = dt.ToString("yyyy-MM-dd HH:mm:ss")
                    End If
                Catch ex As Exception
                    Throw
                End Try
            End Set
        End Property
        Private data_value As String
    End Class
End Namespace

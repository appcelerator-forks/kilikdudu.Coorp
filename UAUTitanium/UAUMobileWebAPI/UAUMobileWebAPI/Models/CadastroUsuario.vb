Public Class CadastroUsuario
    Public Property codEmpresa As Integer
    Public Property Login As String
    Public Property Senha As String
    Public Property CpfCnpj As String
    Public Property Email As String
    Public Property TipoPessoa As Integer
    Public Property DataNasc() As Object
        Get
            Return dtnasc_value
        End Get
        Set(value As Object)
            Try
                If Not IsDBNull(value) Then
                    Dim dt = CType(value, DateTime)
                    dtnasc_value = dt.ToString("yyyy-MM-dd HH:mm:ss")
                End If
            Catch ex As Exception
                Throw
            End Try
        End Set
    End Property
    Private dtnasc_value As String
End Class

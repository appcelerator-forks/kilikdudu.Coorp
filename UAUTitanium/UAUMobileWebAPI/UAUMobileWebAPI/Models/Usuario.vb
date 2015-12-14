Namespace Models.Validador
    Public Class Usuario
        Public Property Codigo() As Integer
        Public Property Nome() As String
        Public Property Cpf() As String
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
        Public Property Email() As String
        Public Property Endereco() As String
        Public Property Numero() As String
        Public Property Referencia() As String
        Public Property Bairro() As String
        Public Property Cep() As String
        Public Property Cidade() As String
        Public Property UF() As String
        Public Property Login() As String
        Public Property UsuarioUAU() As String
    End Class
End Namespace

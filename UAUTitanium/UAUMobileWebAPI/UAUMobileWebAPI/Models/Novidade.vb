Namespace Models.Novidades
    Public Class Novidade
        Public Property NumeroTarefa As String
        Public Property Descricao() As String
            Get
                Return descricao_value
            End Get
            Set(value As String)
                Try
                    descricao_value = Regex.Split(value, "\/\*\*\/")(0)
                Catch ex As Exception
                    Throw
                End Try
            End Set
        End Property
        Private descricao_value As String
        Public Property linkVirtual() As Object
            Get
                Return linkvirtual_value
            End Get
            Set(value As Object)
                Try
                    If Not IsDBNull(value) Then
                        linkvirtual_value = CType(value, String)
                    End If
                Catch ex As Exception
                    Throw
                End Try
            End Set
        End Property
        Private linkvirtual_value As String
    End Class
End Namespace

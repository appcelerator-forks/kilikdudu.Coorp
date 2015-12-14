Public Class RespostaMob
    Public Property sucesso As Boolean
    Public Property mensagem As String

    Public Sub AddMensagem(ByVal mensagem As String)
        Me.mensagem &= mensagem & "<BR> "
    End Sub

    Public Property Dados As Object

End Class
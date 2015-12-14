Namespace Util
    Public Class DataHora
        Private Sub New()

        End Sub

        Shared Function getMiliSecondsFromHourMinute(ByVal Hour As Integer, ByVal Minute As Integer)
            Dim miliseconds As Long
            Dim agora = DateTime.Now
            Dim target = New DateTime(Now.Year, Now.Month, Now.Day, Hour, Minute, 0)
            miliseconds = target.Subtract(agora).TotalMilliseconds


            If miliseconds < 0 Then
                miliseconds = target.AddDays(1).Subtract(agora).TotalMilliseconds
            End If

            Return miliseconds
        End Function

    End Class
End Namespace

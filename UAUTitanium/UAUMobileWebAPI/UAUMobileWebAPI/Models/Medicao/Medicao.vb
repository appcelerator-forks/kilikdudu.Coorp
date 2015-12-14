Namespace Models.Medicao
    Public Class Medicao
        Public Property Row As Integer
        Public Property CodMedicao As String
        Public Property Contrato As String
        Public Property Contratado As String
        Public Property EmpObra As String
        Public Property CodEmp As Integer
        Public Property CodObra As String
        Public Property DescEmpresa As String
        Public Property DescObra As String
        Public Property DataMedicao() As Object
            Get
                Return datamedicao_value
            End Get
            Set(value As Object)
                Try
                    If Not IsDBNull(value) Then
                        Dim dt = CType(value, DateTime)
                        datamedicao_value = dt.ToString("yyyy-MM-dd HH:mm:ss")
                    End If
                Catch ex As Exception
                    Throw
                End Try
            End Set
        End Property
        Private datamedicao_value As String
        Public Property ObsMedicao As String
        Public Property ValorLiquido As Double
        Public Property ValorMedicao As Double
        Public Property ValorDesconto As Double
        Public Property ValorAdiantamento As Double
        Public Property ValorAcrescimo As Double
    End Class
End Namespace


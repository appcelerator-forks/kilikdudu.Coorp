Namespace Util
    Public Class SmartFilterMob
        Private columns As Dictionary(Of String, Char)
        Public Sub New()
            columns = New Dictionary(Of String, Char)()
        End Sub
        ''' <summary>
        ''' Adiciona uma nova coluna a cláusula where.
        ''' </summary>
        ''' <param name="coluna">Identificador da coluna dentro da consulta</param>
        ''' <param name="tipo">Tipo do dado da coluna:
        '''       S - Texto
        '''       D - Data
        '''       M - Dinheiro
        ''' </param>
        ''' <remarks>
        ''' Criação    : Carlos Eduardo Santos Alves Domingos        Data: 08/05/2015
        ''' Projeto    : 186931
        ''' </remarks>
        Public Sub addColuna(coluna As String, tipo As Char)
            columns.Add(coluna, tipo)
        End Sub

        ''' <summary>
        ''' Retorna a cláusula where da consulta da páginação.
        ''' </summary>
        ''' <param name="texto">Texto a se buscar na consulta.</param>
        ''' <param name="cursor">Valor da coluna Row no último registro da lista.</param>
        ''' <param name="keyOrdena">Identificador da coluna a ordenar na consulta.</param>
        ''' <param name="ordem">ASC ou DESC</param>
        ''' <remarks>
        ''' Criação    : Carlos Eduardo Santos Alves Domingos        Data: 08/05/2015
        ''' Projeto    : 186931
        ''' </remarks>
        Public Function getClausulaWhere(ByVal texto As String, ByVal cursor As Integer, ByVal keyOrdena As String, Optional ByVal ordem As String = "ASC") As String
            Dim strRetorno As Text.StringBuilder = New Text.StringBuilder()

            For Each coluna As KeyValuePair(Of String, Char) In columns
                If strRetorno.ToString.Length > 0 Then
                    strRetorno.Append(" OR ")
                End If
                Select Case coluna.Value
                    Case "S"
                        strRetorno.Append(String.Format(" ISNULL(CAST({0} AS varchar), '') LIKE '%{1}%'", coluna.Key, texto))
                    Case "D"
                        strRetorno.Append(String.Format(" ISNULL(CONVERT(VARCHAR, {0}, 103), '') LIKE '%{1}%'", coluna.Key, texto))
                    Case "M"
                        strRetorno.Append(String.Format(" 'R$ ' + REPLACE(REPLACE(REPLACE(CONVERT(VARCHAR, CAST({0} AS money), 1), ',', ';'), '.', ','), ';', '.') LIKE '%{1}%'", coluna.Key, texto))
                        End Select
            Next

            strRetorno.Insert(0, String.Format(" Row > {0} AND (", cursor))

            strRetorno.Append(String.Format(") ORDER BY {0} {1}", keyOrdena, ordem))

            Return strRetorno.ToString()
        End Function
    End Class
End Namespace


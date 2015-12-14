Imports System.Security.Cryptography
Imports System.Text

Public Class UAUWeb_CRYPTO

    Private Shared IV() As Byte = {&H18, &H34, &H54, &H72, &H85, &HAB, &HCD, &HDF}
    Private Shared key() As Byte = Encoding.UTF8.GetBytes("gcluau96")

    Shared Function Encriptar(ByVal Valor As String) As String
        Try
            Dim des As New DESCryptoServiceProvider
            Dim inputByteArray() As Byte = Encoding.UTF8.GetBytes(Valor)
            Dim ms As New System.IO.MemoryStream
            Dim cs As New CryptoStream(ms, des.CreateEncryptor(key, IV), CryptoStreamMode.Write)
            cs.Write(inputByteArray, 0, inputByteArray.Length)
            cs.FlushFinalBlock()
            Return Convert.ToBase64String(ms.ToArray())
        Catch e As Exception
            Return e.Message
        End Try
    End Function

    Shared Function Desencriptar(ByVal Valor As String) As String
        Dim inputByteArray(Valor.Length) As Byte
        Try
            Dim des As New DESCryptoServiceProvider
            inputByteArray = Convert.FromBase64String(Valor)
            Dim ms As New System.IO.MemoryStream
            Dim cs As New CryptoStream(ms, des.CreateDecryptor(key, IV), CryptoStreamMode.Write)
            cs.Write(inputByteArray, 0, inputByteArray.Length)
            cs.FlushFinalBlock()
            Dim enc As Encoding = Encoding.UTF8
            Return enc.GetString(ms.ToArray())
        Catch e As Exception
            Return e.Message
        End Try
    End Function

End Class


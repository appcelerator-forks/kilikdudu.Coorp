Imports System.Threading
Imports AcessoACS.Util
Imports System.Web
Imports System.Runtime.InteropServices
Imports AcessoACS.wsBoletoReference

Public Class UAUMonitorACS

    Private t As System.Threading.Timer

    Public Enum ServiceState
        SERVICE_STOPPED = 1
        SERVICE_START_PENDING = 2
        SERVICE_STOP_PENDING = 3
        SERVICE_RUNNING = 4
        SERVICE_CONTINUE_PENDING = 5
        SERVICE_PAUSE_PENDING = 6
        SERVICE_PAUSED = 7
    End Enum

    <StructLayout(LayoutKind.Sequential)>
    Public Structure ServiceStatus
        Public dwServiceType As Long
        Public dwCurrentState As ServiceState
        Public dwControlsAccepted As Long
        Public dwWin32ExitCode As Long
        Public dwServiceSpecificExitCode As Long
        Public dwCheckPoint As Long
        Public dwWaitHint As Long
    End Structure

    Declare Auto Function SetServiceStatus Lib "advapi32.dll" (ByVal handle As IntPtr, ByRef serviceStatus As ServiceStatus) As Boolean

    Protected Overrides Sub OnStart(ByVal args() As String)

        Dim serviceStatus As ServiceStatus = New ServiceStatus()
        serviceStatus.dwCurrentState = ServiceState.SERVICE_START_PENDING
        serviceStatus.dwWaitHint = 100000
        SetServiceStatus(Me.ServiceHandle, serviceStatus)

        'Agendo a thread que envia os boletos.
        AgendarThread()

        ' Update the service state to Running.
        serviceStatus.dwCurrentState = ServiceState.SERVICE_RUNNING
        SetServiceStatus(Me.ServiceHandle, serviceStatus)

    End Sub

    Protected Overrides Sub OnStop()
        t.Dispose()
        Dim serviceStatus As ServiceStatus = New ServiceStatus()
        serviceStatus.dwCurrentState = ServiceState.SERVICE_STOPPED
        SetServiceStatus(Me.ServiceHandle, serviceStatus)
    End Sub

    Protected Overrides Sub OnPause()
        t.Dispose()
        Dim serviceStatus As ServiceStatus = New ServiceStatus()
        serviceStatus.dwCurrentState = ServiceState.SERVICE_PAUSED
        SetServiceStatus(Me.ServiceHandle, serviceStatus)
    End Sub

    Protected Overrides Sub OnContinue()
        Dim serviceStatus As ServiceStatus = New ServiceStatus()
        serviceStatus.dwCurrentState = ServiceState.SERVICE_CONTINUE_PENDING
        serviceStatus.dwWaitHint = 100000
        SetServiceStatus(Me.ServiceHandle, serviceStatus)

        AgendarThread()

        serviceStatus.dwCurrentState = ServiceState.SERVICE_RUNNING
        SetServiceStatus(Me.ServiceHandle, serviceStatus)

    End Sub

    Private Sub AgendarThread()

        Dim method As New TimerCallback(AddressOf IniciaEnvioBoleto)
        Dim HoraMinuto() = System.Configuration.ConfigurationManager.AppSettings("HoraMinutoBoleto").Split(";")
        EventLog.WriteEntry("Agendando thread para " & HoraMinuto(0) & ":" & HoraMinuto(1) & ".")
        Dim ts As TimeSpan = TimeSpan.FromMilliseconds(DataHora.getMiliSecondsFromHourMinute(CInt(HoraMinuto(0)), CInt(HoraMinuto(1))))
        t = New System.Threading.Timer(method, Nothing, ts, System.Threading.Timeout.InfiniteTimeSpan)
    End Sub

    Private Sub IniciaEnvioBoleto()
        EventLog.WriteEntry("Executando notificação de boletos.")
        Dim ref As New wsBoleto
        ref.EnviaNotificacaoBoleto()
        AgendarThread()

    End Sub

End Class

<Global.Microsoft.VisualBasic.CompilerServices.DesignerGenerated()> _
Partial Class Principal
    Inherits System.Windows.Forms.Form

    'Form overrides dispose to clean up the component list.
    <System.Diagnostics.DebuggerNonUserCode()> _
    Protected Overrides Sub Dispose(ByVal disposing As Boolean)
        Try
            If disposing AndAlso components IsNot Nothing Then
                components.Dispose()
            End If
        Finally
            MyBase.Dispose(disposing)
        End Try
    End Sub

    'Required by the Windows Form Designer
    Private components As System.ComponentModel.IContainer

    'NOTE: The following procedure is required by the Windows Form Designer
    'It can be modified using the Windows Form Designer.  
    'Do not modify it using the code editor.
    <System.Diagnostics.DebuggerStepThrough()> _
    Private Sub InitializeComponent()
        Me.btnGravar = New System.Windows.Forms.Button()
        Me.btnTestarWebAPI = New System.Windows.Forms.Button()
        Me.configFile = New System.Windows.Forms.OpenFileDialog()
        Me.GrupoWebAPI = New System.Windows.Forms.GroupBox()
        Me.Label2 = New System.Windows.Forms.Label()
        Me.btnBuscarWebAPI = New System.Windows.Forms.Button()
        Me.txtConfigFileWebAPI = New System.Windows.Forms.TextBox()
        Me.Label1 = New System.Windows.Forms.Label()
        Me.txtEnderecoUAUWeb = New System.Windows.Forms.TextBox()
        Me.GrupoUAUWeb = New System.Windows.Forms.GroupBox()
        Me.btnTestarUAUWeb = New System.Windows.Forms.Button()
        Me.Label3 = New System.Windows.Forms.Label()
        Me.btnBuscarUAUWeb = New System.Windows.Forms.Button()
        Me.txtConfigFileUAUWeb = New System.Windows.Forms.TextBox()
        Me.Label4 = New System.Windows.Forms.Label()
        Me.txtEnderecoWebAPI = New System.Windows.Forms.TextBox()
        Me.GrupoWebAPI.SuspendLayout()
        Me.GrupoUAUWeb.SuspendLayout()
        Me.SuspendLayout()
        '
        'btnGravar
        '
        Me.btnGravar.Enabled = False
        Me.btnGravar.Location = New System.Drawing.Point(665, 13)
        Me.btnGravar.Name = "btnGravar"
        Me.btnGravar.Size = New System.Drawing.Size(75, 23)
        Me.btnGravar.TabIndex = 1
        Me.btnGravar.Text = "Gravar"
        Me.btnGravar.UseVisualStyleBackColor = True
        '
        'btnTestarWebAPI
        '
        Me.btnTestarWebAPI.Enabled = False
        Me.btnTestarWebAPI.Location = New System.Drawing.Point(231, 110)
        Me.btnTestarWebAPI.Name = "btnTestarWebAPI"
        Me.btnTestarWebAPI.Size = New System.Drawing.Size(75, 23)
        Me.btnTestarWebAPI.TabIndex = 2
        Me.btnTestarWebAPI.Text = "Testar"
        Me.btnTestarWebAPI.UseVisualStyleBackColor = True
        '
        'configFile
        '
        Me.configFile.FileName = "OpenFileDialog1"
        '
        'GrupoWebAPI
        '
        Me.GrupoWebAPI.Controls.Add(Me.Label2)
        Me.GrupoWebAPI.Controls.Add(Me.btnBuscarWebAPI)
        Me.GrupoWebAPI.Controls.Add(Me.btnTestarWebAPI)
        Me.GrupoWebAPI.Controls.Add(Me.txtConfigFileWebAPI)
        Me.GrupoWebAPI.Controls.Add(Me.Label1)
        Me.GrupoWebAPI.Controls.Add(Me.txtEnderecoUAUWeb)
        Me.GrupoWebAPI.Location = New System.Drawing.Point(19, 13)
        Me.GrupoWebAPI.Name = "GrupoWebAPI"
        Me.GrupoWebAPI.Size = New System.Drawing.Size(317, 141)
        Me.GrupoWebAPI.TabIndex = 7
        Me.GrupoWebAPI.TabStop = False
        Me.GrupoWebAPI.Text = "Informações do MobileWebAPI"
        '
        'Label2
        '
        Me.Label2.AutoSize = True
        Me.Label2.Location = New System.Drawing.Point(6, 28)
        Me.Label2.Name = "Label2"
        Me.Label2.Size = New System.Drawing.Size(212, 13)
        Me.Label2.TabIndex = 11
        Me.Label2.Text = "Arquivo de configuração do MobileWebAPI"
        '
        'btnBuscarWebAPI
        '
        Me.btnBuscarWebAPI.Location = New System.Drawing.Point(227, 44)
        Me.btnBuscarWebAPI.Name = "btnBuscarWebAPI"
        Me.btnBuscarWebAPI.Size = New System.Drawing.Size(79, 21)
        Me.btnBuscarWebAPI.TabIndex = 10
        Me.btnBuscarWebAPI.Text = "Buscar"
        Me.btnBuscarWebAPI.UseVisualStyleBackColor = True
        '
        'txtConfigFileWebAPI
        '
        Me.txtConfigFileWebAPI.Location = New System.Drawing.Point(9, 44)
        Me.txtConfigFileWebAPI.Name = "txtConfigFileWebAPI"
        Me.txtConfigFileWebAPI.Size = New System.Drawing.Size(212, 20)
        Me.txtConfigFileWebAPI.TabIndex = 9
        '
        'Label1
        '
        Me.Label1.AutoSize = True
        Me.Label1.Location = New System.Drawing.Point(6, 68)
        Me.Label1.Name = "Label1"
        Me.Label1.Size = New System.Drawing.Size(291, 13)
        Me.Label1.TabIndex = 8
        Me.Label1.Text = "Endereço do servidor onde está hospedado o UAUWeb_ws"
        '
        'txtEnderecoUAUWeb
        '
        Me.txtEnderecoUAUWeb.Enabled = False
        Me.txtEnderecoUAUWeb.Location = New System.Drawing.Point(9, 84)
        Me.txtEnderecoUAUWeb.Name = "txtEnderecoUAUWeb"
        Me.txtEnderecoUAUWeb.Size = New System.Drawing.Size(297, 20)
        Me.txtEnderecoUAUWeb.TabIndex = 7
        '
        'GrupoUAUWeb
        '
        Me.GrupoUAUWeb.Controls.Add(Me.btnTestarUAUWeb)
        Me.GrupoUAUWeb.Controls.Add(Me.Label3)
        Me.GrupoUAUWeb.Controls.Add(Me.btnBuscarUAUWeb)
        Me.GrupoUAUWeb.Controls.Add(Me.txtConfigFileUAUWeb)
        Me.GrupoUAUWeb.Controls.Add(Me.Label4)
        Me.GrupoUAUWeb.Controls.Add(Me.txtEnderecoWebAPI)
        Me.GrupoUAUWeb.Enabled = False
        Me.GrupoUAUWeb.Location = New System.Drawing.Point(342, 13)
        Me.GrupoUAUWeb.Name = "GrupoUAUWeb"
        Me.GrupoUAUWeb.Size = New System.Drawing.Size(317, 139)
        Me.GrupoUAUWeb.TabIndex = 8
        Me.GrupoUAUWeb.TabStop = False
        Me.GrupoUAUWeb.Text = "Informações do UAUWeb_ws"
        '
        'btnTestarUAUWeb
        '
        Me.btnTestarUAUWeb.Enabled = False
        Me.btnTestarUAUWeb.Location = New System.Drawing.Point(231, 108)
        Me.btnTestarUAUWeb.Name = "btnTestarUAUWeb"
        Me.btnTestarUAUWeb.Size = New System.Drawing.Size(75, 23)
        Me.btnTestarUAUWeb.TabIndex = 17
        Me.btnTestarUAUWeb.Text = "Testar"
        Me.btnTestarUAUWeb.UseVisualStyleBackColor = True
        '
        'Label3
        '
        Me.Label3.AutoSize = True
        Me.Label3.Location = New System.Drawing.Point(6, 26)
        Me.Label3.Name = "Label3"
        Me.Label3.Size = New System.Drawing.Size(206, 13)
        Me.Label3.TabIndex = 16
        Me.Label3.Text = "Arquivo de configuração do UAUWeb_ws"
        '
        'btnBuscarUAUWeb
        '
        Me.btnBuscarUAUWeb.Location = New System.Drawing.Point(227, 41)
        Me.btnBuscarUAUWeb.Name = "btnBuscarUAUWeb"
        Me.btnBuscarUAUWeb.Size = New System.Drawing.Size(79, 21)
        Me.btnBuscarUAUWeb.TabIndex = 15
        Me.btnBuscarUAUWeb.Text = "Buscar"
        Me.btnBuscarUAUWeb.UseVisualStyleBackColor = True
        '
        'txtConfigFileUAUWeb
        '
        Me.txtConfigFileUAUWeb.Location = New System.Drawing.Point(9, 42)
        Me.txtConfigFileUAUWeb.Name = "txtConfigFileUAUWeb"
        Me.txtConfigFileUAUWeb.Size = New System.Drawing.Size(212, 20)
        Me.txtConfigFileUAUWeb.TabIndex = 14
        '
        'Label4
        '
        Me.Label4.AutoSize = True
        Me.Label4.Location = New System.Drawing.Point(6, 66)
        Me.Label4.Name = "Label4"
        Me.Label4.Size = New System.Drawing.Size(300, 13)
        Me.Label4.TabIndex = 13
        Me.Label4.Text = "Endereço do servidor onde está hospedado o  MobileWebAPI"
        '
        'txtEnderecoWebAPI
        '
        Me.txtEnderecoWebAPI.Enabled = False
        Me.txtEnderecoWebAPI.Location = New System.Drawing.Point(9, 82)
        Me.txtEnderecoWebAPI.Name = "txtEnderecoWebAPI"
        Me.txtEnderecoWebAPI.Size = New System.Drawing.Size(297, 20)
        Me.txtEnderecoWebAPI.TabIndex = 12
        '
        'Principal
        '
        Me.AutoScaleDimensions = New System.Drawing.SizeF(6.0!, 13.0!)
        Me.AutoScaleMode = System.Windows.Forms.AutoScaleMode.Font
        Me.ClientSize = New System.Drawing.Size(752, 159)
        Me.Controls.Add(Me.GrupoUAUWeb)
        Me.Controls.Add(Me.GrupoWebAPI)
        Me.Controls.Add(Me.btnGravar)
        Me.Name = "Principal"
        Me.Text = "Configurar .NET MobileWebAPI"
        Me.GrupoWebAPI.ResumeLayout(False)
        Me.GrupoWebAPI.PerformLayout()
        Me.GrupoUAUWeb.ResumeLayout(False)
        Me.GrupoUAUWeb.PerformLayout()
        Me.ResumeLayout(False)

    End Sub
    Friend WithEvents btnGravar As System.Windows.Forms.Button
    Friend WithEvents btnTestarWebAPI As System.Windows.Forms.Button
    Friend WithEvents configFile As System.Windows.Forms.OpenFileDialog
    Friend WithEvents GrupoWebAPI As System.Windows.Forms.GroupBox
    Friend WithEvents Label2 As System.Windows.Forms.Label
    Friend WithEvents btnBuscarWebAPI As System.Windows.Forms.Button
    Friend WithEvents txtConfigFileWebAPI As System.Windows.Forms.TextBox
    Friend WithEvents Label1 As System.Windows.Forms.Label
    Friend WithEvents txtEnderecoUAUWeb As System.Windows.Forms.TextBox
    Friend WithEvents GrupoUAUWeb As System.Windows.Forms.GroupBox
    Friend WithEvents Label3 As System.Windows.Forms.Label
    Friend WithEvents btnBuscarUAUWeb As System.Windows.Forms.Button
    Friend WithEvents txtConfigFileUAUWeb As System.Windows.Forms.TextBox
    Friend WithEvents Label4 As System.Windows.Forms.Label
    Friend WithEvents txtEnderecoWebAPI As System.Windows.Forms.TextBox
    Friend WithEvents btnTestarUAUWeb As System.Windows.Forms.Button

End Class

namespace Gaia.Forms
{
    partial class CreateEvent
    {
        /// <summary>
        /// Required designer variable.
        /// </summary>
        private System.ComponentModel.IContainer components = null;

        /// <summary>
        /// Clean up any resources being used.
        /// </summary>
        /// <param name="disposing">true if managed resources should be disposed; otherwise, false.</param>
        protected override void Dispose(bool disposing)
        {
            if (disposing && (components != null))
            {
                components.Dispose();
            }
            base.Dispose(disposing);
        }

        #region Windows Form Designer generated code

        /// <summary>
        /// Required method for Designer support - do not modify
        /// the contents of this method with the code editor.
        /// </summary>
        private void InitializeComponent()
        {
            System.ComponentModel.ComponentResourceManager resources = new System.ComponentModel.ComponentResourceManager(typeof(CreateEvent));
            this.nudTeamsCount = new System.Windows.Forms.NumericUpDown();
            this.lTeamsCount = new System.Windows.Forms.Label();
            this.lEventName = new System.Windows.Forms.Label();
            this.tbEventName = new System.Windows.Forms.TextBox();
            this.lvGames = new System.Windows.Forms.ListView();
            this.chGamesCode = new System.Windows.Forms.ColumnHeader();
            this.chGamesName = new System.Windows.Forms.ColumnHeader();
            this.chGamesCountMode = new System.Windows.Forms.ColumnHeader();
            this.chSelectedGamesCode = new System.Windows.Forms.ColumnHeader();
            this.chSelectedGamesName = new System.Windows.Forms.ColumnHeader();
            this.chSelectedGamesCountMode = new System.Windows.Forms.ColumnHeader();
            this.lChooseGames = new System.Windows.Forms.Label();
            this.bGameSelect = new System.Windows.Forms.Button();
            this.lvSelectedGames = new System.Windows.Forms.ListView();
            this.bGameUnselect = new System.Windows.Forms.Button();
            ((System.ComponentModel.ISupportInitialize)(this.nudTeamsCount)).BeginInit();
            this.SuspendLayout();
            // 
            // nudTeamsCount
            // 
            this.nudTeamsCount.Location = new System.Drawing.Point(142, 44);
            this.nudTeamsCount.Margin = new System.Windows.Forms.Padding(4, 3, 4, 3);
            this.nudTeamsCount.Name = "nudTeamsCount";
            this.nudTeamsCount.Size = new System.Drawing.Size(117, 23);
            this.nudTeamsCount.TabIndex = 3;
            // 
            // lTeamsCount
            // 
            this.lTeamsCount.AutoSize = true;
            this.lTeamsCount.Location = new System.Drawing.Point(14, 46);
            this.lTeamsCount.Margin = new System.Windows.Forms.Padding(4, 0, 4, 0);
            this.lTeamsCount.Name = "lTeamsCount";
            this.lTeamsCount.Size = new System.Drawing.Size(105, 15);
            this.lTeamsCount.TabIndex = 2;
            this.lTeamsCount.Text = "Nombre d\'équipes";
            // 
            // lEventName
            // 
            this.lEventName.AutoSize = true;
            this.lEventName.Location = new System.Drawing.Point(14, 17);
            this.lEventName.Margin = new System.Windows.Forms.Padding(4, 0, 4, 0);
            this.lEventName.Name = "lEventName";
            this.lEventName.Size = new System.Drawing.Size(118, 15);
            this.lEventName.TabIndex = 0;
            this.lEventName.Text = "Nom de l\'évènement";
            // 
            // tbEventName
            // 
            this.tbEventName.Location = new System.Drawing.Point(142, 14);
            this.tbEventName.Margin = new System.Windows.Forms.Padding(4, 3, 4, 3);
            this.tbEventName.Name = "tbEventName";
            this.tbEventName.Size = new System.Drawing.Size(116, 23);
            this.tbEventName.TabIndex = 1;
            // 
            // lvGames
            // 
            this.lvGames.Columns.AddRange(new System.Windows.Forms.ColumnHeader[] {
            this.chGamesCode,
            this.chGamesName,
            this.chGamesCountMode});
            this.lvGames.Location = new System.Drawing.Point(14, 92);
            this.lvGames.Margin = new System.Windows.Forms.Padding(4, 3, 4, 3);
            this.lvGames.Name = "lvGames";
            this.lvGames.Size = new System.Drawing.Size(244, 183);
            this.lvGames.TabIndex = 5;
            this.lvGames.UseCompatibleStateImageBehavior = false;
            this.lvGames.View = System.Windows.Forms.View.List;
            this.lvGames.ItemSelectionChanged += new System.Windows.Forms.ListViewItemSelectionChangedEventHandler(this.lvGames_ItemSelectionChanged);
            // 
            // chGamesCode
            // 
            this.chGamesCode.Text = "Code";
            this.chGamesCode.Width = 0;
            // 
            // chGamesName
            // 
            this.chGamesName.Text = "Nom";
            // 
            // chGamesCountMode
            // 
            this.chGamesCountMode.Text = "Comptage";
            // 
            // chSelectedGamesCode
            // 
            this.chSelectedGamesCode.Text = "Code";
            this.chSelectedGamesCode.Width = 0;
            // 
            // chSelectedGamesName
            // 
            this.chSelectedGamesName.Text = "Nom";
            // 
            // chSelectedGamesCountMode
            // 
            this.chSelectedGamesCountMode.Text = "Comptage";
            // 
            // lChooseGames
            // 
            this.lChooseGames.AutoSize = true;
            this.lChooseGames.Location = new System.Drawing.Point(14, 74);
            this.lChooseGames.Margin = new System.Windows.Forms.Padding(4, 0, 4, 0);
            this.lChooseGames.Name = "lChooseGames";
            this.lChooseGames.Size = new System.Drawing.Size(81, 15);
            this.lChooseGames.TabIndex = 4;
            this.lChooseGames.Text = "Chox des jeux";
            // 
            // bGameSelect
            // 
            this.bGameSelect.Location = new System.Drawing.Point(266, 114);
            this.bGameSelect.Margin = new System.Windows.Forms.Padding(4, 3, 4, 3);
            this.bGameSelect.Name = "bGameSelect";
            this.bGameSelect.Size = new System.Drawing.Size(88, 27);
            this.bGameSelect.TabIndex = 6;
            this.bGameSelect.Text = "Button1";
            this.bGameSelect.UseVisualStyleBackColor = true;
            this.bGameSelect.Click += new System.EventHandler(this.bGameSelect_Click);
            // 
            // lvSelectedGames
            // 
            this.lvSelectedGames.Columns.AddRange(new System.Windows.Forms.ColumnHeader[] {
            this.chSelectedGamesCode,
            this.chSelectedGamesName,
            this.chSelectedGamesCountMode});
            this.lvSelectedGames.Location = new System.Drawing.Point(360, 92);
            this.lvSelectedGames.Margin = new System.Windows.Forms.Padding(4, 3, 4, 3);
            this.lvSelectedGames.Name = "lvSelectedGames";
            this.lvSelectedGames.Size = new System.Drawing.Size(244, 183);
            this.lvSelectedGames.TabIndex = 8;
            this.lvSelectedGames.UseCompatibleStateImageBehavior = false;
            this.lvSelectedGames.View = System.Windows.Forms.View.List;
            // 
            // bGameUnselect
            // 
            this.bGameUnselect.Location = new System.Drawing.Point(266, 190);
            this.bGameUnselect.Margin = new System.Windows.Forms.Padding(4, 3, 4, 3);
            this.bGameUnselect.Name = "bGameUnselect";
            this.bGameUnselect.Size = new System.Drawing.Size(88, 27);
            this.bGameUnselect.TabIndex = 7;
            this.bGameUnselect.Text = "Button2";
            this.bGameUnselect.UseVisualStyleBackColor = true;
            this.bGameUnselect.Click += new System.EventHandler(this.bGameUnselect_Click);
            // 
            // CreateEvent
            // 
            this.AutoScaleDimensions = new System.Drawing.SizeF(7F, 15F);
            this.AutoScaleMode = System.Windows.Forms.AutoScaleMode.Font;
            this.ClientSize = new System.Drawing.Size(933, 519);
            this.Controls.Add(this.bGameUnselect);
            this.Controls.Add(this.lvSelectedGames);
            this.Controls.Add(this.bGameSelect);
            this.Controls.Add(this.lChooseGames);
            this.Controls.Add(this.lvGames);
            this.Controls.Add(this.tbEventName);
            this.Controls.Add(this.lEventName);
            this.Controls.Add(this.lTeamsCount);
            this.Controls.Add(this.nudTeamsCount);
            this.Icon = ((System.Drawing.Icon)(resources.GetObject("$this.Icon")));
            this.Margin = new System.Windows.Forms.Padding(4, 3, 4, 3);
            this.Name = "CreateEvent";
            this.Text = "Créer un évènement";
            this.Load += new System.EventHandler(this.CreateEvent_Load);
            ((System.ComponentModel.ISupportInitialize)(this.nudTeamsCount)).EndInit();
            this.ResumeLayout(false);
            this.PerformLayout();

        }

        #endregion
        private NumericUpDown nudTeamsCount;
        private Label lTeamsCount;
        private Label lEventName;
        private TextBox tbEventName;
        private ListView lvGames;
        private ColumnHeader chGamesCode;
        private ColumnHeader chGamesName;
        private ColumnHeader chGamesCountMode;
        private Label lChooseGames;
        private Button bGameSelect;
        private Button bGameUnselect;
        private ListView lvSelectedGames;
        private ColumnHeader chSelectedGamesCode;
        private ColumnHeader chSelectedGamesName;
        private ColumnHeader chSelectedGamesCountMode;
    }
}
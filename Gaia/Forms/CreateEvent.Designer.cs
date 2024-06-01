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
            nudTeamsCount = new NumericUpDown();
            lTeamsCount = new Label();
            lEventName = new Label();
            tbEventName = new TextBox();
            lvGames = new ListView();
            chGamesCode = new ColumnHeader();
            chGamesName = new ColumnHeader();
            chGamesCountMode = new ColumnHeader();
            chSelectedGamesCode = new ColumnHeader();
            chSelectedGamesName = new ColumnHeader();
            chSelectedGamesCountMode = new ColumnHeader();
            lChooseGames = new Label();
            bGameSelect = new Button();
            lvSelectedGames = new ListView();
            bGameUnselect = new Button();
            bUp = new Button();
            bDown = new Button();
            ((System.ComponentModel.ISupportInitialize)nudTeamsCount).BeginInit();
            SuspendLayout();
            // 
            // nudTeamsCount
            // 
            nudTeamsCount.Location = new Point(142, 44);
            nudTeamsCount.Margin = new Padding(4, 3, 4, 3);
            nudTeamsCount.Name = "nudTeamsCount";
            nudTeamsCount.Size = new Size(117, 23);
            nudTeamsCount.TabIndex = 3;
            // 
            // lTeamsCount
            // 
            lTeamsCount.AutoSize = true;
            lTeamsCount.Location = new Point(14, 46);
            lTeamsCount.Margin = new Padding(4, 0, 4, 0);
            lTeamsCount.Name = "lTeamsCount";
            lTeamsCount.Size = new Size(105, 15);
            lTeamsCount.TabIndex = 2;
            lTeamsCount.Text = "Nombre d'équipes";
            // 
            // lEventName
            // 
            lEventName.AutoSize = true;
            lEventName.Location = new Point(14, 17);
            lEventName.Margin = new Padding(4, 0, 4, 0);
            lEventName.Name = "lEventName";
            lEventName.Size = new Size(118, 15);
            lEventName.TabIndex = 0;
            lEventName.Text = "Nom de l'évènement";
            // 
            // tbEventName
            // 
            tbEventName.Location = new Point(142, 14);
            tbEventName.Margin = new Padding(4, 3, 4, 3);
            tbEventName.Name = "tbEventName";
            tbEventName.Size = new Size(116, 23);
            tbEventName.TabIndex = 1;
            // 
            // lvGames
            // 
            lvGames.Columns.AddRange(new ColumnHeader[] { chGamesCode, chGamesName, chGamesCountMode });
            lvGames.Location = new Point(14, 92);
            lvGames.Margin = new Padding(4, 3, 4, 3);
            lvGames.MultiSelect = false;
            lvGames.Name = "lvGames";
            lvGames.Size = new Size(244, 183);
            lvGames.TabIndex = 5;
            lvGames.UseCompatibleStateImageBehavior = false;
            lvGames.View = View.List;
            lvGames.ItemSelectionChanged += lvGames_ItemSelectionChanged;
            // 
            // chGamesCode
            // 
            chGamesCode.Text = "Code";
            chGamesCode.Width = 0;
            // 
            // chGamesName
            // 
            chGamesName.Text = "Nom";
            // 
            // chGamesCountMode
            // 
            chGamesCountMode.Text = "Comptage";
            // 
            // chSelectedGamesCode
            // 
            chSelectedGamesCode.Text = "Code";
            chSelectedGamesCode.Width = 0;
            // 
            // chSelectedGamesName
            // 
            chSelectedGamesName.Text = "Nom";
            // 
            // chSelectedGamesCountMode
            // 
            chSelectedGamesCountMode.Text = "Comptage";
            // 
            // lChooseGames
            // 
            lChooseGames.AutoSize = true;
            lChooseGames.Location = new Point(14, 74);
            lChooseGames.Margin = new Padding(4, 0, 4, 0);
            lChooseGames.Name = "lChooseGames";
            lChooseGames.Size = new Size(81, 15);
            lChooseGames.TabIndex = 4;
            lChooseGames.Text = "Chox des jeux";
            // 
            // bGameSelect
            // 
            bGameSelect.Location = new Point(266, 103);
            bGameSelect.Margin = new Padding(4, 3, 4, 3);
            bGameSelect.Name = "bGameSelect";
            bGameSelect.Size = new Size(88, 27);
            bGameSelect.TabIndex = 6;
            bGameSelect.Text = "Ajouter";
            bGameSelect.UseVisualStyleBackColor = true;
            bGameSelect.Click += bGameSelect_Click;
            // 
            // lvSelectedGames
            // 
            lvSelectedGames.Columns.AddRange(new ColumnHeader[] { chSelectedGamesCode, chSelectedGamesName, chSelectedGamesCountMode });
            lvSelectedGames.Location = new Point(362, 92);
            lvSelectedGames.Margin = new Padding(4, 3, 4, 3);
            lvSelectedGames.MultiSelect = false;
            lvSelectedGames.Name = "lvSelectedGames";
            lvSelectedGames.Size = new Size(244, 183);
            lvSelectedGames.TabIndex = 8;
            lvSelectedGames.UseCompatibleStateImageBehavior = false;
            lvSelectedGames.View = View.List;
            lvSelectedGames.ItemSelectionChanged += lvSelectedGames_ItemSelectionChanged;
            // 
            // bGameUnselect
            // 
            bGameUnselect.Location = new Point(266, 136);
            bGameUnselect.Margin = new Padding(4, 3, 4, 3);
            bGameUnselect.Name = "bGameUnselect";
            bGameUnselect.Size = new Size(88, 27);
            bGameUnselect.TabIndex = 7;
            bGameUnselect.Text = "Supprimer";
            bGameUnselect.UseVisualStyleBackColor = true;
            bGameUnselect.Click += bGameUnselect_Click;
            // 
            // bUp
            // 
            bUp.Location = new Point(266, 211);
            bUp.Margin = new Padding(4, 3, 4, 3);
            bUp.Name = "bUp";
            bUp.Size = new Size(88, 27);
            bUp.TabIndex = 9;
            bUp.Text = "Monter";
            bUp.UseVisualStyleBackColor = true;
            // 
            // bDown
            // 
            bDown.Location = new Point(266, 244);
            bDown.Margin = new Padding(4, 3, 4, 3);
            bDown.Name = "bDown";
            bDown.Size = new Size(88, 27);
            bDown.TabIndex = 10;
            bDown.Text = "Descendre";
            bDown.UseVisualStyleBackColor = true;
            // 
            // CreateEvent
            // 
            AutoScaleDimensions = new SizeF(7F, 15F);
            AutoScaleMode = AutoScaleMode.Font;
            ClientSize = new Size(641, 399);
            Controls.Add(bDown);
            Controls.Add(bUp);
            Controls.Add(bGameUnselect);
            Controls.Add(lvSelectedGames);
            Controls.Add(bGameSelect);
            Controls.Add(lChooseGames);
            Controls.Add(lvGames);
            Controls.Add(tbEventName);
            Controls.Add(lEventName);
            Controls.Add(lTeamsCount);
            Controls.Add(nudTeamsCount);
            Icon = (Icon)resources.GetObject("$this.Icon");
            Margin = new Padding(4, 3, 4, 3);
            Name = "CreateEvent";
            Text = "Créer un évènement";
            Load += CreateEvent_Load;
            ((System.ComponentModel.ISupportInitialize)nudTeamsCount).EndInit();
            ResumeLayout(false);
            PerformLayout();
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
        private Button bUp;
        private Button bDown;
    }
}
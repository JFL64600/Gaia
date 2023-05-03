namespace Gaia.Forms
{
    partial class Scoreboards
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
            System.ComponentModel.ComponentResourceManager resources = new System.ComponentModel.ComponentResourceManager(typeof(Scoreboards));
            pPanel = new Panel();
            bSetRanking = new Button();
            tpRanking = new TabPage();
            lThird = new Label();
            lSecond = new Label();
            lFirst = new Label();
            rtbRank = new RichTextBox();
            tcJeux = new TabControl();
            pPanel.SuspendLayout();
            tpRanking.SuspendLayout();
            tcJeux.SuspendLayout();
            SuspendLayout();
            // 
            // pPanel
            // 
            pPanel.Controls.Add(bSetRanking);
            pPanel.Dock = DockStyle.Top;
            pPanel.Location = new Point(0, 0);
            pPanel.Margin = new Padding(4, 5, 4, 5);
            pPanel.Name = "pPanel";
            pPanel.Size = new Size(1090, 54);
            pPanel.TabIndex = 2;
            // 
            // bSetRanking
            // 
            bSetRanking.Location = new Point(959, 5);
            bSetRanking.Margin = new Padding(4, 5, 4, 5);
            bSetRanking.Name = "bSetRanking";
            bSetRanking.Size = new Size(117, 46);
            bSetRanking.TabIndex = 0;
            bSetRanking.Text = "Classement";
            bSetRanking.UseVisualStyleBackColor = true;
            bSetRanking.Click += bSetRanking_Click;
            // 
            // tpRanking
            // 
            tpRanking.Controls.Add(lThird);
            tpRanking.Controls.Add(lSecond);
            tpRanking.Controls.Add(lFirst);
            tpRanking.Controls.Add(rtbRank);
            tpRanking.Location = new Point(4, 27);
            tpRanking.Margin = new Padding(4, 5, 4, 5);
            tpRanking.Name = "tpRanking";
            tpRanking.Padding = new Padding(4, 5, 4, 5);
            tpRanking.Size = new Size(1082, 715);
            tpRanking.TabIndex = 6;
            tpRanking.Text = "Classement";
            tpRanking.UseVisualStyleBackColor = true;
            tpRanking.Paint += tpRanking_Paint;
            // 
            // lThird
            // 
            lThird.AutoSize = true;
            lThird.Font = new Font("Trebuchet MS", 14.25F, FontStyle.Regular, GraphicsUnit.Point);
            lThird.Location = new Point(601, 145);
            lThird.Margin = new Padding(4, 0, 4, 0);
            lThird.Name = "lThird";
            lThird.Size = new Size(0, 24);
            lThird.TabIndex = 5;
            // 
            // lSecond
            // 
            lSecond.AutoSize = true;
            lSecond.Font = new Font("Trebuchet MS", 14.25F, FontStyle.Regular, GraphicsUnit.Point);
            lSecond.Location = new Point(100, 120);
            lSecond.Margin = new Padding(4, 0, 4, 0);
            lSecond.Name = "lSecond";
            lSecond.Size = new Size(0, 24);
            lSecond.TabIndex = 4;
            // 
            // lFirst
            // 
            lFirst.AutoSize = true;
            lFirst.Font = new Font("Trebuchet MS", 14.25F, FontStyle.Regular, GraphicsUnit.Point);
            lFirst.Location = new Point(350, 70);
            lFirst.Margin = new Padding(4, 0, 4, 0);
            lFirst.Name = "lFirst";
            lFirst.Size = new Size(0, 24);
            lFirst.TabIndex = 3;
            // 
            // rtbRank
            // 
            rtbRank.Dock = DockStyle.Bottom;
            rtbRank.Location = new Point(4, 300);
            rtbRank.Margin = new Padding(4, 5, 4, 5);
            rtbRank.Name = "rtbRank";
            rtbRank.Size = new Size(1074, 410);
            rtbRank.TabIndex = 2;
            rtbRank.Text = "";
            // 
            // tcJeux
            // 
            tcJeux.Controls.Add(tpRanking);
            tcJeux.Dock = DockStyle.Fill;
            tcJeux.Location = new Point(0, 54);
            tcJeux.Margin = new Padding(4, 5, 4, 5);
            tcJeux.Name = "tcJeux";
            tcJeux.SelectedIndex = 0;
            tcJeux.Size = new Size(1090, 746);
            tcJeux.TabIndex = 0;
            // 
            // Scoreboards
            // 
            AutoScaleDimensions = new SizeF(7F, 18F);
            AutoScaleMode = AutoScaleMode.Font;
            ClientSize = new Size(1090, 800);
            Controls.Add(tcJeux);
            Controls.Add(pPanel);
            Font = new Font("Trebuchet MS", 9F, FontStyle.Regular, GraphicsUnit.Point);
            Icon = (Icon)resources.GetObject("$this.Icon");
            Margin = new Padding(4, 5, 4, 5);
            MaximizeBox = false;
            MaximumSize = new Size(1106, 839);
            MinimumSize = new Size(1106, 839);
            Name = "Scoreboards";
            SizeGripStyle = SizeGripStyle.Hide;
            StartPosition = FormStartPosition.CenterScreen;
            Text = "Gaia";
            Load += Scoreboards_Load;
            pPanel.ResumeLayout(false);
            tpRanking.ResumeLayout(false);
            tpRanking.PerformLayout();
            tcJeux.ResumeLayout(false);
            ResumeLayout(false);
        }

        #endregion
        private Panel pPanel;
        private Button bSetRanking;
        private TabPage tpRanking;
        private RichTextBox rtbRank;
        private TabControl tcJeux;
        private Label lFirst;
        private Label lSecond;
        private Label lThird;
    }
}
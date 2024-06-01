namespace Gaia.Controls
{
    partial class Score
    {
        /// <summary> 
        /// Variable nécessaire au concepteur.
        /// </summary>
        private System.ComponentModel.IContainer components = null;

        /// <summary> 
        /// Nettoyage des ressources utilisées.
        /// </summary>
        /// <param name="disposing">true si les ressources managées doivent être supprimées ; sinon, false.</param>
        protected override void Dispose(bool disposing)
        {
            if (disposing && (components != null))
            {
                components.Dispose();
            }
            base.Dispose(disposing);
        }

        #region Code généré par le Concepteur de composants

        /// <summary> 
        /// Méthode requise pour la prise en charge du concepteur - ne modifiez pas 
        /// le contenu de cette méthode avec l'éditeur de code.
        /// </summary>
        private void InitializeComponent()
        {
            System.ComponentModel.ComponentResourceManager resources = new System.ComponentModel.ComponentResourceManager(typeof(Score));
            bValid = new Button();
            nupMinutes = new NumericUpDown();
            nupSecondes = new NumericUpDown();
            nupCentisecondes = new NumericUpDown();
            nupPoints = new NumericUpDown();
            lMinutes = new Label();
            lSecondes = new Label();
            lCentisecondes = new Label();
            lPoints = new Label();
            lPosition = new Label();
            ((System.ComponentModel.ISupportInitialize)nupMinutes).BeginInit();
            ((System.ComponentModel.ISupportInitialize)nupSecondes).BeginInit();
            ((System.ComponentModel.ISupportInitialize)nupCentisecondes).BeginInit();
            ((System.ComponentModel.ISupportInitialize)nupPoints).BeginInit();
            SuspendLayout();
            // 
            // bValid
            // 
            bValid.Anchor = AnchorStyles.Bottom | AnchorStyles.Right;
            bValid.Enabled = false;
            bValid.Image = (Image)resources.GetObject("bValid.Image");
            bValid.Name = "bValid";
            bValid.Size = new Size(20, 20);
            bValid.TabIndex = 4;
            bValid.UseVisualStyleBackColor = true;
            bValid.Click += bValid_Click;
            // 
            // nupMinutes
            // 
            nupMinutes.Anchor = AnchorStyles.Top | AnchorStyles.Bottom | AnchorStyles.Left | AnchorStyles.Right;
            nupMinutes.Name = "nupMinutes";
            nupMinutes.Size = new Size(50, 23);
            nupMinutes.TabIndex = 1;
            nupMinutes.TextAlign = HorizontalAlignment.Right;
            nupMinutes.ValueChanged += nup_ValueChanged;
            // 
            // nupSecondes
            // 
            nupSecondes.Anchor = AnchorStyles.Top | AnchorStyles.Bottom | AnchorStyles.Left | AnchorStyles.Right;
            nupSecondes.Maximum = new decimal(new int[] { 59, 0, 0, 0 });
            nupSecondes.Name = "nupSecondes";
            nupSecondes.Size = new Size(50, 23);
            nupSecondes.TabIndex = 2;
            nupSecondes.TextAlign = HorizontalAlignment.Right;
            nupSecondes.ValueChanged += nup_ValueChanged;
            // 
            // nupCentisecondes
            // 
            nupCentisecondes.Anchor = AnchorStyles.Top | AnchorStyles.Bottom | AnchorStyles.Left | AnchorStyles.Right;
            nupCentisecondes.Maximum = new decimal(new int[] { 99, 0, 0, 0 });
            nupCentisecondes.Name = "nupCentisecondes";
            nupCentisecondes.Size = new Size(50, 23);
            nupCentisecondes.TabIndex = 3;
            nupCentisecondes.TextAlign = HorizontalAlignment.Right;
            nupCentisecondes.ValueChanged += nup_ValueChanged;
            // 
            // nupPoints
            // 
            nupPoints.Anchor = AnchorStyles.Top | AnchorStyles.Bottom | AnchorStyles.Left | AnchorStyles.Right;
            nupPoints.Maximum = new decimal(new int[] { 500, 0, 0, 0 });
            nupPoints.Name = "nupPoints";
            nupPoints.Size = new Size(140, 23);
            nupPoints.TabIndex = 1;
            nupPoints.TextAlign = HorizontalAlignment.Right;
            nupPoints.ValueChanged += nup_ValueChanged;
            // 
            // lMinutes
            // 
            lMinutes.Anchor = AnchorStyles.Top | AnchorStyles.Bottom | AnchorStyles.Left | AnchorStyles.Right;
            lMinutes.AutoSize = true;
            lMinutes.Name = "lMinutes";
            lMinutes.Size = new Size(28, 15);
            lMinutes.TabIndex = 0;
            lMinutes.Text = "min";
            // 
            // lSecondes
            // 
            lSecondes.Anchor = AnchorStyles.Top | AnchorStyles.Bottom | AnchorStyles.Left | AnchorStyles.Right;
            lSecondes.AutoSize = true;
            lSecondes.Name = "lSecondes";
            lSecondes.Size = new Size(12, 15);
            lSecondes.TabIndex = 0;
            lSecondes.Text = "s";
            // 
            // lCentisecondes
            // 
            lCentisecondes.Anchor = AnchorStyles.Top | AnchorStyles.Bottom | AnchorStyles.Left | AnchorStyles.Right;
            lCentisecondes.AutoSize = true;
            lCentisecondes.Name = "lCentisecondes";
            lCentisecondes.Size = new Size(18, 15);
            lCentisecondes.TabIndex = 0;
            lCentisecondes.Text = "cs";
            // 
            // lPoints
            // 
            lPoints.Anchor = AnchorStyles.Top | AnchorStyles.Bottom | AnchorStyles.Left | AnchorStyles.Right;
            lPoints.AutoSize = true;
            lPoints.Name = "lPoints";
            lPoints.Size = new Size(48, 15);
            lPoints.TabIndex = 0;
            lPoints.Text = "Point(s)";
            // 
            // lPosition
            // 
            lPosition.Anchor = AnchorStyles.Top | AnchorStyles.Right;
            lPosition.AutoSize = true;
            lPosition.Font = new Font("Trebuchet MS", 14.25F, FontStyle.Regular, GraphicsUnit.Point);
            lPosition.Name = "lPosition";
            lPosition.Size = new Size(30, 24);
            lPosition.TabIndex = 0;
            lPosition.Text = "17";
            // 
            // Score
            // 
            Controls.Add(bValid);
            Controls.Add(lMinutes);
            Controls.Add(nupMinutes);
            Controls.Add(lSecondes);
            Controls.Add(nupSecondes);
            Controls.Add(lCentisecondes);
            Controls.Add(nupCentisecondes);
            Controls.Add(lPoints);
            Controls.Add(nupPoints);
            Controls.Add(lPosition);
            ControlAdded += Score_ControlAdded;
            ((System.ComponentModel.ISupportInitialize)nupMinutes).EndInit();
            ((System.ComponentModel.ISupportInitialize)nupSecondes).EndInit();
            ((System.ComponentModel.ISupportInitialize)nupCentisecondes).EndInit();
            ((System.ComponentModel.ISupportInitialize)nupPoints).EndInit();
            ResumeLayout(false);
            PerformLayout();
        }

        #endregion
        private Button bValid;
        private NumericUpDown nupMinutes;
        private NumericUpDown nupSecondes;
        private NumericUpDown nupCentisecondes;
        private NumericUpDown nupPoints;
        private Label lMinutes;
        private Label lSecondes;
        private Label lCentisecondes;
        private Label lPoints;
        private Label lPosition;
    }
}

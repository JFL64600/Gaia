namespace Gaia.Forms
{
    public partial class Choose : Form
    {
        #region Properties
        public string Root { get; set; } = string.Empty;
        #endregion
        #region Events
        private void Choose_Load(object sender, EventArgs e)
        {
            cbChoose.Items.Add("-- Créer un évènement -- ");
            foreach (string directory in Directory.GetDirectories(Root))
            {
                string name = new DirectoryInfo(directory).Name;
                if (!name.StartsWith("_"))
                {
                    cbChoose.Items.Add(new DirectoryInfo(directory).Name);
                }
            }
        }

        private void bOK_Click(object sender, EventArgs e)
        {
            DialogResult = DialogResult.OK;
            Close();
        }

        private void bCancel_Click(object sender, EventArgs e)
        {
            DialogResult = DialogResult.Cancel;
            Close();
        }
        #endregion
        #region Methods
        public string GetEvent()
        {
            return cbChoose.SelectedItem == null ? string.Empty : cbChoose.SelectedItem.ToString();
        }
        #endregion
        public Choose()
        {
            InitializeComponent();
        }
    }
}

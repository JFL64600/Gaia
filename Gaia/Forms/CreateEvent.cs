using Gaia.Classes;
using Newtonsoft.Json;

namespace Gaia.Forms
{
    public partial class CreateEvent : Form
    {
        #region Declarations
        private const string JSONGamesFile = @"Resources\games.json";
        private List<Game> _games;
        #endregion
        #region Properties
        public string Root { get; set; } = string.Empty;
        #endregion
        #region Events
        private void CreateEvent_Load(object sender, EventArgs e)
        {
            using StreamReader sr = new(Path.Combine(AppDomain.CurrentDomain.BaseDirectory, JSONGamesFile));
            _games = JsonConvert.DeserializeObject<List<Game>>(sr.ReadToEnd());
            foreach (Game game in _games)
            {
                lvGames.Items.Add(game.Code, game.Label, 0);
            }
            SetButtons();
        }
        private void lvGames_ItemSelectionChanged(object sender, ListViewItemSelectionChangedEventArgs e)
        {
            SetButtons();
        }
        private void lvSelectedGames_ItemSelectionChanged(object sender, ListViewItemSelectionChangedEventArgs e)
        {
            SetButtons();
        }
        private void bGameSelect_Click(object sender, EventArgs e)
        {
            if (lvGames.SelectedItems.Count > 0)
            {
                lvSelectedGames.Items.Add(lvGames.SelectedItems[0].Name, lvGames.SelectedItems[0].Text, 0);
                lvGames.Items.Remove(lvGames.SelectedItems[0]);
            }
            SetButtons();
        }
        private void bGameUnselect_Click(object sender, EventArgs e)
        {
            if (lvSelectedGames.SelectedItems.Count > 0)
            {
                lvGames.Items.Add(lvSelectedGames.SelectedItems[0].Name, lvSelectedGames.SelectedItems[0].Text, 0);
                lvSelectedGames.Items.Remove(lvSelectedGames.SelectedItems[0]);
            }
            SetButtons();
        }
        #endregion
        public CreateEvent()
        {
            InitializeComponent();
        }
        #region Privates
        private void SetButtons()
        {
            bGameSelect.Enabled = lvGames.SelectedItems != null && lvGames.SelectedItems.Count > 0;
            bGameUnselect.Enabled = lvSelectedGames.SelectedItems != null && lvSelectedGames.SelectedItems.Count > 0;
            //bUp.Enabled = bGameUnselect.Enabled && lvSelectedGames.SelectedItems[0].Index > 0;
        }
        #endregion
    }
}

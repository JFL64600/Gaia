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
            test();
        }

        private void lvGames_ItemSelectionChanged(object sender, ListViewItemSelectionChangedEventArgs e)
        {
            test();
        }

        private void bGameSelect_Click(object sender, EventArgs e)
        {
            //Dim toto As String = ""
            //If String.IsNullOrWhiteSpace(toto) Then

            //End If
            //For Each si As ListViewItem In lvGames.SelectedItems
            //    si.EnsureVisible()
            //    MsgBox("test")
            //    Dim titi As String = ""
            //    If String.IsNullOrWhiteSpace(titi) Then

            //    End If
            //Next
        }

        private void bGameUnselect_Click(object sender, EventArgs e)
        {

        }
        #endregion
        public CreateEvent()
        {
            InitializeComponent();
        }
        #region Privates
        private void test()
        {
            bGameSelect.Enabled = lvGames.SelectedItems != null && lvGames.SelectedItems.Count > 0;
            bGameUnselect.Enabled = lvSelectedGames.SelectedItems != null && lvSelectedGames.SelectedItems.Count > 0;
        }
        #endregion
    }
}

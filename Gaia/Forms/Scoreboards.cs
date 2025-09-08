using Gaia.Classes;
using Gaia.Controls;
using Newtonsoft.Json;

namespace Gaia.Forms
{
    public partial class Scoreboards : Form
    {
        #region Declarations
        private const string JSONGamesFile = "games.json";
        private const string JSONTeamsFile = "teams.json";
        private const string TimeMax = "100:59:99";
        private string _eventPath;
        private List<Game> _games;
        private List<Team> _teams;
        private readonly List<Rotation> _rotations = [];
        #endregion
        #region Properties
        public string Root { get; set; } = string.Empty;
        public string Event { get; set; } = string.Empty;
        #endregion
        #region Events
        private void Scoreboards_Load(object sender, EventArgs e)
        {
            _eventPath = Path.Combine(Root, Event);
            Text += $" - {Event}";
            _games = JsonConvert.DeserializeObject<List<Game>>(Tools.ReadFile(Path.Combine(AppDomain.CurrentDomain.BaseDirectory, "Resources", JSONGamesFile)));
            _teams = JsonConvert.DeserializeObject<List<Team>>(Tools.ReadFile(Path.Combine(_eventPath, JSONTeamsFile)));
            List<PlayedGame> playedGames = JsonConvert.DeserializeObject<List<PlayedGame>>(Tools.ReadFile(Path.Combine(_eventPath, JSONGamesFile)));
            int columnCount = Tools.GetRotationCount(playedGames);
            foreach (PlayedGame playedGame in playedGames)
            {
                AddTabPage(columnCount, _games.Find(c => c.Code == playedGame.Game), playedGame.Rotations);
            }
            tcJeux.SelectedIndex = 0;
            //using StreamWriter sw = new(Path.Combine(_eventPath, "rotations.hson"));
            //sw.Write(JsonConvert.SerializeObject(_rotations, Formatting.Indented));
        }
        private void tpRanking_Paint(object sender, PaintEventArgs e)
        {
            using Graphics graphics = tpRanking.CreateGraphics();
            using Pen pen = new(Color.Black);
            graphics.DrawRectangle(pen, new Rectangle(100, 150, 250, 75));
            graphics.DrawRectangle(pen, new Rectangle(350, 100, 250, 125));
            graphics.DrawRectangle(pen, new Rectangle(600, 175, 250, 50));
        }
        private void bSetRanking_Click(object sender, EventArgs e)
        {
            List<Rank> ranks = new();
            foreach (Team team in _teams)
            {
                int t = team.Number;
                int total = 0;
                foreach (Result result in team.Results)
                {
                    total += result.Position;
                }
                ranks.Add(new Rank { Team = team.Number, Total = total });
            }
            lFirst.ResetText();
            lFirst.Location = new Point(lFirst.Location.X, 70);
            lSecond.ResetText();
            lSecond.Location = new Point(lSecond.Location.X, 120);
            lThird.ResetText();
            lThird.Location = new Point(lThird.Location.X, 145);
            rtbRank.ReadOnly = true;
            rtbRank.ResetText();
            int i = 0;
            int previous = -1;
            string separator = string.Empty;
            foreach (Rank rank in (from c in ranks where c.Total > 0 orderby c.Total select c))
            {
                if (rank.Total != previous)
                {
                    i += 1;
                    separator = string.Empty;
                }
                previous = rank.Total;
                string teamLabel = "Equipe inconnue";
                Team team = _teams.Find(c => c.Number == rank.Team);
                if (team != null)
                {
                    teamLabel = Tools.GetDisplayedName(team);
                }
                string rankLabel = $"{i} - {teamLabel} ({rank.Total} points)";
                switch (i)
                {
                    case 1:
                        SetRankingLabel(lFirst, rankLabel);
                        break;
                    case 2:
                        SetRankingLabel(lSecond, rankLabel);
                        break;
                    case 3:
                        SetRankingLabel(lThird, rankLabel);
                        break;
                    default:
                        rtbRank.AppendText(rankLabel);
                        rtbRank.AppendText(Environment.NewLine);
                        rtbRank.AppendText(Environment.NewLine);
                        break;
                }
            }
            tcJeux.SelectedIndex = tcJeux.TabPages.Count - 1;
        }
        #endregion
        public Scoreboards()
        {
            InitializeComponent();
        }
        #region Privates
        private void AddTabPage(int columnCount, Game game, List<List<int>> rotations)
        {
            if (game != null)
            {
                TabPage tp = new(game.Label)
                {
                    Location = new Point(4, 25),
                    Margin = new Padding(3, 4, 3, 4),
                    Name = $"tp{game.Code}",
                    Padding = new Padding(3, 4, 3, 4),
                    UseVisualStyleBackColor = true
                };
                TableLayoutPanel tlp = new()
                {
                    Dock = DockStyle.Fill,
                    Location = new Point(3, 4),
                    Margin = new Padding(3, 4, 3, 4),
                    Name = $"tlp{game.Code}",
                    RowCount = 4,
                    ColumnCount = columnCount
                };
                tp.Controls.Add(tlp);
                tlp.RowStyles.Add(new RowStyle(SizeType.Percent, 25F));
                tlp.RowStyles.Add(new RowStyle(SizeType.Percent, 25F));
                tlp.RowStyles.Add(new RowStyle(SizeType.Percent, 25F));
                tlp.RowStyles.Add(new RowStyle(SizeType.Percent, 25F));
                decimal columnWidth = Math.Round(Convert.ToDecimal(100 / tlp.ColumnCount), 2);
                for (int i = 1; i <= tlp.ColumnCount; i++)
                {
                    if (i == tlp.ColumnCount)
                    {
                        tlp.ColumnStyles.Add(new ColumnStyle(SizeType.Percent, Convert.ToSingle(100 - (tlp.ColumnCount - 1) * columnWidth)));
                    }
                    else
                    {
                        tlp.ColumnStyles.Add(new ColumnStyle(SizeType.Percent, Convert.ToSingle(columnWidth)));
                    }
                }
                int column = 0;
                foreach (List<int> rotation in rotations)
                {
                    int row = 0;
                    string rotationName = $"Rotation {column + 1}";
                    int rotationIndex = _rotations.FindIndex(x => x.Name == rotationName);
                    RotationGame rotationGame = null;
                    if (rotationIndex == -1)
                    {
                        _rotations.Add(new() { Name = rotationName });
                        _rotations.Last().Games.Add(new() { Name = game.Label });
                        rotationGame = _rotations.Last().Games.Last();
                    }
                    else
                    {
                        int gameIndex = _rotations[rotationIndex].Games.FindIndex(x => x.Name == game.Label);
                        if (gameIndex == -1)
                        {
                            _rotations[rotationIndex].Games.Add(new() { Name = game.Label });
                            rotationGame = _rotations[rotationIndex].Games.Last();
                        }
                        else
                        {
                            rotationGame = _rotations[rotationIndex].Games[gameIndex];
                        }
                    }
                    foreach (int team in rotation)
                    {
                        Score score = new()
                        {
                            Dock = DockStyle.Fill,
                            Game = game,
                            BackColor = (column % 2 == 0) ? Color.AliceBlue : Color.Aquamarine
                        };
                        rotationGame.Teams.Add(_teams.Find(c => c.Number == team).Name);
                        score.SetTeam(_teams.Find(c => c.Number == team));
                        score.ValidClick += ValidClickDelegate;
                        tlp.Controls.Add(score, column, row);
                        row += 1;
                    }
                    column += 1;
                }
                tcJeux.TabPages.Insert(tcJeux.TabPages.Count - 1, tp);
            }
        }
        private void SetRanking(Game game)
        {
            Dictionary<int, Result> results = new();
            foreach (Team team in _teams)
            {
                results.Add(team.Number, team.Results.Find(c => c.Game == game.Code));
            }
            int i = 0;
            if (game.Role == Tools.Role.Point)
            {
                int previous = 0;
                foreach (int team in from c in results orderby c.Value.Points descending select c.Key)
                {
                    //if (results[team].Points == 0)
                    //{
                    //    break;
                    //}
                    if (results[team].Points != previous)
                    {
                        i += 1;
                    }
                    results[team].Position = i;
                    previous = results[team].Points;
                    SetPosition(game.Code, team, results[team].Position);
                }
            }
            else
            {
                string previous = string.Empty;
                foreach (int team in from c in results orderby (string.IsNullOrWhiteSpace(c.Value.Time) ? TimeMax : c.Value.Time) select c.Key)
                {
                    string time = results[team].Time;
                    if (string.IsNullOrWhiteSpace(results[team].Time))
                    {
                        time = TimeMax;
                    }
                    if (time != previous)
                    {
                        i += 1;
                    }
                    results[team].Position = i;
                    previous = time;
                    SetPosition(game.Code, team, results[team].Position);
                }
            }
        }
        private void SetRankingLabel(Label label, string label2Add)
        {
            string separator = string.Empty;
            if (!string.IsNullOrWhiteSpace(label.Text))
            {
                separator = Environment.NewLine;
                label.Location = new Point(label.Location.X, label.Location.Y - 21);
            }
            label.Text += string.Concat(separator, label2Add);
        }
        private void SetPosition(string game, int team, int position)
        {
            string tabPageName = $"tp{game}";
            string tableLayoutPanelName = $"tlp{game}";
            TableLayoutPanel tlp = (TableLayoutPanel)tcJeux.TabPages[tabPageName].Controls[tableLayoutPanelName];
            if (tlp != null)
            {
                foreach (Control c in tlp.Controls)
                {
                    Score score = (Score)c;
                    if (score != null && score.Team.Number == team)
                    {
                        score.SetPosition(position);
                    }
                }
            }
        }
        #endregion
        #region Delegates
        private void ValidClickDelegate(object sender, ResultEventArgs e)
        {
            Team team = _teams.Find(c => c.Number == e.Team);
            if (team != null)
            {
                Result result = team.Results.Find(c => c.Game == e.Game.Code);
                if (result != null)
                {
                    if (e.Game.Role == Tools.Role.Point)
                    {
                        result.Points = e.Points;
                    }
                    else
                    {
                        result.Time = e.Time;
                    }
                    SetRanking(e.Game);
                    using StreamWriter sw = new(Path.Combine(_eventPath, JSONTeamsFile));
                    sw.Write(JsonConvert.SerializeObject(_teams, Formatting.Indented));
                }
            }
        }
        #endregion
    }
}

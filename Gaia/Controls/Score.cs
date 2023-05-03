using Gaia.Classes;
using System.ComponentModel;
using System.Xml.Linq;

namespace Gaia.Controls
{
    public partial class Score : GroupBox
    {
        #region Declarations
        #region Events
        public event EventHandler<ResultEventArgs> ValidClick;
        #endregion
        #endregion
        #region Properties
        [Browsable(false)]
        public Game Game { get; set; } = null;
        [Browsable(false)]
        public string Root { get; set; } = string.Empty;
        public Team Team { get; set; } = null;
        #endregion
        #region Events
        private void Score_ControlAdded(object sender, ControlEventArgs e)
        {
            bValid.Enabled = false;
        }

        private void bValid_Click(object sender, EventArgs e)
        {
            ValidClick.Invoke(
                sender,
                new ResultEventArgs
                {
                    Team = Team.Number,
                    Game = Game,
                    Points = decimal.ToInt32(nupPoints.Value),
                    Time = $"{nupMinutes.Value:00}:{nupSecondes.Value:00}:{nupCentisecondes.Value:00}"
                });
            bValid.Enabled = false;
        }

        private void nup_ValueChanged(object sender, EventArgs e)
        {
            bValid.Enabled = true;
        }
        #endregion
        #region Protected
        protected override void OnPaint(PaintEventArgs e)
        {
            base.OnPaint(e);
            //Add your custom paint code here
            lMinutes.Location = new Point(2, 55);
            nupMinutes.Location = new Point(2, 75);
            nupMinutes.Width = Convert.ToInt32((ClientSize.Width - 6) / 3);
            lSecondes.Location = new Point(nupMinutes.Width + 4, 55);
            nupSecondes.Location = new Point(lSecondes.Location.X, 75);
            nupSecondes.Width = nupMinutes.Width;
            lCentisecondes.Location = new Point(2 * nupSecondes.Width + 6, 55);
            nupCentisecondes.Location = new Point(lCentisecondes.Location.X, 75);
            nupCentisecondes.Width = nupMinutes.Width;
            lPoints.Location = new Point(2, 55);
            nupPoints.Location = new Point(2, 75);
            nupPoints.Width = ClientSize.Width - 2;
            bValid.Location = new Point(ClientSize.Width - bValid.Width - 10, ClientSize.Height - bValid.Height - 10);
            lPosition.Location = new Point(ClientSize.Width - lPosition.Width - 2, 5);
            lPoints.Visible = Game.Role == Tools.Role.Point;
            nupPoints.Visible = lPoints.Visible;
            lMinutes.Visible = !lPoints.Visible;
            nupMinutes.Visible = lMinutes.Visible;
            lSecondes.Visible = lMinutes.Visible;
            nupSecondes.Visible = lMinutes.Visible;
            lCentisecondes.Visible = lMinutes.Visible;
            nupCentisecondes.Visible = lMinutes.Visible;
        }
        #endregion
        #region Methods
        public void SetTeam(Team team)
        {
            if (team != null)
            {
                Team = team;
                Text = Tools.GetDisplayedName(team);
                Result? result = team.Results.Find(c => c.Game == Game.Code);
                if (result != null)
                {
                    SetPosition(result.Position);
                    if (Game.Role == Tools.Role.Point)
                    {
                        nupPoints.Value = result.Points;
                    }
                    else
                    {
                        if (!string.IsNullOrWhiteSpace(result.Time))
                        {
                            string[] time = result.Time.Split(":");
                            nupMinutes.Value = Convert.ToInt32(time[0]);
                            nupSecondes.Value = Convert.ToInt32(time[1]);
                            nupCentisecondes.Value = (time.Length > 2) ? Convert.ToInt32(time[2]) : 0;
                        }
                    }
                }
            }
        }

        public void SetPosition(int position)
        {
            lPosition.Text = (position > 0) ? position.ToString() : String.Empty;
        }
        #endregion
        public Score()
        {
            InitializeComponent();
        }
    }
}

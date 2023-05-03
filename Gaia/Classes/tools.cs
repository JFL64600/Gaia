namespace Gaia.Classes
{
    public class Tools
    {
        #region Declarations
        public enum Role
        {
            Point,
            Time
        }
        #endregion
        #region Methods
        public static string ReadFile(string file)
        {
            using StreamReader sr = new(file);
            return sr.ReadToEnd();
        }

        public static string GetDisplayedName(Team team)
        {
            if (string.IsNullOrWhiteSpace(team.Name))
                return $"Equipe {team.Number}";
            return team.Name;
        }

        public static int GetRotationCount(List<PlayedGame> playedGames)
        {
            int rotationCount = 0;
            foreach (PlayedGame pg in playedGames)
            {
                rotationCount = Math.Max(rotationCount, pg.Rotations.Count);
            }
            return rotationCount;
        }
        #endregion
    }
}

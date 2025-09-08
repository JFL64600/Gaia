namespace Gaia.Classes
{
    public class Team
    {
        #region Properties
        public int Number { get; set; } = 0;
        public string Name { get; set; } = string.Empty;
        public List<Result> Results { get; set; } = [];
        #endregion
    }
}

namespace Gaia.Classes
{
    public class Game
    {
        #region Properties
        public string Code { get; set; } = string.Empty;
        public string Label { get; set; } = string.Empty;
        public Tools.Role Role { get; set; } = Tools.Role.Time;
        #endregion
    }
}

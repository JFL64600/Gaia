namespace Gaia.DTO
{
    public class PlayedGame
    {
        #region Properties
        public string Game { get; set; } = string.Empty;
        public List<List<int>> Rotations { get; set; } = [];
        #endregion
    }
}

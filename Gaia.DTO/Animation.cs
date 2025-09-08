namespace Gaia.DTO
{
    public class Animation
    {
        #region Properties
        public string Name { get; set; } = string.Empty;
        public List<PlayedGame> Games { get; } = [];
        public List<Team> Teams { get; set; } = [];
        #endregion
    }
}

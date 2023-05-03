namespace Gaia.Classes
{
    public class ResultEventArgs : EventArgs
    {
        #region Properties
        public int Team { get; set; } = 0;
        public Game Game { get; set; } = null;
        public int Points { get; set; } = 0;
        public string Time { get; set; } = string.Empty;
        #endregion
    }
}

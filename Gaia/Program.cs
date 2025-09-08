using Gaia.Forms;
using System.Configuration;

namespace Gaia
{
    internal static class Program
    {
        /// <summary>
        ///  The main entry point for the application.
        /// </summary>
        [STAThread]
        static void Main()
        {
            // To customize application configuration such as set high DPI settings or default font,
            // see https://aka.ms/applicationconfiguration.
            ApplicationConfiguration.Initialize();
            Application.EnableVisualStyles();
            using Choose choose = new() { Root = ConfigurationManager.AppSettings.Get("root") };
            if (choose.ShowDialog() != DialogResult.OK)
            {
                Environment.Exit(1001);
            }
            string @event = choose.GetEvent();
            if (string.IsNullOrWhiteSpace(@event))
            {
                Environment.Exit(1002);
            }
            if (@event.StartsWith("--"))
            {
                Application.Run(new CreateEvent { Root = choose.Root });
            }
            else
            {
                Application.Run(new Scoreboards { Root = choose.Root, Event = @event });
            }
        }
    }
}
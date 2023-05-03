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
            DialogResult dr = DialogResult.None;
            string root = ConfigurationManager.AppSettings.Get("root");
            string @event = string.Empty;
            using Choose choose = new() { Root = root };
            if (choose.ShowDialog() != DialogResult.OK)
            {
                Environment.Exit(1001);
            }
            @event = choose.GetEvent();
            if (string.IsNullOrWhiteSpace(@event))
            {
                Environment.Exit(1002);
            }
            if (@event.StartsWith("--"))
            {
                Application.Run(new CreateEvent { Root = root });
            }
            else
            {
                Application.Run(new Scoreboards { Root = root, Event = @event });
            }
            //'Dim teams As New List(Of Tools.Team)
            //'For i As Integer = 1 To 28
            //'    teams.Add(New Tools.Team With {.Number = i,
            //'                                   .Results = New List(Of Tools.Result) From {New Tools.Result With {.Game = "SokaTira"}, New Tools.Result With {.Game = "BonetaBotatzea"},
            //'                                                                              New Tools.Result With {.Game = "Toka"}, New Tools.Result With {.Game = "LastoAltxatzeaTime"},
            //'                                                                              New Tools.Result With {.Game = "Arpana"}, New Tools.Result With {.Game = "BuskailBiltzea"},
            //'                                                                              New Tools.Result With {.Game = "EgurPilota"}}})
            //'Next
            //'Using sw As New IO.StreamWriter("C:\Temp\teams.json")
            //'    sw.Write(JsonConvert.SerializeObject(teams, Formatting.Indented))
            //'End Using
        }
    }
}
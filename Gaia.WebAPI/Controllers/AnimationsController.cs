using FireSharp;
using FireSharp.Config;
using FireSharp.Response;
using Gaia.DTO;
using Microsoft.AspNetCore.Mvc;
using Newtonsoft.Json;

namespace Gaia.WebAPI.Controllers
{
    [Route("[controller]")]
    [ApiController]
    public class AnimationsController : ControllerBase
    {
        [HttpGet]
        public IEnumerable<Animation> GetAnimations()
        {
            FirebaseClient fbc = new(
                new FirebaseConfig()
                {
                    AuthSecret = "FX3cQeAFPRACMe2bG11KZZt0o9KaB0aW6nP0as1x",
                    BasePath = "https://gaia-5c758-default-rtdb.europe-west1.firebasedatabase.app/"
                });
            return JsonConvert.DeserializeObject<List<Animation>>(fbc.Get("Animations").Body.ToString());
        }
        [HttpGet("Teams")]
        public Animation GetTeams()
        {
            FirebaseClient fbc = new(
                new FirebaseConfig()
                {
                    AuthSecret = "FX3cQeAFPRACMe2bG11KZZt0o9KaB0aW6nP0as1x",
                    BasePath = "https://gaia-5c758-default-rtdb.europe-west1.firebasedatabase.app/"
                });
            FirebaseResponse fbr = fbc.Get("Animations/", QueryBuilder.New("\"Name\":\"Deloitte - 9 septembre 2025\""));
            return JsonConvert.DeserializeObject<Animation>(fbc.Get("Animations", QueryBuilder.New("\"Name\":\"Deloitte - 9 septembre 2025\"")).Body.ToString());
        }
    }
}

using Microsoft.AspNetCore.Mvc;

namespace GEOEmergency.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class TestController : ControllerBase
    {
        [HttpGet]
        public ActionResult Get()
        {
            return Ok(new { message = "API is working", timestamp = DateTime.Now });
        }
    }
}
using System.Security.Claims;
using System.Linq;
using Microsoft.AspNetCore.Mvc;

namespace AzureADSample.Api.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class UserController : ControllerBase
    {
        private readonly ClaimsPrincipal _currentUser;

        public UserController(ClaimsPrincipal currentUser)
        {
            _currentUser = currentUser;
        }

        [HttpGet]
        public IActionResult GetCurrentUser()
        {
            return Ok(_currentUser.Claims.GroupBy(c => c.Type, c => c.Value).ToDictionary(c => c.Key, c => c.ToArray()));
        }
    }
}
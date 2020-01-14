using System.Security.Claims;
using Microsoft.AspNetCore.Authorization;
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
        [AllowAnonymous]
        public IActionResult GetCurrentUser()
        {
            return Ok(_currentUser);
        }

    }
}
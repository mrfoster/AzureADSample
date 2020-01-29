using System.Security.Claims;
using System.Linq;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Configuration;

namespace AzureADSample.Api.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class UserController : ControllerBase
    {
        private readonly ClaimsPrincipal _currentUser;
        private readonly IConfiguration _configuration;

        public UserController(ClaimsPrincipal currentUser, IConfiguration configuration)
        {
            _currentUser = currentUser;
            _configuration = configuration;
        }

        [HttpGet]
        [AllowAnonymous]
        public IActionResult GetCurrentUser()
        {
            return Ok(_currentUser.Claims.ToDictionary(c => c.Type, c => c.Value));
        }

        [HttpGet("config")]
        [AllowAnonymous]
        public IActionResult GetConfig()
        {
            return Ok(new
            {
                Authority = _configuration.GetValue<string>("Auth:Authority"),
                Audience = _configuration.GetValue<string>("Auth:Audience")
            });
        }
    }
}
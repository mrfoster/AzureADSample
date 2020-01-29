using System.Reflection;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Configuration;

namespace AzureADSample.Api.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class ApplicationController : ControllerBase
    {
        private readonly IConfiguration _configuration;

        public ApplicationController(IConfiguration configuration)
        {
            _configuration = configuration;
        }

        [HttpGet]
        public dynamic Get()
        {
            var assembly = typeof(Program).GetTypeInfo().Assembly;
            return new
            {
                Version = assembly.GetCustomAttribute<AssemblyInformationalVersionAttribute>()?.InformationalVersion,
                Authority = _configuration.GetValue<string>("Auth:Authority"),
                Audience = _configuration.GetValue<string>("Auth:Audience")
            };
        }
    }
}

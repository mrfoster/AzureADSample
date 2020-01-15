using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Azure.WebJobs;
using Microsoft.Azure.WebJobs.Extensions.Http;
using Microsoft.AspNetCore.Http;
using System.Net.Http;
using AzureADSample.Functions.Api;
using Microsoft.Extensions.Logging;
using System.Collections.Generic;

namespace AzureAdSample.Functions
{
    public class GetUser
    {
        private readonly HttpClient _httpClient;

        public GetUser(ApiClient apiClient)
        {
            _httpClient = apiClient.HttpClient;
        }

        [FunctionName("GetUserHttp")]
        public async Task<IActionResult> RunHttp(
             [HttpTrigger(AuthorizationLevel.Function, "get", "post", Route = null)] HttpRequest req, ILogger log)
        {
            IDictionary<string, string> claims;
            using (var response = await _httpClient.GetAsync("user"))
            {
                claims = await response.Content.ReadAsAsync<IDictionary<string, string>>();
            }
            return new JsonResult(claims);
        }
    }
}

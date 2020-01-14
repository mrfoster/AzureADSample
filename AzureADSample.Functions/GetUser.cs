using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Azure.WebJobs;
using Microsoft.Azure.WebJobs.Extensions.Http;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Logging;
using System.Net.Http;
using AzureADSample.Functions.Api;
using System;

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
            log.LogInformation($"GetUser trigger function executing at {DateTime.UtcNow}");

            using (var response = await _httpClient.GetAsync("api/user"))
            {
            }

            log.LogInformation($"GetUser Completed at {DateTime.UtcNow}");

            return new OkResult();
        }
    }
}

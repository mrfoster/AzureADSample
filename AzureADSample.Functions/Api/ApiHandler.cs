using System;
using System.Net.Http;
using System.Net.Http.Headers;
using System.Threading;
using System.Threading.Tasks;
using Microsoft.Extensions.Logging;
using Newtonsoft.Json.Linq;

namespace AzureADSample.Functions.Api
{
    public class ApiHandler : DelegatingHandler
    {
        private readonly IAuthProvider _authProvider;
        private readonly ILogger _logger;

        public ApiHandler(IAuthProvider authProvider, ILogger<ApiHandler> logger)
        {
            _authProvider = authProvider;
            _logger = logger;
        }

        protected override async Task<HttpResponseMessage> SendAsync(HttpRequestMessage request, CancellationToken cancellationToken)
        {
            var token = await _authProvider.GetToken();

            request.Headers.Authorization = new AuthenticationHeaderValue("Bearer", token);

            _logger.LogInformation($"Begin request {request.Method} {request.RequestUri}");

            var response = await base.SendAsync(request, cancellationToken);

            if (response.IsSuccessStatusCode)
            {
                var content = await response.Content.ReadAsStringAsync();
                _logger.LogInformation($"Request Success: {JObject.Parse(content)}");
            }
            else
            {
                _logger.LogError($"Request Error: {response.StatusCode}");
            }

            return response;
        }
    }
}

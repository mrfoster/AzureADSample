using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using Microsoft.Extensions.Configuration;
using Microsoft.Identity.Client;

namespace AzureADSample.Functions.Api
{
    public class MsalClientCredentialsProvider : IAuthProvider
    {
        private readonly IEnumerable<string> _scopes;
        private readonly IConfidentialClientApplication _app;

        public MsalClientCredentialsProvider(IConfiguration configuration)
        {
            var scopes = configuration["Scopes"];
            _scopes = scopes.Split(new char[0], StringSplitOptions.RemoveEmptyEntries);

            var options = new ConfidentialClientApplicationOptions();
            configuration.Bind("AzureAd", options);
            _app = ConfidentialClientApplicationBuilder.CreateWithApplicationOptions(options).Build();
        }

        public async Task<string> GetToken()
        {
            var result = await _app.AcquireTokenForClient(_scopes).ExecuteAsync();
            return result.AccessToken;
        }
    }
}

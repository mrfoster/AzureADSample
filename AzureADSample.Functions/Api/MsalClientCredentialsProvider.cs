using System;
using System.Collections.Generic;
using System.Globalization;
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
            var clientId = configuration["AzureAd:ClientId"];
            var clientSecret = configuration["AzureAd:ClientSecret"];
            var instance = configuration["AzureAd:Instance"];
            var tenant = configuration["AzureAd:Tenant"];
            var scopes = configuration["AzureAd:Scopes"];

            var authority = string.Format(CultureInfo.InvariantCulture, instance, tenant);

            _app = ConfidentialClientApplicationBuilder
                    .Create(clientId)
                    .WithClientSecret(clientSecret)
                    .WithAuthority(authority)
                    .Build();

            _scopes = scopes.Split(new char[0], StringSplitOptions.RemoveEmptyEntries);
        }

        public async Task<string> GetToken()
        {
            var result = await _app.AcquireTokenForClient(_scopes).ExecuteAsync();
            return result.AccessToken;
        }
    }
}

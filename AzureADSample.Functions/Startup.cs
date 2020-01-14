using AzureADSample.Functions;
using AzureADSample.Functions.Api;
using Microsoft.Azure.Functions.Extensions.DependencyInjection;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using System;

[assembly: FunctionsStartup(typeof(Startup))]
namespace AzureADSample.Functions
{
    public class Startup : FunctionsStartup
    {
        public override void Configure(IFunctionsHostBuilder builder)
        {
            var config = builder
                .AddConfiguration(configBuilder => configBuilder.AddJsonFile("local.settings.json", true, true).Build())
                .GetCurrentConfiguration();

            builder.Services.AddTransient<ApiHandler>();
            builder.Services.AddTransient<IAuthProvider, MsalClientCredentialsProvider>();
            builder.Services.AddHttpClient<ApiClient>(client =>
            {
                client.DefaultRequestHeaders.Add("Accept", "application/json");
                client.BaseAddress = new Uri(config["ApiBaseAddress"]);
            }).AddHttpMessageHandler<ApiHandler>();
        }
    }
}

using AzureADSample.Functions;
using AzureADSample.Functions.Api;
using Microsoft.Azure.Functions.Extensions.DependencyInjection;
using Microsoft.Azure.WebJobs.Host.Bindings;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Options;
using System;

[assembly: FunctionsStartup(typeof(Startup))]
namespace AzureADSample.Functions
{
    public class Startup : FunctionsStartup
    {
        public override void Configure(IFunctionsHostBuilder builder)
        {
            var executioncontextoptions = builder.Services.BuildServiceProvider()
                .GetService<IOptions<ExecutionContextOptions>>().Value;
            var currentDirectory = executioncontextoptions.AppDirectory;

            var config = new ConfigurationBuilder()
                .SetBasePath(currentDirectory)
                .AddJsonFile("local.settings.json", optional: true, reloadOnChange: true)
                .AddEnvironmentVariables()
                .Build();

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
